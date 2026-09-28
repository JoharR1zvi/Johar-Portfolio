// Development/initial-content seed script. Wipes and re-inserts every
// top-level table (child rows cascade-delete automatically) and rebuilds
// everything from the data/ files below. This is meant to establish the
// baseline dataset from docs/CONTENT_FACTS.md, not as an ongoing content
// sync tool: once the Phase 3 admin panel exists, content is managed
// there, not by re-running this script.
//
// Content was drafted, reviewed by Johar, and approved for publication
// (2026-08-01), so translations and sections are inserted with
// review_status='reviewed' and published=true. Any future content added
// here that hasn't been reviewed yet should use review_status='draft' and
// published=false instead, exactly as this content did before Johar's
// approval.
//
// Run with: npm run db:seed

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { certifications } from './data/certifications';
import { profile, profileTranslationEn } from './data/profile';
import { skills } from './data/skills';
import { technologies } from './data/technologies';
import { timelineItems } from './data/timeline';
import { peCdss } from './data/projects/pe-cdss';
import { swiggy } from './data/projects/swiggy';
import { f1Predictor } from './data/projects/f1-predictor';
import { skinLesion } from './data/projects/skin-lesion';
import { goaLegislativeRag } from './data/projects/goa-legislative-rag';
import type { ProjectSeed } from './types';
import type { Database } from '../../src/types/supabase';

const projects: ProjectSeed[] = [peCdss, swiggy, f1Predictor, skinLesion, goaLegislativeRag];

function loadEnvLocal() {
  const raw = readFileSync(new URL('../../.env.local', import.meta.url), 'utf8');
  for (const line of raw.split('\n')) {
    if (!line.includes('=') || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (value) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local');
  }

  const db = createClient<Database>(url, secretKey, { auth: { persistSession: false } });

  console.log('Wiping existing content (children cascade)...');
  for (const table of [
    'projects',
    'profiles',
    'technologies',
    'skills',
    'timeline_items',
    'certifications',
    'site_settings',
  ] as const) {
    const { error } = await db.from(table).delete().not('id', 'is', null);
    if (error) throw new Error(`Failed clearing ${table}: ${error.message}`);
  }

  console.log('Seeding profile...');
  const { data: profileRow, error: profileErr } = await db
    .from('profiles')
    .insert({
      full_name: profile.fullName,
      primary_title: profile.primaryTitle,
      supporting_descriptor: profile.supportingDescriptor,
      location: profile.location,
      public_email: profile.publicEmail,
      github_url: profile.githubUrl,
      linkedin_url: profile.linkedinUrl,
      msc_program: profile.mscProgram,
      msc_university: profile.mscUniversity,
      msc_start_date: profile.mscStartDate,
      msc_end_date: profile.mscEndDate,
      msc_specialization: profile.mscSpecialization,
      beng_program: profile.bengProgram,
      beng_university: profile.bengUniversity,
      beng_start_date: profile.bengStartDate,
      beng_end_date: profile.bengEndDate,
    })
    .select('id')
    .single();
  if (profileErr || !profileRow) throw new Error(`Failed seeding profile: ${profileErr?.message}`);

  const { error: profileTrErr } = await db.from('profile_translations').insert({
    profile_id: profileRow.id,
    locale: profileTranslationEn.locale,
    hero_headline: profileTranslationEn.heroHeadline,
    hero_subheadline: profileTranslationEn.heroSubheadline,
    about_text: profileTranslationEn.aboutText,
    availability_line: profileTranslationEn.availabilityLine,
    review_status: 'reviewed',
  });
  if (profileTrErr) throw new Error(`Failed seeding profile translation: ${profileTrErr.message}`);

  console.log('Seeding site settings...');
  const { error: settingsErr } = await db
    .from('site_settings')
    .insert({ f1_explorer_enabled: false, swiggy_simulator_enabled: false });
  if (settingsErr) throw new Error(`Failed seeding site settings: ${settingsErr.message}`);

  console.log('Seeding technologies...');
  const technologyIdBySlug = new Map<string, string>();
  for (const tech of technologies) {
    const { data, error } = await db
      .from('technologies')
      .insert({ slug: tech.slug, category: tech.category })
      .select('id')
      .single();
    if (error || !data)
      throw new Error(`Failed seeding technology ${tech.slug}: ${error?.message}`);
    technologyIdBySlug.set(tech.slug, data.id);

    const { error: trErr } = await db
      .from('technology_translations')
      .insert({ technology_id: data.id, locale: 'en', name: tech.name });
    if (trErr)
      throw new Error(`Failed seeding technology translation ${tech.slug}: ${trErr.message}`);
  }

  console.log('Seeding skills...');
  const skillIdBySlug = new Map<string, string>();
  for (const skill of skills) {
    const { data, error } = await db
      .from('skills')
      .insert({ slug: skill.slug, category: skill.category })
      .select('id')
      .single();
    if (error || !data) throw new Error(`Failed seeding skill ${skill.slug}: ${error?.message}`);
    skillIdBySlug.set(skill.slug, data.id);

    const { error: trErr } = await db
      .from('skill_translations')
      .insert({ skill_id: data.id, locale: 'en', name: skill.name });
    if (trErr) throw new Error(`Failed seeding skill translation ${skill.slug}: ${trErr.message}`);
  }

  console.log('Seeding projects...');
  const projectIdBySlug = new Map<string, string>();
  for (const project of projects) {
    const { data, error } = await db
      .from('projects')
      .insert({
        slug: project.slug,
        status: project.status,
        project_type: project.projectType,
        team_size: project.teamSize,
        role: project.role,
        homepage_priority: project.homepagePriority,
        safety_label: project.safetyLabel,
        github_url: project.githubUrl,
        demo_url: project.demoUrl,
        is_repo_public: project.isRepoPublic,
        published: project.published,
      })
      .select('id')
      .single();
    if (error || !data)
      throw new Error(`Failed seeding project ${project.slug}: ${error?.message}`);
    projectIdBySlug.set(project.slug, data.id);

    const { error: trErr } = await db.from('project_translations').insert({
      project_id: data.id,
      locale: 'en',
      title: project.title,
      one_liner: project.oneLiner,
      recruiter_summary: project.recruiterSummary,
      review_status: 'reviewed',
      published: true,
    });
    if (trErr)
      throw new Error(`Failed seeding project translation ${project.slug}: ${trErr.message}`);

    for (const [index, section] of project.sections.entries()) {
      const { data: sectionRow, error: sectionErr } = await db
        .from('project_sections')
        .insert({ project_id: data.id, section_key: section.key, section_order: index + 1 })
        .select('id')
        .single();
      if (sectionErr || !sectionRow) {
        throw new Error(
          `Failed seeding section ${section.key} for ${project.slug}: ${sectionErr?.message}`,
        );
      }

      const { error: sectionTrErr } = await db.from('project_section_translations').insert({
        section_id: sectionRow.id,
        locale: 'en',
        heading: section.heading,
        body_markdown: section.body,
        review_status: 'reviewed',
      });
      if (sectionTrErr) {
        throw new Error(
          `Failed seeding section translation ${section.key} for ${project.slug}: ${sectionTrErr.message}`,
        );
      }
    }

    for (const [index, metric] of project.metrics.entries()) {
      const { error: metricErr } = await db.from('project_metrics').insert({
        project_id: data.id,
        metric_key: metric.key,
        value_text: metric.valueText,
        verified: metric.verified,
        verification_note: metric.verificationNote ?? null,
        display_order: index + 1,
      });
      if (metricErr)
        throw new Error(
          `Failed seeding metric ${metric.key} for ${project.slug}: ${metricErr.message}`,
        );
    }
  }

  console.log('Linking project technologies...');
  for (const project of projects) {
    const projectId = projectIdBySlug.get(project.slug)!;
    for (const tech of project.technologies) {
      const technologyId = technologyIdBySlug.get(tech.slug);
      if (!technologyId)
        throw new Error(`Unknown technology slug "${tech.slug}" on project ${project.slug}`);
      const { error } = await db
        .from('project_technologies')
        .insert({ project_id: projectId, technology_id: technologyId, usage_label: tech.usage });
      if (error)
        throw new Error(
          `Failed linking technology ${tech.slug} to ${project.slug}: ${error.message}`,
        );
    }
  }

  console.log('Linking skill evidence...');
  for (const skill of skills) {
    const skillId = skillIdBySlug.get(skill.slug)!;
    for (const evidence of skill.evidence) {
      const projectId = projectIdBySlug.get(evidence.projectSlug);
      if (!projectId) {
        throw new Error(
          `Unknown project slug "${evidence.projectSlug}" in evidence for skill ${skill.slug}`,
        );
      }
      const { error } = await db
        .from('skill_project_evidence')
        .insert({ skill_id: skillId, project_id: projectId, usage_label: evidence.usage });
      if (error)
        throw new Error(
          `Failed linking skill ${skill.slug} to ${evidence.projectSlug}: ${error.message}`,
        );
    }
  }

  console.log('Seeding timeline...');
  for (const item of timelineItems) {
    const { data, error } = await db
      .from('timeline_items')
      .insert({
        item_type: item.itemType,
        organization: item.organization,
        start_date: item.startDate,
        end_date: item.endDate,
        display_order: item.displayOrder,
      })
      .select('id')
      .single();
    if (error || !data)
      throw new Error(`Failed seeding timeline item ${item.title}: ${error?.message}`);

    const { error: trErr } = await db.from('timeline_translations').insert({
      timeline_item_id: data.id,
      locale: 'en',
      title: item.title,
      description: item.description,
      review_status: 'reviewed',
    });
    if (trErr)
      throw new Error(`Failed seeding timeline translation ${item.title}: ${trErr.message}`);
  }

  console.log('Seeding certifications...');
  for (const cert of certifications) {
    const { data, error } = await db
      .from('certifications')
      .insert({ issuer: cert.issuer, issue_date: cert.issueDate, priority: cert.priority })
      .select('id')
      .single();
    if (error || !data)
      throw new Error(`Failed seeding certification ${cert.name}: ${error?.message}`);

    const { error: trErr } = await db
      .from('certification_translations')
      .insert({ certification_id: data.id, locale: 'en', name: cert.name });
    if (trErr)
      throw new Error(`Failed seeding certification translation ${cert.name}: ${trErr.message}`);
  }

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
