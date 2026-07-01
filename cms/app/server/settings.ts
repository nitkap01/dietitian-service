import postgres from 'postgres';

// Key/value app configuration stored in the `app_settings` table.
// Includes AI provider config (the "configure in Settings" requirement),
// business info, and feature toggles.

export const DEFAULT_SETTINGS: Record<string, string> = {
  ai_provider: 'claude', // 'claude' | 'openai'
  ai_model: 'claude-opus-4-8',
  ai_api_key: '',
  payment_detection_enabled: '1',
  weight_capture_enabled: '1',
  business_name: "Dietician Ritika Bahl's Portal",
  dietitian_name: 'Dietician Ritika Bahl',
  whatsapp_number: '',
  whatsapp_provider: 'simulator', // 'simulator' | 'meta' | 'twilio'
  portal_url: 'http://localhost:3000/portal',
};

// Keys that must never be returned to the browser in full.
const SECRET_KEYS = new Set(['ai_api_key']);

export async function getAllSettings(sql: postgres.Sql): Promise<Record<string, string>> {
  const rows = await sql`SELECT key, value FROM app_settings`;
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const r of rows) map[r.key as string] = (r.value as string) ?? '';
  return map;
}

// Same as getAllSettings but masks secret values (for GET /api/settings).
export async function getPublicSettings(
  sql: postgres.Sql,
): Promise<Record<string, string | boolean>> {
  const all = await getAllSettings(sql);
  const masked: Record<string, string> = {};
  let apiKeySet = false;
  for (const [k, v] of Object.entries(all)) {
    if (SECRET_KEYS.has(k)) {
      if (k === 'ai_api_key') apiKeySet = !!v;
      masked[k] = ''; // never expose the secret itself
    } else {
      masked[k] = v;
    }
  }
  return { ...masked, ai_api_key_set: apiKeySet };
}

export async function getSetting(sql: postgres.Sql, key: string): Promise<string> {
  const [row] = await sql`SELECT value FROM app_settings WHERE key = ${key}`;
  return (row?.value as string) ?? DEFAULT_SETTINGS[key] ?? '';
}

export async function setSettings(sql: postgres.Sql, values: Record<string, string>): Promise<void> {
  const entries = Object.entries(values);
  for (const [key, value] of entries) {
    await sql`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES (${key}, ${value}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
  }
}

// Insert defaults only where a key does not exist yet (used by seed).
export async function ensureDefaultSettings(sql: postgres.Sql): Promise<void> {
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await sql`
      INSERT INTO app_settings (key, value) VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `;
  }
}

export interface AiConfig {
  provider: string;
  model: string;
  apiKey: string;
  paymentDetectionEnabled: boolean;
  weightCaptureEnabled: boolean;
}

export async function getAiConfig(sql: postgres.Sql): Promise<AiConfig> {
  const s = await getAllSettings(sql);
  const provider = s.ai_provider || 'claude';
  // Env fallback (used only when no key is saved in Settings) matches the provider.
  const envFallback = provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY;
  return {
    provider,
    model: s.ai_model || DEFAULT_SETTINGS.ai_model,
    apiKey: s.ai_api_key || envFallback || '',
    paymentDetectionEnabled: s.payment_detection_enabled !== '0',
    weightCaptureEnabled: s.weight_capture_enabled !== '0',
  };
}
