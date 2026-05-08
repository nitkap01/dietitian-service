import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = initDB();
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('client_id');

    let query = `
      SELECT wm.*, c.name as client_name, c.phone as client_phone
      FROM whatsapp_messages wm
      JOIN clients c ON c.id = wm.client_id
    `;
    const params: (string | number)[] = [];

    if (clientId) {
      query += ' WHERE wm.client_id = ?';
      params.push(clientId);
    }

    query += ' ORDER BY wm.received_at ASC';

    const messages = db.prepare(query).all(...params);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = initDB();
    const body = await req.json();
    const { client_id, direction, message, phone_number } = body;

    if (!client_id || !message) {
      return NextResponse.json({ error: 'client_id and message are required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO whatsapp_messages (client_id, direction, message, phone_number, is_read, received_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(client_id, direction || 'inbound', message, phone_number || null, direction === 'outbound' ? 1 : 0);

    return NextResponse.json({ success: true, id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error('POST whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = initDB();
    const body = await req.json();
    const { client_id } = body;

    if (client_id) {
      db.prepare('UPDATE whatsapp_messages SET is_read = 1 WHERE client_id = ? AND is_read = 0').run(client_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
