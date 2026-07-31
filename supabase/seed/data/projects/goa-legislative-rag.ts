import type { ProjectSeed } from '../../types';

// Source: docs/CONTENT_FACTS.md's timeline entry for the Inertia
// Technologies internship (Jul-Aug 2023). Lower priority than the four
// flagship projects, so a lighter case study — not every section applies
// at this depth, and that's fine. Written in first person per Johar's
// preference.
export const goaLegislativeRag: ProjectSeed = {
  slug: 'goa-legislative-rag',
  status: 'completed',
  projectType: 'work',
  teamSize: null,
  role: 'AI Intern — designed and built the RAG assistant',
  homepagePriority: null,
  safetyLabel: null,
  githubUrl: null,
  demoUrl: null,
  isRepoPublic: false,
  published: true,
  title: 'Goa Legislative Assembly RAG Assistant',
  oneLiner: 'Natural-language search over 3,000+ pages of Goa Legislative Assembly records.',
  recruiterSummary:
    'I built this during an AI internship at Inertia Technologies (Jul-Aug 2023): a natural-language search assistant over 3,000+ pages of Goa Legislative Assembly records, using GPT-4, embeddings, and Pinecone.',
  sections: [
    {
      key: 'executive_summary',
      heading: 'Executive summary',
      body: `I built this during a July-August 2023 AI internship at Inertia Technologies: a retrieval-augmented natural-language search assistant over 3,000+ pages of Goa Legislative Assembly records, letting a user ask a question in plain language instead of manually searching legislative documents.`,
    },
    {
      key: 'role_contribution',
      heading: 'My role',
      body: `As AI Intern, I designed and built the RAG assistant: the ingestion of the legislative records, the embedding and retrieval pipeline, and the generation layer using GPT-4.`,
    },
    {
      key: 'architecture',
      heading: 'System architecture',
      body: `I embedded legislative records using OpenAI's Ada embedding model and indexed them in Pinecone, a hosted vector database. User questions retrieve relevant passages from across the 3,000+ pages of records, which are then passed to GPT-4 to generate a natural-language answer grounded in the retrieved content.`,
    },
    {
      key: 'links_resources',
      heading: 'Links and resources',
      body: `This was an internship project; no public repository is available for it.`,
    },
  ],
  metrics: [
    {
      key: 'pages_indexed',
      valueText: '3,000+ pages of records',
      verified: true,
    },
  ],
  technologies: [
    { slug: 'gpt-4', usage: 'used_in_project' },
    { slug: 'pinecone', usage: 'used_in_project' },
    { slug: 'embeddings', usage: 'used_in_project' },
  ],
};
