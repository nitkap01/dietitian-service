import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../../server/db';
import { scoreRecommendations, RecoCandidate } from '../../../../server/ai';

type Ctx = { params: Promise<{ id: string }> };

const GOAL_LABEL: Record<string, string> = {
  weight_management: 'weight management', sugar_control: 'sugar control', pcos: 'PCOS', other: 'general wellness',
};
const STOP = new Set(['with', 'from', 'that', 'this', 'have', 'will', 'need', 'needs', 'wants', 'goal', 'plan', 'diet', 'client', 'month', 'months', 'patient', 'lose', 'gain', 'weight']);

function keywords(text: string): Set<string> {
  return new Set((text || '').toLowerCase().match(/[a-z]{4,}/g)?.filter((w) => !STOP.has(w)) || []);
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

interface Target { age: number; gender: string; health_goal: string; notes: string }
interface Cand extends Target { diet_id: number; title: string; issues: string; client_name: string; status: string; ocr_data: string; text: string }

function baseScore(t: Target, c: Cand): { score: number; reason: string } {
  let s = 0;
  const factors: string[] = [];
  if (t.health_goal === c.health_goal) { s += 45; factors.push(`same goal (${GOAL_LABEL[t.health_goal] || t.health_goal})`); }
  if (t.gender === c.gender) { s += 15; factors.push('same gender'); }
  const ageDiff = Math.abs(t.age - c.age);
  s += Math.max(0, 20 * (1 - ageDiff / 20));
  if (ageDiff <= 5) factors.push(`age within ${ageDiff} yr${ageDiff === 1 ? '' : 's'}`);
  const overlap = jaccard(keywords(t.notes), keywords(c.text));
  s += 20 * overlap;
  if (overlap > 0.12) factors.push('similar notes');
  return { score: Math.round(s), reason: factors.length ? `Matched on ${factors.join(', ')}.` : 'General similarity.' };
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;

    const [client] = await sql`SELECT id, age, gender, health_goal, notes FROM clients WHERE id = ${id}`;
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    const target: Target = { age: Number(client.age), gender: client.gender, health_goal: client.health_goal, notes: client.notes || '' };

    const rows = await sql`
      SELECT dp.id as diet_id, dp.title, dp.issues, dp.status,
        c.name as client_name, c.age, c.gender, c.health_goal, c.notes,
        (SELECT ocr_data FROM diet_plan_versions WHERE diet_plan_id = dp.id ORDER BY version_number DESC LIMIT 1) as ocr_data
      FROM diet_plans dp JOIN clients c ON c.id = dp.client_id
      WHERE dp.client_id != ${id}
    `;

    const candidates: Cand[] = rows
      .filter((r) => r.ocr_data)
      .map((r) => ({
        diet_id: r.diet_id, title: r.title, issues: r.issues || '', client_name: r.client_name, status: r.status,
        age: Number(r.age), gender: r.gender, health_goal: r.health_goal, notes: r.notes || '', ocr_data: r.ocr_data,
        text: `${r.notes || ''} ${r.issues || ''}`,
      }));

    // Deterministic base score → shortlist top 8.
    const scored = candidates.map((c) => ({ c, ...baseScore(target, c) })).sort((a, b) => b.score - a.score).slice(0, 8);

    // Optional AI refinement (same provider/key as Settings; null if no key).
    const aiInput: RecoCandidate[] = scored.map(({ c }) => ({ id: c.diet_id, age: c.age, gender: c.gender, health_goal: c.health_goal, text: c.text.slice(0, 400), title: c.title }));
    const aiMap = await scoreRecommendations({ sql, target, candidates: aiInput });

    const results = scored.map(({ c, score, reason }) => {
      const ai = aiMap?.[c.diet_id];
      let ocr: unknown = null;
      try { ocr = JSON.parse(c.ocr_data); } catch { ocr = null; }
      return {
        diet_id: c.diet_id,
        title: c.title,
        issues: c.issues,
        source: { name: c.client_name, age: c.age, gender: c.gender, health_goal: c.health_goal, status: c.status },
        score: ai ? ai.score : score,
        reason: ai?.reason || reason,
        scored_by: ai ? 'ai' : 'similarity',
        ocr,
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5);

    return NextResponse.json({ recommendations: results });
  } catch (error) {
    console.error('GET recommendations error:', error);
    return NextResponse.json({ error: 'Failed to build recommendations' }, { status: 500 });
  }
}
