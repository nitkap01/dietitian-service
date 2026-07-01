import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../server/db';
import { getPortalClientId } from '../../../server/session';

export async function GET(req: NextRequest) {
  try {
    const clientId = await getPortalClientId(req);
    if (!clientId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sql = await initDB();
    const metrics = await sql`SELECT id, weight_kg, recorded_at, source FROM health_metrics WHERE client_id = ${clientId} ORDER BY recorded_at ASC`;
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('GET portal/weight error:', error);
    return NextResponse.json({ error: 'Failed to load weight history' }, { status: 500 });
  }
}
