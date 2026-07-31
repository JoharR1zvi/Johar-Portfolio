# Portfolio Website

Bilingual (English/German) portfolio: project case studies, an interactive
AI lab, a citation-grounded RAG assistant, and a protected admin CMS with an
AI-assisted project-document import workflow.

Start with `docs/DECISIONS.md` (locked decisions and rationale) and
`docs/architecture.md` (file tree, database schema, RAG pipeline). Also see
`docs/IMPLEMENTATION_STATUS.md` (live phase tracker), `docs/CONTENT_FACTS.md`
(factual source of truth for portfolio content), and
`docs/LAUNCH_CHECKLIST.md`. Three more documents are maintained alongside
the code as the project grows: `docs/PROJECT_NOTES.md` (technical narrative
of how it works), `docs/LEARNING_JOURNAL.md` (the same material explained
simply), and `docs/PROJECT_REPORT.md` (a recruiter-facing summary).

## Status

Phase 1 (foundation and visual system) is complete — see
`docs/IMPLEMENTATION_STATUS.md` for the live phase-by-phase tracker. There is
no backend yet: no Supabase project, no database, no AI provider wired up.
The site currently renders placeholder pages for every route in both
locales, with working theme (light/dark/system) and language (EN/DE)
switching.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to the default locale (`/en`).

Supabase setup, environment variables, and migrations will be documented
here once Phase 2 introduces the database (see `docs/IMPLEMENTATION_STATUS.md`
for what's blocked and why).

## Commands

```bash
npm run dev            # local dev server
npm run format          # prettier --write .
npm run format:check    # prettier --check .
npm run lint            # eslint .
npm run typecheck       # tsc --noEmit
npm run test            # vitest run
npm run test:watch      # vitest (watch mode)
npm run test:e2e        # playwright test (requires: npx playwright install chromium)
npm run build           # next build
npm run verify          # format:check && lint && typecheck && test && build
```

`npm run verify` is the quality gate run after every implementation phase —
see `docs/DECISIONS.md` for the one current accepted exception if it's ever
not clean.

## Testing

- Unit/component tests: Vitest + React Testing Library, in `tests/`.
- End-to-end tests: Playwright, in `e2e/`. Run `npx playwright install chromium`
  once before the first `npm run test:e2e`.

## Troubleshooting

- **`npm audit` shows high-severity findings**: expected — see the "Known
  exception" entry in `docs/DECISIONS.md`. `postcss` and `sharp` are patched
  via `package.json` `overrides`; the remaining findings are confined to
  `eslint`'s own dependency chain (devDependency only, not shipped) and are
  blocked on `eslint-config-next` supporting ESLint 10.
- **Playwright can't find a browser**: run `npx playwright install chromium`.
