import postgres from 'postgres';
import { getSetting } from './settings';

// WhatsApp provider adapter.
//
// Every outbound message goes through sendWhatsApp(), which records the message
// in `whatsapp_messages` (direction 'outbound') and — for real providers —
// dispatches it to the provider API. The default 'simulator' provider only
// records the message so the whole product can be tested for free locally.
//
// To add a real provider later (Meta Cloud API / Twilio), implement a branch in
// dispatch() keyed on the `whatsapp_provider` setting and a webhook route that
// POSTs inbound messages to /api/whatsapp.

export interface SendWhatsAppInput {
  clientId: number | string;
  phone?: string | null;
  message: string;
  mediaPath?: string | null;
  intent?: string | null;
}

async function dispatch(provider: string, phone: string | null | undefined, message: string): Promise<void> {
  if (provider === 'simulator') return; // recorded only
  // Real providers plug in here. Kept as a no-op seam for now so nothing breaks
  // if a provider is selected before credentials are wired.
  console.warn(`[whatsapp] provider "${provider}" not yet implemented; message recorded only.`, { phone, len: message.length });
}

export async function sendWhatsApp(sql: postgres.Sql, input: SendWhatsAppInput) {
  const provider = (await getSetting(sql, 'whatsapp_provider')) || 'simulator';
  await dispatch(provider, input.phone, input.message);

  const [row] = await sql`
    INSERT INTO whatsapp_messages
      (client_id, direction, message, phone_number, media_path, intent, is_read, received_at, created_at)
    VALUES
      (${input.clientId}, 'outbound', ${input.message}, ${input.phone ?? null},
       ${input.mediaPath ?? null}, ${input.intent ?? null}, 1, NOW(), NOW())
    RETURNING *
  `;
  return row;
}
