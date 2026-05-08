import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
  try {
    const db = initDB();
    const packages = db.prepare(`
      SELECT p.*,
        (SELECT COUNT(*) FROM client_packages cp WHERE cp.package_id = p.id AND cp.is_active = 1) as active_clients
      FROM packages p
      ORDER BY p.created_at DESC
    `).all();
    return NextResponse.json(packages);
  } catch (error) {
    console.error('GET packages error:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = initDB();
    const body = await request.json();
    const { name, description, category, price, duration_months } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO packages (name, description, category, price, duration_months)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, description || null, category, price, duration_months || 1);

    const pkg = db.prepare('SELECT * FROM packages WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error('POST packages error:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
