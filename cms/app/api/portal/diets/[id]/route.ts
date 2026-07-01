import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../../server/db';
import { getPortalClientId } from '../../../../server/session';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const clientId = await getPortalClientId(req);
    if (!clientId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sql = await initDB();
    const { id } = await ctx.params;

    const [plan] = await sql`SELECT * FROM diet_plans WHERE id = ${id} AND client_id = ${clientId}`;
    if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [{ paid }] = await sql`SELECT COUNT(*)::int as paid FROM payments WHERE client_id = ${clientId} AND status = 'paid'`;
    const isPublished = plan.status === 'published';
    const locked = !isPublished || paid === 0;
    if (locked) {
      const reason = !isPublished ? 'pending_release' : 'payment_pending';
      return NextResponse.json({ locked: true, reason, title: plan.title });
    }

    const versions = await sql`SELECT * FROM diet_plan_versions WHERE diet_plan_id = ${id} ORDER BY version_number DESC`;
    return NextResponse.json({ locked: false, plan, versions });
  } catch (error) {
    console.error('GET portal/diets/[id] error:', error);
    return NextResponse.json({ error: 'Failed to load diet' }, { status: 500 });
  }
}
