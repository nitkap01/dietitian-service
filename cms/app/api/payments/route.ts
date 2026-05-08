import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
  try {
    const db = initDB();
    const payments = db.prepare(`
      SELECT pay.*, c.name as client_name, p.name as package_name
      FROM payments pay
      JOIN clients c ON pay.client_id = c.id
      LEFT JOIN packages p ON pay.package_id = p.id
      ORDER BY pay.created_at DESC
    `).all();
    return NextResponse.json(payments);
  } catch (error) {
    console.error('GET payments error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = initDB();
    const body = await request.json();
    const { client_id, package_id, amount, status, notes, due_date } = body;

    if (!client_id || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const paid_at = status === 'paid' ? new Date().toISOString() : null;

    const result = db.prepare(`
      INSERT INTO payments (client_id, package_id, amount, status, notes, paid_at, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(client_id, package_id || null, amount, status || 'pending', notes || null, paid_at, due_date || null);

    if (status === 'paid') {
      db.prepare(`UPDATE clients SET status = 'active', updated_at = datetime('now') WHERE id = ?`).run(client_id);
      const clientName = (db.prepare('SELECT name FROM clients WHERE id = ?').get(client_id) as { name: string })?.name;
      db.prepare(`
        INSERT INTO activity_log (type, description, client_name) VALUES (?, ?, ?)
      `).run('payment_received', `Payment of ₹${amount} received`, clientName || 'Unknown');
    }

    const payment = db.prepare(`
      SELECT pay.*, c.name as client_name, p.name as package_name
      FROM payments pay
      JOIN clients c ON pay.client_id = c.id
      LEFT JOIN packages p ON pay.package_id = p.id
      WHERE pay.id = ?
    `).get(result.lastInsertRowid);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('POST payments error:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = initDB();
    const body = await request.json();
    const { id, status } = body;

    const paid_at = status === 'paid' ? new Date().toISOString() : null;

    db.prepare(`
      UPDATE payments SET status = ?, paid_at = ? WHERE id = ?
    `).run(status, paid_at, id);

    if (status === 'paid') {
      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as { client_id: number; amount: number } | undefined;
      if (payment) {
        db.prepare(`UPDATE clients SET status = 'active', updated_at = datetime('now') WHERE id = ?`).run(payment.client_id);
        const clientName = (db.prepare('SELECT name FROM clients WHERE id = ?').get(payment.client_id) as { name: string })?.name;
        db.prepare(`
          INSERT INTO activity_log (type, description, client_name) VALUES (?, ?, ?)
        `).run('payment_received', `Payment of ₹${payment.amount} marked as paid`, clientName || 'Unknown');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT payments error:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
