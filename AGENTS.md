# dietitian-service — agent notes

Monorepo for Dietitian Ritika Bahl.

| Folder | What | Live |
|---|---|---|
| `website/` | Public site (Next.js 16.2.5). Read `website/AGENTS.md` first: this Next.js version has breaking changes. | https://www.dietitianritikabahl.com (Vercel project `dietitian-service`) |
| `cms/` | Client/package/payment/diet-plan CMS (Next.js 16.2.5). See `cms/README.md`, `ARCHITECTURE.md`, `SCHEMA.md`. | https://dietitian-service-cms.vercel.app (Vercel project `dietitian-service-cms`) |

## Working here
- Local path: `/home/nitin/projects/diet` (CT 108 INDIE). Cloned 2026-09-29 from `github.com/nitkap01/dietitian-service` over HTTPS (the SSH key isn't registered on GitHub; `gh` provides the auth).
- Commit style: `fix(website): …` / `feat(cms): …` (conventional commits scoped by folder).
- **Pushing may trigger a production deploy of a live client site.** Only push or deploy when the owner asks.
- Vercel team: `nitkap01s-projects`; token at `/home/nitin/.vercel_token`.
- Prices on the site (₹ plans, international $70/$130/$180) are business decisions: change them only when told to.
- Kapoor Traders took this site's visual style (Geist, soft pastel cards) as its reference. That project lives in `/home/nitin/projects/kapoortraders`.

## Tasking is the ground truth (strict)
All work on this project is tracked in **Tasking** (http://192.168.0.246:8090): check the board before starting, log every step as it happens, set the status when done. Full rule: `~/.claude/CLAUDE.md`.
