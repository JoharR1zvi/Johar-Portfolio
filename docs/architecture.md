# Architecture

Companion to `DECISIONS.md` (why) and `IMPLEMENTATION_STATUS.md` (progress).
This file captures the how: system shape, file tree, database design, and
the RAG pipeline. Update it when architecture materially changes.

## System overview

A Next.js App Router application (TypeScript strict) serving a bilingual
(EN/DE) public portfolio, a single-admin CMS, and a citation-grounded RAG
assistant, backed by Supabase (Postgres + Auth + Storage + pgvector). No
separate backend service — Next.js route handlers cover the API surface.
Content flows one way for trust: admin authors/approves → publish →
revalidate → selectively re-index into `content_chunks` → public pages and
the RAG assistant read only published, approved data.

## File / folder tree (target shape after Phase 1 scaffolding)

```
src/app/[locale]/
  page.tsx                        homepage
  projects/page.tsx                projects index
  projects/[slug]/page.tsx         project case study
  lab/page.tsx                     interactive AI/ML lab
  lab/swiggy-simulator/page.tsx
  lab/f1-explorer/page.tsx         feature-flagged
  notes/page.tsx                   technical notes
  notes/[slug]/page.tsx
  resume/page.tsx
  privacy/page.tsx
src/app/admin/
  login/page.tsx
  page.tsx                         dashboard
  projects/page.tsx                projects/page.tsx, [id]/page.tsx (CRUD + translations)
  projects/[id]/import/page.tsx    AI-assisted project import wizard
  projects/[id]/update/page.tsx    AI-assisted update/compare wizard
  media/page.tsx
  settings/page.tsx
  evaluations/page.tsx             RAG eval dashboard
  feedback/page.tsx                contact + chat feedback
src/app/api/
  chat/route.ts                    streaming RAG assistant
  github/route.ts                  cached approved repo metadata
  contact/route.ts                 validated contact form
  admin/reindex/route.ts
  admin/evaluations/route.ts
  admin/import/route.ts
  admin/update-compare/route.ts
src/components/{ui,layout,projects,chat,lab,admin}/
src/lib/
  db/                              Supabase server/browser clients
  auth/                            admin session + route guards
  ai/
    provider.ts                    provider-neutral LLM client (Gemini primary, Groq fallback)
    embeddings.ts                  gemini-embedding-001 wrapper
    extraction/                    Zod schemas + versioned prompts for project import
    diff/                          deterministic change-detection engine
  rag/
    chunking.ts                    semantic, section-based chunking
    retrieval.ts                   hybrid vector + FTS + reciprocal-rank fusion
    indexing.ts                    content hashing, selective re-embed, publish hooks
  validation/                      Zod schemas: forms, chat input, extraction payloads
  i18n/
  utils/
src/proxy.ts                        locale routing + admin route guard (Next.js 16 renamed "middleware" to "proxy")
supabase/migrations/
  0001_extensions.sql
  0002_core_content.sql
  0003_skills_timeline_certifications.sql
  0004_ai_import_workflow.sql
  0005_change_detection.sql
  0006_rag.sql
  0007_rls_policies.sql
supabase/seed.sql
docs/{architecture.md, GITHUB_PROFILE_README_DRAFT.md, project-documentation-template.md, rag-eval-seed.json}
e2e/                               Playwright flows
messages/{en,de}.json
scripts/workflows/{project-import, project-update, rag-reindex}
```

`JoharInfo/` (real source documents) stays at the repo root, git-ignored.
Nothing in `src/` reads it directly — it only enters the system later
through the admin's private-storage upload path (Phase 3).

## Database schema summary

Convention: every localizable entity is a base table plus a `_translations`
table, each translation row carrying its own `locale` and `review_status`
(`draft | machine_assisted | reviewed`) so English and German publish
independently. UUID primary keys, `created_at`/`updated_at`, RLS enabled on
every table.

**Core content**: `profiles`, `site_settings`, `projects` (+ `project_translations`),
`project_sections` (+ `_translations`, one row per case-study section),
`project_metrics` (with a `verified` boolean — how the skin-lesion 90% figure
is stored but gated from public display), `project_media`, `technologies`
(+ `_translations`), `project_technologies` (join, with a `usage_label`:
`used_in_project | currently_developing | exploring`), `skills`
(+ `_translations`), `skill_project_evidence` (every skill must cite a
project), `timeline_items` / `certifications` (+ `_translations`), `posts`
(+ `_translations`), `contact_submissions` (public insert-only),
`chat_feedback` (public insert-only, optional/consented).

**RAG core**: `content_chunks` — `project_id` (nullable), `section_ref`,
`locale`, `source_type`, `content_text`, `embedding vector(1536)`, a
generated `tsvector` column, `content_hash`, `is_active`, `visibility`.
Public RLS only selects `visibility = 'public' AND is_active = true`.
Chunking is one row per case-study section (semantic), not fixed character
counts. On publish: hash the section text; unchanged → skip re-embedding;
changed → insert the new embedding and flip the prior row's `is_active` to
`false` (never two active versions of the same section — this is what
prevents stale answers after an update). Plus `rag_eval_cases`,
`rag_eval_runs`, `rag_eval_results`.

**AI project-import workflow**: `project_source_documents` (private storage
path, MIME, filename, content hash, parsing status), `project_import_jobs`
(`job_type`: `initial_import | update_compare`, status, provider/model,
schema/prompt version, `baseline_project_revision_id`),
`project_extracted_facts` (`field_path`, jsonb value, `confidence_state`:
`source_backed | inferred | ambiguous | missing`, source location,
supporting snippet, review state), `project_content_drafts` (versioned per
locale/layer — card/quick_view/case_study — status:
`generated | edited | approved | rejected | superseded`),
`project_content_provenance` (admin-only, links published fields to source
doc/manual edit, never public, never indexed), `project_document_revisions`.

**Deterministic change detection**: `project_change_sets` (one comparison
run: baseline revision, source revision, counts of new/changed/removed/
unchanged/conflict, review status), `project_change_items` (field-level:
stable `field_path` like `project.results.metrics.roc_auc`, `change_type`,
old/new value as jsonb, provenance, review status, affected targets).

**RLS approach**: public (`anon`) role gets narrow `SELECT` on
`published = true` (and, for translations, `review_status = 'reviewed'`)
rows only. `contact_submissions`/`chat_feedback` are insert-only for public,
no public select. Every admin-only table has no public policy at all —
access requires `auth.uid()` to match the row in a tiny `admin_users` table
via an `is_admin()` helper. The Supabase secret key (`sb_secret_...` — the
current key format, replacing the legacy `service_role` JWT; see
`DECISIONS.md`) is used only from trusted server code (the publish →
reindex step), never from any client component and never for routine
admin CRUD.

## RAG pipeline

**Ingestion**: index only published + approved content — project summaries,
case-study sections, skills evidence, public work experience, education,
technical notes, selected resume content. Never index admin instructions,
private drafts, old-CV sensitive fields, API keys, addresses, phone numbers,
or visitor messages. Chunk semantically by project section. Re-embed only
when a content hash changes.

**Retrieval**: normalize/validate the question with Zod, detect the active
locale, search same-locale content first via hybrid semantic vector search +
Postgres full-text search merged with reciprocal-rank fusion. If same-locale
evidence is insufficient, search the other locale and answer in the user's
language while labeling the source language. Apply project/status filters
where relevant. Retrieve a small, high-signal context set.

**Generation**: answer only from retrieved published evidence, cite factual
claims about Johar, say explicitly when evidence is insufficient, never
infer protected/private attributes, never invent skill levels, metrics,
availability, visa status, graduation date, or completion status. Medical
project questions always state academic-prototype status. Swiggy questions
distinguish POC/MVP from production-readiness. F1 questions flag in-progress
status and avoid unstable claims.

**Security/cost controls**: server-only provider keys, IP-hash-based rate
limiting with a daily anonymous quota, max message/conversation lengths, no
arbitrary URL fetching/file upload/tool execution/DB writes/commerce actions
from chat, prompt-injection-resistant instruction hierarchy with delimited
retrieved content, timeouts/abort/provider fallback (Gemini → Groq). No
full visitor conversation persistence by default — only optional consented
feedback or short anonymized telemetry.

**LLM/embedding providers** (see `DECISIONS.md` for full rationale): Google
Gemini (current free-tier Flash model) primary for generation via
`@ai-sdk/google`, Groq (Qwen3/DeepSeek) fallback; `gemini-embedding-001`
truncated to 1536 dimensions for embeddings. Both selected through
provider-neutral modules (`lib/ai/provider.ts`, `lib/ai/embeddings.ts`) so
the underlying model can change without touching call sites.

## Project instructions outline (authored at the start of Phase 1)

1. Project overview
2. Tech stack (pointer to `package.json` for exact versions)
3. Repository map
4. Condensed engineering principles (simplicity, modularity, no premature
   abstraction, explicit over magic, strict TypeScript, validate at
   boundaries, graceful errors, accessibility-first, performance budget,
   security defaults)
5. Non-negotiable content rules (source precedence, privacy exclusions,
   locked positioning/status truths — pointer to `CONTENT_FACTS.md`)
6. Bilingual rules (EN source language, DE requires `reviewed` status,
   never imply fluency)
7. RAG & AI-import safety rules (index only published/approved content,
   schema-validate all LLM output, human review before publish,
   deterministic change detection)
8. Database & migration conventions
9. Commands (quality gates, below)
10. Pointers to `DECISIONS.md`, `IMPLEMENTATION_STATUS.md`,
    `CONTENT_FACTS.md`, `scripts/workflows/`
11. Explicit non-goals (no project health/readiness score, no interview
    coach, no live Swiggy calls from the public site, no frozen F1 metrics,
    no ORM/microservices/Kubernetes/LangChain/second vector DB without a
    real need)

## Quality-gate commands

```
npm run format:check   prettier --check .
npm run format         prettier --write .
npm run lint           eslint .
npm run typecheck      tsc --noEmit
npm run test           vitest run
npm run test:e2e       playwright test
npm run build          next build
npm run verify         format:check && lint && typecheck && test && build
npm run db:migrate     supabase db push
npm run db:types       supabase gen types typescript --local > src/types/supabase.ts
npm run db:seed        tsx supabase/seed.ts
```

`npm run verify` is the exit gate run after every implementation phase.
CI (`.github/workflows/ci.yml`) runs, in order: `npm ci` → `format:check` →
`lint` → `typecheck` → `test` → `build` → selected `test:e2e` flows.

## Phases

See `IMPLEMENTATION_STATUS.md` for live status. Phase order and gating
follow the master prompt section 24 exactly: 0 Audit/Plan → 1
Foundation/Visual System → 2 Content Model/Public Portfolio → 3 Admin +
AI Project Import (highest complexity) → 4 Interactive Lab → 5 RAG Backend
→ 6 GitHub/SEO/Performance/Polish → 7 QA/Deployment. Each phase's exit gate
is a clean `npm run verify`, or every known exception documented in
`IMPLEMENTATION_STATUS.md`.
