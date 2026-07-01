import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../server/db';
import { getPortalClientId } from '../../../server/session';

export async function GET(req: NextRequest) {
  try {
    const clientId = await getPortalClientId(req);
    if (!clientId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sql = await initDB();
    const rows = await sql`SELECT * FROM portal_notifications WHERE client_id = ${clientId} ORDER BY created_at DESC LIMIT 50`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET portal/notifications error:', error);
    return NextResponse.json({ error: 'Failed to load notifications' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const clientId = await getPortalClientId(req);
    if (!clientId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sql = await initDB();
    await sql`UPDATE portal_notifications SET is_read = 1 WHERE client_id = ${clientId} AND is_read = 0`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH portal/notifications error:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
