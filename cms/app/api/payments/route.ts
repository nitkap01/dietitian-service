import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../server/db';

export async function GET() {
  try {
    const sql = await initDB();
    const payments = await sql`
      SELECT pay.*, c.name as client_name, p.name as package_name
      FROM payments pay
      JOIN clients c ON pay.client_id = c.id
      LEFT JOIN packages p ON pay.package_id = p.id
      ORDER BY pay.created_at DESC
    `;
    return NextResponse.json(payments);
  } catch (error) {
    console.error('GET payments error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = await initDB();
    const body = await request.json();
    const { client_id, package_id, amount, status, notes, due_date } = body;

    if (!client_id || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const paid_at = status === 'paid' ? new Date() : null;

    const [newPayment] = await sql`
      INSERT INTO payments (client_id, package_id, amount, status, notes, paid_at, due_date)
      VALUES (${client_id}, ${package_id || null}, ${amount}, ${status || 'pending'}, ${notes || null}, ${paid_at}, ${due_date || null})
      RETURNING id
    `;

    if (status === 'paid') {
      await sql`UPDATE clients SET status = 'active', updated_at = NOW() WHERE id = ${client_id}`;
      const [clientRow] = await sql`SELECT name FROM clients WHERE id = ${client_id}`;
      await sql`
        INSERT INTO activity_log (type, description, client_name)
        VALUES ('payment_received', ${`Payment of ₹${amount} received`}, ${clientRow?.name || 'Unknown'})
      `;
    }

    const [payment] = await sql`
      SELECT pay.*, c.name as client_name, p.name as package_name
      FROM payments pay
      JOIN clients c ON pay.client_id = c.id
      LEFT JOIN packages p ON pay.package_id = p.id
      WHERE pay.id = ${newPayment.id}
    `;

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('POST payments error:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sql = await initDB();
    const body = await request.json();
    const { id, status } = body;

    const paid_at = status === 'paid' ? new Date() : null;

    await sql`UPDATE payments SET status = ${status}, paid_at = ${paid_at} WHERE id = ${id}`;

    if (status === 'paid') {
      const [payment] = await sql`SELECT client_id, amount FROM payments WHERE id = ${id}`;
      if (payment) {
        await sql`UPDATE clients SET status = 'active', updated_at = NOW() WHERE id = ${payment.client_id}`;
        const [clientRow] = await sql`SELECT name FROM clients WHERE id = ${payment.client_id}`;
        await sql`
          INSERT INTO activity_log (type, description, client_name)
          VALUES ('payment_received', ${`Payment of ₹${payment.amount} marked as paid`}, ${clientRow?.name || 'Unknown'})
        `;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT payments error:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
