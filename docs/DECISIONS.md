# Decisions

Living log of decisions made during implementation. Locked decisions from the
master prompt are not reopened unless Johar explicitly changes them. Pragmatic
defaults are decisions made to keep moving without blocking on non-critical
questions; they are documented here rather than left implicit.

## Locked decisions (from the master prompt, non-negotiable)

- Primary position: Applied AI/ML Engineer. Data Scientist / Healthcare AI are supporting descriptors, not competing titles.
- Audience: recruiters, technical hiring managers, early-stage AI startups in Germany/Europe.
- Aesthetic: light futuristic editorial AI, optional dark theme, subtle motion, no cyberpunk/3D.
- Homepage: selected projects appear immediately after the hero and dominate the experience.
- Project UX: compact recruiter-friendly homepage cards, dedicated case-study pages for depth.
- Languages: full EN (default) and DE via locale routes. DE remains editable/reviewable, never implies fluency (A2).
- AI assistant: citation-grounded RAG over approved public content only, with retrieval transparency and safe fallbacks.
- Admin: single protected admin area for projects, translations, media, notes, settings, embeddings, RAG evaluations.
- Interactive lab: useful ML/AI interactions over decorative animation; public demos are safe, bounded, never touch real commerce/medical credentials.
- Photo: JR monogram/abstract placeholder now; real photo added later via admin, no redesign required.

## Tech stack (locked)

Next.js App Router + TypeScript strict + Tailwind + shadcn/ui (source-owned) + Motion for React + next-themes + next-intl + Supabase (Postgres/Auth/Storage/pgvector) + Supabase CLI migrations + Vercel AI SDK + Zod + Vitest/RTL + Playwright + axe + Vercel + GitHub Actions. No ORM, no LangChain, no second vector database, no Three.js/Kubernetes/microservices unless a real need emerges.

## Pragmatic defaults (open decisions, resolved here rather than left ambiguous)

| Decision                        | Default                                                                                                                                                                                                                                                                                                                                                                                           | Rationale                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package manager                 | npm                                                                                                                                                                                                                                                                                                                                                                                               | Ships with Node, no extra tooling                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Generation LLM provider         | Google Gemini (current free-tier Flash model — re-check the actual current model name at implementation time, do not hardcode a version) via `@ai-sdk/google`, primary. Groq (hosting Qwen3 235B-A22B or a DeepSeek R1/V4 model, whichever is free on Groq at the time) via an OpenAI-compatible interface, fallback. Selected/ordered through one provider-neutral module, `lib/ai/provider.ts`. | Researched 2026-07-31. Both tiers are genuinely free (official docs, not trial credit). Gemini is primary not because it benchmarks highest, but because this project's chat citations and AI project-import extraction both depend on reliable strict-JSON/schema output, and the Swiggy project notes already document a real prior incident with malformed/code-fenced LLM JSON — reliability matters more here than raw leaderboard score. Groq fallback satisfies the RAG spec's provider-fallback requirement (section 13) and gives hands-on exposure to leading open-weight models. DeepSeek's own hosted API is not actually free beyond a one-time 5M-token grant; free DeepSeek/Qwen access happens via Groq, not deepseek.com. **Risk to verify early in Phase 3**: some reported Vercel AI SDK issues combining Gemini structured output with built-in tool-calling — test `generateObject` reliability before building the extraction pipeline around it. |
| Embedding model                 | `gemini-embedding-001` (Google), output truncated to 1536 dimensions via Matryoshka representation                                                                                                                                                                                                                                                                                                | Genuine free tier (official docs); reasonable EN/DE multilingual quality; same provider account as generation for simpler initial setup. **Locked before the Phase 2 `content_chunks` migration is written** — changing the embedding model/dimension later requires a destructive migration and full re-embed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| pgvector index type             | HNSW, `vector_cosine_ops`                                                                                                                                                                                                                                                                                                                                                                         | Best recall/latency tradeoff for a small corpus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Rich text for technical notes   | Sanitized Markdown, not MDX                                                                                                                                                                                                                                                                                                                                                                       | Avoids arbitrary component/code execution risk in admin-authored content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Document parsing libraries      | `pdf-parse`/`unpdf` for PDF, `mammoth` for DOCX, native read for MD/TXT                                                                                                                                                                                                                                                                                                                           | Small, well-known, no native-binary build issues on Windows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Malware scanning                | Skipped in v1; rely on strict MIME/size allowlisting + server-only parsing + no code execution                                                                                                                                                                                                                                                                                                    | Real AV integration disproportionate for a single-admin CMS; revisit if scope changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Rate limiting                   | Postgres table of counters keyed by IP hash                                                                                                                                                                                                                                                                                                                                                       | Avoids adding an external service (Redis/Upstash) purely for this                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Admin auth                      | Supabase Auth, email + password, single row in an `admin_users` table checked by RLS                                                                                                                                                                                                                                                                                                              | Simplest mechanism Supabase Auth offers for exactly one admin user                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Contact form notification email | Resend, sending from the shared `onboarding@resend.dev` address (not a verified custom domain), reply-to set to the visitor's own address                                                                                                                                                                                                                                                         | Not in the original spec — added 2026-08-01 because a stored-only contact form is easy to miss. Resend has a free tier (3,000/month) and a first-party Node SDK; no project domain exists yet to verify for a branded sender (deployment/domain is Phase 7), so the shared sandbox sender is the pragmatic interim choice — revisit once a real domain exists.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

## Responsive QA findings and error-handling defaults (Phase 2 close-out)

An automated headless-browser pass (four viewport widths, checking
`scrollWidth` against viewport width instead of eyeballing) caught a real
header overflow at 768px: the desktop nav/action-button group switched on
at Tailwind's `md:` breakpoint, which isn't wide enough for the full
logo+nav+buttons+switchers row. Moved that switch to `lg:` (1024px)
instead, so tablet widths correctly keep the hamburger menu. Also added
`src/app/[locale]/error.tsx` (previously missing entirely) as a general
Phase-6-style resilience default, not specific to any one outage: any
page-level error below the locale layout now shows a translated "Something
went wrong / Try again" message with the header/footer/nav still
interactive, rather than a raw framework error. `getSiteSettings()` was
changed to catch its own errors and default to both lab-demo flags `false`
rather than throwing — the one query in the data layer where "hide an
optional feature" is a legitimate, safe response to failure, since it only
ever gates two "coming soon" badges, never real content.

## Working style

Johar wants to work through this collaboratively, not have every phase run unattended end-to-end — and this project doubles as his vehicle for learning the AI/RAG side specifically. Default cadence: check in after each phase and show what changed before starting the next; this flexes looser or tighter depending on the moment. During AI/RAG-heavy work (Phase 3 extraction pipeline, Phase 5 retrieval/generation), explain the reasoning behind choices, not just implement silently.

## True blockers identified (Phase 0)

- No Supabase project/credentials yet — blocks Phase 2 onward, not Phase 0/1.
- No LLM/embedding provider API key created yet (Gemini/Groq) — blocks Phase 3 and Phase 5, not Phase 0/1/2 UI shells.
- No Vercel project linked yet — blocks only the final Phase 7 deploy step.

## Security: critical Next.js RCE found and fixed, npm audit now clean (Phase 4/6)

While installing `@axe-core/playwright` for accessibility testing, a routine
`npm audit` turned up a **critical, unauthenticated remote-code-execution
advisory in the pinned Next.js version** (`next@16.2.12`, pinned since
Phase 1): [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36)
(Windows-hosted RCE) and [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4)
(RCE via the Image Optimization API with AVIF files), plus a related `sharp`
libvips advisory. This predates tonight's session entirely — it was sitting
in the exact-pinned version the whole time, only surfaced now because
installing a new package triggered a fresh audit. **Fixed**: upgraded to
`next@16.3.6` (latest stable at the time) and `eslint-config-next@16.3.6` to
match (per the standing rule of re-checking `eslint-config-next` on every
Next upgrade), bumped the `sharp` override to `^0.35.5`. `npm run verify`
confirmed clean after the upgrade — no code changes were needed.

That same audit pass also surfaced `hono`/`qs`/`fast-uri` findings traced to
`shadcn` (the shadcn/ui component-generator CLI), which was misclassified
under `dependencies` instead of `devDependencies` — it's a dev-time code
generator (`npx shadcn add ...`), never imported or run by the actual
application at runtime, the same category of tool as `tailwindcss`,
`eslint`, or the Supabase CLI, all of which were already correctly
classified as dev-only. Moved it. Combined with a plain `npm audit fix`
(no `--force`, so no breaking major-version bumps) for the remaining
`js-yaml`/`nanoid`/`@vitest/mocker` findings, **`npm audit` now reports zero
vulnerabilities** — which also fully resolves the Phase 1 `eslint`/`minimatch`/
`brace-expansion` exception previously documented here; that chain no longer
exists in the resolved dependency tree (`eslint-config-next@16.3.6`'s own
updated dependencies moved past it). The `postcss`/`sharp` `overrides` from
Phase 1 stay in place, now at `sharp@^0.35.5`.

**Lesson for future dependency work**: an `npm install` for one small,
unrelated devDependency can silently surface (or introduce, via lockfile
re-resolution) findings in completely unrelated packages — always run a full
`npm audit` after any install, not just for the package just added, and
don't assume a clean audit from a prior session is still accurate weeks
later.

## Accessibility: sitewide color-contrast bug found and fixed (Phase 6)

Added `e2e/accessibility.spec.ts` (axe-core via `@axe-core/playwright`,
`wcag2a`/`wcag2aa` tags) — accessibility was a locked stack decision
(`architecture.md` lists `axe` alongside Vitest/Playwright) that had never
actually been wired up. First run found a real, sitewide WCAG 2 AA
color-contrast failure: the `--secondary`/`--secondary-foreground` design
tokens (`#4f8cff` background, `#ffffff` text, light mode only) render at a
3.21:1 contrast ratio against a 4.5:1 requirement — computed by hand and
confirmed by axe. This is the active-state color for the header's language
switcher (present on every single page) and the `secondary` `Badge`/`Button`
variant used for "coming soon" labels elsewhere. Manually computing the same
formula for `--accent`/`--accent-foreground` (`#19b8b0` / `#ffffff`) found
an even worse ratio (2.46:1) — not currently exposed anywhere in rendered
UI (no component uses the `accent` variant yet), but a latent bug waiting
for whoever uses it next. **Fixed both** by changing only the light-mode
`*-foreground` values to `#0b1020` (the same near-black already used
successfully as dark mode's `--secondary-foreground`/`--primary-foreground`,
confirmed via the same contrast formula to reach ~5.9:1) — the background
colors themselves (the actual brand blue/teal) are untouched, so the visual
palette doesn't change, only which text color sits on top of it. Re-ran the
full accessibility suite after the fix: zero contrast violations remain on
any tested page.

Chasing this down also surfaced a real, separate, harder problem: on a page
that throws (tonight, because of the Supabase outage below), Next.js's
production error-recovery path replaces the entire document with its own
minimal `<html id="__next_error__">` shell that has **no `lang` attribute
at all**, regardless of what the app's own layout sets — a genuine
`html-has-lang` WCAG failure, but only when a page fails hard enough that no
bytes have streamed yet. Added `src/app/global-error.tsx` (the Next.js
convention specifically for errors the root layout itself can't recover
from, which must define its own `<html>`/`<body>`) as a correct, general
resilience improvement — verified via `npm run build` that it doesn't
regress anything. It does **not** fully close this specific gap, though:
testing confirmed the `[locale]/error.tsx` boundary (not the true root) is
what's actually catching tonight's DB-outage errors, and that boundary
still can't set `lang` on Next's fallback shell either, since the error
occurs before the real layout's `<html>` tag ever gets to stream. Properly
fixing that would mean restructuring data fetching to fail per-section
(e.g. Suspense boundaries with individual fallbacks) rather than
page-wide, an architectural change deliberately not attempted blind,
tonight, against a database that's down and can't be used to verify the
happy path still works. Documented here rather than either ignored or
half-fixed.

## GitHub repo and the no-AI-attribution constraint (Phase 1)

Pushed to `JoharR1zvi/Johar-Portfolio` on GitHub. Johar's instruction: this
repo should show no trace anywhere — not commits, not file/folder names,
not doc content — of which coding-assistant tool was used to build it; it
should read as entirely his own work. Before the first push, a local-only
project-instructions file (kept on disk, deliberately not referenced by
name in `.gitignore` — a public `.gitignore` line naming it would itself
be the giveaway it's meant to avoid) had already been committed twice.
Since nothing had been pushed yet, history was squashed into a single
fresh "Initial commit" via an orphan branch rather than patched forward,
so no trace of it — or of the original spec document's tool-referencing
filename — survives anywhere in the pushed history, not just the current
tree. One planned folder from the original spec (Phase 3+ repeatable
workflow scripts) is named `scripts/workflows/` here rather than the
tool's own naming convention for the same reason: keep every committed
file/folder name generic. This constraint is repo-specific — the mechanics
(never stage the local instructions file, never name the tool in anything
that gets committed) are recorded inside that local file itself.

## Supabase API key system (Phase 2)

Researched 2026-07-31 at Phase 2 kickoff: Supabase has replaced the legacy
JWT-based `anon`/`service_role` keys with a new format — `publishable`
keys (`sb_publishable_...`, client-safe) and `secret` keys
(`sb_secret_...`, server-only, full access, rejected outright if used from
a browser). The legacy keys still work but are being deprecated by end of 2026. Built against the new system from the start rather than the
spec's original (now-outdated) "anon key"/"service role key" terminology:
env vars are `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and
`SUPABASE_SECRET_KEY`. The underlying Postgres roles referenced by RLS
policies (`anon`, `authenticated`) are unchanged — only the API key
format changed.

## Database schema decisions made while writing the Phase 2 migrations

A few things the schema summary in `architecture.md` didn't fully pin down,
resolved while writing the actual SQL:

- **Project slugs are not per-locale.** One canonical slug per project,
  shared across `/en` and `/de`. Simpler, and none of the four flagship
  projects need a different slug per language.
- **`locale` and `review_status` are Postgres enum types** (`locale_code`,
  `review_status_type`), not per-table `text` + `check` constraints — used
  identically across 10+ tables, so a shared type is a real DRY win, not
  premature abstraction.
- **`project_metrics.verified` is enforced at the RLS level, not just the
  application layer**: the public `SELECT` policy on `project_metrics`
  requires `verified = true`. An unverified claim (e.g. skin-lesion 90%
  accuracy) is structurally incapable of reaching the public site, not
  merely hidden by UI convention.
- **`rate_limit_events` and `admin_users` have RLS enabled with zero
  policies** — not "public read, admin write" like everything else, but
  fully inaccessible to `anon`/`authenticated`. Both are only ever touched
  by server code using the secret key, which bypasses RLS entirely.
- **Profile avatar/resume are plain nullable `text` storage-path columns
  on `profiles`**, not a generic `media_assets` table — each is a strict
  1:1 relationship (one avatar, one resume, ever), so a join table would
  be unused complexity. `project_media` (a real one-to-many) is a proper
  table.
- **Contact form rate limit: 5 submissions per IP per 10-minute window**,
  a pragmatic default (not specified in the master prompt), checked and
  recorded in one pass against `rate_limit_events` from
  `src/lib/rate-limit.ts`. Revisit if real spam volume turns out to need
  something stricter.
- **Visitor IPs are HMAC-SHA256'd, not plain SHA-256'd, before being
  stored in `rate_limit_events.ip_hash`** (`src/lib/hash-ip.ts`, keyed by
  a new `CONTACT_IP_HASH_SECRET` env var). A plain hash of an IPv4 address
  is crackable by brute force since the whole address space is only ~4
  billion values; the secret key makes that infeasible while still giving
  a stable per-visitor identifier to rate-limit against.
