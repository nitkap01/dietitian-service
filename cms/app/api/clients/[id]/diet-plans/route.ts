import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../../server/db';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const plans = await sql`
      SELECT dp.*,
        (SELECT COUNT(*) FROM diet_plan_versions WHERE diet_plan_id = dp.id) as version_count,
        (SELECT created_at FROM diet_plan_versions WHERE diet_plan_id = dp.id ORDER BY version_number DESC LIMIT 1) as last_updated
      FROM diet_plans dp
      WHERE dp.client_id = ${id}
      ORDER BY dp.created_at DESC
    `;

    const plansWithVersions = await Promise.all(plans.map(async (plan) => {
      const versions = await sql`
        SELECT * FROM diet_plan_versions WHERE diet_plan_id = ${plan.id} ORDER BY version_number DESC
      `;
      return { ...plan, versions };
    }));

    return NextResponse.json(plansWithVersions);
  } catch (error) {
    console.error('GET diet-plans error:', error);
    return NextResponse.json({ error: 'Failed to fetch diet plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const body = await request.json();
    const { title, issues, ocrData, changelog } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Persist the actual built plan (previously this route dropped ocrData and
    // wrote a hardcoded sample — that bug is fixed here).
    const ocrJson = ocrData ? JSON.stringify(ocrData) : null;

    const [plan] = await sql`
      INSERT INTO diet_plans (client_id, title, issues, status) VALUES (${id}, ${title}, ${issues || null}, 'draft') RETURNING id
    `;

    await sql`
      INSERT INTO diet_plan_versions (diet_plan_id, version_number, ocr_data, changelog)
      VALUES (${plan.id}, 1, ${ocrJson}, ${changelog || 'Initial version'})
    `;

    const [clientRow] = await sql`SELECT name FROM clients WHERE id = ${id}`;
    await sql`
      INSERT INTO activity_log (type, description, client_name)
      VALUES ('diet_plan_updated', ${`Diet plan drafted: ${title}`}, ${clientRow?.name || 'Unknown'})
    `;

    return NextResponse.json({ success: true, id: plan.id }, { status: 201 });
  } catch (error) {
    console.error('POST diet-plans error:', error);
    return NextResponse.json({ error: 'Failed to create diet plan' }, { status: 500 });
  }
}
