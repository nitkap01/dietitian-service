import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../server/db';
import { getPortalClientId } from '../../../server/session';

export async function GET(req: NextRequest) {
  try {
    const clientId = await getPortalClientId(req);
    if (!clientId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sql = await initDB();

    const [client] = await sql`
      SELECT id, name, email, phone, age, gender, health_goal, status, address, created_at
      FROM clients WHERE id = ${clientId}
    `;
    if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [plan] = await sql`
      SELECT p.name, p.description, p.price, p.duration_months, p.benefits, cp.start_date, cp.end_date
      FROM client_packages cp JOIN packages p ON p.id = cp.package_id
      WHERE cp.client_id = ${clientId} AND cp.is_active = 1
      ORDER BY cp.created_at DESC LIMIT 1
    `;
    const [latest] = await sql`SELECT weight_kg, recorded_at FROM health_metrics WHERE client_id = ${clientId} ORDER BY recorded_at DESC LIMIT 1`;
    const [{ metrics_count }] = await sql`SELECT COUNT(*)::int as metrics_count FROM health_metrics WHERE client_id = ${clientId}`;
    const [{ paid }] = await sql`SELECT COUNT(*)::int as paid FROM payments WHERE client_id = ${clientId} AND status = 'paid'`;
    const [{ unread }] = await sql`SELECT COUNT(*)::int as unread FROM portal_notifications WHERE client_id = ${clientId} AND is_read = 0`;
    const [{ diet_count }] = await sql`SELECT COUNT(*)::int as diet_count FROM diet_plans WHERE client_id = ${clientId} AND status = 'published'`;

    return NextResponse.json({
      client,
      plan: plan || null,
      latestWeight: latest || null,
      metricsCount: metrics_count,
      hasPaid: paid > 0,
      unread,
      publishedDiets: diet_count,
    });
  } catch (error) {
    console.error('GET portal/me error:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
