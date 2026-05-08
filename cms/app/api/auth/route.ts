import { NextRequest, NextResponse } from 'next/server';

async function makeToken(username: string): Promise<string> {
  const secret = process.env.SESSION_SECRET || 'fallback-secret';
  const payload = `${username}:${Date.now()}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
  return btoa(`${payload}:${sig}`);
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.CMS_USERNAME || 'admin';
  const validPass = process.env.CMS_PASSWORD || 'changeme123';

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await makeToken(username);
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
