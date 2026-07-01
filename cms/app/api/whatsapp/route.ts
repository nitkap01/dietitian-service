import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../server/db';
import { detectPayment, parseWeight } from '../../server/ai';
import { getAiConfig } from '../../server/settings';
import { sendWhatsApp } from '../../server/whatsapp';

const MAX_MEDIA_CHARS = 2_500_000; // ~1.8MB base64

export async function GET(req: NextRequest) {
  try {
    const sql = await initDB();
    const clientId = new URL(req.url).searchParams.get('client_id');

    const messages = clientId
      ? await sql`
          SELECT wm.*, c.name as client_name, c.phone as client_phone
          FROM whatsapp_messages wm JOIN clients c ON c.id = wm.client_id
          WHERE wm.client_id = ${clientId}
          ORDER BY wm.received_at ASC`
      : await sql`
          SELECT wm.*, c.name as client_name, c.phone as client_phone
          FROM whatsapp_messages wm JOIN clients c ON c.id = wm.client_id
          ORDER BY wm.received_at ASC`;

    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = await initDB();
    const body = await req.json();
    const { client_id, direction, message, phone_number, media, media_type } = body;
    const dir = direction || 'inbound';

    if (!client_id || (!message && !media)) {
      return NextResponse.json({ error: 'client_id and a message or media are required' }, { status: 400 });
    }

    // Parse media (accepts a data URL or raw base64 + media_type).
    let mediaPath: string | null = null;
    let imageBase64: string | null = null;
    let imageMediaType: string | null = media_type || null;
    if (typeof media === 'string' && media.length > 0) {
      if (media.length > MAX_MEDIA_CHARS) {
        return NextResponse.json({ error: 'Attachment too large (max ~1.8MB).' }, { status: 413 });
      }
      if (media.startsWith('data:')) {
        const match = media.match(/^data:([^;]+);base64,(.*)$/);
        if (match) {
          imageMediaType = match[1];
          imageBase64 = match[2];
        }
        mediaPath = media;
      } else {
        imageBase64 = media;
        mediaPath = `data:${imageMediaType || 'image/jpeg'};base64,${media}`;
      }
    }

    const [client] = await sql`SELECT id, name, phone, status FROM clients WHERE id = ${client_id}`;
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const [row] = await sql`
      INSERT INTO whatsapp_messages
        (client_id, direction, message, phone_number, media_path, media_type, is_read, received_at)
      VALUES
        (${client_id}, ${dir}, ${message || (mediaPath ? '[screenshot]' : '')},
         ${phone_number || client.phone}, ${mediaPath}, ${imageMediaType}, ${dir === 'outbound' ? 1 : 0}, NOW())
      RETURNING *
    `;

    let detection: Record<string, unknown> | null = null;

    if (dir === 'inbound') {
      const cfg = await getAiConfig(sql);

      // 1) Payment detection
      let handled = false;
      if (cfg.paymentDetectionEnabled) {
        const result = await detectPayment({ sql, text: message || '', imageBase64, imageMediaType });
        if (result.isPayment && result.confidence >= 0.5) {
          handled = true;
          await sql`UPDATE whatsapp_messages SET payment_detected = 1, intent = 'payment' WHERE id = ${row.id}`;

          const [activePlan] = await sql`
            SELECT p.price FROM client_packages cp JOIN packages p ON p.id = cp.package_id
            WHERE cp.client_id = ${client_id} AND cp.is_active = 1 ORDER BY cp.created_at DESC LIMIT 1
          `;
          const amount = result.amount ?? (activePlan?.price as number) ?? 0;

          const [pending] = await sql`
            SELECT id FROM payments WHERE client_id = ${client_id} AND status != 'paid'
            ORDER BY created_at ASC LIMIT 1
          `;
          if (pending) {
            await sql`
              UPDATE payments SET status = 'paid', paid_at = NOW(), source = 'auto',
                detected_message_id = ${row.id}, detection_confidence = ${result.confidence},
                screenshot_path = ${mediaPath}
              WHERE id = ${pending.id}
            `;
          } else {
            await sql`
              INSERT INTO payments (client_id, amount, status, source, detected_message_id, detection_confidence, screenshot_path, paid_at, notes)
              VALUES (${client_id}, ${amount}, 'paid', 'auto', ${row.id}, ${result.confidence}, ${mediaPath}, NOW(),
                ${`Auto-detected from WhatsApp${result.method ? ' (' + result.method + ')' : ''}`})
            `;
          }

          if (client.status !== 'active') {
            await sql`UPDATE clients SET status = 'active', inactive_reason = NULL, updated_at = NOW() WHERE id = ${client_id}`;
          }

          await sql`
            INSERT INTO portal_notifications (client_id, type, title, body)
            VALUES (${client_id}, 'payment_received', 'Payment received', 'Thanks! Your diet plans are now unlocked.')
          `;
          await sql`
            INSERT INTO activity_log (type, description, client_name)
            VALUES ('payment_received', ${`Payment auto-detected from WhatsApp${result.amount ? ' (₹' + result.amount + ')' : ''}`}, ${client.name})
          `;

          await sendWhatsApp(sql, {
            clientId: client_id,
            phone: client.phone,
            message: `✅ Thank you! We've received your payment${result.amount ? ` of ₹${result.amount}` : ''}. Your diet plan is now unlocked on your portal.`,
            intent: 'payment_confirmation',
          });

          detection = { type: 'payment', ...result };
        }
      }

      // 2) Weight capture (only if not already handled as a payment)
      if (!handled && cfg.weightCaptureEnabled) {
        const w = parseWeight(message || '');
        if (w !== null) {
          await sql`UPDATE whatsapp_messages SET intent = 'weight', parsed_weight = ${w} WHERE id = ${row.id}`;

          const [prev] = await sql`SELECT weight_kg, recorded_at FROM health_metrics WHERE client_id = ${client_id} ORDER BY recorded_at DESC LIMIT 1`;
          await sql`INSERT INTO health_metrics (client_id, weight_kg, source) VALUES (${client_id}, ${w}, 'whatsapp')`;

          await sql`
            INSERT INTO portal_notifications (client_id, type, title, body)
            VALUES (${client_id}, 'general', 'Weight recorded', ${`We recorded your weight: ${w} kg.`})
          `;
          await sql`
            INSERT INTO activity_log (type, description, client_name)
            VALUES ('metric_recorded', ${`Weight ${w} kg captured from WhatsApp`}, ${client.name})
          `;

          const prevText = prev
            ? ` Your previous weight was ${prev.weight_kg} kg on ${new Date(prev.recorded_at).toLocaleDateString('en-IN')}.`
            : '';
          await sendWhatsApp(sql, {
            clientId: client_id,
            phone: client.phone,
            message: `✅ Recorded your weight: ${w} kg.${prevText} Keep it up! 💪`,
            intent: 'weight_confirmation',
          });

          detection = { type: 'weight', weight: w };
        }
      }
    }

    return NextResponse.json({ success: true, id: row.id, detection }, { status: 201 });
  } catch (error) {
    console.error('POST whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const sql = await initDB();
    const { client_id } = await req.json();
    if (client_id) {
      await sql`UPDATE whatsapp_messages SET is_read = 1 WHERE client_id = ${client_id} AND is_read = 0`;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH whatsapp error:', error);
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
