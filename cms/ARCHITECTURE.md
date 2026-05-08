# Architecture & Developer Guide

## Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components, API routes, Vercel-native |
| Language | TypeScript | Type safety across frontend + backend |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Database | SQLite via `better-sqlite3` | Zero-config local prototype; swap for Postgres in prod |
| AI | Anthropic Claude (Haiku) | Diet plan nutritional analysis |
| Charts | Recharts | Weight tracking line charts |
| Theme | `next-themes` | Dark/light/white toggle, SSR-safe |
| Icons | `lucide-react` | Consistent icon set |
| Auth | HMAC-signed cookie | Simple single-user session |

---

## Directory Structure

```
cms/
├── app/
│   ├── login/                  # Login page (public)
│   ├── (dashboard)/            # Route group — all protected pages share sidebar layout
│   │   ├── layout.tsx          # Sidebar + TopBar wrapper, mobile menu state
│   │   ├── dashboard/          # Stats overview
│   │   ├── clients/            # List, new, [id] detail
│   │   ├── packages/           # Package management
│   │   ├── meals/              # Meal library (recommendations)
│   │   ├── payments/           # Payment tracking
│   │   ├── notifications/      # Notification scheduling
│   │   ├── whatsapp/           # WhatsApp conversation view
│   │   └── settings/           # App config
│   └── api/
│       ├── auth/               # POST login, DELETE logout
│       ├── clients/            # CRUD + [id]/metrics, [id]/diet-plans
│       ├── packages/           # CRUD
│       ├── meals/              # CRUD meal library
│       ├── payments/           # CRUD
│       ├── notifications/      # CRUD
│       ├── whatsapp/           # GET/POST/PATCH messages
│       ├── diet-plans/analyze/ # POST — Claude AI diet analysis
│       ├── dashboard/          # GET stats
│       └── seed/               # POST re-seed database
├── components/
│   ├── layout/                 # Sidebar, TopBar, ThemeToggle
│   ├── ui/                     # Button, Card, Input, Select, Badge, Modal, Table
│   ├── clients/                # ClientForm, ClientCard, StatusBadge
│   ├── charts/                 # WeightChart (Recharts)
│   └── payments/               # PaymentForm
├── lib/
│   ├── db.ts                   # SQLite init, table creation, seed trigger
│   ├── seed.ts                 # Sample data (clients, packages, meals, messages)
│   └── types.ts                # TypeScript interfaces for all entities
├── middleware.ts                # Auth guard — redirects to /login if no valid session
├── SCHEMA.md                   # Full database schema reference
├── ARCHITECTURE.md             # This file
└── README.md                   # Quick start
```

---

## Authentication

A simple single-user session using HMAC-signed cookies (no external auth library needed).

- Credentials stored in env vars: `CMS_USERNAME`, `CMS_PASSWORD`
- On login: server creates an HMAC-SHA256 signed token, sets as `httpOnly` cookie
- `middleware.ts` verifies the cookie on every request, redirects to `/login` if invalid
- Logout: DELETE `/api/auth` clears the cookie

**To change credentials:** update `.env.local` — no rebuild needed, just restart dev server.

**For production:** use a strong random `SESSION_SECRET` (e.g. `openssl rand -hex 32`).

---

## Database Pattern

All API routes call `initDB()` from `lib/db.ts`:
1. Opens (or creates) the SQLite file at `DATABASE_URL`
2. Runs `CREATE TABLE IF NOT EXISTS` for every table
3. Checks if clients table is empty — if so, calls `seedDatabase()`

```ts
// Every API route follows this pattern
import { initDB } from '@/lib/db';

export async function GET() {
  const db = initDB();
  const rows = db.prepare('SELECT * FROM clients').all();
  return NextResponse.json(rows);
}
```

`better-sqlite3` is synchronous — no `await` needed for DB calls. This is intentional and fits Next.js API routes well.

**Switching to Postgres:** Replace `better-sqlite3` with `pg` or `postgres`, wrap queries in `async/await`, and update `lib/db.ts` to use a connection pool.

---

## Adding a New Feature

### 1. New database table
Add `CREATE TABLE IF NOT EXISTS your_table (...)` inside `createTables()` in `lib/db.ts`. Add the TypeScript interface to `lib/types.ts`.

### 2. New API route
Create `app/api/your-feature/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
  const db = initDB();
  const rows = db.prepare('SELECT * FROM your_table ORDER BY created_at DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const db = initDB();
  const body = await req.json();
  const result = db.prepare('INSERT INTO your_table (col) VALUES (?)').run(body.col);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
```

### 3. New page
Create `app/(dashboard)/your-feature/page.tsx` — it automatically gets the sidebar layout.
Add it to the nav in `components/layout/Sidebar.tsx` and the titles map in `components/layout/TopBar.tsx`.

### 4. New UI component
Add to `components/ui/`. Follow the existing `Button`, `Card`, `Input` patterns — they accept `className` for extension and use Tailwind for styling.

---

## AI Diet Analysis

**Route:** `POST /api/diet-plans/analyze`

**Request body:**
```json
{
  "ocrData": { "breakfast": {...}, "lunch": {...}, ... },
  "clientGoal": "weight_management",
  "clientName": "Priya Sharma"
}
```

**How it works:**
1. Formats the diet plan as a human-readable prompt
2. Calls `claude-haiku-4-5` (fast, cost-effective for analysis tasks)
3. Returns structured pros/cons/recommendations

**No API key set?** Falls back to a well-crafted mock analysis so the UI always works.

**To enable real AI:** Add `ANTHROPIC_API_KEY=sk-ant-...` to `.env.local`.

**Future: Meal recommendations for new clients**
When onboarding a new client, you can call the AI with their profile (age, gender, health goal, any medical notes) and ask it to recommend meals from the `meal_items` library. The `health_tags` field on each meal item is the bridge — Claude can filter by goal and suggest a starter diet plan.

---

## WhatsApp Integration

**Current (prototype):** Manual logging. You type what a client replied and click "Record" — it saves as an `inbound` message. You send outbound messages from the CMS and log them.

**Real integration options:**

| Option | Effort | Cost | Notes |
|---|---|---|---|
| **Twilio WhatsApp Business API** | Medium | Pay-per-message | Webhook receives messages → POST to `/api/whatsapp`. Twilio handles delivery. Best for India. |
| **WhatsApp Cloud API (Meta)** | Medium-High | Free tier available | Official Meta API. Requires business verification. More control. |
| **Wati / Interakt** | Low | SaaS fee | No-code WhatsApp CRM with webhooks. Fastest to set up. |

**Webhook implementation (Twilio example):**
```ts
// app/api/whatsapp/webhook/route.ts
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const from = formData.get('From')?.toString().replace('whatsapp:', '');
  const body = formData.get('Body')?.toString();
  // Look up client by phone number, save as inbound message
}
```

---

## Notifications (Future Automation)

Currently notifications are scheduled rules in the DB but not auto-sent.

**To automate sending:**
1. Set up a cron job (Vercel Cron, GitHub Actions, or a simple cron server)
2. POST to `/api/notifications/send` every hour
3. Route fetches notifications where `next_send_at <= now AND is_active = 1`
4. For each: send via WhatsApp API, update `last_sent_at` and `next_send_at`

---

## Deployment (Vercel)

1. Push repo to GitHub
2. Connect to Vercel — it auto-detects Next.js
3. Set env vars in Vercel dashboard:
   - `DATABASE_URL` → Use a Postgres connection string (e.g. Vercel Postgres, Neon, Supabase)
   - `ANTHROPIC_API_KEY`
   - `CMS_USERNAME`, `CMS_PASSWORD`, `SESSION_SECRET`
4. Update `lib/db.ts` to use your Postgres driver instead of `better-sqlite3`
5. File uploads (`public/uploads/`) → swap for Vercel Blob or AWS S3

**SQLite → Postgres migration checklist:**
- Replace `better-sqlite3` with `postgres` or `@vercel/postgres`
- Change all `.prepare().run()` to `await sql\`...\``
- Replace `INTEGER PRIMARY KEY AUTOINCREMENT` with `SERIAL PRIMARY KEY`
- Replace `TEXT` datetime columns with `TIMESTAMP`
- `REAL` → `NUMERIC`

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | No | SQLite path or Postgres URL. Default: `./dietitian.db` |
| `ANTHROPIC_API_KEY` | No | Enables real AI analysis. Falls back to mock if unset. |
| `CMS_USERNAME` | Yes | Login username. Default: `admin` |
| `CMS_PASSWORD` | Yes | Login password. Default: `changeme123` |
| `SESSION_SECRET` | Yes | Random string for signing auth cookies. |
