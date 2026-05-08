import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
  try {
    const db = initDB();
    const clients = db.prepare(`
      SELECT c.*,
        p.name as package_name,
        p.price as package_price,
        p.category as package_category,
        cp.start_date as package_start,
        cp.end_date as package_end
      FROM clients c
      LEFT JOIN client_packages cp ON c.id = cp.client_id AND cp.is_active = 1
      LEFT JOIN packages p ON cp.package_id = p.id
      ORDER BY c.created_at DESC
    `).all();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = initDB();
    const body = await request.json();
    const { name, email, phone, age, gender, health_goal, notes } = body;

    if (!name || !email || !phone || !age || !gender || !health_goal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO clients (name, email, phone, age, gender, health_goal, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, age, gender, health_goal, notes || null);

    db.prepare(`
      INSERT INTO activity_log (type, description, client_name) VALUES (?, ?, ?)
    `).run('client_added', `New client onboarded for ${health_goal.replace('_', ' ')} program`, name);

    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(client, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/clients error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    if (msg.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
