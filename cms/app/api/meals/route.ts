import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const sql = await initDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const goal = searchParams.get('goal');

    let items;
    if (category && category !== 'all' && goal) {
      items = await sql`
        SELECT * FROM meal_items
        WHERE (category = ${category} OR category = 'any') AND health_tags LIKE ${'%' + goal + '%'}
        ORDER BY category, name
      `;
    } else if (category && category !== 'all') {
      items = await sql`
        SELECT * FROM meal_items
        WHERE category = ${category} OR category = 'any'
        ORDER BY category, name
      `;
    } else if (goal) {
      items = await sql`
        SELECT * FROM meal_items
        WHERE health_tags LIKE ${'%' + goal + '%'}
        ORDER BY category, name
      `;
    } else {
      items = await sql`SELECT * FROM meal_items ORDER BY category, name`;
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('GET meals error:', error);
    return NextResponse.json({ error: 'Failed to fetch meal items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = await initDB();
    const body = await req.json();
    const { name, category, calories_per_serving, protein, carbs, fat, serving_size, health_tags, notes } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const tagsValue = Array.isArray(health_tags) ? JSON.stringify(health_tags) : (health_tags || null);

    const [item] = await sql`
      INSERT INTO meal_items (name, category, calories_per_serving, protein, carbs, fat, serving_size, health_tags, notes)
      VALUES (${name}, ${category}, ${calories_per_serving || null}, ${protein || null}, ${carbs || null}, ${fat || null}, ${serving_size || null}, ${tagsValue}, ${notes || null})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: item.id }, { status: 201 });
  } catch (error) {
    console.error('POST meals error:', error);
    return NextResponse.json({ error: 'Failed to create meal item' }, { status: 500 });
  }
}
