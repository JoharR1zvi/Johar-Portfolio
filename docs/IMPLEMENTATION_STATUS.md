# Implementation Status

Tracks phase progress against the plan in the master prompt (section 24) and
`DECISIONS.md`. Update this file whenever a phase's status changes.

**Repository:** pushed to GitHub at `JoharR1zvi/Johar-Portfolio`, branch
`main`. History was squashed to a single clean initial commit before the
first push (see `DECISIONS.md`) so no local-only or tool-specific file ever
touched the public repo.

| Phase | Description                             | Status      | Notes                                                                                                                                              |
| ----- | --------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Audit and plan                          | Complete    | Repo audited, all decision docs written and committed                                                                                              |
| 1     | Foundation and visual system            | Complete    | Next.js scaffold, design tokens, next-intl, global layout, tests all green                                                                         |
| 2     | Content model and public portfolio      | Complete    | All public pages live and reading from the database. See "Live infrastructure issue" below — the Supabase project itself is currently unreachable. |
| 3     | Admin application and AI project import | Not started | Blocked: needs Supabase + LLM/embedding provider keys. Highest complexity phase.                                                                   |
| 4     | Interactive lab                         | Not started | Chat/Swiggy UI can start against a stub API before Phase 5 lands                                                                                   |
| 5     | RAG backend                             | Not started | Blocked: needs LLM/embedding provider keys                                                                                                         |
| 6     | GitHub, SEO, performance, polish        | Not started |                                                                                                                                                    |
| 7     | QA and deployment                       | Not started | Blocked: needs Vercel project                                                                                                                      |

## Phase 0 checklist

- [x] Repository audited (empty except master prompt docx; `JoharInfo/` found with real source docs)
- [x] `git init`
- [x] `.gitignore` authored and verified (`JoharInfo/`, `.env*`, `node_modules/`, `.next/` excluded) before first `git add`
- [x] `DECISIONS.md` created
- [x] `IMPLEMENTATION_STATUS.md` created
- [x] `CONTENT_FACTS.md` created
- [x] `LAUNCH_CHECKLIST.md` created
- [x] `architecture.md` created
- [x] Initial commit

## Phase 1 checklist

- [x] Next.js scaffolded (App Router, TypeScript strict + `noUncheckedIndexedAccess`, Tailwind, `src/`)
- [x] ESLint + Prettier (with `prettier-plugin-tailwindcss`) + quality-gate npm scripts (`format`, `format:check`, `lint`, `typecheck`, `test`, `test:e2e`, `build`, `verify`)
- [x] `npm audit` reviewed: `postcss`/`sharp` patched via `overrides`; remaining `eslint`-chain findings documented as an accepted exception in `DECISIONS.md`
- [x] shadcn/ui initialized (`base-nova`, Base UI primitives) with core components (button, dialog, sheet, tabs, accordion, input, label, textarea, badge, separator, skeleton, dropdown-menu)
- [x] next-intl routing (`/en`, `/de`, `localePrefix: 'always'`), `src/proxy.ts` (Next.js 16 renamed "middleware"), `messages/{en,de}.json`
- [x] Design tokens from the spec's light/dark palette wired into `globals.css`; `next-themes` (light/dark/system) wired and verified working end-to-end via Playwright
- [x] Global layout: header (nav, resume button, AI assistant entry placeholder, language switcher, theme toggle, mobile sheet menu), footer (email/GitHub/LinkedIn), skip link
- [x] Placeholder pages for every IA route (`/`, `/projects`, `/projects/[slug]`, `/lab`, `/lab/swiggy-simulator`, `/lab/f1-explorer`, `/notes`, `/notes/[slug]`, `/resume`, `/privacy`)
- [x] Geist Sans/Mono via `next/font/google`; global `prefers-reduced-motion` baseline in `globals.css`
- [x] Vitest + React Testing Library (6 unit/component tests) and Playwright (4 e2e smoke tests) — both green
- [x] Root project-instructions file written (kept local, not committed)
- [x] `npm run verify` clean
- [x] `PROJECT_NOTES.md`, `LEARNING_JOURNAL.md`, `PROJECT_REPORT.md` created (backfilled Phase 0 + Phase 1) — maintained every phase from here on

Notable bugs caught along the way (not regressions, just worth remembering — full detail in `PROJECT_NOTES.md`): the theme toggle initially did nothing because `@base-ui/react`'s `Menu.Item` uses `onClick`, not Radix's `onSelect` convention (caught by the Playwright theme-toggle test, not typecheck); and the header's resume link logged a Base UI console warning for missing `nativeButton={false}` when composing `Button` with a `Link` (caught by manually driving the dev server in a headless browser and checking the console, not by any automated test).

## Phase 2 checklist (in progress)

- [x] Supabase project created (`hiiauzddkrfehrcnpzlh`, EU region), credentials in `.env.local` (gitignored), `.env.example` updated with variable names only
- [x] `@supabase/supabase-js`, `@supabase/ssr`, Supabase CLI installed
- [x] Project linked via CLI (`SUPABASE_ACCESS_TOKEN` + DB password, both in `.env.local` only)
- [x] Migrations written and applied: `0001_extensions`, `0002_core_content`, `0003_skills_timeline_content`, `0004_rls_policies` (25 tables, RLS enabled on every one, `is_admin()` helper)
- [x] TypeScript types generated from the live schema (`src/types/supabase.ts`)
- [x] `src/lib/db/{client,server,admin}.ts` — browser/server (RLS-respecting) and admin (secret-key, RLS-bypassing) client wrappers, `admin.ts` guarded with `server-only`
- [x] End-to-end connection verified manually: anon client correctly blocked by RLS, admin client correctly bypasses it, both against the live database
- [x] `npm run verify` clean
- [x] Seed script written and run: profile, site settings, 22 technologies, 34 skills (38 evidence links), 4-item timeline, 1 certification, and 5 projects (4 flagship + Goa Legislative RAG) with full case-study sections — 52 section translations, 8 metrics total (1 unverified: skin-lesion accuracy)
- [x] Johar reviewed the drafted case-study prose (2026-08-01) — re-seeded with `review_status='reviewed'` and `published: true` across all 5 projects; live on the public site per RLS
- [x] Homepage sections (`src/app/[locale]/page.tsx` + `src/components/home/*`) — hero, selected work, more projects, lab preview (driven by `site_settings` flags), capability map (`src/lib/db/skills.ts`), about, journey (`src/lib/db/timeline.ts`), notes teaser (static, no `posts` seeded yet), contact. New `src/lib/db/profile.ts` and `src/lib/db/site-settings.ts`. Contact section is links/availability only — the actual form is the separate checklist item below.
- [x] Projects index (`src/app/[locale]/projects/page.tsx`) — card grid pulling `published`/`reviewed` projects via `src/lib/db/projects.ts`; filters not yet built
- [x] Project case-study page (`src/app/[locale]/projects/[slug]/page.tsx`) — 12-section order, sticky in-page nav, verified-only metrics, safety-label callout, technologies, GitHub/demo links. Added `react-markdown` (section body rendering) and `@tailwindcss/typography` (prose styling) as new dependencies.
- [x] Projects index filters (by technology/type) — `src/lib/db/projects.ts`
      (`getProjectFilterOptions`, `filterProjects`) + `src/components/projects/project-filters.tsx`,
      plain server-rendered `?type=`/`?tech=` query-param links, no client JS
- [x] Resume page real content (`src/app/[locale]/resume/page.tsx`) — identity header with contact links, Education/Experience split from `timeline_items` (new `TimelineList` local component shared between both), capability map reused via a new presentational `src/components/skills/skill-groups.tsx` (extracted out of `components/home/capability-map.tsx` so the homepage and resume don't duplicate the skill-grid markup), certifications. Download button stays disabled (no resume PDF uploaded / no storage bucket yet — see `LAUNCH_CHECKLIST.md`).
- [x] Contact form (`src/app/api/contact/route.ts`, `src/components/home/contact-form.tsx`) — Zod-validated (`src/lib/validation/contact.ts`), rate-limited 5/10min per IP (`src/lib/rate-limit.ts`) against `rate_limit_events` via the admin client (that table has zero public RLS policies by design). IPs are HMAC-hashed (`src/lib/hash-ip.ts`, new `CONTACT_IP_HASH_SECRET` env var) before storage, never stored raw. Manually verified end-to-end against the live database (insert, validation errors, 429 after 5 requests), then test rows deleted.
- [x] Contact form email notification (`src/lib/email.ts`, new `resend` dependency + `RESEND_API_KEY`) — on a successful submission, emails the profile's public address (reply-to set to the visitor) so a message doesn't sit unnoticed in the database. Sends from Resend's shared sandbox address, not a verified domain (none exists yet). Never throws: a delivery failure logs and doesn't fail the submission, since the row is already saved by the time it runs. Verified with a real send (Resend returned a message ID).
- [x] Responsive QA — automated headless-browser check across
      375/768/1024/1440px on every DB-independent route, caught and fixed a
      real 2px overflow bug in the header at 768px (see `PROJECT_NOTES.md`);
      the DB-backed routes (home, projects, resume) could not be visually
      re-verified live tonight because of the Supabase outage below, so
      re-check those once the database is back

## Live infrastructure issue (found 2026-09-28, blocks everything above until fixed)

The Supabase project (`hiiauzddkrfehrcnpzlh`) is currently unreachable —
its hostname returns `NXDOMAIN` (does not resolve at all), not just a slow
or erroring response. Confirmed this isn't a local network/sandbox
restriction (`supabase.co` itself resolves fine; only this project's
subdomain fails). Most likely cause: free-tier auto-pause after no API
traffic since the 2026-08-01 seed run — but only checking the Supabase
dashboard can confirm and fix it. **Action needed from Johar:** log into
the Supabase dashboard, un-pause/restore the project (or confirm it needs
recreating), then let this session know so the affected work can be
verified live: the new projects-index filters, the header responsive fix,
and a re-run of `npm run db:seed` if the flags below get flipped.

Two resilience improvements shipped alongside discovering this (real fixes
worth keeping regardless of what caused tonight's specific outage, not
just worked around): `src/app/[locale]/error.tsx` (a friendly, translated
error boundary for any page-level data-fetch failure) and
`getSiteSettings()` now fails soft to "both lab demos hidden" instead of
throwing, since it only gates two optional badges, not real content.

## Known exceptions to the quality gate

`npm run verify` passes clean as of Phase 1. The one standing exception is
the `npm audit` finding confined to `eslint`'s own dependency chain
(devDependency only, not shipped) — see `docs/DECISIONS.md` for detail and
what would resolve it.

## True blockers (see `DECISIONS.md` for detail)

- **Supabase project unreachable** — see "Live infrastructure issue" above.
  Needs Johar to check the dashboard. Blocks live verification of anything
  database-backed, not just new phases.
- LLM + embedding provider API keys (Gemini, Groq) — needed before Phase 3/5.
- Vercel project — needed before Phase 7.
