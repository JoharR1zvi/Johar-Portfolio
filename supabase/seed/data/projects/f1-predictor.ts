import type { ProjectSeed } from '../../types';

// Source: docs/CONTENT_FACTS.md + master prompt section 10.3. Hard rule
// throughout: no final accuracy/ROC-AUC/best-model claim until Johar
// confirms the final target and validated results. The public GitHub
// README is currently stale (says modelling not started) — tracked in
// docs/LAUNCH_CHECKLIST.md, not restated here.
export const f1Predictor: ProjectSeed = {
  slug: 'f1-race-predictor',
  status: 'in_progress',
  projectType: 'personal',
  teamSize: null,
  role: 'Sole developer — data pipeline, feature engineering, and modelling',
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
    'An end-to-end data engineering and machine learning pipeline that integrates historical results, qualifying, telemetry, tyre, weather, and driver context from three APIs to study and predict Formula 1 outcomes.',
  sections: [
    {
      key: 'executive_summary',
      heading: 'Executive summary',
      body: `**This project is in progress.** It's an end-to-end data engineering and machine learning pipeline integrating historical results, qualifying, telemetry, tyre, weather, and driver context from three separate APIs to study and predict Formula 1 outcomes. What's presented here are the stable, completed parts of the pipeline — the data integration, data-quality work, and leakage-aware feature engineering. Final modelling targets, model choices, and results are still being finalized and are deliberately not shown until confirmed.`,
    },
    {
      key: 'problem_users_constraints',
      heading: 'Problem, users, and constraints',
      body: `Predicting Formula 1 race outcomes from public data sounds straightforward but has a genuinely hard data problem underneath it: results, qualifying, and telemetry/weather data live in three separate APIs with different granularities and identifiers, spanning the 2022-2025 era, and naively joining them risks both data-quality errors and — more subtly — leaking future information into features that are supposed to represent what was knowable before a race.`,
    },
    {
      key: 'role_contribution',
      heading: "Johar's role and contribution boundary",
      body: `Personal project, solely developed: the data pipeline, feature engineering, data-quality investigation, and modelling work described here are all Johar's individual work.`,
    },
    {
      key: 'architecture',
      heading: 'System architecture',
      body: `Three data sources feed the pipeline: Jolpica (historical results and qualifying), FastF1 (telemetry and lap data), and OpenF1 (live-timing-style session data), integrated across the 2022-2025 era. The pipeline processes approximately 100,000 lap-level records into a 1,838-row race-entry master dataset (as described in the current project brief — these figures will be re-confirmed as the project develops further).

Caching, retry with exponential backoff, and rate-limit handling wrap all three API integrations, and join-safe merge utilities combine them into the master dataset.`,
    },
    {
      key: 'data_retrieval_model',
      heading: 'Data pipeline and modelling approach',
      body: `A bridge-table fix prevented a many-to-many join explosion when combining the three data sources — a structural data-modelling fix, not just a deduplication patch. Beyond that, substantial data-quality work went into weather coverage reconciliation, qualifying-time parsing, boolean-flag restoration, and DNF-label correction.

On the modelling side, features are built with **leakage-aware rolling windows using \`shift(1)\`** — ensuring a feature describing a driver's recent form only ever uses information from before the race it's predicting — combined with **time-based validation** instead of random train/test splits, since a random split would let the model implicitly learn from future races when validating on past ones. Current experiments include both classification and regression framings, but the exact target and final results remain in progress and intentionally editable until confirmed.`,
    },
    {
      key: 'evaluation_results',
      heading: 'Evaluation and results',
      body: `**No final accuracy, ROC-AUC, or best-model claim is published here.** This is intentional: the project's targets and modelling choices are still being finalized, and the spec this site follows explicitly rules out presenting unstable claims as final. What is stable and shown: the data integration scope (three APIs, 2022-2025), the dataset sizes above, and the time-aware evaluation methodology itself.`,
    },
    {
      key: 'engineering_decisions',
      heading: 'Key engineering decisions',
      body: `- **Time-based validation over random splits** — the single most important methodological decision in the project, since random splits on time-series race data would silently leak future information.
- **A bridge table to fix the join structure**, rather than a deduplication workaround, when three-source joins produced a many-to-many explosion.
- **Leakage-aware rolling features (\`shift(1)\`)** applied systematically, not just in one place, so no feature accidentally encodes race-day-or-later information.`,
    },
    {
      key: 'failures_lessons',
      heading: 'What failed and what was learned',
      body: `The join-explosion issue (many-to-many joins across the three data sources) surfaced early and was fixed structurally with a bridge table rather than patched with deduplication. Multiple data-quality issues — weather coverage gaps, malformed qualifying times, incorrect boolean flags, and mislabeled DNFs — had to be found and corrected before the dataset was trustworthy enough to build features on; this data-quality investigation is presented as a first-class part of the project, not a footnote.`,
    },
    {
      key: 'deployment_testing_security',
      heading: 'Deployment, testing, and security',
      body: `The pipeline includes caching, retry with exponential backoff, and rate-limit handling for all three external API integrations, so it degrades gracefully rather than failing outright against API instability.`,
    },
    {
      key: 'limitations_responsible_use',
      heading: 'Limitations and responsible use',
      body: `**This project is in progress.** Targets, modelling choices, and metrics may change. No final accuracy, ROC-AUC, or best-model claim should be inferred from this case study, and none is presented — only the stable data-pipeline and methodology work is shown.`,
    },
    {
      key: 'future_improvements',
      heading: 'Future improvements',
      body: `Finalizing the prediction target and modelling approach, producing validated results under the time-aware evaluation methodology, and publishing those results once confirmed.`,
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
