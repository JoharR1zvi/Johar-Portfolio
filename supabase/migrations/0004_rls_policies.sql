-- Row-level security for every table created so far. Default-deny: RLS is
-- enabled on every table, and only the policies below grant access. Public
-- (anon + authenticated, since the only authenticated user in this app is
-- the admin) gets narrow SELECT on published + reviewed content. Writes
-- require is_admin(). Tables with no policy at all (rate_limit_events,
-- admin_users) are fully inaccessible to anon/authenticated by design —
-- only server code using the secret key (which bypasses RLS) touches them.

create function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

-- ── profiles / profile_translations ─────────────────────────────────────

alter table profiles enable row level security;

create policy "public can read the profile" on profiles
  for select to anon, authenticated using (true);

create policy "admin can manage the profile" on profiles
  for all to authenticated using (is_admin()) with check (is_admin());

alter table profile_translations enable row level security;

create policy "public can read reviewed profile translations" on profile_translations
  for select to anon, authenticated using (review_status = 'reviewed');

create policy "admin can manage profile translations" on profile_translations
  for all to authenticated using (is_admin()) with check (is_admin());

-- ── site_settings ────────────────────────────────────────────────────────

alter table site_settings enable row level security;

create policy "public can read site settings" on site_settings
  for select to anon, authenticated using (true);

create policy "admin can manage site settings" on site_settings
  for all to authenticated using (is_admin()) with check (is_admin());

-- ── projects / translations / sections / metrics / media ────────────────

alter table projects enable row level security;

create policy "public can read published projects" on projects
  for select to anon, authenticated using (published);

create policy "admin can manage projects" on projects
  for all to authenticated using (is_admin()) with check (is_admin());

alter table project_translations enable row level security;

create policy "public can read reviewed published project translations" on project_translations
  for select to anon, authenticated using (
    published
    and review_status = 'reviewed'
    and exists (select 1 from projects where projects.id = project_translations.project_id and projects.published)
  );

create policy "admin can manage project translations" on project_translations
  for all to authenticated using (is_admin()) with check (is_admin());

alter table project_sections enable row level security;

create policy "public can read sections of published projects" on project_sections
  for select to anon, authenticated using (
    exists (select 1 from projects where projects.id = project_sections.project_id and projects.published)
  );

create policy "admin can manage project sections" on project_sections
  for all to authenticated using (is_admin()) with check (is_admin());

alter table project_section_translations enable row level security;

create policy "public can read reviewed section translations" on project_section_translations
  for select to anon, authenticated using (
    review_status = 'reviewed'
    and exists (
      select 1 from project_sections
      join projects on projects.id = project_sections.project_id
      where project_sections.id = project_section_translations.section_id and projects.published
    )
  );

create policy "admin can manage section translations" on project_section_translations
  for all to authenticated using (is_admin()) with check (is_admin());

alter table project_metrics enable row level security;

-- Only verified metrics are ever publicly visible — this is the DB-level
-- enforcement of "never let an unconfirmed claim look like a fact"
-- (e.g. the skin-lesion 90% accuracy figure, pending Johar's confirmation).
create policy "public can read verified metrics of published projects" on project_metrics
  for select to anon, authenticated using (
    verified
    and exists (select 1 from projects where projects.id = project_metrics.project_id and projects.published)
  );

create policy "admin can manage project metrics" on project_metrics
  for all to authenticated using (is_admin()) with check (is_admin());

alter table project_media enable row level security;

create policy "public can read media of published projects" on project_media
  for select to anon, authenticated using (
    exists (select 1 from projects where projects.id = project_media.project_id and projects.published)
  );

create policy "admin can manage project media" on project_media
  for all to authenticated using (is_admin()) with check (is_admin());

-- ── technologies ─────────────────────────────────────────────────────────

alter table technologies enable row level security;

create policy "public can read technologies" on technologies
  for select to anon, authenticated using (true);

create policy "admin can manage technologies" on technologies
  for all to authenticated using (is_admin()) with check (is_admin());

alter table technology_translations enable row level security;

create policy "public can read technology translations" on technology_translations
  for select to anon, authenticated using (true);

create policy "admin can manage technology translations" on technology_translations
  for all to authenticated using (is_admin()) with check (is_admin());

alter table project_technologies enable row level security;

create policy "public can read technologies of published projects" on project_technologies
  for select to anon, authenticated using (
    exists (select 1 from projects where projects.id = project_technologies.project_id and projects.published)
  );

create policy "admin can manage project technologies" on project_technologies
  for all to authenticated using (is_admin()) with check (is_admin());

-- ── skills ───────────────────────────────────────────────────────────────

alter table skills enable row level security;

create policy "public can read skills" on skills
  for select to anon, authenticated using (true);

create policy "admin can manage skills" on skills
  for all to authenticated using (is_admin()) with check (is_admin());

alter table skill_translations enable row level security;

create policy "public can read skill translations" on skill_translations
  for select to anon, authenticated using (true);

create policy "admin can manage skill translations" on skill_translations
  for all to authenticated using (is_admin()) with check (is_admin());

alter table skill_project_evidence enable row level security;

create policy "public can read skill evidence for published projects" on skill_project_evidence
  for select to anon, authenticated using (
    exists (select 1 from projects where projects.id = skill_project_evidence.project_id and projects.published)
  );

create policy "admin can manage skill evidence" on skill_project_evidence
  for all to authenticated using (is_admin()) with check (is_admin());

-- ── timeline / certifications ────────────────────────────────────────────

alter table timeline_items enable row level security;

create policy "public can read timeline items" on timeline_items
  for select to anon, authenticated using (true);

create policy "admin can manage timeline items" on timeline_items
  for all to authenticated using (is_admin()) with check (is_admin());

alter table timeline_translations enable row level security;

create policy "public can read reviewed timeline translations" on timeline_translations
  for select to anon, authenticated using (review_status = 'reviewed');

create policy "admin can manage timeline translations" on timeline_translations
  for all to authenticated using (is_admin()) with check (is_admin());

alter table certifications enable row level security;

create policy "public can read certifications" on certifications
  for select to anon, authenticated using (true);

create policy "admin can manage certifications" on certifications
  for all to authenticated using (is_admin()) with check (is_admin());

alter table certification_translations enable row level security;

create policy "public can read certification translations" on certification_translations
  for select to anon, authenticated using (true);

create policy "admin can manage certification translations" on certification_translations
  for all to authenticated using (is_admin()) with check (is_admin());

-- ── technical notes ──────────────────────────────────────────────────────

alter table posts enable row level security;

create policy "public can read published posts" on posts
  for select to anon, authenticated using (published);

create policy "admin can manage posts" on posts
  for all to authenticated using (is_admin()) with check (is_admin());

alter table post_translations enable row level security;

create policy "public can read reviewed published post translations" on post_translations
  for select to anon, authenticated using (
    published
    and review_status = 'reviewed'
    and exists (select 1 from posts where posts.id = post_translations.post_id and posts.published)
  );

create policy "admin can manage post translations" on post_translations
  for all to authenticated using (is_admin()) with check (is_admin());

-- ── visitor-submitted data ───────────────────────────────────────────────

alter table contact_submissions enable row level security;

create policy "public can submit contact messages" on contact_submissions
  for insert to anon, authenticated with check (true);

create policy "admin can read contact messages" on contact_submissions
  for select to authenticated using (is_admin());

alter table chat_feedback enable row level security;

create policy "public can submit chat feedback" on chat_feedback
  for insert to anon, authenticated with check (true);

create policy "admin can read chat feedback" on chat_feedback
  for select to authenticated using (is_admin());

-- rate_limit_events and admin_users: RLS enabled, no policies at all —
-- fully inaccessible to anon/authenticated. Only server code using the
-- secret key (which bypasses RLS entirely) reads or writes these.
alter table rate_limit_events enable row level security;
alter table admin_users enable row level security;
