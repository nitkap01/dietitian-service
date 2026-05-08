import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    const plans = db.prepare(`
      SELECT dp.*,
        (SELECT COUNT(*) FROM diet_plan_versions WHERE diet_plan_id = dp.id) as version_count,
        (SELECT created_at FROM diet_plan_versions WHERE diet_plan_id = dp.id ORDER BY version_number DESC LIMIT 1) as last_updated
      FROM diet_plans dp
      WHERE dp.client_id = ?
      ORDER BY dp.created_at DESC
    `).all(id);

    const plansWithVersions = (plans as Record<string, unknown>[]).map((plan) => {
      const versions = db.prepare(`
        SELECT * FROM diet_plan_versions WHERE diet_plan_id = ? ORDER BY version_number DESC
      `).all(plan.id as number);
      return { ...plan, versions };
    });

    return NextResponse.json(plansWithVersions);
  } catch (error) {
    console.error('GET diet-plans error:', error);
    return NextResponse.json({ error: 'Failed to fetch diet plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    const body = await request.json();
    const { title, changelog } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Mock OCR data
    const mockOcrData = JSON.stringify({
      breakfast: { items: ['Oats porridge', 'Boiled eggs (2)', 'Green tea'], calories: 350, protein: '18g', carbs: '42g', fat: '8g' },
      lunch: { items: ['Brown rice (1 cup)', 'Dal (1 bowl)', 'Mixed vegetables', 'Salad'], calories: 480, protein: '22g', carbs: '65g', fat: '10g' },
      snacks: { items: ['Fruits (seasonal)', 'Nuts (small handful)'], calories: 200, protein: '6g', carbs: '28g', fat: '7g' },
      dinner: { items: ['Roti (2)', 'Vegetable curry', 'Soup'], calories: 430, protein: '20g', carbs: '48g', fat: '12g' },
      totalCalories: 1460,
      notes: 'Customized plan. Follow timing strictly. Drink 3L water daily.'
    });

    const planResult = db.prepare(`
      INSERT INTO diet_plans (client_id, title) VALUES (?, ?)
    `).run(id, title);

    db.prepare(`
      INSERT INTO diet_plan_versions (diet_plan_id, version_number, ocr_data, changelog)
      VALUES (?, 1, ?, ?)
    `).run(planResult.lastInsertRowid, mockOcrData, changelog || 'Initial version');

    const clientName = (db.prepare('SELECT name FROM clients WHERE id = ?').get(id) as { name: string })?.name;
    db.prepare(`
      INSERT INTO activity_log (type, description, client_name) VALUES (?, ?, ?)
    `).run('diet_plan_updated', `Diet plan created: ${title}`, clientName || 'Unknown');

    return NextResponse.json({ success: true, id: planResult.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error('POST diet-plans error:', error);
    return NextResponse.json({ error: 'Failed to create diet plan' }, { status: 500 });
  }
}
