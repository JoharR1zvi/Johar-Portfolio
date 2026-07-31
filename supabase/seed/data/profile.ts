// All facts here are transcribed directly from docs/CONTENT_FACTS.md.
// The about text is drafted prose (spec section 9.6: 100-160 English
// words) built only from facts already in CONTENT_FACTS.md — no new
// claims. review_status is 'draft' pending Johar's review (see
// docs/DECISIONS.md, Phase 2).
export const profile = {
  fullName: 'Johar Rizvi',
  primaryTitle: 'Applied AI/ML Engineer',
  supportingDescriptor: 'Data Scientist | Healthcare AI',
  location: 'Oldenburg, Germany',
  publicEmail: 'thejoharrizvi@gmail.com',
  githubUrl: 'https://github.com/JoharR1zvi',
  linkedinUrl: 'https://www.linkedin.com/in/johar-rizvi/',
  mscProgram: 'Data Science and Machine Learning',
  mscUniversity: 'Carl von Ossietzky University of Oldenburg',
  mscStartDate: '2025-10-01',
  mscEndDate: null as string | null,
  mscSpecialization: 'Medical data / Data Science and Machine Learning in Medicine and Health Care',
  bengProgram: 'Information Technology',
  bengUniversity: 'Padre Conceicao College of Engineering',
  bengStartDate: '2020-08-01',
  bengEndDate: '2024-07-31',
};

export const profileTranslationEn = {
  locale: 'en' as const,
  heroHeadline: 'Building reliable AI systems from data to deployment.',
  heroSubheadline:
    'M.Sc. Data Science and Machine Learning student at Carl von Ossietzky University of Oldenburg, specializing in medical data. I build applied AI systems across multimodal RAG, agentic workflows, computer vision, and end-to-end data science.',
  aboutText:
    "I'm an Applied AI/ML Engineer currently pursuing an MSc in Data Science and Machine Learning at Carl von Ossietzky University of Oldenburg, specializing in medical data. Before returning to study, I spent over a year as a Junior Technical Project Manager, delivering technical projects and coordinating cross-functional teams — experience that now shapes how I approach AI systems: as products that need to work reliably for real users, not just perform well on a benchmark. My recent work spans multimodal retrieval-augmented generation for a clinical guideline assistant, an agentic shopping assistant built on a real commerce API, and a leakage-aware machine learning pipeline for sports data. Across all of it, I care most about building systems that are explainable, thoroughly tested, and honest about their own limitations. I'm a native English and Hindi speaker, currently learning German (A2), and hold an IELTS Band 8.0.",
  availabilityLine:
    'Based in Germany. Open to student, internship, working-student, and early-career opportunities in Applied AI, Machine Learning, and Data Science.',
};
