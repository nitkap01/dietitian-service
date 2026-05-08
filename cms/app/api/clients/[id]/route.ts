import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    const client = db.prepare(`
      SELECT c.*,
        p.name as package_name,
        p.price as package_price,
        p.category as package_category,
        p.id as package_id,
        cp.start_date as package_start,
        cp.end_date as package_end
      FROM clients c
      LEFT JOIN client_packages cp ON c.id = cp.client_id AND cp.is_active = 1
      LEFT JOIN packages p ON cp.package_id = p.id
      WHERE c.id = ?
    `).get(id);

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    console.error('GET /api/clients/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    const body = await request.json();
    const { name, email, phone, age, gender, health_goal, status, inactive_reason, notes } = body;

    db.prepare(`
      UPDATE clients SET
        name = ?, email = ?, phone = ?, age = ?, gender = ?,
        health_goal = ?, status = ?, inactive_reason = ?, notes = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(name, email, phone, age, gender, health_goal, status, inactive_reason || null, notes || null, id);

    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
    return NextResponse.json(client);
  } catch (error) {
    console.error('PUT /api/clients/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    db.prepare('UPDATE clients SET status = ?, inactive_reason = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run('inactive', 'Deactivated by admin', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/clients/[id] error:', error);
    return NextResponse.json({ error: 'Failed to deactivate client' }, { status: 500 });
  }
}
