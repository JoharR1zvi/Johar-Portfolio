# Project Report

A high-level summary of this project, kept current as work progresses.
Written to be reused directly — as a technical-notes entry on the site
itself, or handed to a recruiter/technical reviewer who wants the short
version before going deeper.

## 1. Project identity

- **Name:** Personal Portfolio & AI Assistant Platform
- **Type:** Personal project
- **Status:** In progress (Phases 1, 2, and most of 4/6 complete; deployed
  and live at `johar-portfolio.vercel.app`. Phase 3, the admin panel and
  AI-assisted content import, is next.)
- **My role:** Sole designer and developer

## 2. The problem

Most portfolio sites are static lists of projects that ask a recruiter to
take the claims on faith, and they rarely demonstrate applied AI/ML
engineering ability within the site itself. Skimming time is short — a
recruiter needs to understand who I am, what I've built, and whether it's
credible within about 30 seconds.

## 3. What I'm building

A bilingual (English/German) web application with:

- Recruiter-scannable project case studies with real proof points, clearly
  labeled by status (completed, in progress, prototype) so nothing is
  overstated.
- An interactive AI lab demonstrating retrieval, reasoning, and data
  understanding rather than decorative animation.
- A citation-grounded AI assistant embedded in the site that answers
  questions about my work using only content I've explicitly approved —
  it shows its sources and refuses to answer when it doesn't have
  evidence, rather than making things up.
- A private admin system where I can write project notes and have AI help
  extract and draft structured, publishable content from them — with every
  fact reviewed and approved by me before it goes live, and full traceback
  to the source document behind any claim.

## 4. Architecture, at a glance

- **Frontend:** Next.js (App Router) with TypeScript — static pages
  pre-built for speed where content is fixed, database-backed pages
  (project case studies) rendered fresh per request so edits go live
  without a redeploy — with English/German routing built in from day one
  rather than bolted on later.
- **Design system:** a custom light/dark visual theme built on shared
  design tokens, so the whole site stays visually consistent as it grows.
- **Backend (in progress):** Supabase — Postgres database, authentication,
  file storage, and vector search — powering both the content-management
  system and the AI assistant's knowledge base.
- **AI layer (in progress):** a provider-agnostic integration (not locked
  to one vendor) used for both the chat assistant and structured extraction
  of facts from uploaded project documents, with schema-validated output so
  AI-generated content is always a reviewable draft, never a silent fact.

## 5. Engineering practices

- Automated quality gates — formatting, linting, type-checking, automated
  tests, and a production build — run and must pass before any phase of
  work is considered complete.
- Two layers of automated testing: component-level tests and full
  browser end-to-end tests that simulate a real visitor using the site,
  including automated accessibility checks (WCAG 2.2 AA) on every page.
- Dependency security audited on every install, not just periodically —
  caught and fixed a critical vulnerability in a pinned framework version.
- Deliberate privacy handling: sensitive personal source documents are
  excluded from version control from the very first commit, before any
  other file was added.
- Every non-trivial engineering decision is recorded with its reasoning in
  a living decision log rather than left as tribal knowledge.

## 6. Current status

**Phase 1 and 2 of 7 complete.** Foundation, design system,
internationalization, and theming are built, tested, and passing all
quality gates. All five project case studies (reviewed and approved) are
published, the real homepage is live (hero, selected work, more projects,
a lab preview, a skills capability map, about, career journey, a notes
teaser, contact links), the projects index now supports filtering by
project type and technology, and a responsive-QA pass (verified across
phone/tablet/desktop widths with an automated headless-browser check, not
just eyeballed) caught and fixed a real header overflow bug at tablet
width. The resume page is live with real education, experience, skills,
and certification content. The contact form is live: Zod-validated,
rate-limited (5 messages per visitor per 10 minutes), with visitor IPs
one-way hashed rather than stored raw, and emails a notification on every
message. A downloadable resume PDF is still pending (no file exported and
uploaded yet).

Ahead of schedule, the interactive lab (Phase 4) is also built: an
F1-pipeline explorer and a mocked Swiggy assistant simulator, both running
entirely on static/scripted content with no live database or AI-provider
dependency at all. Both stay hidden behind a feature flag until I review
the content myself and turn them on. Every page also now has its own real
search-engine title and description (previously every page silently shared
one), plus a sitemap, robots file, and structured data for the homepage
(Phase 6, started early).

**The site is deployed and live** at `johar-portfolio.vercel.app` (Phase 7's
Vercel setup). A routine dependency audit also caught and fixed a critical
security vulnerability in a pinned framework version, and an automated
accessibility check (WCAG 2.2 AA) found and fixed a real sitewide
color-contrast issue — both closed the same day they were found. Next up:
Phase 3, the admin panel and AI-assisted project import workflow, the
largest remaining phase, now unblocked with LLM provider keys in place.

**Current blocker (infrastructure, not code):** the project's Supabase
database has become unreachable (its hostname no longer resolves),
almost certainly because the free-tier project auto-paused after a
period of inactivity. Every database-backed page is affected until this
is restored from the Supabase dashboard — this is outside the codebase
and needs to be resolved before the public site (or any further live
verification) is fully functional again. The AI assistant and admin
system come in later phases and are separately blocked on LLM provider
API keys not yet created.

## 7. Roadmap

| Phase | Focus                                                            |
| ----- | ---------------------------------------------------------------- |
| 2     | Database-backed content, real project case studies, public pages |
| 3     | Private admin panel with AI-assisted content import and review   |
| 4     | Interactive AI/ML lab demos                                      |
| 5     | The citation-grounded chat assistant                             |
| 6     | SEO, performance, and polish                                     |
| 7     | QA and deployment                                                |
