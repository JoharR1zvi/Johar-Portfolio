# Implementation Status

Tracks phase progress against the plan in the master prompt (section 24) and
`DECISIONS.md`. Update this file whenever a phase's status changes.

**Repository:** pushed to GitHub at `JoharR1zvi/Johar-Portfolio`, branch
`main`. History was squashed to a single clean initial commit before the
first push (see `DECISIONS.md`) so no local-only or tool-specific file ever
touched the public repo.

| Phase | Description                             | Status      | Notes                                                                                                 |
| ----- | --------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| 0     | Audit and plan                          | Complete    | Repo audited, all decision docs written and committed                                                 |
| 1     | Foundation and visual system            | Complete    | Next.js scaffold, design tokens, next-intl, global layout, tests all green                            |
| 2     | Content model and public portfolio      | In progress | Supabase project live, schema + RLS migrated, clients wired. Content authoring and public pages next. |
| 3     | Admin application and AI project import | Not started | Blocked: needs Supabase + LLM/embedding provider keys. Highest complexity phase.                      |
| 4     | Interactive lab                         | Not started | Chat/Swiggy UI can start against a stub API before Phase 5 lands                                      |
| 5     | RAG backend                             | Not started | Blocked: needs LLM/embedding provider keys                                                            |
| 6     | GitHub, SEO, performance, polish        | Not started |                                                                                                       |
| 7     | QA and deployment                       | Not started | Blocked: needs Vercel project                                                                         |

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
- [ ] **Awaiting Johar's review** of the drafted case-study prose (`supabase/seed/data/projects/*.ts`, or the compiled review artifact shared in chat) before flipping any `review_status` to `reviewed` — everything is currently `draft`/`published: false` and correctly invisible on the public site per RLS
- [ ] Homepage sections (hero, selected work, lab preview, more-projects grid, capability map, about, journey, notes teaser, contact)
- [ ] Projects index + filters
- [ ] Project case-study page (12-section order, sticky nav)
- [ ] Resume page real content
- [ ] Contact form (Zod + `rate_limit_events`-backed rate limiting)
- [ ] Responsive QA

## Known exceptions to the quality gate

`npm run verify` passes clean as of Phase 1. The one standing exception is
the `npm audit` finding confined to `eslint`'s own dependency chain
(devDependency only, not shipped) — see `docs/DECISIONS.md` for detail and
what would resolve it.

## True blockers (see `DECISIONS.md` for detail)

- ~~Supabase project/credentials~~ — resolved 2026-07-31.
- LLM + embedding provider API keys (Gemini, Groq) — needed before Phase 3/5.
- Vercel project — needed before Phase 7.
