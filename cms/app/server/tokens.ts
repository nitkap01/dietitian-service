// Edge-safe session tokens (used by middleware AND API routes).
// Only depends on the Web Crypto API — no Node built-ins, no DB imports.

export type SessionKind = 'admin' | 'client';

export interface SessionPayload {
  kind: SessionKind;
  subject: string; // admin username, or client id
  issuedAt: number;
}

function getSecret(): string {
  return process.env.SESSION_SECRET || 'fallback-secret';
}

async function importKey(usage: KeyUsage): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage],
  );
}

// Cookie value = base64( "kind:subject:issuedAt:base64sig" )
export async function createSession(kind: SessionKind, subject: string): Promise<string> {
  const payload = `${kind}:${subject}:${Date.now()}`;
  const enc = new TextEncoder();
  const key = await importKey('sign');
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
  return btoa(`${payload}:${sig}`);
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const decoded = atob(token);
    const lastColon = decoded.lastIndexOf(':');
    if (lastColon === -1) return null;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);

    const enc = new TextEncoder();
    const key = await importKey('verify');
    const sigBytes = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0));
    const ok = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payload));
    if (!ok) return null;

    const [kind, subject, issuedAt] = payload.split(':');
    if (kind !== 'admin' && kind !== 'client') return null;
    return { kind, subject, issuedAt: Number(issuedAt) };
  } catch {
    return null;
  }
}
