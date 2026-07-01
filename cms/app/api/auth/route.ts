import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '../../server/tokens';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.CMS_USERNAME || 'admin';
  const validPass = process.env.CMS_PASSWORD || 'changeme123';

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSession('admin', username);
  const response = NextResponse.json({ success: true });
  response.cookies.set('cms_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('cms_session');
  return response;
}
