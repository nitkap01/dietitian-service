import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../server/db';

function ymd(d: Date): string {
  return d.toISOString().split('T')[0];
}

export async function GET(req: NextRequest) {
  try {
    const sql = await initDB();
    const clientId = new URL(req.url).searchParams.get('client_id');
    if (!clientId) return NextResponse.json({ error: 'client_id required' }, { status: 400 });
    const rows = await sql`
      SELECT cp.*, p.name as package_name, p.price as package_price, p.category as package_category,
        p.duration_months, p.request_weights, p.weight_frequency
      FROM client_packages cp JOIN packages p ON p.id = cp.package_id
      WHERE cp.client_id = ${clientId}
      ORDER BY cp.created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET client-packages error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// Assign a plan to a client.
export async function POST(req: NextRequest) {
  try {
    const sql = await initDB();
    const body = await req.json();
    const { client_id, package_id, start_date } = body;
    if (!client_id || !package_id) {
      return NextResponse.json({ error: 'client_id and package_id are required' }, { status: 400 });
    }

    const [pkg] = await sql`SELECT * FROM packages WHERE id = ${package_id}`;
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    const [client] = await sql`SELECT id, name FROM clients WHERE id = ${client_id}`;
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const start = start_date ? new Date(start_date) : new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + (Number(pkg.duration_months) || 1));

    // One active plan at a time.
    await sql`UPDATE client_packages SET is_active = 0 WHERE client_id = ${client_id} AND is_active = 1`;

    const [cp] = await sql`
      INSERT INTO client_packages (client_id, package_id, start_date, end_date, is_active)
      VALUES (${client_id}, ${package_id}, ${ymd(start)}, ${ymd(end)}, 1)
      RETURNING *
    `;

    // Pending payment for the plan — diets stay locked until this is marked paid.
    const [payment] = await sql`
      INSERT INTO payments (client_id, package_id, amount, status, notes, source, due_date)
      VALUES (${client_id}, ${package_id}, ${pkg.price}, 'pending', ${`${pkg.name} plan`}, 'manual', ${ymd(start)})
      RETURNING *
    `;

    // Weight-request schedule.
    if (pkg.request_weights) {
      await sql`UPDATE notifications SET is_active = 0 WHERE client_id = ${client_id} AND type = 'health_metric_request'`;
      await sql`
        INSERT INTO notifications (client_id, type, frequency, message, next_send_at, is_active)
        VALUES (${client_id}, 'health_metric_request', ${pkg.weight_frequency || 'weekly'},
          ${`Weight update request (${pkg.weight_frequency || 'weekly'})`}, NOW(), 1)
      `;
    }

    await sql`
      INSERT INTO activity_log (type, description, client_name)
      VALUES ('client_added', ${`Assigned plan: ${pkg.name}`}, ${client.name})
    `;

    return NextResponse.json({ success: true, client_package: cp, payment }, { status: 201 });
  } catch (error) {
    console.error('POST client-packages error:', error);
    return NextResponse.json({ error: 'Failed to assign plan' }, { status: 500 });
  }
}
