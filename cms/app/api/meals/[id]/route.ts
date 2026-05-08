import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const body = await req.json();
    const { name, category, calories_per_serving, protein, carbs, fat, serving_size, health_tags, notes } = body;

    const tagsValue = Array.isArray(health_tags) ? JSON.stringify(health_tags) : (health_tags || null);

    await sql`
      UPDATE meal_items SET
        name = ${name}, category = ${category},
        calories_per_serving = ${calories_per_serving || null},
        protein = ${protein || null}, carbs = ${carbs || null}, fat = ${fat || null},
        serving_size = ${serving_size || null}, health_tags = ${tagsValue}, notes = ${notes || null}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT meal error:', error);
    return NextResponse.json({ error: 'Failed to update meal item' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    await sql`DELETE FROM meal_items WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE meal error:', error);
    return NextResponse.json({ error: 'Failed to delete meal item' }, { status: 500 });
  }
}
