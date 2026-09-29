-- Phase 3 (admin app + AI-assisted project import) schema. See
-- docs/architecture.md's "AI project-import workflow" and "Deterministic
-- change detection" summaries for the shape this implements, and
-- docs/DECISIONS.md for the concrete design choices made turning that
-- summary into actual DDL (several genuinely required judgment calls, not
-- fully pinned down by the summary alone).
--
-- Unlike 0002/0003 (schema) + 0004 (RLS) being split across separate
-- migrations, every table below enables RLS and gets its policy in the
-- same statement block it's created in. That split was fine in Phase 2,
-- applied together in one sitting before anything was live; splitting it
-- again now, with the site already deployed and public, would leave these
-- tables briefly exposed with no access control at all if the two
-- migrations were ever applied out of step. Every table here is entirely
-- admin-only — none of this is ever public, indexed, or partially
-- readable.

-- ── Source documents ────────────────────────────────────────────────────
-- An uploaded PDF/DOCX/MD file. `project_id` is not null: uploading a
-- document for a brand-new project means creating a minimal placeholder
-- project first (slug only, unpublished — the same shape `admin:create`-
-- style flows already use elsewhere in this admin), not a nullable FK
-- threaded through every table below it. Keeps every downstream table's
-- project_id a plain required reference instead of an optional one.

create table project_source_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null check (
    mime_type in (
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
      'text/plain'
    )
  ),
  content_hash text not null,
  parsing_status text not null default 'pending' check (
    parsing_status in ('pending', 'parsed', 'failed')
  ),
  parsing_error text,
  uploaded_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

alter table project_source_documents enable row level security;

create policy "admin can manage source documents" on project_source_documents
  for all to authenticated using (is_admin())
  with check (is_admin());

-- ── Import jobs ──────────────────────────────────────────────────────────
-- One run of the extraction pipeline against one source document.
-- `baseline_revision_id` is only set for `update_compare` jobs (an
-- `initial_import` job has nothing to compare against yet); the FK to
-- `project_document_revisions` is added after that table exists below,
-- since the two tables reference each other (a job can point at the
-- revision it's comparing against, and a revision records which job
-- produced it) and Postgres can't forward-reference a table that doesn't
-- exist yet in a single `create table`.

create table project_import_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  source_document_id uuid not null references project_source_documents(id) on delete cascade,
  job_type text not null check (job_type in ('initial_import', 'update_compare')),
  status text not null default 'pending' check (
    status in ('pending', 'running', 'completed', 'failed')
  ),
  provider text not null,
  model text not null,
  schema_version text not null,
  prompt_version text not null,
  baseline_revision_id uuid,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table project_import_jobs enable row level security;

create policy "admin can manage import jobs" on project_import_jobs
  for all to authenticated using (is_admin())
  with check (is_admin());

-- ── Document revisions ──────────────────────────────────────────────────
-- A checkpoint recorded when an import job's reviewed output actually
-- gets published: a full snapshot of the project's approved field values
-- at that point, so a previous published revision stays recoverable (a
-- launch-checklist requirement) and so a later `update_compare` job has a
-- concrete baseline to diff against, not just "whatever's live right now."

create table project_document_revisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  source_document_id uuid not null references project_source_documents(id) on delete cascade,
  import_job_id uuid not null references project_import_jobs(id) on delete cascade,
  revision_number integer not null,
  snapshot jsonb not null,
  approved_by uuid not null references auth.users (id),
  approved_at timestamptz not null default now(),
  unique (project_id, revision_number)
);

alter table project_document_revisions enable row level security;

create policy "admin can manage document revisions" on project_document_revisions
  for all to authenticated using (is_admin())
  with check (is_admin());

alter table project_import_jobs
add constraint project_import_jobs_baseline_revision_id_fkey foreign key (baseline_revision_id) references project_document_revisions (id);

-- ── Extracted facts ──────────────────────────────────────────────────────
-- One row per field the extraction pipeline pulled out of a document.
-- `field_path` is a stable dotted path (e.g. "results.metrics.roc_auc"),
-- not a column name, since the set of fields varies by project and layer.
-- `confidence_state` and `supporting_snippet` are what let the review UI
-- show *why* the model claims something, not just the claim itself — the
-- whole point of never letting extracted content become public without a
-- human actually reading the evidence behind it.

create table project_extracted_facts (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references project_import_jobs(id) on delete cascade,
  field_path text not null,
  value jsonb not null,
  confidence_state text not null check (
    confidence_state in ('source_backed', 'inferred', 'ambiguous', 'missing')
  ),
  source_location text,
  supporting_snippet text,
  review_state text not null default 'pending' check (
    review_state in ('pending', 'accepted', 'rejected', 'edited')
  ),
  reviewed_value jsonb,
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (import_job_id, field_path)
);

alter table project_extracted_facts enable row level security;

create policy "admin can manage extracted facts" on project_extracted_facts
  for all to authenticated using (is_admin())
  with check (is_admin());

-- ── Content drafts ───────────────────────────────────────────────────────
-- The actual drafted copy for one locale/layer, built from accepted
-- extracted facts (or a manual edit — `import_job_id` is nullable because
-- not every draft originates from an import). Versioned so an edit never
-- silently overwrites a prior draft; the previous version's status moves
-- to `superseded` rather than being deleted.

create table project_content_drafts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  import_job_id uuid references project_import_jobs(id) on delete set null,
  locale locale_code not null,
  layer text not null check (layer in ('card', 'quick_view', 'case_study')),
  content jsonb not null,
  status text not null default 'generated' check (
    status in ('generated', 'edited', 'approved', 'rejected', 'superseded')
  ),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger project_content_drafts_set_updated_at before
update on project_content_drafts for each row
execute function set_updated_at();

alter table project_content_drafts enable row level security;

create policy "admin can manage content drafts" on project_content_drafts
  for all to authenticated using (is_admin())
  with check (is_admin());

-- ── Provenance ───────────────────────────────────────────────────────────
-- Links a published field back to exactly where it came from — an
-- extracted fact (and the document behind it) or a manual edit. Purely an
-- internal audit trail: never read by any public page, never indexed into
-- the RAG assistant's knowledge base.

create table project_content_provenance (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  field_path text not null,
  source text not null check (source in ('ai_extracted', 'manual_edit')),
  source_document_id uuid references project_source_documents(id) on delete set null,
  extracted_fact_id uuid references project_extracted_facts(id) on delete set null,
  edited_by uuid references auth.users (id),
  recorded_at timestamptz not null default now()
);

alter table project_content_provenance enable row level security;

create policy "admin can manage content provenance" on project_content_provenance
  for all to authenticated using (is_admin())
  with check (is_admin());

-- ── Deterministic change detection ──────────────────────────────────────
-- One comparison run (an `update_compare` job diffing a freshly parsed
-- document's facts against `baseline_revision_id`'s snapshot) plus its
-- field-level line items. Deliberately deterministic: the diff itself is
-- computed from normalized structured data, never decided by an LLM (see
-- docs/DECISIONS.md's RAG & AI-import safety rules).

create table project_change_sets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  baseline_revision_id uuid not null references project_document_revisions(id),
  source_document_id uuid not null references project_source_documents(id),
  import_job_id uuid not null references project_import_jobs(id),
  new_count integer not null default 0,
  changed_count integer not null default 0,
  removed_count integer not null default 0,
  unchanged_count integer not null default 0,
  conflict_count integer not null default 0,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'in_review', 'completed')
  ),
  created_at timestamptz not null default now()
);

alter table project_change_sets enable row level security;

create policy "admin can manage change sets" on project_change_sets
  for all to authenticated using (is_admin())
  with check (is_admin());

create table project_change_items (
  id uuid primary key default gen_random_uuid(),
  change_set_id uuid not null references project_change_sets(id) on delete cascade,
  field_path text not null,
  change_type text not null check (
    change_type in ('new', 'changed', 'removed', 'unchanged', 'conflict')
  ),
  old_value jsonb,
  new_value jsonb,
  provenance text,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'accepted', 'rejected')
  ),
  affected_targets text[],
  created_at timestamptz not null default now()
);

alter table project_change_items enable row level security;

create policy "admin can manage change items" on project_change_items
  for all to authenticated using (is_admin())
  with check (is_admin());

-- ── Private storage for source documents ────────────────────────────────
-- A private (non-public) bucket for uploaded source documents — never a
-- public URL, never listed to anon/authenticated. Storage RLS mirrors the
-- table policies above: only a signed-in admin can read/write.

insert into
  storage.buckets (id, name, public)
values
  ('project-source-documents', 'project-source-documents', false);

create policy "admin can manage source document files" on storage.objects
  for all to authenticated using (
    bucket_id = 'project-source-documents'
    and is_admin()
  )
  with check (
    bucket_id = 'project-source-documents'
    and is_admin()
  );
