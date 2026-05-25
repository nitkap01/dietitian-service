import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../server/db';

export async function GET() {
  try {
    const sql = await initDB();
    const packages = await sql`
      SELECT p.*,
        (SELECT COUNT(*) FROM client_packages cp WHERE cp.package_id = p.id AND cp.is_active = 1)::int as active_clients
      FROM packages p
      ORDER BY p.created_at DESC
    `;
    return NextResponse.json(packages);
  } catch (error) {
    console.error('GET packages error:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = await initDB();
    const body = await request.json();
    const { name, description, category, price, duration_months } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [pkg] = await sql`
      INSERT INTO packages (name, description, category, price, duration_months)
      VALUES (${name}, ${description || null}, ${category}, ${price}, ${duration_months || 1})
      RETURNING *
    `;
    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error('POST packages error:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
