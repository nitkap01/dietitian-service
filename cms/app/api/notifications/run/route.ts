import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../server/db';
import { sendWhatsApp } from '../../../server/whatsapp';

const DAYS: Record<string, number> = { weekly: 7, biweekly: 15, monthly: 30 };

// Processes due weight-request schedules: asks each client for their weight over
// WhatsApp (including their last recorded weight). Call with { client_id } to
// force a single client immediately ("Request weight now"); call with no body
// (or from a cron) to process all due requests.
export async function POST(req: NextRequest) {
  try {
    const sql = await initDB();
    const body = await req.json().catch(() => ({}));
    const clientId = body.client_id ? Number(body.client_id) : null;
    const force = !!clientId;

    const due = clientId
      ? await sql`
          SELECT n.id, n.client_id, n.frequency, c.name, c.phone
          FROM notifications n JOIN clients c ON c.id = n.client_id
          WHERE n.type = 'health_metric_request' AND n.is_active = 1 AND c.status = 'active'
            AND n.client_id = ${clientId}
          ORDER BY n.id DESC LIMIT 1`
      : await sql`
          SELECT n.id, n.client_id, n.frequency, c.name, c.phone
          FROM notifications n JOIN clients c ON c.id = n.client_id
          WHERE n.type = 'health_metric_request' AND n.is_active = 1 AND c.status = 'active'
            AND (n.next_send_at IS NULL OR n.next_send_at <= NOW())`;

    let sent = 0;
    for (const n of due) {
      const [last] = await sql`SELECT weight_kg, recorded_at FROM health_metrics WHERE client_id = ${n.client_id} ORDER BY recorded_at DESC LIMIT 1`;
      const lastText = last
        ? `Your last recorded weight was ${last.weight_kg} kg on ${new Date(last.recorded_at).toLocaleDateString('en-IN')}.`
        : `We don't have a weight on record yet.`;
      const firstName = String(n.name).split(' ')[0];
      const message = `Hi ${firstName}! 📏 Please share your current weight (just reply with the number in kg). ${lastText}`;

      await sendWhatsApp(sql, { clientId: n.client_id, phone: n.phone, message, intent: 'weight_request' });
      await sql`
        INSERT INTO portal_notifications (client_id, type, title, body)
        VALUES (${n.client_id}, 'weight_requested', 'Weight update requested', 'Please reply on WhatsApp with your current weight.')
      `;

      const days = DAYS[n.frequency as string] || 7;
      const next = new Date(Date.now() + days * 86_400_000);
      await sql`UPDATE notifications SET last_sent_at = NOW(), next_send_at = ${next} WHERE id = ${n.id}`;
      sent++;
    }

    if (force && sent === 0) {
      return NextResponse.json({ error: 'No active weight-request schedule for this client. Assign a plan with "Request Weights" enabled.' }, { status: 400 });
    }
    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error('POST notifications/run error:', error);
    return NextResponse.json({ error: 'Failed to run weight requests' }, { status: 500 });
  }
}
