# CMS Revamp — Plan & Status

Source-of-truth document for the CMS revamp requested for **Project Diet**
(Hale N Hearty Diet Clinic / Dt. Ritika Bahl).

## Goal

Turn the existing admin-only CMS into a full practice-management tool with a
client-facing portal, AI payment detection from WhatsApp chats, automated weight
requests, plan management, and a publish/lock workflow for diets — matching the
public website's visual theme.

## Requirements → implementation map

| # | Requirement | Where |
|---|---|---|
| 1 | Dietitian manages clients/diets/payments/WhatsApp | existing admin `(dashboard)` extended |
| 2 | Client dashboard (diets, notifications, weight history) | new `app/portal/*` |
| 3 | Diet visible only when published; else blurred/locked (payment) | `diet_plans.status`, portal blur logic |
| 4 | Auto-detect payment from chat (Claude/OpenAI, configurable) | `app/server/ai.ts`, Settings, `/api/whatsapp` |
| 5 | Plans tab: cost/description/benefits, link to user | `packages` (relabelled "Plans") + `client_packages` assign |
| 6 | Plans of 1/2/3 months | `packages.duration_months` |
| 7 | "Request Weights" + frequency (1-month → weekly only) | `packages.request_weights`, `weight_frequency` |
| 8 | Auto weight request over WhatsApp + capture + "last recorded" | `/api/notifications/run`, inbound parse |
| 9 | Weight graph: <5 = table only; else toggle, default table, page 5 | portal `weight` + admin metrics tab |
| 10 | Onboarding captures name/address/age/gender/weight/phone/email | `clients.address` + initial weight |
| 11 | Username=phone, secure random password, send via WhatsApp, dietician-only reset | `clients.password_hash`, `/api/clients/[id]/credentials` |
| 12/13 | Account active while active; activate/deactivate | existing `status`, portal login gate |
| 14 | Diet flow: issues → meals → publish → client sees | `diet_plans.issues/status/published_at` |
| 15 | Same theme as website | `components/portal/*` in purple/cream brand |

## Architecture decisions

- **Single Next.js app.** Client portal lives at `/portal/*` in the same `cms`
  app. Admin uses `cms_session` cookie; portal uses `portal_session`.
  `middleware.ts` segments the two areas.
- **AI provider** configurable in Settings (Claude default via `@anthropic-ai/sdk`,
  OpenAI via REST). Falls back to a heuristic detector when no key is set, so it
  works for free locally. Key stored in `app_settings` (runtime config).
- **WhatsApp** uses a provider adapter (`app/server/whatsapp.ts`). Default
  `simulator` records/plays messages in-app for free E2E testing; Meta Cloud API
  / Twilio plug into the same seam later via a webhook route.
- **Schema migrations** are idempotent `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
  inside `createTables()` (the schema is otherwise create-only).
- **PDF** = print-optimized portal route (`/portal/diets/[id]/print`) → browser
  Save-as-PDF. No heavy dependency; a real provider can attach a rendered PDF later.

## Local testing

- Local Postgres DB `dietitian_cms` (`DATABASE_URL` in `.env.local`).
- `npm run dev` auto-creates tables and seeds demo data, including a demo client
  with a known portal password (printed in the seed / see README).
- WhatsApp Simulator page drives inbound messages + screenshot uploads to test
  payment auto-detection and weight capture end to end.
- AI works with a real key in Settings, or the free heuristic fallback otherwise.

## Status: in progress (single-pass build, committed to a feature branch)
