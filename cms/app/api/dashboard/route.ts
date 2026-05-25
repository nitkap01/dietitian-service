import { NextResponse } from 'next/server';
import { initDB } from '../../server/db';

export async function GET() {
  try {
    const sql = await initDB();

    const [stats] = await sql`
      SELECT
        (SELECT COUNT(*) FROM clients)::int as total_clients,
        (SELECT COUNT(*) FROM clients WHERE status = 'active')::int as active_clients,
        (SELECT COUNT(*) FROM clients WHERE status = 'inactive')::int as inactive_clients,
        COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'paid'), 0)::int as total_revenue,
        (SELECT COUNT(*) FROM payments WHERE status IN ('pending', 'unpaid'))::int as pending_payments,
        COALESCE((SELECT SUM(amount) FROM payments WHERE status IN ('pending', 'unpaid')), 0)::int as pending_amount
    `;

    const activity = await sql`
      SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 15
    `;

    return NextResponse.json({ stats, activity });
  } catch (error) {
    console.error('GET dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
