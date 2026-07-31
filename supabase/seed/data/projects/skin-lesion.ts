import type { ProjectSeed } from '../../types';

// Source: docs/CONTENT_FACTS.md + master prompt section 10.4. The 90%
// accuracy figure is stored with verified: false on purpose — RLS blocks
// it from public display until Johar supplies dataset/evaluation context
// or explicitly approves the claim (see supabase/migrations/0004). Always
// "skin-lesion classification," never "skin cancer detection." Written in
// first person per Johar's preference. PyTorch/TensorFlow added as
// technologies on Johar's direct confirmation (2026-07-31) — see
// docs/CONTENT_FACTS.md.
export const skinLesion: ProjectSeed = {
  slug: 'skin-lesion-classification',
  status: 'completed',
  projectType: 'university',
  teamSize: 4,
  role: 'Team lead',
  homepagePriority: 4,
  safetyLabel: 'Academic image-classification prototype — not a diagnostic tool',
  githubUrl: null,
  demoUrl: null,
  isRepoPublic: false,
  published: true,
  title: 'CNN-Based Skin-Lesion Classification',
  oneLiner:
    'An EfficientNet-based transfer-learning system for seven-class dermatoscopic skin-lesion classification.',
  recruiterSummary:
    'An EfficientNet-based transfer-learning system I built for seven-class dermatoscopic skin-lesion classification, covering preprocessing, augmentation, tuning, and evaluation.',
  sections: [
    {
      key: 'executive_summary',
      heading: 'Executive summary',
      body: `A completed bachelor's capstone project I led as part of a four-person team: an EfficientNet-based transfer-learning system for seven-class dermatoscopic **skin-lesion classification**, covering preprocessing, augmentation, tuning, and evaluation.

**This is an academic image-classification prototype, not a diagnostic tool**, and I never describe it as skin cancer detection or present it as clinically validated.`,
    },
    {
      key: 'problem_users_constraints',
      heading: 'Problem, users, and constraints',
      body: `Dermatoscopic image classification — distinguishing between seven categories of skin lesion from close-up images — is a well-studied computer vision problem often used as an academic benchmark for transfer learning and medical image classification techniques. I scoped this project academically: build and evaluate a working seven-class classifier, not produce a clinically deployable diagnostic system.`,
    },
    {
      key: 'role_contribution',
      heading: 'My role and contribution boundary',
      body: `Four-person team project. I was team lead, responsible for the overall direction of the capstone alongside my individual contributions to the classification system, described below.`,
    },
    {
      key: 'architecture',
      heading: 'System architecture',
      body: `I built the system around **transfer learning on an EfficientNet backbone**, adapted for seven-class dermatoscopic lesion classification, using PyTorch. The pipeline covers image preprocessing and augmentation ahead of training, followed by tuning and evaluation of the resulting classifier.`,
    },
    {
      key: 'data_retrieval_model',
      heading: 'Model approach',
      body: `Transfer learning starts from EfficientNet's pretrained weights rather than training a convolutional network from scratch, then fine-tunes on the dermatoscopic dataset across seven lesion classes. I used image preprocessing and augmentation to improve robustness ahead of tuning and final evaluation.`,
    },
    {
      key: 'evaluation_results',
      heading: 'Evaluation and results',
      body: `My current resume reports a 90% accuracy figure for this project. **I'm storing that figure as an unverified metric pending confirmation** — I won't display it as a validated result on this site until I supply the underlying dataset and evaluation methodology (split strategy, class balance, test-set construction) or otherwise explicitly approve the claim. This is a policy I apply to every metric on this site, not a special caveat for this project alone.`,
    },
    {
      key: 'engineering_decisions',
      heading: 'Key engineering decisions',
      body: `- **Transfer learning over training from scratch** — a standard, well-justified choice for a seven-class image classification task with a capstone-scale dataset and timeline.
- **Preprocessing and augmentation as explicit pipeline stages** rather than ad hoc — supports the tuning and evaluation work that followed.`,
    },
    {
      key: 'failures_lessons',
      heading: 'What I learned',
      body: `I haven't yet documented detailed engineering-challenge notes for this project (specific tuning iterations, augmentation choices that did or didn't help) in this case study — I'll add them if and when I revisit the original project materials.`,
    },
    {
      key: 'deployment_testing_security',
      heading: 'Deployment, testing, and security',
      body: `This project was an academic capstone and wasn't deployed as a running service. No patient data or real diagnostic use was involved at any stage — the dataset is a dermatoscopic image classification dataset used for academic evaluation.`,
    },
    {
      key: 'limitations_responsible_use',
      heading: 'Limitations and responsible use',
      body: `**This is an academic image-classification prototype, not a diagnostic tool.** It hasn't been clinically validated, I never use or represent it as skin cancer detection, and no accuracy figure associated with it should be treated as a confirmed, production-grade result unless I've explicitly verified it (see "Evaluation and results" above).`,
    },
    {
      key: 'future_improvements',
      heading: 'Future improvements',
      body: `I'm working on confirming the dataset, split methodology, and evaluation details behind my reported accuracy figure so I can verify it and display it with proper context.`,
    },
    {
      key: 'links_resources',
      heading: 'Links and resources',
      body: `This project's repository isn't currently visible on my public GitHub.`,
    },
  ],
  metrics: [
    {
      key: 'accuracy',
      valueText: '90%',
      verified: false,
      verificationNote:
        'Reported on the current resume. Not yet displayed publicly — pending dataset/evaluation context or explicit approval from Johar.',
    },
  ],
  technologies: [
    { slug: 'efficientnet', usage: 'used_in_project' },
    { slug: 'transfer-learning', usage: 'used_in_project' },
    { slug: 'image-augmentation', usage: 'used_in_project' },
    { slug: 'pytorch', usage: 'used_in_project' },
  ],
};
