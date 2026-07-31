import type { ProjectSeed } from '../../types';

// Source: docs/CONTENT_FACTS.md + master prompt section 10.1. Every claim
// below traces to those documents; no new facts introduced. Group
// project: the contribution-boundary language in role_contribution and
// throughout is deliberate and must not be loosened. Written in first
// person per Johar's preference: this is his own voice addressing a
// recruiter, not a third-party description.
export const peCdss: ProjectSeed = {
  slug: 'pe-cdss',
  status: 'completed',
  projectType: 'university',
  teamSize: null,
  role: 'Designed and implemented the multimodal RAG guideline assistant',
  homepagePriority: 1,
  safetyLabel: 'Research/educational prototype, not a diagnostic tool',
  githubUrl: 'https://github.com/JoharR1zvi/PE_CDSS',
  demoUrl: null,
  isRepoPublic: true,
  published: true,
  title: 'PE-CDSS: Multimodal Clinical Guideline RAG',
  oneLiner:
    'A citation-grounded assistant for the 2019 ESC pulmonary embolism guidelines that unifies text, tables, and figure descriptions.',
  recruiterSummary:
    'A multilingual clinical decision-support prototype with a citation-grounded assistant for the 2019 ESC pulmonary embolism guidelines. I built the RAG feature that unifies text, tables, and vision-model figure descriptions and returns traceable German or English answers.',
  sections: [
    {
      key: 'executive_summary',
      heading: 'Executive summary',
      body: `PE-CDSS is a completed academic prototype I built as part of an MSc group project: a multilingual clinical decision-support tool with a citation-grounded assistant for the 2019 ESC (European Society of Cardiology) pulmonary embolism guidelines. I designed and implemented the multimodal retrieval-augmented generation (RAG) feature that unifies guideline text, structured tables, and vision-model figure descriptions into one retrieval system, returning traceable answers in German or English.

**This is a research and educational prototype, not a diagnostic tool.** It is not intended for clinical use, and no output from it should inform real patient care.`,
    },
    {
      key: 'problem_users_constraints',
      heading: 'Problem, users, and constraints',
      body: `Clinical guidelines like the ESC pulmonary embolism guidelines are long, dense documents mixing narrative text, risk-scoring tables, and diagnostic flowchart figures. A clinician or student trying to quickly check a specific recommendation has to manually search a PDF that wasn't designed for that. Critically, the scoring tables and flowchart figures that often carry the most decision-relevant information are the hardest parts of a PDF to search at all.

I built this for clinicians, medical students, and researchers who want fast, traceable answers grounded in the actual guideline text, with every answer showing exactly which page and content type it came from, so it can be verified against the source rather than trusted blindly.`,
    },
    {
      key: 'role_contribution',
      heading: 'My role and contribution boundary',
      body: `**PE-CDSS is a group MSc project. I did not build the entire clinical system alone.** My specific, individually-designed and implemented contribution is the multimodal RAG guideline assistant: the ingestion pipeline that unifies text, tables, and figures into one retrieval system, the dual-retrieval design that protects scoring tables from being crowded out by prose, and the translate-at-the-edges bilingual architecture. Other parts of the broader clinical decision-support system were built by other team members and are not represented in this case study.`,
    },
    {
      key: 'architecture',
      heading: 'System architecture',
      body: `The system has a React/Vite frontend and a FastAPI backend, with source citations surfaced directly in the chat UI so an answer can always be traced back to a specific page and content type.

Ingestion runs three parallel extraction paths over the source guideline PDF:
- **Text extraction** with pdfplumber, using spacing adjustments to handle a PDF encoding that made naive extraction unreliable.
- **Table extraction**, specifically built to preserve structured scoring information (e.g. risk scores) rather than flattening tables into unstructured prose.
- **Figure and flowchart coverage** via a local LLaVA vision-language model, run through Ollama, which renders each page as an image and generates a description of any diagnostic figures or flowcharts on it.

All three streams are embedded with a local all-MiniLM-L6-v2 model and stored in ChromaDB, each chunk tagged with page number and content type (text, table, or figure description) as metadata.`,
    },
    {
      key: 'data_retrieval_model',
      heading: 'Retrieval design',
      body: `Retrieval runs two paths in parallel rather than one: a general semantic search across all content, and a dedicated table-only retrieval path. I built this dual-path design specifically because scoring tables were losing the ranking competition against surrounding prose in a single unified retrieval pass (see "What failed and what I learned" below).

I also used a **translate-at-the-edges** architecture: retrieval and reasoning happen entirely in the English source language of the guideline, and only the final answer is translated to German or English depending on the user's selected language. This keeps retrieval quality consistent regardless of which language the user asks in, rather than trying to retrieve against translated (and potentially degraded) embeddings.`,
    },
    {
      key: 'evaluation_results',
      heading: 'Evaluation and results',
      body: `Formal, published evaluation metrics for retrieval quality aren't available yet for this prototype (see "Future improvements"). What's verified and demonstrated is functional: the system correctly retrieves and cites source pages across all three content types (text, tables, figure descriptions) in both English and German queries, and the dual-retrieval design measurably fixed the table-visibility failure described below.`,
    },
    {
      key: 'engineering_decisions',
      heading: 'Key engineering decisions',
      body: `- **Local models over hosted APIs for ingestion** (all-MiniLM-L6-v2 for embeddings, LLaVA via Ollama for figure description): keeps the pipeline runnable without sending clinical guideline content to a third-party API.
- **Content-type metadata on every chunk** (page number + text/table/figure) rather than a flat text index. This is what makes citation-grounded, traceable answers possible, and what enabled the table-only retrieval fix.
- **Translate-at-the-edges rather than translating source content upfront**: avoids compounding translation error into the retrieval step itself.`,
    },
    {
      key: 'failures_lessons',
      heading: 'What failed and what I learned',
      body: `**Table-search failure and fix.** In my initial single-path retrieval design, structured scoring tables were consistently outranked by surrounding narrative prose: a query asking for a specific risk score would often retrieve explanatory text about the score instead of the table containing it. My fix was architectural, not a ranking tweak: a dedicated table-only retrieval path runs in parallel with general retrieval, guaranteeing that table content gets surfaced when relevant rather than competing directly against prose for the same ranking slots.`,
    },
    {
      key: 'deployment_testing_security',
      heading: 'Deployment, testing, and security',
      body: `The system does not accept or retain real patient-identifying information in any demonstration. This is a hard constraint given the clinical subject matter, not just a nice-to-have. The stack (React/Vite frontend, FastAPI backend, local ChromaDB) is designed to run without external data egress for the guideline content itself.`,
    },
    {
      key: 'limitations_responsible_use',
      heading: 'Limitations and responsible use',
      body: `**This is a research and educational prototype, not a validated diagnostic tool, and it must never be used for real clinical decision-making or real patient care.** It hasn't undergone clinical validation. Formal retrieval-quality evaluation is still pending (see "Future improvements"). This case study describes my individual contribution (the multimodal RAG feature) within a larger group project; it doesn't represent or claim credit for the entire clinical decision-support system.`,
    },
    {
      key: 'future_improvements',
      heading: 'Future improvements',
      body: `My planned next steps include formal retrieval-quality evaluation (precision/recall of citations against a labeled question set), further retrieval improvements, and translation-quality review, none of which should be assumed complete until I explicitly confirm it.`,
    },
    {
      key: 'links_resources',
      heading: 'Links and resources',
      body: `GitHub: [PE_CDSS](https://github.com/JoharR1zvi/PE_CDSS), displayed as a fork. The multimodal RAG feature described in this case study is my individual contribution to a group project, not the entire linked repository's authorship.`,
    },
  ],
  metrics: [],
  technologies: [
    { slug: 'multimodal-rag', usage: 'used_in_project' },
    { slug: 'fastapi', usage: 'used_in_project' },
    { slug: 'react', usage: 'used_in_project' },
    { slug: 'vite', usage: 'used_in_project' },
    { slug: 'chromadb', usage: 'used_in_project' },
    { slug: 'ollama', usage: 'used_in_project' },
  ],
};
