import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '../../server/db';
import { getPublicSettings, setSettings, DEFAULT_SETTINGS } from '../../server/settings';

const EDITABLE_KEYS = new Set([
  'ai_provider',
  'ai_model',
  'payment_detection_enabled',
  'weight_capture_enabled',
  'business_name',
  'dietitian_name',
  'whatsapp_number',
  'whatsapp_provider',
  'portal_url',
]);

export async function GET() {
  try {
    const sql = await initDB();
    const settings = await getPublicSettings(sql);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sql = await initDB();
    const body = await req.json();

    const updates: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (EDITABLE_KEYS.has(key) && typeof value === 'string' && key in DEFAULT_SETTINGS) {
        updates[key] = value;
      }
    }

    // Secret handling: only update the API key if a new non-empty value is given,
    // so submitting the masked form never wipes it. Explicit removal via a flag.
    if (typeof body.ai_api_key === 'string' && body.ai_api_key.trim().length > 0) {
      updates.ai_api_key = body.ai_api_key.trim();
    } else if (body.remove_ai_api_key === true) {
      updates.ai_api_key = '';
    }

    await setSettings(sql, updates);
    return NextResponse.json(await getPublicSettings(sql));
  } catch (error) {
    console.error('PUT settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
