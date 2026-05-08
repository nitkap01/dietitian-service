# Dietitian CMS

A Content Management System for managing dietitian clients, packages, payments, health metrics, and diet plans.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. The database is automatically created and seeded on first run.

## Tech Stack

- Next.js 16.2.5 with App Router
- TypeScript
- Tailwind CSS v4
- better-sqlite3 (local SQLite database)
- Recharts (health metric graphs)
- next-themes (dark/light mode)
- lucide-react (icons)

## Features

- **Dashboard** - Stats overview, recent activity feed
- **Client Management** - Onboarding, status management, detailed profiles
- **Package Management** - Create and link packages to clients
- **Health Metrics** - Weight tracking with line charts
- **Diet Plan Management** - Upload diet images, mock OCR extraction, version history
- **Notifications** - Schedule update requests, payment reminders, WhatsApp previews
- **Payment Tracking** - Record payments, mark paid/unpaid, link to client status
- **Settings** - App configuration

## Database

SQLite database stored at `./dietitian.db` (configurable via `DATABASE_URL` env var).
The database is automatically initialized and seeded with sample data on first API call.
