import { NextResponse } from 'next/server';
import { resetDB } from '../../../lib/db';

export async function POST() {
  try {
    await resetDB();
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
