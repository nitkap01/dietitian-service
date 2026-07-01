import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../server/db';
import { verifyPassword } from '../../../server/password';
import { createSession } from '../../../server/tokens';

// Client portal login: username = phone number, password = the one the dietitian set.
export async function POST(req: NextRequest) {
  try {
    const sql = await initDB();
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 });
    }

    const phone = String(username).trim();
    const [client] = await sql`
      SELECT id, name, status, password_hash FROM clients
      WHERE phone = ${phone} OR phone = ${'+91-' + phone} OR phone = ${'+91' + phone}
      LIMIT 1
    `;

    if (!client || !client.password_hash) {
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 });
    }
    if (client.status !== 'active') {
      return NextResponse.json({ error: 'Your account is inactive. Please contact your dietitian.' }, { status: 403 });
    }
    const ok = await verifyPassword(password, client.password_hash as string);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 });
    }

    await sql`UPDATE clients SET portal_last_login = NOW() WHERE id = ${client.id}`;

    const token = await createSession('client', String(client.id));
    const response = NextResponse.json({ success: true, name: client.name });
    response.cookies.set('portal_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('POST /api/portal/auth error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('portal_session');
  return response;
}
