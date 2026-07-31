import type { ProjectSeed } from '../../types';

// Source: docs/CONTENT_FACTS.md + master prompt section 10.4. The 90%
// accuracy figure was seeded with verified: false pending Johar's
// confirmation; he confirmed it directly (2026-07-31, see
// docs/CONTENT_FACTS.md), so it's now verified: true. Note that
// confirming the accuracy figure is a separate question from clinical
// validation: this remains an academic prototype, never a diagnostic
// tool, regardless of the confirmed number. Always "skin-lesion
// classification," never "skin cancer detection." Written in first
// person per Johar's preference. PyTorch added as a technology on
// Johar's direct confirmation (2026-07-31); see docs/CONTENT_FACTS.md.
export const skinLesion: ProjectSeed = {
  slug: 'skin-lesion-classification',
  status: 'completed',
  projectType: 'university',
  teamSize: 4,
  role: 'Team lead',
  homepagePriority: 4,
  safetyLabel: 'Academic image-classification prototype, not a diagnostic tool',
  githubUrl: null,
  demoUrl: null,
  isRepoPublic: false,
  published: true,
  title: 'CNN-Based Skin-Lesion Classification',
  oneLiner:
    'An EfficientNet-based transfer-learning system for seven-class dermatoscopic skin-lesion classification.',
  recruiterSummary:
    'An EfficientNet-based transfer-learning system I built for seven-class dermatoscopic skin-lesion classification, covering preprocessing, augmentation, tuning, and evaluation. Achieved 90% accuracy.',
  sections: [
    {
      key: 'executive_summary',
      heading: 'Executive summary',
      body: `A completed bachelor's capstone project I led as part of a four-person team: an EfficientNet-based transfer-learning system for seven-class dermatoscopic **skin-lesion classification**, covering preprocessing, augmentation, tuning, and evaluation, reaching 90% accuracy.

**This is an academic image-classification prototype, not a diagnostic tool**, and I never describe it as skin cancer detection or present it as clinically validated.`,
    },
    {
      key: 'problem_users_constraints',
      heading: 'Problem, users, and constraints',
      body: `Dermatoscopic image classification, distinguishing between seven categories of skin lesion from close-up images, is a well-studied computer vision problem often used as an academic benchmark for transfer learning and medical image classification techniques. I scoped this project academically: build and evaluate a working seven-class classifier, not produce a clinically deployable diagnostic system.`,
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
      body: `I can confirm the model reached 90% accuracy on this seven-class classification task. I plan to add the full dataset and evaluation methodology details (split strategy, class balance, test-set construction) to this case study as I revisit the original project materials, but the accuracy figure itself is confirmed.

This is an academic benchmark result on a dermatoscopic image dataset, not a clinical validation study.`,
    },
    {
      key: 'engineering_decisions',
      heading: 'Key engineering decisions',
      body: `- **Transfer learning over training from scratch**: a standard, well-justified choice for a seven-class image classification task with a capstone-scale dataset and timeline.
- **Preprocessing and augmentation as explicit pipeline stages** rather than ad hoc, supporting the tuning and evaluation work that followed.`,
    },
    {
      key: 'failures_lessons',
      heading: 'What I learned',
      body: `I haven't yet documented detailed engineering-challenge notes for this project (specific tuning iterations, augmentation choices that did or didn't help) in this case study. I'll add them if and when I revisit the original project materials.`,
    },
    {
      key: 'deployment_testing_security',
      heading: 'Deployment, testing, and security',
      body: `This project was an academic capstone and wasn't deployed as a running service. No patient data or real diagnostic use was involved at any stage. The dataset is a dermatoscopic image classification dataset used for academic evaluation.`,
    },
    {
      key: 'limitations_responsible_use',
      heading: 'Limitations and responsible use',
      body: `**This is an academic image-classification prototype, not a diagnostic tool.** It hasn't been clinically validated, and I never use or represent it as skin cancer detection. The 90% accuracy figure is a confirmed academic benchmark result, not evidence of clinical-grade validation.`,
    },
    {
      key: 'future_improvements',
      heading: 'Future improvements',
      body: `I'm working on documenting the full dataset, split methodology, and evaluation details behind the confirmed accuracy figure so this case study reflects the complete picture.`,
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
      verified: true,
      verificationNote:
        'Confirmed directly by Johar (2026-07-31). Full dataset/evaluation methodology to be added.',
    },
  ],
  technologies: [
    { slug: 'efficientnet', usage: 'used_in_project' },
    { slug: 'transfer-learning', usage: 'used_in_project' },
    { slug: 'image-augmentation', usage: 'used_in_project' },
    { slug: 'pytorch', usage: 'used_in_project' },
  ],
};
