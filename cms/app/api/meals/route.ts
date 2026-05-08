import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = initDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const goal = searchParams.get('goal');

    let query = 'SELECT * FROM meal_items';
    const conditions: string[] = [];
    const params: string[] = [];

    if (category && category !== 'all') {
      conditions.push("(category = ? OR category = 'any')");
      params.push(category);
    }

    if (goal) {
      conditions.push("health_tags LIKE ?");
      params.push(`%${goal}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY category, name';

    const items = db.prepare(query).all(...params);
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET meals error:', error);
    return NextResponse.json({ error: 'Failed to fetch meal items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = initDB();
    const body = await req.json();
    const { name, category, calories_per_serving, protein, carbs, fat, serving_size, health_tags, notes } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO meal_items (name, category, calories_per_serving, protein, carbs, fat, serving_size, health_tags, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, category,
      calories_per_serving || null,
      protein || null,
      carbs || null,
      fat || null,
      serving_size || null,
      Array.isArray(health_tags) ? JSON.stringify(health_tags) : (health_tags || null),
      notes || null
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error('POST meals error:', error);
    return NextResponse.json({ error: 'Failed to create meal item' }, { status: 500 });
  }
}
