# Implementation Status

Tracks phase progress against the plan in the master prompt (section 24) and
`DECISIONS.md`. Update this file whenever a phase's status changes.

**Repository:** pushed to GitHub at `JoharR1zvi/Johar-Portfolio`, branch
`main`. History was squashed to a single clean initial commit before the
first push (see `DECISIONS.md`) so no local-only or tool-specific file ever
touched the public repo. **Live at `https://johar-portfolio.vercel.app`.**

## Where we left off (2026-09-29) — read this first

**Infrastructure is fully live, nothing is blocked.** Supabase restored,
Vercel deployed, `NEXT_PUBLIC_SITE_URL` set correctly in Vercel's
Production env vars (canonical/hreflang/sitemap verified correct on the
live site), Gemini + Groq keys are in `.env.local` — see "Live
infrastructure issue" below for the full trail.

`GOOGLE_GENERATIVE_AI_API_KEY`/`GROQ_API_KEY`: in `.env.local`, and Johar
says he's also added them to Vercel's Production env vars — not yet
independently verified (no deployed route exercises them yet). Confirm
for real once Phase 3/5 ships a route that uses them.

**Admin account is live.** Johar created it, ran `npm run admin:create`,
and signed in for real at `/admin/login` (2026-09-29) — 3a is fully
confirmed, not just code-reviewed.

**Waiting on Johar, not blocking further work:**

- Review `/lab/f1-explorer` and `/lab/swiggy-simulator`, then flip them on
  yourself at `/admin/settings` (built tonight — no need to ask this
  session to touch the database directly anymore).
- Quick manual check on that same settings page: flip a toggle, refresh,
  confirm it stuck. The write path couldn't be verified live from this
  session (see the Phase 3 checklist below for why), so this is the one
  real gap before calling 3b's settings piece fully done.
- Johar confirmed (2026-09-29) **both the F1 predictor and Swiggy
  assistant are finished projects** — current site copy still frames F1
  as "in progress, no metrics" and Swiggy as "55+ tests" (see
  `LAUNCH_CHECKLIST.md` for the exact discrepancies already found in his
  local docs). He'll upload newer/finished source documents for both
  later; when they arrive, re-parse into `CONTENT_FACTS.md` following its
  existing precedence rules, then update the seed data
  (`supabase/seed/data/projects/{f1-predictor,swiggy}.ts`), the published
  case studies, and the Lab explorer/simulator copy to match — don't
  update just one of those places and leave the others stale.

**Phase 3 is underway**, broken into checkpoints (3a–3f, full breakdown in
the Phase 3 checklist below). 3a is done and confirmed live. 3b's settings
piece is built (pending the manual check above). Continuing into the rest
of 3b (projects/translations/media/notes CRUD) — pure code work, doesn't
need Johar's input, so it's proceeding without waiting on him.

| Phase | Description                             | Status                             | Notes                                                                                                                                                              |
| ----- | --------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0     | Audit and plan                          | Complete                           | Repo audited, all decision docs written and committed                                                                                                              |
| 1     | Foundation and visual system            | Complete                           | Next.js scaffold, design tokens, next-intl, global layout, tests all green                                                                                         |
| 2     | Content model and public portfolio      | Complete                           | All public pages live and reading from the database. Supabase outage resolved, see below.                                                                          |
| 3     | Admin application and AI project import | In progress (3a, 3b settings done) | Auth foundation confirmed live. Settings page built. CRUD (projects/translations/media/notes) underway, no Johar input needed for it.                              |
| 4     | Interactive lab                         | Built, pending review              | Both demos and the /lab index are built and pass verify; both stay behind their `site_settings` flags (`false`) until Johar reviews the content and flips them on. |
| 5     | RAG backend                             | Not started                        | Unblocked (Gemini/Groq keys set). Not yet started.                                                                                                                 |
| 6     | GitHub, SEO, performance, polish        | SEO metadata done                  | Per-page titles/descriptions, canonical/hreflang, sitemap.xml, robots.txt, Person JSON-LD. Performance/GitHub-polish items still open.                             |
| 7     | QA and deployment                       | Vercel live                        | Deployed at `johar-portfolio.vercel.app`. Remaining acceptance criteria (LAUNCH_CHECKLIST.md) depend on Phase 3/5 and content finalization.                        |

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

## Live infrastructure issue (found 2026-09-28, resolved same day)

The Supabase project (`hiiauzddkrfehrcnpzlh`) was unreachable for part of
this session — its hostname returned `NXDOMAIN`, most likely a free-tier
auto-pause after no API traffic since the 2026-08-01 seed run. **Resolved:**
Johar restored it from the Supabase dashboard; DNS resolves, the REST API
returns real data, and the full `test:e2e` suite (including the new
accessibility checks) passes 13/13 against the live database. Everything
built during the outage — the projects-index filters, the header
responsive fix, the lab pages, SEO metadata — is confirmed working live.

**Also resolved the same day:** a Vercel project is now linked and
deployed at `https://johar-portfolio.vercel.app`, closing the Phase 7
blocker below. `NEXT_PUBLIC_SITE_URL` is set in Vercel's Production
environment variables to match; canonical/hreflang/sitemap URLs verified
correct in production. Gemini and Groq API keys are also now set in
`.env.local` (not yet added to Vercel's env vars — needed there too before
Phase 3/5 features are deployed), unblocking Phase 3 and Phase 5.

Two resilience improvements shipped alongside discovering this (real fixes
worth keeping regardless of what caused tonight's specific outage, not
just worked around): `src/app/[locale]/error.tsx` (a friendly, translated
error boundary for any page-level data-fetch failure) and
`getSiteSettings()` now fails soft to "both lab demos hidden" instead of
throwing, since it only gates two optional badges, not real content.

## Phase 3 checklist (in progress)

Broken into checkpoints rather than built end-to-end in one pass, given
its size and complexity:

- [x] **3a — admin auth foundation.**
  - `src/lib/auth/session.ts` (`getAdminSession()`) — checks
    `auth.getUser()` then calls the `is_admin()` RPC (a `security definer`
    SQL function from Phase 2's RLS migration, exposed via PostgREST;
    `admin_users` itself has zero public policies, so this RPC is the only
    way to check admin status from an RLS-respecting client).
  - `src/app/admin/layout.tsx` — its own root `<html>`/`<body>`, since
    `/admin` sits outside `[locale]` (private, English-only tool, no
    next-intl).
  - `src/app/admin/login/page.tsx` + `src/components/admin/login-form.tsx`
    — email/password sign-in via `supabase.auth.signInWithPassword`,
    Zod-validated (`src/lib/validation/auth.ts`).
  - `src/app/admin/(protected)/layout.tsx` — route-group guard, redirects
    to `/admin/login` if `getAdminSession()` returns null. Applies to
    every route nested under it without repeating the check.
  - `src/proxy.ts` — now branches on `/admin`: those routes get Supabase's
    documented session-refresh middleware pattern (keeps the auth cookie
    alive) instead of next-intl's locale middleware.
  - `scripts/create-admin.ts` (`npm run admin:create -- email`) —
    registers an _existing_ Supabase Auth user (created via the dashboard,
    not this script) as the admin, by inserting their id into
    `admin_users`. Deliberately doesn't create the Auth user itself, so
    the actual password never touches this codebase.
  - **Verified live**: unauthenticated `/admin` → 307 to `/admin/login`
    (confirmed via curl); login page renders correctly, and a wrong
    password is rejected with a clear error, no crash, no unexpected
    console errors (confirmed via a real headless browser). **Success
    path confirmed live 2026-09-29** — Johar created the admin account,
    registered it with `npm run admin:create`, and signed in for real.
- [x] 3b (partial) — **settings page** (`/admin/settings`): toggles for
      `f1_explorer_enabled`/`swiggy_simulator_enabled`, replacing the
      "ask this session to flip it in the DB" step. New
      `src/components/ui/switch.tsx` (Base UI has a `Switch` primitive,
      just wasn't wrapped yet — no new dependency needed). Write path is
      a Server Action (`src/app/admin/(protected)/settings/actions.ts`)
      using the RLS-respecting client, not the secret/admin one — the
      existing "admin can manage site settings" policy already permits
      it for a signed-in admin, so there's no reason to bypass RLS here.
      **Not independently verified live**: attempted to mint a real
      session server-side (via `auth.admin.generateLink` + `verifyOtp`)
      to test the write path without needing Johar's password, but the
      token didn't verify outside a real redirect flow, and chasing that
      further wasn't worth the time against a Server Action this simple.
      Quick manual check needed: open `/admin/settings`, flip a toggle,
      confirm it sticks after a refresh.
- [x] 3b (partial) — **projects + translations CRUD** (`/admin/projects`,
      `/admin/projects/[id]`): list view (status/published/review-status
      badges per locale) and an edit page with three tabs (Core, English,
      German). Core covers every `projects` column except `slug`/timestamps.
      Each translation tab is an upsert — no German translation exists for
      any project yet, so that tab creates one on first save rather than
      requiring it to pre-exist. `src/lib/db/admin-projects.ts` holds the
      reads/writes, all through the RLS-respecting client (the "admin can
      manage projects"/"admin can manage project translations" policies
      already cover a signed-in admin). **Deliberately out of scope for
      this slice**: sections, metrics, and technologies (all one-to-many,
      need a proper add/remove-row UI, cleaner as a separate pass than
      folded into the same forms). **Verified**: unauthenticated
      `/admin/projects` and `/admin/projects/[id]` both redirect to
      `/admin/login` (curl); `npm run verify` clean. The actual save flow
      (authenticated write via the Server Actions) has the same gap as the
      settings page above — not independently testable from this session,
      needs a quick manual check.
- [x] 3b (partial) — **notes CRUD** (`/admin/notes`, `/admin/notes/[id]`):
      same shape as the projects CRUD above (`src/lib/db/admin-posts.ts`,
      RLS-respecting client, Core/English/German tabs), but notes needed
      one thing projects didn't — an actual **create** flow. Projects are
      expected to arrive through the AI import pipeline (3c–3f), but
      nothing analogous exists or is planned for notes, and zero exist in
      the database yet, so a slug-entry form on the list page
      (`src/components/admin/create-note-form.tsx`, Zod-validated slug
      pattern) is the only way a note will ever get created. Also has a
      delete button (two-step confirm) — reasonable for notes in a way it
      wouldn't be for projects, which are never really meant to be
      deleted outright, just unpublished. **Verified**: unauthenticated
      access to both routes redirects to login; `npm run verify` clean.
      Same not-independently-testable gap on the actual save/create/delete
      flows as the settings and projects pages above.
- [ ] 3b (remaining) — media upload (needs a Storage bucket + policies,
      genuinely new infrastructure, not just another CRUD table — a
      separate slice from the rest of 3b)
- [ ] 3c — AI import schema migration (source documents, import jobs,
      extracted facts, content drafts, provenance, document revisions)
- [ ] 3d — upload + extraction pipeline (PDF/DOCX/MD parsing, Gemini
      structured extraction, Zod-validated, versioned prompts)
- [ ] 3e — review/approve → publish UI
- [ ] 3f — update/compare workflow (deterministic field-level diff against
      an existing project, selective accept/reject)

## Phase 4 checklist (built, pending review)

Built entirely on static/mocked content, no database or LLM-provider key
needed for any of it (matches the lab's own "mocked or sample data"
description) — the only DB read either page makes is the `site_settings`
enabled-flag check, which fails soft anyway. **Both flags stay `false`
until Johar reviews the actual copy/UX below and flips them on** —
nothing here is currently visible on the public site.

- [x] `/lab` index — real content (was a placeholder), lists both demos via
      a new shared `src/components/lab/lab-demo-card.tsx` (also now used by
      the homepage's lab preview section, replacing its inlined duplicate
      card markup)
- [x] F1 Race Predictor Explorer (`/lab/f1-explorer`) — a 5-stage,
      zero-JS `<details>` accordion (`src/components/lab/f1-pipeline.tsx`)
      walking through the pipeline's already-approved stable facts from
      `docs/CONTENT_FACTS.md`/the seeded case study (three data sources,
      the ~100k-record → 1,838-row join fix, data-quality work,
      leakage-aware `shift(1)` features, time-based validation). Explicitly
      stops at "modelling: in progress" — no accuracy/ROC-AUC/best-model
      claim, matching the non-negotiable content rule. Link to the GitHub
      repo. See `LAUNCH_CHECKLIST.md` for a newly found local document that
      suggests real modelling progress exists beyond this, pending Johar's
      review.
- [x] Swiggy Instamart Simulator (`/lab/swiggy-simulator`) — a deterministic,
      fully client-side mocked walkthrough (`src/components/lab/swiggy-agent-simulator.tsx`)
      of all 5 user-facing capabilities (pick one, see a scripted
      user/assistant exchange and the graph nodes it routes through), plus
      a "what broke and what I learned" section reusing the same 7
      categories already approved in the published case study. No network
      calls of any kind, matches the "never make live Swiggy calls from the
      public site" rule by construction, not by a runtime check.
- [x] Verified live in a browser (both languages, 375px/1440px, with the
      flags temporarily forced on locally, then reverted): no layout
      overflow, both interactive pieces work (Swiggy's 5 scenario buttons,
      F1's accordion), zero console errors. Caught and fixed one real bug
      in the process — a missing `nativeButton={false}` on the F1 page's
      new GitHub-link button (Base UI, composing `Button` with an `<a>` via
      `render` needs it, same class of bug already documented from Phase 1).
- [ ] Johar reviews the built content/UX and decides whether to flip
      `f1_explorer_enabled`/`swiggy_simulator_enabled` to `true` (requires
      the Supabase outage above to be resolved first, to re-run the seed
      script or update the row directly)
- [ ] Chat UI against a stub API (deferred; Phase 5's actual RAG backend is
      still blocked on Gemini/Groq keys, and the two demos above were the
      higher-value use of unblocked time tonight)

## Phase 6 checklist (SEO metadata done tonight; rest still open)

Every route previously shared one identical `<title>`/description from the
root layout (a real gap — `/projects`, `/resume`, `/lab`, etc. all looked
the same to search engines and shared links). Fixed with a title template
(`%s | Johar Rizvi`, root layout keeps the full default for `/`) plus
per-page `generateMetadata` everywhere:

- [x] `src/lib/seo.ts` — shared `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`,
      new env var, defaults to `localhost:3000`) and `localeAlternates()`
      (canonical + hreflang for both locales)
- [x] Per-page metadata: `/`, `/projects`, `/projects/[slug]` (dynamic,
      real project title/one-liner), `/resume`, `/lab` + both demo pages,
      `/notes` (+ `[slug]` noindexed, no real posts seeded yet), `/privacy`
- [x] `getProjectBySlug` wrapped in React's `cache()` — its new
      `generateMetadata` call and the page component both need the same
      project, so this dedupes it to one DB round-trip per request instead
      of two
- [x] `src/app/robots.ts`, `src/app/sitemap.ts` (static routes across both
      locales + every published project slug; dynamic, since it reads the
      database — untestable live tonight because of the outage above,
      confirmed via `npm run build` only)
- [x] `src/components/seo/person-json-ld.tsx` — schema.org Person on the
      homepage, built only from fields already public per
      `docs/CONTENT_FACTS.md`
- [x] Security: upgraded `next` (16.2.12 → 16.3.6, fixes a critical RCE
      advisory that predates tonight) and `eslint-config-next` to match,
      bumped the `sharp` override, reclassified `shadcn` as a
      devDependency (it's dev-tool-only, was incorrectly shipped under
      `dependencies`). `npm audit` now reports **zero** vulnerabilities —
      see `docs/DECISIONS.md` for the full writeup, this also retires the
      old Phase 1 eslint-chain exception below.
- [x] Accessibility: `e2e/accessibility.spec.ts` (axe-core, `wcag2a`/
      `wcag2aa`) across every route. Found and fixed a real sitewide color-
      contrast failure (`--secondary`/`--accent` foreground tokens in light
      mode); added `src/app/global-error.tsx` for a related but distinct
      `html-has-lang` gap on the framework's error-recovery shell — see
      `docs/DECISIONS.md` for what that does and doesn't fully cover.
- [ ] Everything else in Phase 6: GitHub profile README/pin, performance
      budget pass, remaining polish

## Known exceptions to the quality gate

`npm run verify` passes clean. `npm audit` is now clean too (zero
vulnerabilities, see `docs/DECISIONS.md`) — the previous standing
exception here (an `eslint` dependency chain finding) no longer applies;
that chain doesn't exist in the current resolved dependency tree.

`npm run test:e2e` currently has 2 known, expected failures, both tracing
directly to the Supabase outage above, not a code defect: the case-study
page's accessibility check and the language-switcher test (which
navigates through `/projects`, a database-backed route). Every other e2e
test, including the new accessibility suite across every
database-independent route, passes. Re-run once the database is restored.

## True blockers

None currently. ~~Supabase unreachable~~, ~~LLM/embedding provider keys~~,
and ~~Vercel project~~ are all resolved as of 2026-09-28 — see "Live
infrastructure issue" above. Phase 3 is unstarted but not blocked; it's
simply the next, highest-complexity phase.
