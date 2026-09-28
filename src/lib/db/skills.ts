import 'server-only';
import { createClient } from '@/lib/db/server';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

function toLocale(locale: string): Locale {
  return locale as Locale;
}

const CATEGORY_ORDER = [
  'applied_ai',
  'machine_learning',
  'deep_learning',
  'data_engineering',
  'production_engineering',
  'platforms_tools',
] as const;

export interface SkillItem {
  slug: string;
  name: string;
  /** True once at least one evidence link confirms real project usage, not just exploration — never overstate proficiency on the homepage. */
  confirmed: boolean;
}

export interface SkillCategoryGroup {
  category: string;
  skills: SkillItem[];
}

export async function getCapabilityMap(locale: string): Promise<SkillCategoryGroup[]> {
  const db = await createClient();

  const { data: skills, error } = await db
    .from('skills')
    .select('id, slug, category, display_order, skill_translations!inner(name)')
    .eq('skill_translations.locale', toLocale(locale))
    .order('display_order', { ascending: true, nullsFirst: false });
  if (error) throw new Error(`Failed loading skills: ${error.message}`);
  if (!skills || skills.length === 0) return [];

  const { data: evidence, error: evidenceError } = await db
    .from('skill_project_evidence')
    .select('skill_id, usage_label')
    .in(
      'skill_id',
      skills.map((s) => s.id),
    );
  if (evidenceError) throw new Error(`Failed loading skill evidence: ${evidenceError.message}`);

  const confirmedBySkill = new Set(
    (evidence ?? []).filter((e) => e.usage_label === 'used_in_project').map((e) => e.skill_id),
  );

  const byCategory = new Map<string, SkillItem[]>();
  for (const skill of skills) {
    const translation = skill.skill_translations[0];
    if (!translation) continue;
    const list = byCategory.get(skill.category) ?? [];
    list.push({
      slug: skill.slug,
      name: translation.name,
      confirmed: confirmedBySkill.has(skill.id),
    });
    byCategory.set(skill.category, list);
  }

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => byCategory.has(c)),
    ...[...byCategory.keys()].filter((c) => !(CATEGORY_ORDER as readonly string[]).includes(c)),
  ];

  return orderedCategories.map((category) => ({
    category,
    skills: byCategory.get(category) ?? [],
  }));
}
