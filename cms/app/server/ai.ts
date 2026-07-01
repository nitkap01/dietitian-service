import postgres from 'postgres';
import Anthropic from '@anthropic-ai/sdk';
import { getAiConfig } from './settings';

// Payment detection + weight parsing over WhatsApp messages.
// Provider is configurable in Settings (Claude via the official SDK, OpenAI via
// REST). When no API key is configured it falls back to a heuristic so the whole
// flow can be tested for free locally.

export interface PaymentDetection {
  isPayment: boolean;
  confidence: number; // 0..1
  amount: number | null;
  method: string | null;
  reason: string;
  source: 'claude' | 'openai' | 'heuristic';
}

const SYSTEM_PROMPT =
  'You are a payment-detection assistant for a dietitian. Given a WhatsApp message ' +
  'from a client (and optionally a screenshot they sent), decide whether it indicates ' +
  'the client has SENT or CONFIRMED a payment to the dietitian (e.g. "payment done", ' +
  '"I have paid", a UPI/GPay/PhonePe/bank transfer confirmation, or a payment receipt ' +
  'screenshot). A photo of food, a weight reply, or a general question is NOT a payment. ' +
  'Respond with ONLY a JSON object of the form: ' +
  '{"is_payment": boolean, "confidence": number between 0 and 1, "amount": number or null, ' +
  '"method": string or null, "reason": short string}.';

function extractJson(text: string): Record<string, unknown> | null {
  if (!text) return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function normalize(obj: Record<string, unknown> | null, source: PaymentDetection['source']): PaymentDetection | null {
  if (!obj) return null;
  return {
    isPayment: !!obj.is_payment,
    confidence: typeof obj.confidence === 'number' ? Math.max(0, Math.min(1, obj.confidence)) : 0.5,
    amount: typeof obj.amount === 'number' ? obj.amount : null,
    method: typeof obj.method === 'string' ? obj.method : null,
    reason: typeof obj.reason === 'string' ? obj.reason : '',
    source,
  };
}

async function detectWithClaude(
  apiKey: string,
  model: string,
  text: string,
  imageBase64?: string | null,
  imageMediaType?: string | null,
): Promise<PaymentDetection | null> {
  const client = new Anthropic({ apiKey });
  const parts: unknown[] = [];
  if (imageBase64) {
    parts.push({
      type: 'image',
      source: { type: 'base64', media_type: imageMediaType || 'image/jpeg', data: imageBase64 },
    });
  }
  parts.push({ type: 'text', text: `Message: "${text || '(no text, screenshot only)'}"` });

  const msg = await client.messages.create({
    model: model || 'claude-opus-4-8',
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: parts as Anthropic.MessageParam['content'] }],
  });
  const out = msg.content.find((b) => b.type === 'text');
  const textOut = out && out.type === 'text' ? out.text : '';
  return normalize(extractJson(textOut), 'claude');
}

async function detectWithOpenAI(
  apiKey: string,
  model: string,
  text: string,
  imageBase64?: string | null,
  imageMediaType?: string | null,
): Promise<PaymentDetection | null> {
  const userContent: unknown = imageBase64
    ? [
        { type: 'text', text: `Message: "${text || '(no text, screenshot only)'}"` },
        { type: 'image_url', image_url: { url: `data:${imageMediaType || 'image/jpeg'};base64,${imageBase64}` } },
      ]
    : `Message: "${text}"`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      max_tokens: 400,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  const textOut = data?.choices?.[0]?.message?.content ?? '';
  return normalize(extractJson(textOut), 'openai');
}

const PAYMENT_RE =
  /\b(paid|payment\s*(done|made|sent|received|completed)|sent (the )?(payment|money|amount|fees?)|transferred|i (have|hv) paid|fees?\s*(paid|done)|g[\s-]?pay|phone[\s-]?pe|paytm|\bupi\b|neft|imps|transaction|txn|receipt|screenshot)\b/i;

function detectHeuristic(text: string, hasImage: boolean): PaymentDetection {
  const t = (text || '').trim();
  const matched = PAYMENT_RE.test(t);

  // amount
  let amount: number | null = null;
  const amt = t.match(/(?:₹|rs\.?|inr)\s*(\d{2,6})|\b(\d{3,6})\s*(?:rs|rupees|inr)\b/i);
  if (amt) amount = parseInt(amt[1] || amt[2], 10);

  // method
  let method: string | null = null;
  if (/g[\s-]?pay/i.test(t)) method = 'GPay';
  else if (/phone[\s-]?pe/i.test(t)) method = 'PhonePe';
  else if (/paytm/i.test(t)) method = 'Paytm';
  else if (/\bupi\b/i.test(t)) method = 'UPI';
  else if (/neft|imps|bank/i.test(t)) method = 'Bank transfer';
  else if (/cash/i.test(t)) method = 'Cash';

  if (hasImage) {
    if (method === null) method = 'Screenshot';
    return {
      isPayment: true,
      confidence: matched ? 0.7 : 0.55,
      amount,
      method,
      reason: 'Payment screenshot received (heuristic — enable AI for verification).',
      source: 'heuristic',
    };
  }
  if (matched) {
    return {
      isPayment: true,
      confidence: 0.7,
      amount,
      method,
      reason: 'Message text indicates a payment.',
      source: 'heuristic',
    };
  }
  return { isPayment: false, confidence: 0.1, amount, method, reason: 'No payment signal detected.', source: 'heuristic' };
}

export async function detectPayment(input: {
  sql: postgres.Sql;
  text: string;
  imageBase64?: string | null;
  imageMediaType?: string | null;
}): Promise<PaymentDetection> {
  const { sql, text, imageBase64, imageMediaType } = input;
  const cfg = await getAiConfig(sql);
  const hasImage = !!imageBase64;

  if (cfg.apiKey) {
    try {
      const result =
        cfg.provider === 'openai'
          ? await detectWithOpenAI(cfg.apiKey, cfg.model, text, imageBase64, imageMediaType)
          : await detectWithClaude(cfg.apiKey, cfg.model, text, imageBase64, imageMediaType);
      if (result) return result;
    } catch (err) {
      console.error('[ai] payment detection failed, falling back to heuristic:', err);
    }
  }
  return detectHeuristic(text, hasImage);
}

// ── Diet recommendation scoring ────────────────────────────────────────────
// Given a target client and a shortlist of candidate past clients (each with a
// diet), asks the configured AI provider to score how well each candidate's diet
// suits the target. Returns null when no key is configured (caller falls back to
// the deterministic score). Reads provider/key from Settings each call — no reboot.

export interface RecoTarget { age: number; gender: string; health_goal: string; notes?: string }
export interface RecoCandidate { id: number; age: number; gender: string; health_goal: string; text: string; title: string }

async function claudeComplete(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: model || 'claude-opus-4-8',
    max_tokens: 900,
    system,
    messages: [{ role: 'user', content: user }],
  });
  const out = msg.content.find((b) => b.type === 'text');
  return out && out.type === 'text' ? out.text : '';
}

async function openaiComplete(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      max_tokens: 900,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

export async function scoreRecommendations(input: {
  sql: postgres.Sql;
  target: RecoTarget;
  candidates: RecoCandidate[];
}): Promise<Record<number, { score: number; reason: string }> | null> {
  const { sql, target, candidates } = input;
  if (candidates.length === 0) return {};
  const cfg = await getAiConfig(sql);
  if (!cfg.apiKey) return null;

  const system =
    'You help a dietitian reuse an existing diet plan for a new client. For each candidate ' +
    "(a past client and their diet plan), score 0-100 how well that diet would suit the TARGET client, " +
    'weighing the same health goal most, then similar age, same gender, and similar described problems. ' +
    'Respond with ONLY JSON: {"results":[{"id":<candidate id>,"score":<0-100>,"reason":"<short reason>"}]}.';
  const user = JSON.stringify({ target, candidates });

  try {
    const raw = cfg.provider === 'openai'
      ? await openaiComplete(cfg.apiKey, cfg.model, system, user)
      : await claudeComplete(cfg.apiKey, cfg.model, system, user);
    const obj = extractJson(raw) as { results?: Array<{ id: number; score: number; reason: string }> } | null;
    if (!obj || !Array.isArray(obj.results)) return null;
    const map: Record<number, { score: number; reason: string }> = {};
    for (const r of obj.results) {
      const id = Number(r.id);
      if (Number.isFinite(id)) {
        map[id] = { score: Math.max(0, Math.min(100, Number(r.score) || 0)), reason: String(r.reason || '') };
      }
    }
    return map;
  } catch (err) {
    console.error('[ai] scoreRecommendations failed, using deterministic score:', err);
    return null;
  }
}

// Weight parsing is pure regex (free + deterministic); AI not required.
export function parseWeight(text: string): number | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  let m = lower.match(/(\d{2,3}(?:\.\d{1,2})?)\s*(?:kgs?|kilograms?)\b/);
  if (m) {
    const n = parseFloat(m[1]);
    if (n >= 25 && n <= 300) return n;
  }
  m = lower.match(/(?:weight|wt|weigh(?:t|ing)?)\D{0,15}(\d{2,3}(?:\.\d{1,2})?)/);
  if (m) {
    const n = parseFloat(m[1]);
    if (n >= 25 && n <= 300) return n;
  }
  const all = lower.match(/\b\d{2,3}(?:\.\d{1,2})?\b/g);
  if (all) {
    for (const s of all) {
      const n = parseFloat(s);
      if (n >= 30 && n <= 250) return n;
    }
  }
  return null;
}
