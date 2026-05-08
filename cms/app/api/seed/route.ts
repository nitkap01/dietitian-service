import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    const db = getDB();
    // Clear all data
    db.exec(`
      DELETE FROM activity_log;
      DELETE FROM whatsapp_messages;
      DELETE FROM notifications;
      DELETE FROM payments;
      DELETE FROM diet_plan_versions;
      DELETE FROM diet_plans;
      DELETE FROM health_metrics;
      DELETE FROM client_packages;
      DELETE FROM clients;
      DELETE FROM packages;
      DELETE FROM meal_items;
    `);
    seedDatabase(db);
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
