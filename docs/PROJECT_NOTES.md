# Project Notes

A running technical log of how this project actually works: the moving
parts, how they connect, and why they're built the way they are. Updated
at the end of every phase. This is the "how it works" reference — for the
static file-tree/schema reference see `architecture.md`; for the reasoning
behind specific choices see `DECISIONS.md`; for plain-language explanations
see `LEARNING_JOURNAL.md`.

---

## Phase 0 — Audit and Plan

Started from a single specification document (a detailed brief describing
the whole site) plus a folder of source material (current resume, an older
CV, project notes for the Swiggy and F1 projects). The repository was
completely empty otherwise — no git, no code.

First real action, before anything else: `git init`, then write `.gitignore`
excluding the source-material folder and any `.env*` files, **before**
staging a single file. The older CV contains private information (address,
phone, etc.) that must never enter git history — once something is
committed, it's in the history forever even if deleted later, so the order
of operations here mattered.

Then wrote four planning documents that don't contain any code but capture
everything needed to build consistently across sessions:

- `DECISIONS.md` — every choice that wasn't dictated by the spec (which
  package manager, which AI provider, etc.), with the reasoning, so nobody
  has to re-derive "why did we pick X" later.
- `IMPLEMENTATION_STATUS.md` — a phase-by-phase checklist, the single place
  to check "what's actually done."
- `CONTENT_FACTS.md` — every fact about the person/projects that's allowed
  to appear on the public site, transcribed once from the source documents
  so nobody has to re-read a 700-line spec to check a fact.
- `LAUNCH_CHECKLIST.md` — what still needs human input before launch
  (photos, final metrics, translations) plus the acceptance criteria for
  "done."

## Phase 1 — Foundation and Visual System

### Scaffold and tooling

Standard Next.js App Router project (TypeScript, Tailwind, `src/` layout),
generated with `create-next-app` then moved into place (the folder name has
spaces and capitals, which npm package names can't have, so the app was
actually scaffolded in a temp folder under a valid name and its contents
moved in — the `package.json` `"name"` field doesn't matter functionally,
this was purely a workaround for the CLI's naming validation).

TypeScript strict mode plus `noUncheckedIndexedAccess` (catches a common
bug class: accessing an array/object index that might not exist without
TypeScript flagging it) and `forceConsistentCasingInFileNames`.

Quality gates are npm scripts, not tribal knowledge: `format`, `format:check`
(Prettier, with `prettier-plugin-tailwindcss` auto-sorting utility classes),
`lint` (ESLint via `eslint-config-next`), `typecheck` (`tsc --noEmit`),
`test` (Vitest), `test:e2e` (Playwright), `build`, and `verify` which chains
all of them — this is the single command that gates every phase.

`npm audit` surfaced a real dependency-hygiene issue worth recording: a
freshly generated project already had 12 high-severity findings. Two were
genuinely fixable — `postcss` and `sharp` were pinned to vulnerable versions
nested inside `next`'s own dependency tree, fixed via `package.json`
`overrides` without touching `next` itself. The rest all trace back to one
chain: `eslint@9` → `minimatch@3` → `brace-expansion@1.1.18` (a
denial-of-service advisory), pulled in by `eslint-config-next`'s bundled
plugins. The "real" fix (`eslint@10`) was tested and it breaks
`eslint-plugin-react` outright (`contextOrFilename.getFilename is not a
function` — that plugin hasn't been updated for ESLint 10's API yet), so
that upgrade was reverted and the finding is documented as an accepted,
revisit-later exception in `DECISIONS.md` rather than silently ignored or
papered over with `--force`.

### Internationalization (next-intl)

Every public route lives under `src/app/[locale]/` — there is no
`src/app/layout.tsx` at all; `src/app/[locale]/layout.tsx` is the true root
layout (Next.js allows this when nothing sits above the dynamic segment).

The flow for a request:

1. `src/proxy.ts` (Next.js 16 renamed the "middleware" file convention to
   "proxy" — same mechanism, new name) runs on every non-static,
   non-`/api` request. It wraps next-intl's `createMiddleware`, which reads
   the `Accept-Language` header / an existing locale cookie and redirects
   `/` to `/en` or `/de` (`localePrefix: 'always'` in `src/i18n/routing.ts`
   means every page always has an explicit locale prefix — no "hidden"
   default-locale route).
2. `src/i18n/request.ts` (`getRequestConfig`) runs server-side per request,
   loading the right `messages/{locale}.json` file.
3. `src/app/[locale]/layout.tsx` calls `setRequestLocale(locale)` (enables
   static rendering per locale) and `generateStaticParams()` (tells
   Next.js to pre-build both `/en` and `/de` at build time rather than on
   first request), then wraps the tree in `NextIntlClientProvider` so
   client components can call `useTranslations()`.
4. Individual pages call `getTranslations({ locale, namespace })`
   (server components) — every page in `src/app/[locale]/**` follows this
   same pattern.

`src/i18n/navigation.ts` re-exports a locale-aware `Link`, `usePathname`,
and `useRouter` (via `createNavigation`) — using these instead of plain
`next/link` / `next/navigation` is what makes the language switcher able to
land on the _same page_ in the other language (`LanguageSwitcher` reads the
current pathname with the locale already stripped, then calls
`router.replace(pathname, { locale: nextLocale })`).

### Theming (next-themes + design tokens)

Colors are CSS custom properties (`--background`, `--primary`, etc.)
defined twice in `src/app/globals.css`: once under `:root` (light) and once
under `.dark` (dark). Tailwind's `@theme inline` block maps each token to a
utility class generator (`--color-primary: var(--primary)` → `bg-primary`,
`text-primary`, etc. become available). Changing a hex value in exactly one
place changes every component using that token.

`next-themes` (`ThemeProvider` in `src/components/layout/theme-provider.tsx`)
handles _which_ class (`light`/`dark`) is on the `<html>` element, reading
the visitor's OS preference or a saved choice from `localStorage`.

One subtlety: the server has no idea what theme a _specific visitor_
prefers (it's client-only state), so a naive implementation would flash the
wrong theme for a frame, or worse, throw a hydration mismatch error
(server-rendered HTML disagreeing with what React expects on the client).
`src/hooks/use-mounted.ts` solves this with `useSyncExternalStore` — it
returns `false` during the server render and the first client render, then
`true` once hydration is confirmed complete, and `ThemeToggle` uses it to
avoid rendering a theme-dependent icon before it's safe to know the answer.

### UI components (shadcn/ui on Base UI, not Radix)

`components.json` uses the `base-nova` style, which is built on
`@base-ui/react` rather than the more commonly seen Radix UI. This matters
because Base UI's composition API differs from Radix's in a way that isn't
obvious from the outside:

- Radix's pattern for "make this trigger render as a different element" is
  an `asChild` prop.
- Base UI's equivalent is a `render` prop that takes a JSX element:
  `<SheetTrigger render={<Button variant="ghost" />}>...</SheetTrigger>`.
- Radix's menu items fire a custom `onSelect` event. Base UI's `Menu.Item`
  just uses the standard `onClick`. **This one caused a real bug**: the
  theme dropdown's "Dark"/"Light"/"System" items were wired with
  `onSelect={() => setTheme(...)}`, which compiles fine — `onSelect` is a
  real (but unrelated) native DOM attribute for text-selection events, so
  TypeScript had no reason to complain — but it never fired on a click. The
  Playwright e2e test (`e2e/homepage.spec.ts`, "theme toggle switches to
  dark mode") caught it immediately; the fix was changing `onSelect` to
  `onClick` in `src/components/layout/theme-toggle.tsx`.
- Base UI's `Button` defaults to `nativeButton: true` (it assumes it's
  rendering a real `<button>`). When `Button` is composed via `render`
  with something that isn't a button — e.g. the header's resume link,
  `<Button render={<Link href="/resume" />}>` — it needs an explicit
  `nativeButton={false}` or it logs a console warning about losing native
  button semantics. Caught by manually running the dev server behind a
  headless browser and checking `console --errors`, not by any automated
  test — a reminder that a clean `npm run verify` doesn't guarantee a
  clean browser console; worth checking by hand after UI changes.

Also worth noting: `lucide-react` (icon library) dropped brand/logo icons
(no more `Github`/`Linkedin` exports) in the installed major version.
`src/components/icons/brand-icons.tsx` has two small hand-written inline
SVGs instead of pulling in a whole separate icon package for two logos.

### Global layout

`src/components/layout/`: `site-header.tsx` (logo, primary nav, resume
button, AI-assistant entry placeholder, language switcher, theme toggle,
and a mobile `Sheet` slide-out menu below the `md` breakpoint),
`site-footer.tsx` (email/GitHub/LinkedIn), `skip-link.tsx` (a
visually-hidden-until-focused link straight to `#main-content`, required
for keyboard/screen-reader users to bypass the nav).

Every route under `src/app/[locale]/` is currently a placeholder — real
title/description text pulled from `messages/*.json`, but no real project
data yet (that's Phase 2, once a database exists). `notes/[slug]` and
`projects/[slug]` echo the slug as a placeholder title so the dynamic route
itself is provably working before real data-fetching exists.

### Testing

Two layers, deliberately different tools for different jobs:

- **Vitest + React Testing Library** (`tests/`) — fast, in-memory,
  no real browser. `tests/component/page-placeholder.test.tsx` renders a
  component and asserts on what's in the DOM. `tests/unit/routing.test.ts`
  checks the i18n config object directly (no rendering at all). Setup
  (`vitest.setup.ts`) registers `afterEach(cleanup)` explicitly — without
  it, DOM nodes from one test can leak into the next test's assertions
  (this actually happened once while writing the first test file).
- **Playwright** (`e2e/`) — a real (headless) Chromium browser, driven like
  an actual visitor: navigate, click, assert on the rendered page. This is
  the layer that caught the `onClick`/`onSelect` bug — nothing about that
  bug was visible to a type-checker or a component-level test, only to
  something that actually clicked the button and checked what happened.

## Phase 2 — Content Model and Public Portfolio (in progress)

### Supabase project and the API key system change

Created the Supabase project (`hiiauzddkrfehrcnpzlh`, EU region). While
setting it up, found that Supabase has moved on from the master prompt's
"anon key"/"service role key" terminology: new projects now issue
**publishable keys** (`sb_publishable_...`, client-safe) and **secret
keys** (`sb_secret_...`, server-only, and rejected outright if a browser
tries to use one) — the old JWT-based keys still work but are being
deprecated by end of 2026. Built against the new system: env vars are
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`. The
Postgres roles RLS policies actually check (`anon`, `authenticated`)
didn't change — only the API key format that maps to them did.

Credentials live in `.env.local` (gitignored) with `.env.example`
documenting variable names only. A fifth variable,
`SUPABASE_ACCESS_TOKEN`, is an account-level personal access token (not
project-specific) that lets the Supabase CLI authenticate non-interactively
(`supabase link --password ...`) instead of opening a browser — necessary
in a terminal-only environment.

### Migrations and schema

Four migrations, applied via `supabase db push` (the CLI's Docker-based
local-diff caching isn't available without Docker installed, but this
doesn't block pushing directly to the remote database — only local
`supabase db diff` development would need it):

- `0001_extensions.sql` — `pgcrypto` (UUID generation). `pgvector` is
  deliberately deferred to whichever migration adds the RAG pipeline
  (Phase 5) rather than enabled speculatively now.
- `0002_core_content.sql` — profile, projects (+ translations, sections,
  metrics, media), technology tags. Defines two Postgres enum types,
  `locale_code` and `review_status_type`, shared across every translatable
  table rather than repeating a `text` + `check` constraint ten times.
- `0003_skills_timeline_content.sql` — the skills evidence map (distinct
  from technology tags — a skill can have multiple evidence projects and
  drives the homepage's grouped capability map), timeline, certifications,
  technical notes, and the visitor-submitted tables (contact form, chat
  feedback, a generic rate-limit counter table).
- `0004_rls_policies.sql` — enables row-level security on every single
  table and adds an `is_admin()` helper function (checks a tiny
  `admin_users` table against `auth.uid()`). Public policies are narrow
  `SELECT`s on `published = true` (and, for translations,
  `review_status = 'reviewed'`) rows; everything else requires
  `is_admin()`. Two tables (`rate_limit_events`, `admin_users`) get RLS
  enabled with **zero** policies — not "public read, admin write" like
  everything else, but fully locked to `anon`/`authenticated`, since only
  server code using the secret key (which bypasses RLS entirely) ever
  touches them.

One design choice worth calling out: `project_metrics.verified` is
enforced _inside the RLS policy itself_, not just checked by application
code — `select ... where verified and exists (select 1 from projects
where projects.published)`. An unverified number (like the skin-lesion 90%
accuracy figure pending confirmation) is structurally incapable of
reaching the public API response, not merely hidden by a UI convention
that a future bug could bypass.

### Client wrappers

Three, in `src/lib/db/`: `client.ts` (browser, publishable key, subject to
RLS), `server.ts` (Server Components/Route Handlers, publishable key +
the visitor's auth cookies via `@supabase/ssr`, also subject to RLS), and
`admin.ts` (secret key, bypasses RLS entirely, imports the `server-only`
package so importing it from a Client Component is a build error rather
than a runtime leak). Verified end-to-end with a throwaway script before
building anything on top: the publishable-key client correctly saw zero
rows through RLS on the still-empty tables, and the secret-key client
correctly bypassed it.

### Seed data and the review gate

`supabase/seed/` holds the initial content, structured as plain data files
(`data/profile.ts`, `data/technologies.ts`, `data/skills.ts`,
`data/timeline.ts`, `data/certifications.ts`, `data/projects/*.ts` — one
file per project) rather than one giant script, so each project's content
is independently readable and reviewable. `run.ts` wipes every top-level
table (children cascade-delete automatically via the FKs) and re-inserts
everything fresh from those files — this is a development/initial-seeding
tool, not an ongoing sync mechanism; once the Phase 3 admin panel exists,
content is managed there instead.

Every fact in the four flagship projects' case studies and the Goa
Legislative RAG entry traces back to `docs/CONTENT_FACTS.md` (and, where
that was a compressed summary, the original specification's more detailed
project sections) — nothing new was introduced. The skills capability map
deliberately omits several items the spec's illustrative list mentions
(PyTorch/TensorFlow by name, Docker, GitHub Actions, NumPy) because no
seeded project's facts confirm which specific tool was used — "never list
a technology solely for keyword density" applies to omission calls like
this, not just to what gets written.

All project translations and sections were initially seeded with
`review_status = 'draft'` and `published = false` — a deliberate choice,
not an oversight, so nothing appeared on the public site until a human
actually read it. Johar reviewed the drafted case-study prose on
2026-08-01 and approved it as-is; `run.ts` was updated to seed with
`review_status = 'reviewed'` / `published = true` and re-run, which is the
live state now (verified: querying with the publishable key returns the
full project set through `project_translations`, gated correctly by RLS).
The skin-lesion 90% accuracy figure, confirmed by Johar on 2026-07-31 (see
`docs/CONTENT_FACTS.md`), is the only metric seeded with `verified = true`
that required an explicit confirmation step before being written as fact;
every other metric drew from facts the spec already labelled stable.

### Projects index and case-study pages (public data wiring)

With reviewed content in the database, the two placeholder routes
(`src/app/[locale]/projects/page.tsx` and `.../projects/[slug]/page.tsx`)
were wired to it. `src/lib/db/projects.ts` holds the two read functions
(`getPublishedProjects`, `getProjectBySlug`), both built on
`lib/db/server.ts` (the RLS-respecting client) — deliberately not the
admin client, since RLS already encodes every visibility rule these pages
need (`published`, `review_status = 'reviewed'`, `project_metrics.verified`)
and duplicating that logic in application code would just be a second
place for it to drift out of sync.

Two things worth remembering about the query shape:

- Locale filtering on `*_translations` tables uses PostgREST's embedded-resource
  filter syntax (`.select('..., project_translations!inner(title)').eq('project_translations.locale', locale)`)
  rather than a second round-trip — the `!inner` join means a project with
  no translation row for the requested locale simply doesn't come back,
  which is exactly the desired "not translated yet" behavior for German.
- Technology names are resolved via a small in-memory map
  (`getTechnologyNameMap`) built from one flat query, then joined to
  `project_technologies` links in JS, rather than a doubly-nested
  PostgREST embed filter (`project_technologies → technologies →
technology_translations`). Two flat queries are easier to type correctly
  and read than one fragile three-level nested filter — simple over clever.

The case-study page renders the 12 canonical sections (order comes from
`project_sections.section_order`, not a hardcoded list) with
`react-markdown` for the Markdown `body_markdown` content, styled via
`@tailwindcss/typography`'s `prose` classes (both added as new
dependencies — nothing in the codebase rendered Markdown before this). A
sticky in-page nav (plain CSS `position: sticky`, no scroll-spy JS) lists
each section's heading as an anchor link. Metrics render as a stat strip
only when `project_metrics` has rows for that project — since RLS already
filters out `verified = false` metrics, an empty array here means either
no metrics or none confirmed yet, and the UI treats both the same way (no
stat strip) without needing to know which.

Because these pages read on every request (cookies-based Supabase client),
both are dynamic routes (`ƒ` in the `next build` output), not statically
generated — expected and fine, since project content can change without a
rebuild once the Phase 3 admin panel exists.

German currently 404s on every case-study page and shows an empty grid on
the index — not a bug, just an accurate reflection of the data: no project
content has German translations yet (seeding only ever inserted
`locale: 'en'` rows). The index page has an explicit `t('empty')` fallback
string for this state rather than rendering a bare empty grid.

### Homepage sections

The last placeholder page, `src/app/[locale]/page.tsx`, is now real: nine
sections (hero, selected work, more projects, lab preview, capability map,
about, journey, notes teaser, contact), each its own component under
`src/components/home/`, composed in one `Promise.all` at the top of the
page so all five data sources (profile, projects, skills, timeline, site
settings) fetch in parallel rather than waterfalling.

Three new read-only lib files follow the same shape as
`lib/db/projects.ts` from the projects-page work: `lib/db/profile.ts`
(the single profile row plus its locale translation), `lib/db/skills.ts`
(skills grouped by category for the capability map), `lib/db/timeline.ts`
(the journey list), and `lib/db/site-settings.ts` (two booleans that gate
whether the F1/Swiggy lab demos show as live or "coming soon" — reads
`site_settings`, which is fully public, no locale or review gating at all).

A few decisions worth remembering:

- **Selected work vs. more projects is just a filter, not two queries.**
  `getPublishedProjects` already returns every published project ordered
  by `homepage_priority` (nulls last); the homepage partitions that one
  list into "has a priority" (the four flagship projects) and "doesn't"
  (currently just the Goa Legislative RAG entry) rather than querying
  twice. Both sections reuse the same `ProjectCard` component built for
  `/projects` — no new near-duplicate card component.
- **A skill's badge style depends on its evidence, not a stored flag.**
  `skill_project_evidence.usage_label` can be `used_in_project`,
  `currently_developing`, or `exploring`. `getCapabilityMap` computes,
  per skill, whether _any_ evidence row is `used_in_project`; if not
  (e.g. TensorFlow, seeded as `exploring` only), the homepage renders it
  with a visibly different badge style and an "(exploring)" suffix rather
  than presenting it identically to confirmed skills — the same
  never-overstate principle from the RLS-enforced `verified` metrics flag,
  applied here in application code instead of a database constraint,
  since "confirmed" here is a derived property across possibly-multiple
  evidence rows, not a single boolean column.
- **The homepage's `contact` section is not the contact form.** It's
  `mailto:`/GitHub/LinkedIn links plus the profile's availability line,
  sourced from the `profiles` table. The actual Zod-validated,
  rate-limited submission form is still a separate, not-yet-built
  checklist item — conflating the two would have meant either a fake form
  with no backend, or scope-creeping this pass into building the rate
  limiter too.
- **German gets the same "not translated yet" treatment as the projects
  pages, with one addition.** `profiles`/`skills`/`timeline_items` are
  only ever seeded in English, so on `/de` the hero and About/Journey
  sections have no translation row to read. Rather than rendering an
  empty heading with nothing under it, About and Journey fall back to a
  new shared string, `home.pendingTranslation`
  ("Deutsche Version folgt in Kürze."), so a German visitor sees an
  explicit, honest "not yet" instead of a section that looks broken.
- **A stale Phase-1 assertion had to be fixed, not worked around.**
  `e2e/homepage.spec.ts` originally asserted the homepage's `<h1>`
  contained "Johar Rizvi" — true only because the old placeholder page
  literally rendered the `messages/*.json` site title as its heading. The
  real, reviewed hero copy (`profile_translations.hero_headline`,
  "Building reliable AI systems from data to deployment.") is the
  intentional H1 — the name already appears in the header logo, the
  footer, and the `<title>` tag, so repeating it in the H1 isn't the
  design. The test now checks the document title for the name and just
  asserts an H1 is present, which reflects what the page is actually
  supposed to show rather than an artifact of unfinished content.
- **An unrelated pre-existing e2e flake surfaced and got fixed while in
  here.** The language-switcher test located the "DE" button with
  `getByRole('button', { name: 'DE' })`, which under Next's dev-mode
  overlay ambiguously matches two buttons — Playwright's accessible-name
  matching is a case-insensitive substring match by default, and "Open
  Next.js **Dev** Tools" contains "de". Scoped the locator to the
  language switcher's `role="group"` container instead of matching
  buttons globally.

### Resume page

`src/app/[locale]/resume/page.tsx` reuses the same data the homepage
already fetches — `getProfile`, `getTimeline`, `getCapabilityMap` — plus a
new `getCertifications` (`src/lib/db/certifications.ts`, same
one-level-embed-filter pattern as the other list queries). It's a genuine
second, differently-shaped view of that data, not a copy of the homepage:
the single unified journey timeline becomes two separate lists, split
client-side by `item_type` (`education` vs. everything else) rather than
two separate queries, since the whole timeline is a handful of rows and
splitting an already-fetched array is simpler than adding a second
DB round-trip for a filter this cheap.

Reusing the homepage's `CapabilityMap` component directly here didn't
work: it renders its own `<section id="capability-map" class="max-w-6xl
border-t py-16 ...">` wrapper, which would have nested a wider,
independently-padded section inside the resume's narrower
`max-w-3xl` column and doubled up the vertical spacing next to the
resume's own `gap-16` rhythm. Fixed by pulling the actual skill-grid
markup (categories → badges) out into a new presentational component,
`src/components/skills/skill-groups.tsx`, that takes no section wrapper
or heading of its own. `CapabilityMap` now just supplies its
homepage-specific wrapper and heading around `<SkillGroups>`; the resume
page supplies its own. Same lesson as the `ProjectCard` reuse from the
projects-page work: share the part that's genuinely identical (the data,
the badge logic), not the part that's contextual (layout, heading level,
spacing).

The two Education/Experience lists render through one local
`TimelineList` component defined in the same file (not exported
elsewhere — it's a page-specific arrangement of already-shared data, not
a second copy of the homepage's `Journey` rendering logic, which stays as
its own single-list component for the homepage's different framing).

The "download resume" button stays disabled, matching the exact comment
already left in the original placeholder file: no PDF has been exported
and uploaded yet (`docs/LAUNCH_CHECKLIST.md`), and no Storage bucket for
it exists yet either (`profiles.resume_storage_path` is a plain nullable
text column per `docs/DECISIONS.md`, but nothing has ever written a
migration for the actual bucket or its access policy). Wiring a
conditional download link against a bucket name that doesn't exist yet
would be guessing at infrastructure Phase 3's admin upload flow hasn't
decided; better to leave the honest "coming soon" state than build half
of a feature against an assumption.

### Contact form

First real write path on the public site — everything before this only
ever read from Supabase. `docs/architecture.md`'s target file tree already
named the shape (`src/app/api/contact/route.ts`), so this follows it
rather than inventing a Server Action instead.

Request flow: `ContactForm` (`src/components/home/contact-form.tsx`, a
Client Component — the first one outside the existing theme/nav chrome)
does a plain `fetch('/api/contact', { method: 'POST' })`, no form library.
Field-level required/type/length validation is delegated entirely to the
browser's native HTML constraints (`required`, `type="email"`,
`minLength`/`maxLength`) rather than hand-rolled JS: with `noValidate` not
set, the browser blocks the `submit` event from firing at all until those
constraints pass, and — a genuinely nice side effect — Chrome/Firefox
localize their built-in validation bubble text from the page's `lang`
attribute automatically, so an invalid email on `/de` already shows a
German browser message for free, no translation work needed for that
layer specifically.

The server route (`src/app/api/contact/route.ts`) is the actual source of
truth: `contactFormSchema` (`src/lib/validation/contact.ts`, a plain Zod
object schema, no `server-only` on it since the same file could be reused
for client-side validation later) re-validates everything server-side —
native HTML constraints are trivially bypassable by anyone calling the
API directly, so skipping server validation because "the browser already
checked" would be a real hole, not just belt-and-suspenders.

Two new server-only helpers back the route:

- **`src/lib/hash-ip.ts`**: HMAC-SHA256 (not plain SHA-256) of the
  visitor's IP, keyed by a new `CONTACT_IP_HASH_SECRET` env var. Plain
  SHA-256 of an IPv4 address is crackable by brute force in seconds — the
  entire IPv4 space is only ~4 billion values, small enough to
  precompute a full rainbow table — so a keyed hash is what actually
  makes `ip_hash` privacy-preserving rather than only privacy-looking.
- **`src/lib/rate-limit.ts`**: counts existing `rate_limit_events` rows
  for that IP hash + endpoint within a 10-minute window; under 5, records
  a new event and allows the request; at or over, blocks it (HTTP 429).

Both go through `createAdminClient()` (secret key), not the
RLS-respecting server client — the only option, since
`rate_limit_events` has RLS enabled with **zero** policies for
`anon`/`authenticated` (see `docs/DECISIONS.md`), on purpose: nothing
except trusted server code should ever be able to read or tamper with
someone else's rate-limit counters. `admin.ts`'s doc comment was updated
to name this as a third legitimate reserved use, alongside the
publish/reindex pipeline and seed scripts.

Verified against the real, live database rather than mocked: a valid
submission actually landed a row in `contact_submissions`; a malformed
email and a too-short message both correctly returned `400` with
field-level Zod issues; six rapid submissions returned `201` for the
first five and `429` for the sixth and any after. All test rows and
rate-limit events created during that check were deleted afterward — the
production tables that will hold real visitor messages shouldn't carry
test junk.

### Contact form email notification

A gap noticed right after shipping the form itself: a message saved
straight to a database table with no admin UI yet (Phase 3) means it's
genuinely invisible until someone thinks to open the Supabase table
editor. Not in the original spec, added as a follow-up once that became
obvious.

`src/lib/email.ts` wraps Resend's Node SDK behind one function,
`sendContactNotification`, called from the route handler right after the
`contact_submissions` insert succeeds. It looks up the recipient from
`profiles.public_email` (the same single source of truth the rest of the
site already reads from) rather than hardcoding an address in code or a
second env var — one place for that fact to live, not two that could
drift apart. `replyTo` is set to the _visitor's_ address, so replying to
the notification email goes straight to them, not back to the noreply
sender.

Two decisions worth flagging:

- **No verified sending domain yet, so it sends from Resend's shared
  `onboarding@resend.dev` sandbox address.** A verified domain requires
  DNS records this project doesn't have anywhere to put yet — no domain
  has been purchased, deployment is Phase 7. Documented in
  `docs/DECISIONS.md` as a pragmatic default to revisit once a domain
  exists, not a permanent choice.
- **A failed send never fails the request.** `sendContactNotification`
  catches and logs internally rather than letting the error propagate —
  by the time it runs, the visitor's message is already safely in the
  database, which is the part that actually matters. If Resend has an
  outage, the visitor should still see success, not a scary error for a
  notification email they don't even know exists.

Verified with two real sends against the live Resend API (one through
the actual route, one direct), both returned a real message ID — not
just "the code didn't throw," an actual confirmed accepted send. The
test contact-form row was deleted afterward, same as the rest of this
feature's testing.

### Projects index filters, a header responsive bug, error-boundary resilience, and a live database outage

Closed out the two remaining Phase 2 checklist items in one pass, then hit
a real infrastructure problem while verifying the second one.

**Filters.** `getPublishedProjects` already returned every published
project with its resolved technologies; two small pure functions,
`getProjectFilterOptions` (distinct project types + technologies actually
present in the current list) and `filterProjects` (an AND filter over
`type`/`tech`), sit in front of the existing list rather than adding new
Supabase queries — five projects and ~20 technologies is small enough that
filtering in memory after one fetch is simpler and cheaper than a second
round-trip per facet. The UI itself (`components/projects/project-filters.tsx`)
is plain server-rendered `<Link>` chips reading/writing `?type=`/`?tech=`
query params, no client-side JS at all — Base UI's `Badge` `render` prop
composes the chip styling directly onto the `Link`, matching the
`render`-prop convention already established for Button+Link in the header
(Base UI, not Radix, uses `render` where Radix would use `asChild`).

**Responsive QA surfaced an actual bug.** Rather than eyeballing the
site, a throwaway Playwright script drove a real headless browser at
mobile (375px), two tablet widths (768px, 1024px), and desktop (1440px)
against every route that doesn't require the database, measuring
`document.documentElement.scrollWidth` against the viewport width to catch
horizontal overflow programmatically instead of by eye. It found a real,
reproducible 2px horizontal overflow at exactly 768px on every single
page: the header switched from the mobile hamburger menu to the full
desktop nav (logo + 6 nav links + resume button + assistant button +
language switcher + theme toggle) at Tailwind's `md:` breakpoint (768px),
but that's not actually enough horizontal room for all of that — it only
comfortably fits from `lg:` (1024px) up. Fixed by moving all three
breakpoint classes (`nav`, the button/switcher group, and the hamburger's
`md:hidden`) from `md:` to `lg:`, so tablet-width visitors correctly still
get the hamburger menu instead of a cramped, overflowing desktop nav.
Re-ran the same script after the fix (zero overflow at any width) and a
second script that actually clicked the hamburger open at 768px and
1024px to confirm the sheet menu itself still works, not just that the
button is visible.

**A live database outage, found by accident.** Starting the dev server to
run that Playwright script turned up something unrelated to responsive
design entirely: every page that reads from Supabase (`/`, `/projects`,
`/resume`, etc.) was throwing `TypeError: fetch failed`, and the project's
own hostname (`hiiauzddkrfehrcnpzlh.supabase.co`) doesn't resolve in DNS
at all (`nslookup` returns `Non-existent domain`) — not a slow response, a
completely absent one. `supabase.co` itself resolves fine, so this isn't a
network/sandbox restriction; the specific project is unreachable. This
predates tonight's session entirely (nothing here touched Supabase
infrastructure) and most likely explains itself: this is a free-tier
project that's had no API traffic since the seed re-run on 2026-08-01, and
Supabase auto-pauses free projects after a period of inactivity. **This
needs Johar to check the Supabase dashboard and un-pause or restore the
project before any further live-database verification (including
re-running the seed script, or visually confirming tonight's filter UI in
a browser) is possible.** Nothing in the codebase can fix this from here.

While tracking this down, two resilience gaps became obvious and got
fixed on the spot rather than left for later, since both are cheap and
generally correct regardless of what caused this specific outage:

- **`src/app/[locale]/error.tsx`** — a segment-level error boundary that
  was previously entirely missing. Before this, any data-fetch failure
  (this outage, or any future transient one) rendered Next's raw
  development error overlay in dev and an unstyled failure in production.
  Now it shows a translated, on-brand "Something went wrong / Try again"
  message with a retry button, while the header/footer/nav/theme toggle
  around it keep working, since the boundary sits below the layout, not
  above it.
- **`getSiteSettings()` now fails soft.** It only ever gates two optional
  "coming soon" lab-demo badges on the homepage, not real content, so a
  database hiccup there shouldn't take down the entire homepage the way a
  failed profile/projects fetch legitimately should. It now catches its
  own error, logs it, and returns both flags `false` (both demos hidden)
  instead of throwing — the one place in the data layer where "hide an
  optional feature" is a more honest response to an outage than "crash the
  page," precisely because it's the one query result that was already
  designed to have a safe default.

## Phase 4: the interactive lab, built entirely offline from the database outage

With Phase 2 closed out and the Supabase project still unreachable, Phase 4
(the interactive lab) turned out to be exactly the right thing to build
next: both of its demos are explicitly meant to run "on mocked or sample
data" (already the copy in `messages/*.json` from Phase 1's placeholder
work), so neither one needed the database at all beyond the existing
`site_settings` enabled-flag check, which already fails soft. Everything
else in this phase is static content and client-side-only interactivity.

**Before writing any new copy, read the actual source documents instead of
guessing.** `docs/CONTENT_FACTS.md` compresses both projects' real project
notes (kept locally in `JoharInfo/`, gitignored) into short fact lists, and
for the F1 pipeline stages, that compressed version was detailed enough to
write from directly. For the Swiggy "what broke and what I learned"
section, though, writing from the compressed category labels alone
(`stale state`, `router misclassification`, etc.) would have meant
inventing specific-sounding incident detail that wasn't actually
confirmed anywhere. Rather than guess, the real
`Swiggy Instamart Agent - Project Notes v2.docx` (a Word file — extracted
by unzipping it and stripping the OOXML tags from `word/document.xml`,
since it's a zip archive of XML under the hood, not plain text) was read
directly. It turned out to already contain far more detail than the
compressed summary: real function/variable names (`pending_items`,
`pantry_node`, `@trace_node`, `parse_json_response()`), the actual
mechanism behind each bug, and how each was fixed. The Lab simulator's
"what broke" cards are built on the same 7 categories and the same claims
already reviewed and published in the Swiggy case study
(`supabase/seed/data/projects/swiggy.ts`), just with those real
identifiers added back in for engineering flavor, not new unreviewed
claims — consistency with an already-approved page beats inventing a
fresh description from scratch.

**That same source-reading turned up two real discrepancies, both flagged
for Johar rather than silently resolved.** The Swiggy notes document (a
"v2" file, meaning it likely postdates the master prompt) says all 62
tests currently pass, while the published case study and every seeded
metric say "55+" — CONTENT_FACTS.md's own precedence rules put the master
prompt's figure above the project notes file, so "55+" is what's used
everywhere tonight, with the discrepancy logged in
`LAUNCH_CHECKLIST.md` for Johar to reconcile. Separately,
`F1_Race_Predictor_Project_Report.docx` describes considerably more
finished modelling work than the site currently shows: a full
twelve-section EDA, three trained model classes (logistic regression,
random forest, XGBoost), a defined primary target, and a time-based
cross-validation scheme. It never states an actual accuracy or ROC-AUC
_value_, so there was nothing concrete to leak even by accident, but the
gap between "what this document describes" and "what the public case
study says" is worth Johar's attention — also logged in
`LAUNCH_CHECKLIST.md`, not acted on unilaterally, since
`docs/CONTENT_FACTS.md` explicitly treats this document as a working
draft pending his confirmation.

**The demos themselves.** `/lab/f1-explorer` is a plain server-rendered
accordion built on native `<details>`/`<summary>` elements — genuinely
interactive (each stage expands/collapses) with zero client-side
JavaScript, which is both simpler and more accessible than reaching for a
client component and manual `useState` just to toggle visibility.
`/lab/swiggy-simulator` does need a client component
(`SwiggyAgentSimulator`): picking one of 5 scripted capability scenarios
and re-rendering the conversation + agent-graph trace is genuine
client-side state, not something `<details>` could express. Every
scenario's user message, assistant reply, and list of graph nodes is a
hardcoded, deterministic array baked into `messages/*.json` — there's no
LLM call, no network request, and no Swiggy API anywhere in this
component, which is what actually satisfies "never make live Swiggy calls
from the public site" (a rule from `docs/DECISIONS.md`) by construction,
not by a runtime permission check that could be bypassed or misconfigured
later.

**Both pages stay gated behind their existing `site_settings` flags,
left `false`.** The flag-check happens inside each page itself, not just
in the nav/homepage preview links pointing to it — so even someone who
guesses or bookmarks the direct URL still sees the same "coming soon"
placeholder as before, until Johar actually reviews this content and
flips the flag himself. This mirrors the same review-before-publish
principle already applied to project case-study content elsewhere in the
codebase, just enforced through a boolean flag instead of a
`review_status` column, since this content was never going to move
through the CMS pipeline in the first place.

**Verifying it live required temporarily working around the same database
outage the pages are designed to tolerate.** Since both flags currently
resolve to `false` (whether from real data or the outage's fail-soft
fallback), the built content wouldn't actually render during a normal dev
server run. `src/lib/db/site-settings.ts`'s `DEFAULTS` constant was
edited to `true` for both flags just long enough to drive a headless
browser at both languages and two viewport widths, then reverted
immediately after. This turned up one genuine bug worth fixing before
committing: the F1 page's new GitHub-link button, built by composing the
shared `Button` component with a real `<a>` element via Base UI's
`render` prop, needed an explicit `nativeButton={false}` — the exact same
class of bug already documented in `IMPLEMENTATION_STATUS.md` from Phase
1's header resume button, caught the same way both times: a real browser
console, not type-checking or a unit test.

**A small shared-component extraction happened along the way, not planned
up front.** The homepage's lab-preview section already had its own inline
card markup for the two demos; building the standalone `/lab` index page
with the same two cards would have meant either a second near-identical
copy of that markup or actually sharing it. `src/components/lab/lab-demo-card.tsx`
is the extracted piece — same lesson as the `ProjectCard` and
`SkillGroups` extractions from Phase 2: the first genuine second use of a
piece of UI is usually what reveals which part of it was actually
general-purpose.

## Phase 6, started early: per-page SEO metadata

With Phase 4 done and Phases 3/5/7 all genuinely blocked (LLM keys,
Vercel), the highest-value unblocked work left was Phase 6's SEO
metadata — every route had been silently sharing one identical
`<title>`/description from the root layout since Phase 1, since only that
layout ever defined `generateMetadata`. Fixed with a title template
(`{page} | Johar Rizvi`, root keeps its own full default) and a
`generateMetadata` export on every route, plus `src/lib/seo.ts`'s
`localeAlternates()` helper for canonical/hreflang tags (this site is
bilingual with `localePrefix: 'always'`, so every page has a real EN/DE
counterpart worth cross-linking, not just a canonical self-reference).

Adding `/projects/[slug]`'s dynamic metadata surfaced a subtle but real
inefficiency: `generateMetadata` and the page component both need the same
project, and without React's `cache()` wrapping `getProjectBySlug`, that's
two separate database round-trips for one page view, since Supabase
client calls aren't automatically deduplicated the way `fetch()` calls
are. Wrapped it in `cache()` — request-scoped memoization, not a persistent
cache, so it dedupes exactly the two calls within one request and nothing
more.

`src/app/sitemap.ts` and `src/app/robots.ts` use Next's built-in
metadata-route file conventions rather than hand-rolled XML/text
responses. The sitemap reads published projects from the database, same
as everything else tonight it couldn't be verified live because of the
outage — confirmed only that `npm run build` still succeeds, since
`sitemap.ts` calling `cookies()` (via the same Supabase server client
everything else uses) forces it to build as a dynamic route rather than
attempting to run at build time, so the outage can't break the build
itself, only the route's live response until the database is back.

The homepage also gained a `Person` JSON-LD block
(`src/components/seo/person-json-ld.tsx`) — structured data search
engines can use to build a knowledge-panel-style understanding of who the
site is about. Built strictly from fields `docs/CONTENT_FACTS.md` already
lists as public (name, title, city-level location, public email,
GitHub/LinkedIn), so nothing here exposes anything not already visible
elsewhere on the same page.

## Standing habit from here on

Three more documents are now maintained alongside this one, updated every
phase: `PROJECT_NOTES.md` (this file — the technical narrative),
`LEARNING_JOURNAL.md` (the same material explained simply, for Johar to
actually learn from), and `PROJECT_REPORT.md` (a recruiter-facing summary
of the project as a whole).
