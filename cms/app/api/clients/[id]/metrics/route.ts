import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    const metrics = db.prepare(`
      SELECT * FROM health_metrics WHERE client_id = ? ORDER BY recorded_at ASC
    `).all(id);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('GET metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const db = initDB();
    const { id } = await ctx.params;
    const body = await request.json();
    const { weight_kg, source, notes, recorded_at } = body;

    if (!weight_kg) {
      return NextResponse.json({ error: 'Weight is required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO health_metrics (client_id, weight_kg, source, notes, recorded_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, weight_kg, source || 'manual', notes || null, recorded_at || new Date().toISOString());

    const clientName = (db.prepare('SELECT name FROM clients WHERE id = ?').get(id) as { name: string })?.name;
    db.prepare(`
      INSERT INTO activity_log (type, description, client_name) VALUES (?, ?, ?)
    `).run('metric_recorded', `Weight logged: ${weight_kg} kg`, clientName || 'Unknown');

    const metric = db.prepare('SELECT * FROM health_metrics WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    console.error('POST metrics error:', error);
    return NextResponse.json({ error: 'Failed to add metric' }, { status: 500 });
  }
}
