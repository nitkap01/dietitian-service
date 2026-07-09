# Task: Mobile-first UI + hardened payment gate

- **Date:** 2026-07-09
- **Project:** Project Diet — Dietician Ritika Bahl's Portal (`dietitian-service/cms`)
- **Branch:** `feature/cms-revamp` (pushed to `origin`, **not** merged to `main`)
- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, PostgreSQL (`postgres` driver)

---

## 1. The request

> The person using this should be able to do all operations with ease from any
> device, preferably a ~6" mobile phone. Make it **extremely mobile friendly** —
> revisit the UI and all components.
>
> People should **not be able to see the diet until they pay** — make the
> adjustments. The admin should easily make diets, publish them, and notify the
> user that a diet is available; if they haven't paid, they need to pay.
>
> Commit everything. Tell me how to run it locally to test.

Follow-ups handled in the same session:
- Build error on `npm run dev`: `Can't resolve 'tailwindcss'`.
- "push all changes."
- "save the progress to a document" (this file).

---

## 2. Plan

1. Make the whole app mobile-first (app-like bottom navigation, responsive
   lists/modals/forms, safe-area handling).
2. Strengthen the payment gate UX (server gate was already correct — surface it
   clearly to both client and admin).
3. Tighten the admin make → publish → notify flow.
4. Build, browser-verify at phone width, commit, then push on approval.

---

## 3. Key decisions

- **Payment gate stays server-side.** The API already never sends meal data for a
  locked diet (`app/api/portal/diets/route.ts`, `.../[id]/route.ts`):
  `locked = !isPublished || !hasPaid`; when locked, no versions/`ocr_data` are
  returned. This is the correct architecture (not a client-side blur), so no
  server change was needed — only clearer messaging on top.
- **`hasPaid` is client-level**, not per-diet: any `payments` row with
  `status = 'paid'` unlocks the client's published diets. Matches the plan model
  (pay for a 1/2/3-month plan → see diets during it).
- **Bottom tab bars** were chosen over the hamburger-only drawer for a native,
  thumb-reachable feel on phones. Desktop keeps the sidebar/header nav.
- **Root-cause fix over workaround** for the tailwind error: pin Next's project
  root instead of just deleting the stray file (durable against future stray
  lockfiles).

---

## 4. Files touched

### Mobile-first UI
- `components/layout/BottomNav.tsx` — **new.** Admin bottom tab bar
  (Home · Clients · Plans · Pay · More). "More" opens the full drawer.
- `app/(dashboard)/layout.tsx` — render `BottomNav`; `pb-24 md:pb-6` so the fixed
  bar never covers content.
- `app/(dashboard)/clients/page.tsx` — mobile tap-through **card list**
  (`md:hidden`) + desktop table (`hidden md:block`); responsive search/filter row.
- `components/ui/Modal.tsx` — docks as a **bottom sheet** on phones
  (`items-end sm:items-center`, `rounded-t-3xl`, `max-h-[92vh]`, flex column).
- `app/(dashboard)/payments/page.tsx` — header controls and rows reflow; full-width
  "Record Payment" on mobile; abbreviated "Paid" button on small screens.
- `app/(dashboard)/settings/page.tsx` — input grids `grid-cols-1 sm:grid-cols-2`.
- `app/(dashboard)/clients/[id]/page.tsx` — mobile-safe toast; diet-builder footer
  and recommendations panel height caps on mobile.
- `components/clients/DietRecommendations.tsx` — macro inputs `grid-cols-2 sm:grid-cols-4`.
- `components/portal/PortalShell.tsx` — client portal **bottom tab bar**
  (Home · Diets · Weight · Alerts[unread badge] · Profile) on phones; header nav on desktop.
- `app/portal/page.tsx` — plan-card header alignment fix (price no longer wraps into title).
- `app/layout.tsx` — explicit mobile `viewport` (`width=device-width`,
  `viewportFit: 'cover'`, `themeColor`) for notch/home-indicator safe areas.

### Payment gate (messaging)
- `app/portal/diets/page.tsx`, `app/portal/diets/[id]/page.tsx` — clearer
  "complete your payment to unlock / message your dietitian if already paid" copy
  on locked plans.
- `app/(dashboard)/clients/[id]/page.tsx` — **"Payment not received" banner** in the
  diet tab when the client is unpaid but has published plans; per-plan
  **Locked for client / Visible to client** state; publish button relabelled
  **"Publish & Notify"**.

### Build fix
- `next.config.ts` — `turbopack.root = __dirname` and `outputFileTracingRoot = __dirname`.

**Never committed:** `.env.local` (contains the DB password).

---

## 5. Build error fix — `Can't resolve 'tailwindcss'`

- **Symptom:** `npm run dev` failed resolving `@import 'tailwindcss'` in
  `globals.css`, searching from the parent `dietitian-service/` (which has no
  `node_modules`).
- **Cause:** a stray empty `dietitian-service/package-lock.json` (created
  accidentally, 96 bytes, no `package.json`). Next saw two lockfiles and inferred
  the **parent** as the workspace root.
- **Fix:** pinned the root in `next.config.ts` (`turbopack.root` +
  `outputFileTracingRoot` = `__dirname`). Deterministic regardless of parent
  lockfiles. The stray file can be deleted safely (`rm ../package-lock.json`) but
  is now harmless.

---

## 6. Verification

- `tsc --noEmit` clean; `next build` compiles (37/37 pages).
- Dev server (Turbopack) starts clean; compiled CSS is ~75 KB with real Tailwind
  output (`.flex`, `.grid`, `--tw-*`, brand `#5C3A9E`).
- Browser-tested at **iPhone width (390×844)** via Playwright + system Chrome,
  logged in as admin + demo clients. Verified pages render with no errors:
  dashboard, clients (cards), client detail (gate banner), payments, plans,
  settings, WhatsApp; portal home, diets (locked **and** unlocked), weight.
- Confirmed the locked diet is **blurred + content withheld** with the pay CTA,
  and both bottom nav bars work (active-tab highlight, unread badge).

---

## 7. Outcome / commits (branch `feature/cms-revamp`)

- `32ede8d` feat(cms): mobile-first UI and hardened payment gate
- `8545966` fix(cms): pin Next/Turbopack project root to cms directory
- (plus earlier session commits: branding rename, recommendations, theme fixes)

Pushed to `origin/feature/cms-revamp`. **Not merged to `main` → no production
deploy triggered** (Vercel prod = `main`; feature branch = preview only).

---

## 8. How to run locally

```bash
cd dietitian-service/cms
npm install          # first time only
npm run dev          # http://localhost:3000
```

- **Admin:** `/login` — use `CMS_USERNAME` / `CMS_PASSWORD` from `.env.local`.
- **Client portal:** `/portal/login`
  - `9000000001` / `demo1234` — paid, unlocked (published diet + weight history).
  - `9000000002` / `demo1234` — payment pending, **diet locked** (shows the gate).
- Mobile view: browser device mode (pick an iPhone), or open on a phone via the
  machine's LAN IP (`http://192.168.0.x:3000`). Requires the DB
  (`192.168.0.167:5432`) to be reachable.

---

## 9. Remaining / next steps

- **To deploy:** merge `feature/cms-revamp` → `main` (open PR:
  `https://github.com/nitkap01/dietitian-service/pull/new/feature/cms-revamp`).
  This is the step that triggers the Vercel production deploy — awaiting approval.
- **On the live DB:** update **Settings → Business Information** to
  "Dietician Ritika Bahl's Portal" — the new default name only applies to a fresh
  database, so WhatsApp messages otherwise use the old saved value.
- Optional: `rm dietitian-service/package-lock.json` (the accidental empty stub).
