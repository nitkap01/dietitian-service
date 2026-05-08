import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
  try {
    const db = initDB();
    const notifications = db.prepare(`
      SELECT n.*, c.name as client_name, c.phone as client_phone
      FROM notifications n
      JOIN clients c ON n.client_id = c.id
      ORDER BY n.created_at DESC
    `).all();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('GET notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = initDB();
    const body = await request.json();
    const { client_id, type, frequency, custom_days, message } = body;

    if (!client_id || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const next_send_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const result = db.prepare(`
      INSERT INTO notifications (client_id, type, frequency, custom_days, message, next_send_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(client_id, type, frequency || null, custom_days || null, message || null, next_send_at);

    const notification = db.prepare(`
      SELECT n.*, c.name as client_name, c.phone as client_phone
      FROM notifications n
      JOIN clients c ON n.client_id = c.id
      WHERE n.id = ?
    `).get(result.lastInsertRowid);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('POST notifications error:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = initDB();
    const body = await request.json();
    const { id, is_active } = body;

    db.prepare('UPDATE notifications SET is_active = ? WHERE id = ?').run(is_active ? 1 : 0, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT notifications error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
