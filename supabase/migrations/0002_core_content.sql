-- Core content schema: profile, projects, and the technology tags shown on
-- project cards. See docs/architecture.md for the full schema summary and
-- docs/CONTENT_FACTS.md for the actual facts this schema will hold.

-- Shared types, used by every translatable table below.
create type locale_code as enum ('en', 'de');
create type review_status_type as enum ('draft', 'machine_assisted', 'reviewed');

-- Shared trigger: keep `updated_at` current on every row update, on every
-- table that has one. Defined once, reused everywhere — genuinely
-- duplicated logic otherwise.
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Profile (singleton — one row) ───────────────────────────────────────

create table profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  primary_title text not null,
  supporting_descriptor text,
  location text,
  public_email text,
  github_url text,
  linkedin_url text,
  -- Storage paths, not public URLs — resolved through Supabase Storage at
  -- read time. Null avatar = show the JR monogram placeholder; null resume
  -- = the resume page shows a disabled "coming soon" state.
  avatar_storage_path text,
  resume_storage_path text,
  msc_program text,
  msc_university text,
  msc_start_date date,
  msc_end_date date,
  msc_specialization text,
  beng_program text,
  beng_university text,
  beng_start_date date,
  beng_end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create table profile_translations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  locale locale_code not null,
  hero_headline text,
  hero_subheadline text,
  about_text text,
  availability_line text,
  review_status review_status_type not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, locale)
);

create trigger profile_translations_set_updated_at
  before update on profile_translations
  for each row execute function set_updated_at();

-- ── Site settings (singleton — one row) ─────────────────────────────────

create table site_settings (
  id uuid primary key default gen_random_uuid(),
  f1_explorer_enabled boolean not null default false,
  swiggy_simulator_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

-- ── Projects ─────────────────────────────────────────────────────────────

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null check (
    status in ('idea', 'in_progress', 'mvp_poc', 'completed', 'deployed', 'archived', 'coming_soon')
  ),
  project_type text check (
    project_type in ('personal', 'university', 'team', 'work', 'hackathon')
  ),
  team_size integer,
  role text,
  start_date date,
  last_updated_at date,
  -- Lower number = higher priority on the homepage. Null = not featured.
  homepage_priority integer,
  safety_label text,
  github_url text,
  demo_url text,
  is_repo_public boolean not null default true,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

create index projects_homepage_priority_idx on projects (homepage_priority) where published;

create table project_translations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  one_liner text,
  recruiter_summary text,
  review_status review_status_type not null default 'draft',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, locale)
);

create trigger project_translations_set_updated_at
  before update on project_translations
  for each row execute function set_updated_at();

-- One row per case-study section, in the spec's fixed 12-part order
-- (executive summary through links/resources). Content lives in the
-- translation table below so English and German can be reviewed/published
-- independently per section.
create table project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  section_key text not null check (
    section_key in (
      'executive_summary',
      'problem_users_constraints',
      'role_contribution',
      'architecture',
      'data_retrieval_model',
      'evaluation_results',
      'engineering_decisions',
      'failures_lessons',
      'deployment_testing_security',
      'limitations_responsible_use',
      'future_improvements',
      'links_resources'
    )
  ),
  section_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, section_key)
);

create trigger project_sections_set_updated_at
  before update on project_sections
  for each row execute function set_updated_at();

create table project_section_translations (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references project_sections(id) on delete cascade,
  locale locale_code not null,
  heading text,
  body_markdown text,
  review_status review_status_type not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, locale)
);

create trigger project_section_translations_set_updated_at
  before update on project_section_translations
  for each row execute function set_updated_at();

-- Metrics are locale-independent (numbers don't translate), but every one
-- carries a `verified` flag — this is how a claim like the skin-lesion 90%
-- accuracy gets stored without being displayed until confirmed.
create table project_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  metric_key text not null,
  value_text text not null,
  verified boolean not null default false,
  verification_note text,
  display_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger project_metrics_set_updated_at
  before update on project_metrics
  for each row execute function set_updated_at();

create table project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'diagram', 'screenshot')),
  alt_text text,
  display_order integer,
  created_at timestamptz not null default now()
);

-- ── Technology tags (the 3-5 badges shown on each project card) ─────────

create table technologies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (
    category in (
      'applied_ai',
      'machine_learning',
      'deep_learning',
      'data_engineering',
      'production_engineering',
      'platforms_tools'
    )
  ),
  created_at timestamptz not null default now()
);

create table technology_translations (
  id uuid primary key default gen_random_uuid(),
  technology_id uuid not null references technologies(id) on delete cascade,
  locale locale_code not null,
  name text not null,
  unique (technology_id, locale)
);

create table project_technologies (
  project_id uuid not null references projects(id) on delete cascade,
  technology_id uuid not null references technologies(id) on delete cascade,
  usage_label text not null check (
    usage_label in ('used_in_project', 'currently_developing', 'exploring')
  ),
  primary key (project_id, technology_id)
);
