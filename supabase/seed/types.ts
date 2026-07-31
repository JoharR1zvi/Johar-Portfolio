// Shared shapes for seed data files. These are intentionally plain data
// structures (not the generated DB types) so each project/data file reads
// like a document, not a database row.

export type ProjectStatus =
  'idea' | 'in_progress' | 'mvp_poc' | 'completed' | 'deployed' | 'archived' | 'coming_soon';

export type ProjectType = 'personal' | 'university' | 'team' | 'work' | 'hackathon';

export type UsageLabel = 'used_in_project' | 'currently_developing' | 'exploring';

export type TechnologyCategory =
  | 'applied_ai'
  | 'machine_learning'
  | 'deep_learning'
  | 'data_engineering'
  | 'production_engineering'
  | 'platforms_tools';

export const SECTION_KEYS = [
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
  'links_resources',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface SectionSeed {
  key: SectionKey;
  heading: string;
  body: string; // Markdown.
}

export interface MetricSeed {
  key: string;
  valueText: string;
  verified: boolean;
  verificationNote?: string;
}

export interface ProjectSeed {
  slug: string;
  status: ProjectStatus;
  projectType: ProjectType | null;
  teamSize: number | null;
  role: string | null;
  homepagePriority: number | null;
  safetyLabel: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  isRepoPublic: boolean;
  published: boolean;
  title: string;
  oneLiner: string;
  recruiterSummary: string;
  sections: SectionSeed[];
  metrics: MetricSeed[];
  technologies: { slug: string; usage: UsageLabel }[];
}
