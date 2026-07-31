import type { ProjectSeed } from '../../types';

// Source: docs/CONTENT_FACTS.md + master prompt section 10.3. Hard rule
// throughout: no final accuracy/ROC-AUC/best-model claim until Johar
// confirms the final target and validated results. The public GitHub
// README is currently stale (says modelling not started); tracked in
// docs/LAUNCH_CHECKLIST.md, not restated here. Written in first person
// per Johar's preference.
export const f1Predictor: ProjectSeed = {
  slug: 'f1-race-predictor',
  status: 'in_progress',
  projectType: 'personal',
  teamSize: null,
  role: 'Sole developer: data pipeline, feature engineering, and modelling',
  homepagePriority: 3,
  safetyLabel: null,
  githubUrl: 'https://github.com/JoharR1zvi/F1-race-predictor',
  demoUrl: null,
  isRepoPublic: true,
  published: true,
  title: 'Formula 1 Race Outcome Predictor',
  oneLiner:
    'An end-to-end data pipeline integrating three F1 data sources, built around temporal leakage prevention and time-aware evaluation.',
  recruiterSummary:
    'An end-to-end data engineering and machine learning pipeline I built that integrates historical results, qualifying, telemetry, tyre, weather, and driver context from three APIs to study and predict Formula 1 outcomes.',
  sections: [
    {
      key: 'executive_summary',
      heading: 'Executive summary',
      body: `**This project is in progress.** I'm building an end-to-end data engineering and machine learning pipeline that integrates historical results, qualifying, telemetry, tyre, weather, and driver context from three separate APIs to study and predict Formula 1 outcomes. What I'm presenting here are the stable, completed parts of the pipeline: the data integration, data-quality work, and leakage-aware feature engineering. I'm still finalizing modelling targets, model choices, and results, and I've deliberately left them out until I've confirmed them.`,
    },
    {
      key: 'problem_users_constraints',
      heading: 'Problem, users, and constraints',
      body: `Predicting Formula 1 race outcomes from public data sounds straightforward but has a genuinely hard data problem underneath it: results, qualifying, and telemetry/weather data live in three separate APIs with different granularities and identifiers, spanning the 2022-2025 era, and naively joining them risks both data-quality errors and, more subtly, leaking future information into features that are supposed to represent what was knowable before a race.`,
    },
    {
      key: 'role_contribution',
      heading: 'My role and contribution boundary',
      body: `This is a personal project I developed solely on my own: the data pipeline, feature engineering, data-quality investigation, and modelling work described here are all my individual work.`,
    },
    {
      key: 'architecture',
      heading: 'System architecture',
      body: `Three data sources feed my pipeline: Jolpica (historical results and qualifying), FastF1 (telemetry and lap data), and OpenF1 (live-timing-style session data), integrated across the 2022-2025 era. The pipeline processes approximately 100,000 lap-level records into a 1,838-row race-entry master dataset (as described in my current project brief; I'll re-confirm these figures as the project develops further).

I wrapped all three API integrations with caching, retry with exponential backoff, and rate-limit handling, and built join-safe merge utilities to combine them into the master dataset.`,
    },
    {
      key: 'data_retrieval_model',
      heading: 'Data pipeline and modelling approach',
      body: `I fixed a many-to-many join explosion with a bridge table when combining the three data sources: a structural data-modelling fix, not just a deduplication patch. Beyond that, I put substantial work into data quality: weather coverage reconciliation, qualifying-time parsing, boolean-flag restoration, and DNF-label correction.

On the modelling side, I build features with **leakage-aware rolling windows using \`shift(1)\`**, ensuring a feature describing a driver's recent form only ever uses information from before the race it's predicting, combined with **time-based validation** instead of random train/test splits, since a random split would let the model implicitly learn from future races when validating on past ones. My current experiments include both classification and regression framings, but I'm keeping the exact target and final results in progress and intentionally editable until I confirm them.`,
    },
    {
      key: 'evaluation_results',
      heading: 'Evaluation and results',
      body: `**I'm not publishing a final accuracy, ROC-AUC, or best-model claim here.** That's intentional: I'm still finalizing the project's targets and modelling choices, and I'd rather not present an unstable claim as final. What is stable and what I'm showing: the data integration scope (three APIs, 2022-2025), the dataset sizes above, and the time-aware evaluation methodology itself.`,
    },
    {
      key: 'engineering_decisions',
      heading: 'Key engineering decisions',
      body: `- **Time-based validation over random splits**: the single most important methodological decision in the project, since random splits on time-series race data would silently leak future information.
- **A bridge table to fix the join structure**, rather than a deduplication workaround, when three-source joins produced a many-to-many explosion.
- **Leakage-aware rolling features (\`shift(1)\`)** applied systematically, not just in one place, so no feature accidentally encodes race-day-or-later information.`,
    },
    {
      key: 'failures_lessons',
      heading: 'What failed and what I learned',
      body: `The join-explosion issue (many-to-many joins across the three data sources) surfaced early, and I fixed it structurally with a bridge table rather than patching it with deduplication. I had to find and correct multiple data-quality issues (weather coverage gaps, malformed qualifying times, incorrect boolean flags, and mislabeled DNFs) before the dataset was trustworthy enough to build features on. I treat this data-quality investigation as a first-class part of the project, not a footnote.`,
    },
    {
      key: 'deployment_testing_security',
      heading: 'Deployment, testing, and security',
      body: `My pipeline includes caching, retry with exponential backoff, and rate-limit handling for all three external API integrations, so it degrades gracefully rather than failing outright against API instability.`,
    },
    {
      key: 'limitations_responsible_use',
      heading: 'Limitations and responsible use',
      body: `**This project is in progress.** My targets, modelling choices, and metrics may change. Don't infer a final accuracy, ROC-AUC, or best-model claim from this case study. I'm not presenting one, only the stable data-pipeline and methodology work.`,
    },
    {
      key: 'future_improvements',
      heading: 'Future improvements',
      body: `I'm working on finalizing the prediction target and modelling approach, producing validated results under my time-aware evaluation methodology, and publishing those results once I've confirmed them.`,
    },
    {
      key: 'links_resources',
      heading: 'Links and resources',
      body: `GitHub: [F1-race-predictor](https://github.com/JoharR1zvi/F1-race-predictor).`,
    },
  ],
  metrics: [
    {
      key: 'lap_level_records',
      valueText: '~100,000 lap-level records processed',
      verified: true,
    },
    {
      key: 'race_entry_dataset_size',
      valueText: '1,838-row race-entry master dataset',
      verified: true,
      verificationNote:
        'As described in the current project brief; subject to re-confirmation as the project develops.',
    },
    {
      key: 'data_sources_integrated',
      valueText: '3 APIs integrated (Jolpica, FastF1, OpenF1), 2022-2025 seasons',
      verified: true,
    },
  ],
  technologies: [
    { slug: 'python', usage: 'used_in_project' },
    { slug: 'pandas', usage: 'used_in_project' },
    { slug: 'fastf1', usage: 'used_in_project' },
    { slug: 'jolpica-api', usage: 'used_in_project' },
    { slug: 'openf1-api', usage: 'used_in_project' },
  ],
};
