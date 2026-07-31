import type { ProjectSeed } from '../../types';

// Source: docs/CONTENT_FACTS.md + master prompt section 10.4. The 90%
// accuracy figure is stored with verified: false on purpose — RLS blocks
// it from public display until Johar supplies dataset/evaluation context
// or explicitly approves the claim (see supabase/migrations/0004). Always
// "skin-lesion classification," never "skin cancer detection."
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
    'An EfficientNet-based transfer-learning system for seven-class dermatoscopic skin-lesion classification, covering preprocessing, augmentation, tuning, and evaluation.',
  sections: [
    {
      key: 'executive_summary',
      heading: 'Executive summary',
      body: `A completed bachelor's capstone project built by a four-person team, which Johar led: an EfficientNet-based transfer-learning system for seven-class dermatoscopic **skin-lesion classification**, covering preprocessing, augmentation, tuning, and evaluation.

**This is an academic image-classification prototype, not a diagnostic tool**, and it must never be described as skin cancer detection or presented as clinically validated.`,
    },
    {
      key: 'problem_users_constraints',
      heading: 'Problem, users, and constraints',
      body: `Dermatoscopic image classification — distinguishing between seven categories of skin lesion from close-up images — is a well-studied computer vision problem often used as an academic benchmark for transfer learning and medical image classification techniques. The project's scope was academic: build and evaluate a working seven-class classifier, not to produce a clinically deployable diagnostic system.`,
    },
    {
      key: 'role_contribution',
      heading: "Johar's role and contribution boundary",
      body: `Four-person team project. Johar was team lead, responsible for the overall direction of the capstone alongside his individual contributions to the classification system, described below.`,
    },
    {
      key: 'architecture',
      heading: 'System architecture',
      body: `The system is built around **transfer learning on an EfficientNet backbone**, adapted for seven-class dermatoscopic lesion classification. The pipeline covers image preprocessing and augmentation ahead of training, followed by tuning and evaluation of the resulting classifier.`,
    },
    {
      key: 'data_retrieval_model',
      heading: 'Model approach',
      body: `Transfer learning starts from EfficientNet's pretrained weights rather than training a convolutional network from scratch, then fine-tunes on the dermatoscopic dataset across seven lesion classes. Image preprocessing and augmentation were used to improve robustness ahead of tuning and final evaluation.`,
    },
    {
      key: 'evaluation_results',
      heading: 'Evaluation and results',
      body: `The current resume reports a 90% accuracy figure for this project. **That figure is stored as an unverified metric pending confirmation** — it is not displayed as a validated result on this site until the underlying dataset and evaluation methodology (split strategy, class balance, test-set construction) are supplied or the claim is otherwise explicitly approved. This is a deliberate policy applied to every metric on this site, not a special caveat for this project alone.`,
    },
    {
      key: 'engineering_decisions',
      heading: 'Key engineering decisions',
      body: `- **Transfer learning over training from scratch** — a standard, well-justified choice for a seven-class image classification task with a capstone-scale dataset and timeline.
- **Preprocessing and augmentation as explicit pipeline stages** rather than ad hoc — supports the tuning and evaluation work that followed.`,
    },
    {
      key: 'failures_lessons',
      heading: 'What was learned',
      body: `Detailed engineering-challenge notes for this project (specific tuning iterations, augmentation choices that did or didn't help) are not yet documented in this case study and will be added if and when Johar revisits the original project materials.`,
    },
    {
      key: 'deployment_testing_security',
      heading: 'Deployment, testing, and security',
      body: `This project was an academic capstone and was not deployed as a running service. No patient data or real diagnostic use was involved at any stage — the dataset is a dermatoscopic image classification dataset used for academic evaluation.`,
    },
    {
      key: 'limitations_responsible_use',
      heading: 'Limitations and responsible use',
      body: `**This is an academic image-classification prototype, not a diagnostic tool.** It has not been clinically validated, must never be used or represented as skin cancer detection, and no accuracy figure associated with it should be treated as a confirmed, production-grade result unless explicitly verified (see "Evaluation and results" above).`,
    },
    {
      key: 'future_improvements',
      heading: 'Future improvements',
      body: `Confirming the dataset, split methodology, and evaluation details behind the reported accuracy figure so it can be verified and displayed with proper context.`,
    },
    {
      key: 'links_resources',
      heading: 'Links and resources',
      body: `This project's repository is not currently visible on Johar's public GitHub.`,
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
  ],
};
