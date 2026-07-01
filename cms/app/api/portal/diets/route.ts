import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../server/db';
import { getPortalClientId } from '../../../server/session';

// Returns the client's diet plans with lock state. Locked diets never include
// their meal data — a client only sees a blurred placeholder until the diet is
// published AND payment has been received.
export async function GET(req: NextRequest) {
  try {
    const clientId = await getPortalClientId(req);
    if (!clientId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sql = await initDB();

    const [{ paid }] = await sql`SELECT COUNT(*)::int as paid FROM payments WHERE client_id = ${clientId} AND status = 'paid'`;
    const hasPaid = paid > 0;

    const plans = await sql`SELECT id, title, status, published_at, created_at FROM diet_plans WHERE client_id = ${clientId} ORDER BY created_at DESC`;

    const diets = await Promise.all(
      plans.map(async (p) => {
        const isPublished = p.status === 'published';
        const locked = !isPublished || !hasPaid;
        const reason = !isPublished ? 'pending_release' : !hasPaid ? 'payment_pending' : null;

        let latest: { ocr_data?: string; version_number?: number } | null = null;
        if (!locked) {
          const [v] = await sql`SELECT ocr_data, version_number FROM diet_plan_versions WHERE diet_plan_id = ${p.id} ORDER BY version_number DESC LIMIT 1`;
          latest = v ? { ocr_data: v.ocr_data, version_number: v.version_number } : null;
        }
        return {
          id: p.id,
          title: p.title,
          status: p.status,
          published_at: p.published_at,
          created_at: p.created_at,
          locked,
          reason,
          latest,
        };
      }),
    );

    return NextResponse.json({ hasPaid, diets });
  } catch (error) {
    console.error('GET portal/diets error:', error);
    return NextResponse.json({ error: 'Failed to load diets' }, { status: 500 });
  }
}
