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

## Standing habit from here on

Three more documents are now maintained alongside this one, updated every
phase: `PROJECT_NOTES.md` (this file — the technical narrative),
`LEARNING_JOURNAL.md` (the same material explained simply, for Johar to
actually learn from), and `PROJECT_REPORT.md` (a recruiter-facing summary
of the project as a whole).
