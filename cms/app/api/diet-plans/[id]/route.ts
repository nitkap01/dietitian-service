import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../../server/db';
import { getSetting } from '../../../server/settings';
import { sendWhatsApp } from '../../../server/whatsapp';

type Ctx = { params: Promise<{ id: string }> };

// Publish / unpublish a diet plan. Publishing is what makes it visible to the
// client on the portal (still payment-gated / blurred until paid).
export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const { action } = await request.json();

    const [plan] = await sql`SELECT dp.*, c.name as client_name, c.phone as client_phone FROM diet_plans dp JOIN clients c ON c.id = dp.client_id WHERE dp.id = ${id}`;
    if (!plan) return NextResponse.json({ error: 'Diet plan not found' }, { status: 404 });

    if (action === 'publish') {
      await sql`UPDATE diet_plans SET status = 'published', published_at = NOW() WHERE id = ${id}`;

      const portalUrl = (await getSetting(sql, 'portal_url')) || '/portal';
      const businessName = (await getSetting(sql, 'business_name')) || 'Your dietitian';

      await sql`
        INSERT INTO portal_notifications (client_id, type, title, body)
        VALUES (${plan.client_id}, 'diet_published', ${`New diet plan: ${plan.title}`},
          ${'Your dietitian published a new diet plan. Open the Diets tab to view it.'})
      `;
      const message =
        `📋 ${businessName}: your new diet plan "${plan.title}" is ready!\n` +
        `View it on your portal: ${portalUrl}\n` +
        `(If a payment is pending, it unlocks as soon as we receive it.)`;
      await sendWhatsApp(sql, { clientId: plan.client_id, phone: plan.client_phone, message, intent: 'diet_published' });

      await sql`
        INSERT INTO activity_log (type, description, client_name)
        VALUES ('diet_plan_updated', ${`Published diet plan: ${plan.title}`}, ${plan.client_name})
      `;
      return NextResponse.json({ success: true, status: 'published' });
    }

    if (action === 'unpublish') {
      await sql`UPDATE diet_plans SET status = 'draft', published_at = NULL WHERE id = ${id}`;
      return NextResponse.json({ success: true, status: 'draft' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('PATCH diet-plans/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update diet plan' }, { status: 500 });
  }
}

// Add a new version to an existing plan.
export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    const { ocrData, changelog } = await request.json();

    const [{ max }] = await sql`SELECT COALESCE(MAX(version_number), 0) as max FROM diet_plan_versions WHERE diet_plan_id = ${id}`;
    const next = Number(max) + 1;
    await sql`
      INSERT INTO diet_plan_versions (diet_plan_id, version_number, ocr_data, changelog)
      VALUES (${id}, ${next}, ${ocrData ? JSON.stringify(ocrData) : null}, ${changelog || `Version ${next}`})
    `;
    return NextResponse.json({ success: true, version_number: next }, { status: 201 });
  } catch (error) {
    console.error('POST diet-plans/[id] version error:', error);
    return NextResponse.json({ error: 'Failed to add version' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const sql = await initDB();
    const { id } = await ctx.params;
    await sql`DELETE FROM diet_plan_versions WHERE diet_plan_id = ${id}`;
    await sql`DELETE FROM diet_plans WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE diet-plans/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete diet plan' }, { status: 500 });
  }
}
