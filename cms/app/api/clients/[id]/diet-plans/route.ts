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
    const { title, changelog } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const mockOcrData = JSON.stringify({
      breakfast: { items: ['Oats porridge', 'Boiled eggs (2)', 'Green tea'], calories: 350, protein: '18g', carbs: '42g', fat: '8g' },
      lunch: { items: ['Brown rice (1 cup)', 'Dal (1 bowl)', 'Mixed vegetables', 'Salad'], calories: 480, protein: '22g', carbs: '65g', fat: '10g' },
      snacks: { items: ['Fruits (seasonal)', 'Nuts (small handful)'], calories: 200, protein: '6g', carbs: '28g', fat: '7g' },
      dinner: { items: ['Roti (2)', 'Vegetable curry', 'Soup'], calories: 430, protein: '20g', carbs: '48g', fat: '12g' },
      totalCalories: 1460,
      notes: 'Customized plan. Follow timing strictly. Drink 3L water daily.'
    });

    const [plan] = await sql`
      INSERT INTO diet_plans (client_id, title) VALUES (${id}, ${title}) RETURNING id
    `;

    await sql`
      INSERT INTO diet_plan_versions (diet_plan_id, version_number, ocr_data, changelog)
      VALUES (${plan.id}, 1, ${mockOcrData}, ${changelog || 'Initial version'})
    `;

    const [clientRow] = await sql`SELECT name FROM clients WHERE id = ${id}`;
    await sql`
      INSERT INTO activity_log (type, description, client_name)
      VALUES ('diet_plan_updated', ${`Diet plan created: ${title}`}, ${clientRow?.name || 'Unknown'})
    `;

    return NextResponse.json({ success: true, id: plan.id }, { status: 201 });
  } catch (error) {
    console.error('POST diet-plans error:', error);
    return NextResponse.json({ error: 'Failed to create diet plan' }, { status: 500 });
  }
}
