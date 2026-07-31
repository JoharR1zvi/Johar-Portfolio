-- Skills evidence map, journey timeline, certifications, technical notes,
-- and the visitor-submitted tables (contact form, chat feedback, rate
-- limiting), plus the admin-user marker table RLS policies will reference.

-- ── Skills (homepage capability map — grouped, evidence-linked) ─────────
-- Distinct from `technologies`: a skill can have multiple evidence
-- projects and drives the grouped capability map (Applied AI, ML, DL,
-- Data Engineering, Production Engineering, Platforms/Tools), not the
-- compact per-card tag list.

create table skills (
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
  display_order integer,
  created_at timestamptz not null default now()
);

create table skill_translations (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references skills(id) on delete cascade,
  locale locale_code not null,
  name text not null,
  unique (skill_id, locale)
);

-- A skill without at least one evidence row should never be displayed —
-- enforced at the application layer, not by a DB constraint, since the
-- evidence is added after the skill itself.
create table skill_project_evidence (
  skill_id uuid not null references skills(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  usage_label text not null check (
    usage_label in ('used_in_project', 'currently_developing', 'exploring')
  ),
  primary key (skill_id, project_id)
);

-- ── Journey timeline ─────────────────────────────────────────────────────

create table timeline_items (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (
    item_type in ('education', 'employment', 'internship', 'milestone')
  ),
  organization text,
  start_date date,
  end_date date,
  display_order integer,
  created_at timestamptz not null default now()
);

create table timeline_translations (
  id uuid primary key default gen_random_uuid(),
  timeline_item_id uuid not null references timeline_items(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  description text,
  review_status review_status_type not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (timeline_item_id, locale)
);

create trigger timeline_translations_set_updated_at
  before update on timeline_translations
  for each row execute function set_updated_at();

create table certifications (
  id uuid primary key default gen_random_uuid(),
  issuer text,
  issue_date date,
  -- Low-priority certs (e.g. the bootcamp certificate) render de-emphasized.
  priority text not null default 'normal' check (priority in ('low', 'normal')),
  created_at timestamptz not null default now()
);

create table certification_translations (
  id uuid primary key default gen_random_uuid(),
  certification_id uuid not null references certifications(id) on delete cascade,
  locale locale_code not null,
  name text not null,
  unique (certification_id, locale)
);

-- ── Technical notes ──────────────────────────────────────────────────────

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

create table post_translations (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  locale locale_code not null,
  title text not null,
  body_markdown text,
  review_status review_status_type not null default 'draft',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (post_id, locale)
);

create trigger post_translations_set_updated_at
  before update on post_translations
  for each row execute function set_updated_at();

-- ── Visitor-submitted data ───────────────────────────────────────────────
-- Insert-only from the public's perspective (see RLS policies migration).
-- No visitor conversation content is stored here by default — only
-- optional consented feedback and contact-form submissions.

create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table chat_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id text,
  rating text check (rating in ('up', 'down')),
  comment text,
  ip_hash text,
  created_at timestamptz not null default now()
);

-- Generic counter table backing Postgres-based rate limiting for public
-- endpoints (see DECISIONS.md for why this instead of Redis/Upstash).
create table rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  endpoint text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_events_lookup_idx on rate_limit_events (ip_hash, endpoint, created_at);

-- ── Admin marker ─────────────────────────────────────────────────────────
-- Maps a Supabase Auth user to "is the site admin." Referenced by the
-- is_admin() helper in the RLS policies migration. Populated manually
-- once the admin's Supabase Auth account exists (Phase 3) — empty for now.

create table admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
