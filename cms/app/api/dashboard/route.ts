import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
  try {
    const db = initDB();

    const stats = db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM clients) as total_clients,
        (SELECT COUNT(*) FROM clients WHERE status = 'active') as active_clients,
        (SELECT COUNT(*) FROM clients WHERE status = 'inactive') as inactive_clients,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'paid') as total_revenue,
        (SELECT COUNT(*) FROM payments WHERE status IN ('pending', 'unpaid')) as pending_payments,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status IN ('pending', 'unpaid')) as pending_amount
    `).get();

    const activity = db.prepare(`
      SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 15
    `).all();

    return NextResponse.json({ stats, activity });
  } catch (error) {
    console.error('GET dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
