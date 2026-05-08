import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    const body = await req.json();
    const { name, category, calories_per_serving, protein, carbs, fat, serving_size, health_tags, notes } = body;

    db.prepare(`
      UPDATE meal_items SET name=?, category=?, calories_per_serving=?, protein=?, carbs=?, fat=?, serving_size=?, health_tags=?, notes=?
      WHERE id=?
    `).run(
      name, category,
      calories_per_serving || null,
      protein || null,
      carbs || null,
      fat || null,
      serving_size || null,
      Array.isArray(health_tags) ? JSON.stringify(health_tags) : (health_tags || null),
      notes || null,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT meal error:', error);
    return NextResponse.json({ error: 'Failed to update meal item' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    db.prepare('DELETE FROM meal_items WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE meal error:', error);
    return NextResponse.json({ error: 'Failed to delete meal item' }, { status: 500 });
  }
}
