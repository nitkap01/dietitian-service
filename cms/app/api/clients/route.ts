import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../server/db';

// Remove the password hash from any client row and expose a boolean instead.
function safeClient(row: Record<string, unknown>) {
  const { password_hash, ...rest } = row;
  return { ...rest, has_credentials: !!password_hash };
}

export async function GET() {
  try {
    const sql = await initDB();
    const clients = await sql`
      SELECT c.*, p.name as package_name, p.price as package_price,
        p.category as package_category, cp.start_date as package_start, cp.end_date as package_end
      FROM clients c
      LEFT JOIN client_packages cp ON c.id = cp.client_id AND cp.is_active = 1
      LEFT JOIN packages p ON cp.package_id = p.id
      ORDER BY c.created_at DESC
    `;
    return NextResponse.json(clients.map((c) => safeClient(c as Record<string, unknown>)));
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = await initDB();
    const body = await request.json();
    const { name, email, phone, age, gender, health_goal, notes, address, weight } = body;
    if (!name || !email || !phone || !age || !gender || !health_goal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const [client] = await sql`
      INSERT INTO clients (name, email, phone, age, gender, health_goal, notes, address)
      VALUES (${name}, ${email}, ${phone}, ${age}, ${gender}, ${health_goal}, ${notes || null}, ${address || null})
      RETURNING *
    `;

    // Optional initial weight captured at onboarding.
    const w = parseFloat(weight);
    if (!isNaN(w) && w > 0) {
      await sql`INSERT INTO health_metrics (client_id, weight_kg, source) VALUES (${client.id}, ${w}, 'manual')`;
    }

    await sql`
      INSERT INTO activity_log (type, description, client_name)
      VALUES ('client_added', ${`New client onboarded for ${String(health_goal).replace('_', ' ')} program`}, ${name})
    `;
    return NextResponse.json(safeClient(client as Record<string, unknown>), { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/clients error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
