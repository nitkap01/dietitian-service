import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sql = await initDB();
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('client_id');

    const messages = clientId
      ? await sql`
          SELECT wm.*, c.name as client_name, c.phone as client_phone
          FROM whatsapp_messages wm
          JOIN clients c ON c.id = wm.client_id
          WHERE wm.client_id = ${clientId}
          ORDER BY wm.received_at ASC
        `
      : await sql`
          SELECT wm.*, c.name as client_name, c.phone as client_phone
          FROM whatsapp_messages wm
          JOIN clients c ON c.id = wm.client_id
          ORDER BY wm.received_at ASC
        `;

    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = await initDB();
    const body = await req.json();
    const { client_id, direction, message, phone_number } = body;

    if (!client_id || !message) {
      return NextResponse.json({ error: 'client_id and message are required' }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO whatsapp_messages (client_id, direction, message, phone_number, is_read, received_at)
      VALUES (${client_id}, ${direction || 'inbound'}, ${message}, ${phone_number || null}, ${direction === 'outbound' ? 1 : 0}, NOW())
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: row.id }, { status: 201 });
  } catch (error) {
    console.error('POST whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const sql = await initDB();
    const body = await req.json();
    const { client_id } = body;

    if (client_id) {
      await sql`UPDATE whatsapp_messages SET is_read = 1 WHERE client_id = ${client_id} AND is_read = 0`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
