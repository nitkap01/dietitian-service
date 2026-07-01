import postgres from 'postgres';
import { seedDatabase } from './seed';
import { ensureDefaultSettings } from './settings';

let _sql: postgres.Sql | null = null;

export function getDB(): postgres.Sql {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL environment variable is not set');
    _sql = postgres(url, {
      ssl: url.includes('supabase') || url.includes('pooler') ? 'require' : false,
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return _sql;
}

let _initPromise: Promise<postgres.Sql> | null = null;

export async function initDB(): Promise<postgres.Sql> {
  if (!_initPromise) {
    _initPromise = (async () => {
      const sql = getDB();
      await createTables(sql);
      await ensureDefaultSettings(sql);
      const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM clients`;
      if (count === 0) await seedDatabase(sql);
      return sql;
    })();
  }
  return _initPromise;
}

export async function resetDB(): Promise<void> {
  _initPromise = null;
  const sql = getDB();
  await sql.begin(async (tx) => {
    await tx`DELETE FROM portal_notifications`;
    await tx`DELETE FROM activity_log`;
    await tx`DELETE FROM whatsapp_messages`;
    await tx`DELETE FROM notifications`;
    await tx`DELETE FROM payments`;
    await tx`DELETE FROM diet_plan_versions`;
    await tx`DELETE FROM diet_plans`;
    await tx`DELETE FROM health_metrics`;
    await tx`DELETE FROM client_packages`;
    await tx`DELETE FROM clients`;
    await tx`DELETE FROM packages`;
    await tx`DELETE FROM meal_items`;
    // app_settings is intentionally preserved so a re-seed doesn't wipe the AI key.
  });
  await seedDatabase(sql);
  _initPromise = Promise.resolve(sql);
}

async function createTables(sql: postgres.Sql) {
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      health_goal TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      inactive_reason TEXT,
      notes TEXT,
      address TEXT,
      password_hash TEXT,
      password_set_at TIMESTAMPTZ,
      portal_last_login TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS packages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      duration_months INTEGER NOT NULL DEFAULT 1,
      benefits TEXT,
      request_weights INTEGER NOT NULL DEFAULT 0,
      weight_frequency TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS client_packages (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id),
      package_id INTEGER NOT NULL REFERENCES packages(id),
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS health_metrics (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id),
      weight_kg NUMERIC NOT NULL,
      recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      source TEXT NOT NULL DEFAULT 'manual',
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS diet_plans (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id),
      title TEXT NOT NULL,
      issues TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS diet_plan_versions (
      id SERIAL PRIMARY KEY,
      diet_plan_id INTEGER NOT NULL REFERENCES diet_plans(id),
      version_number INTEGER NOT NULL DEFAULT 1,
      image_path TEXT,
      ocr_data TEXT,
      changelog TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id),
      package_id INTEGER REFERENCES packages(id),
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      screenshot_path TEXT,
      notes TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      detected_message_id INTEGER,
      detection_confidence NUMERIC,
      paid_at TIMESTAMPTZ,
      due_date TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id),
      type TEXT NOT NULL,
      frequency TEXT,
      custom_days INTEGER,
      message TEXT,
      next_send_at TIMESTAMPTZ,
      last_sent_at TIMESTAMPTZ,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id),
      path TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      client_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS meal_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      calories_per_serving INTEGER,
      protein TEXT,
      carbs TEXT,
      fat TEXT,
      serving_size TEXT,
      health_tags TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS whatsapp_messages (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id),
      direction TEXT NOT NULL DEFAULT 'inbound',
      message TEXT NOT NULL,
      phone_number TEXT,
      media_path TEXT,
      media_type TEXT,
      intent TEXT,
      parsed_weight NUMERIC,
      payment_detected INTEGER NOT NULL DEFAULT 0,
      is_read INTEGER NOT NULL DEFAULT 0,
      received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS portal_notifications (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES clients(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Idempotent migrations for existing databases (the schema above is
    -- create-only, so ALTER ... ADD COLUMN IF NOT EXISTS brings older DBs up to date).
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS password_hash TEXT;
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS password_set_at TIMESTAMPTZ;
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS portal_last_login TIMESTAMPTZ;
    ALTER TABLE packages ADD COLUMN IF NOT EXISTS benefits TEXT;
    ALTER TABLE packages ADD COLUMN IF NOT EXISTS request_weights INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE packages ADD COLUMN IF NOT EXISTS weight_frequency TEXT;
    ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS issues TEXT;
    ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
    ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual';
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS detected_message_id INTEGER;
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS detection_confidence NUMERIC;
    ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS media_path TEXT;
    ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS media_type TEXT;
    ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS intent TEXT;
    ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS parsed_weight NUMERIC;
    ALTER TABLE whatsapp_messages ADD COLUMN IF NOT EXISTS payment_detected INTEGER NOT NULL DEFAULT 0;
  `);
}
