# Dietitian CMS + Client Portal

Practice-management app for **Hale N Hearty Diet Clinic** (Dt. Ritika Bahl):
a dietitian admin panel plus a client-facing portal, in one Next.js app.

## Features

- **Admin (dietitian)** — clients, plans, payments, diet builder with publish
  workflow, WhatsApp simulator with AI payment detection, weight-request
  automation, settings.
- **Client portal** (`/portal`) — dashboard, diet plans (locked/blurred until
  published & paid), weight history (table/graph), notifications, profile,
  printable diet PDF. Styled to match the marketing website.
- **AI payment detection** — scans WhatsApp chats (text + payment screenshots)
  to auto-mark payments and unlock diets. Configurable in Settings (Claude or
  OpenAI); falls back to a free heuristic when no key is set.
- **Weight capture** — inbound WhatsApp weight replies are parsed and saved;
  plans can auto-request weights on a schedule.

## Getting started (local)

Requires **Node 20+** and **PostgreSQL** running locally.

1. Create a database:
   ```bash
   createdb dietitian_cms      # or: psql -c 'CREATE DATABASE dietitian_cms;'
   ```
2. Point `.env.local` at it (see `.env.example`):
   ```
   DATABASE_URL=postgres://<user>@localhost:5432/dietitian_cms
   CMS_USERNAME=admin
   CMS_PASSWORD=dietitian2024
   SESSION_SECRET=<random string>
   ```
3. Install & run:
   ```bash
   npm install
   npm run dev
   ```
4. The database auto-creates its tables and seeds demo data on the first request.

## Logins (after seeding)

- **Admin panel** → http://localhost:3000/login — `admin` / `dietitian2024`
- **Client portal** → http://localhost:3000/portal/login
  - `9000000001` / `demo1234` — fully unlocked (paid, weight graph, published diet)
  - `9000000002` / `demo1234` — diet locked (payment pending — pay via the WhatsApp Simulator to unlock)

## Testing the WhatsApp flow (free, no account)

Open **WhatsApp** in the admin panel → pick a client → use **"As client"** to
simulate an inbound message:
- `payment done via GPay` (or attach a screenshot) → auto-marks paid & unlocks diets.
- `my weight is 74 kg` → captures the weight into the profile.

## AI (optional)

Add a Claude or OpenAI API key in **Settings → AI & Automation** to use a real
model for payment/screenshot detection. Without a key, the heuristic fallback
works for local testing.

## Tech stack

Next.js 16 (App Router) · React 19 · PostgreSQL (`postgres` driver) ·
Tailwind CSS v4 · Recharts · `@anthropic-ai/sdk` · next-themes.

See `ARCHITECTURE.md` and `REVAMP_PLAN.md` for details.
