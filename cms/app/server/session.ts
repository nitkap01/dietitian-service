import { NextRequest } from 'next/server';
import { verifySession } from './tokens';

// Reads and verifies the client portal session cookie, returning the client id.
// Portal API routes call this to scope every query to the logged-in client.
export async function getPortalClientId(req: NextRequest): Promise<number | null> {
  const token = req.cookies.get('portal_session')?.value;
  const session = await verifySession(token);
  if (!session || session.kind !== 'client') return null;
  const id = Number(session.subject);
  return Number.isFinite(id) ? id : null;
}
