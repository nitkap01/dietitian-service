import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const [client] = await sql`
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
      WHERE c.id = ${id}
    `;

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
    const sql = await initDB();
    const { id } = await ctx.params;
    const body = await request.json();
    const { name, email, phone, age, gender, health_goal, status, inactive_reason, notes } = body;

    const [client] = await sql`
      UPDATE clients SET
        name = ${name}, email = ${email}, phone = ${phone}, age = ${age}, gender = ${gender},
        health_goal = ${health_goal}, status = ${status}, inactive_reason = ${inactive_reason || null},
        notes = ${notes || null}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(client);
  } catch (error) {
    console.error('PUT /api/clients/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    await sql`
      UPDATE clients SET status = 'inactive', inactive_reason = 'Deactivated by admin', updated_at = NOW()
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/clients/[id] error:', error);
    return NextResponse.json({ error: 'Failed to deactivate client' }, { status: 500 });
  }
}
