import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../server/db';

type Ctx = { params: Promise<{ id: string }> };

function normalizeWeightConfig(duration: number, requestWeights: boolean, frequency: string | null) {
  if (!requestWeights) return { request_weights: 0, weight_frequency: null as string | null };
  const allowed = duration <= 1 ? ['weekly'] : ['weekly', 'biweekly', 'monthly'];
  const freq = frequency && allowed.includes(frequency) ? frequency : 'weekly';
  return { request_weights: 1, weight_frequency: freq };
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const body = await request.json();
    const { name, description, category, price, duration_months, benefits, request_weights, weight_frequency } = body;

    const duration = Number(duration_months) || 1;
    const benefitsJson = Array.isArray(benefits) ? JSON.stringify(benefits.filter(Boolean)) : benefits || null;
    const wc = normalizeWeightConfig(duration, !!request_weights, weight_frequency || null);

    const [pkg] = await sql`
      UPDATE packages SET
        name = ${name}, description = ${description || null}, category = ${category}, price = ${price},
        duration_months = ${duration}, benefits = ${benefitsJson},
        request_weights = ${wc.request_weights}, weight_frequency = ${wc.weight_frequency}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(pkg);
  } catch (error) {
    console.error('PUT packages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM client_packages WHERE package_id = ${id} AND is_active = 1`;
    if (count > 0) {
      return NextResponse.json({ error: `Cannot delete — ${count} active client(s) on this plan.` }, { status: 409 });
    }
    await sql`DELETE FROM packages WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE packages/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
