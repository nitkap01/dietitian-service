import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../../server/db';
import { hashPassword, generatePassword } from '../../../../server/password';
import { getSetting } from '../../../../server/settings';
import { sendWhatsApp } from '../../../../server/whatsapp';

type Ctx = { params: Promise<{ id: string }> };

// Generates a fresh secure password for the client's portal login, stores only
// its hash, and (optionally) sends the login details over WhatsApp. Used for
// both initial setup and password reset. Only the dietitian (admin session) can
// call this — the middleware gates it.
export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const body = await request.json().catch(() => ({}));
    const send = !!body.send;

    const [client] = await sql`SELECT id, name, phone FROM clients WHERE id = ${id}`;
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const password = generatePassword(10);
    const hash = await hashPassword(password);
    await sql`UPDATE clients SET password_hash = ${hash}, password_set_at = NOW() WHERE id = ${id}`;

    const portalUrl = (await getSetting(sql, 'portal_url')) || '/portal';
    const businessName = (await getSetting(sql, 'business_name')) || 'your dietitian';

    let sent = false;
    if (send) {
      const message =
        `🔐 ${businessName} — your diet portal access\n\n` +
        `Login here: ${portalUrl}\n` +
        `Username: ${client.phone}\n` +
        `Password: ${password}\n\n` +
        `You can view your diet plans, notifications and weight history here. ` +
        `Keep this safe — only your dietitian can reset the password.`;
      await sendWhatsApp(sql, { clientId: Number(id), phone: client.phone as string, message, intent: 'credentials' });
      await sql`
        INSERT INTO portal_notifications (client_id, type, title, body)
        VALUES (${id}, 'general', 'Portal access sent', 'Your login details were shared on WhatsApp.')
      `;
      await sql`
        INSERT INTO activity_log (type, description, client_name)
        VALUES ('client_added', ${'Portal credentials sent via WhatsApp'}, ${client.name})
      `;
      sent = true;
    }

    return NextResponse.json({ success: true, username: client.phone, password, portal_url: portalUrl, sent });
  } catch (error) {
    console.error('POST /api/clients/[id]/credentials error:', error);
    return NextResponse.json({ error: 'Failed to set credentials' }, { status: 500 });
  }
}
