import type { TechnologyCategory, UsageLabel } from '../types';

// The homepage capability map (spec section 9.5). Every skill here is
// tied to at least one project via real evidence from
// docs/CONTENT_FACTS.md: skills the spec's illustrative list mentions but
// that had no project-level confirmation were originally omitted (and
// PyTorch, TensorFlow, Docker, and GitHub Actions were added back once
// Johar confirmed them directly, 2026-07-31). "Never list a technology
// solely for keyword density."
export const skills: {
  slug: string;
  name: string;
  category: TechnologyCategory;
  evidence: { projectSlug: string; usage: UsageLabel }[];
}[] = [
  // Applied AI
  {
    slug: 'rag',
    name: 'Retrieval-Augmented Generation',
    category: 'applied_ai',
    evidence: [
      { projectSlug: 'pe-cdss', usage: 'used_in_project' },
      { projectSlug: 'goa-legislative-rag', usage: 'used_in_project' },
    ],
  },
  {
    slug: 'embeddings',
    name: 'Embeddings',
    category: 'applied_ai',
    evidence: [
      { projectSlug: 'pe-cdss', usage: 'used_in_project' },
      { projectSlug: 'goa-legislative-rag', usage: 'used_in_project' },
    ],
  },
  {
    slug: 'hybrid-retrieval',
    name: 'Hybrid Retrieval',
    category: 'applied_ai',
    evidence: [{ projectSlug: 'pe-cdss', usage: 'used_in_project' }],
  },
  {
    slug: 'multimodal-ingestion',
    name: 'Multimodal Ingestion',
    category: 'applied_ai',
    evidence: [{ projectSlug: 'pe-cdss', usage: 'used_in_project' }],
  },
  {
    slug: 'structured-outputs',
    name: 'Structured Outputs',
    category: 'applied_ai',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },
  {
    slug: 'tool-calling',
    name: 'Tool Calling',
    category: 'applied_ai',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },
  {
    slug: 'agentic-workflows',
    name: 'Agentic Workflows',
    category: 'applied_ai',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },

  // Machine Learning
  {
    slug: 'feature-engineering',
    name: 'Feature Engineering',
    category: 'machine_learning',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'leakage-prevention',
    name: 'Leakage Prevention',
    category: 'machine_learning',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'time-aware-validation',
    name: 'Time-Aware Validation',
    category: 'machine_learning',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'model-evaluation',
    name: 'Model Evaluation',
    category: 'machine_learning',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'currently_developing' }],
  },

  // Deep Learning
  {
    slug: 'efficientnet-cnns',
    name: 'EfficientNet / CNNs',
    category: 'deep_learning',
    evidence: [{ projectSlug: 'skin-lesion-classification', usage: 'used_in_project' }],
  },
  {
    slug: 'transfer-learning-skill',
    name: 'Transfer Learning',
    category: 'deep_learning',
    evidence: [{ projectSlug: 'skin-lesion-classification', usage: 'used_in_project' }],
  },
  {
    slug: 'image-preprocessing-augmentation',
    name: 'Image Preprocessing & Augmentation',
    category: 'deep_learning',
    evidence: [{ projectSlug: 'skin-lesion-classification', usage: 'used_in_project' }],
  },
  {
    // Confirmed directly by Johar (2026-07-31, see docs/CONTENT_FACTS.md).
    slug: 'pytorch-skill',
    name: 'PyTorch',
    category: 'deep_learning',
    evidence: [{ projectSlug: 'skin-lesion-classification', usage: 'used_in_project' }],
  },
  {
    // Confirmed directly by Johar (2026-07-31) as a tool he's fluent with;
    // 'exploring' rather than 'used_in_project' since the skin-lesion
    // capstone's confirmed framework is PyTorch, not both simultaneously.
    slug: 'tensorflow-skill',
    name: 'TensorFlow',
    category: 'deep_learning',
    evidence: [{ projectSlug: 'skin-lesion-classification', usage: 'exploring' }],
  },

  // Data Engineering
  {
    slug: 'python-skill',
    name: 'Python',
    category: 'data_engineering',
    evidence: [
      { projectSlug: 'f1-race-predictor', usage: 'used_in_project' },
      { projectSlug: 'pe-cdss', usage: 'used_in_project' },
      { projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' },
    ],
  },
  {
    slug: 'pandas-skill',
    name: 'pandas',
    category: 'data_engineering',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'sql',
    name: 'SQL',
    category: 'data_engineering',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },
  {
    slug: 'api-ingestion',
    name: 'API Ingestion',
    category: 'data_engineering',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'etl',
    name: 'ETL',
    category: 'data_engineering',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'data-validation',
    name: 'Data Validation',
    category: 'data_engineering',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'caching',
    name: 'Caching',
    category: 'data_engineering',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'join-design',
    name: 'Join Design',
    category: 'data_engineering',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'used_in_project' }],
  },
  {
    slug: 'statistical-analysis',
    name: 'Statistical Analysis',
    category: 'data_engineering',
    evidence: [{ projectSlug: 'f1-race-predictor', usage: 'currently_developing' }],
  },

  // Production Engineering
  {
    slug: 'fastapi-skill',
    name: 'FastAPI',
    category: 'production_engineering',
    evidence: [{ projectSlug: 'pe-cdss', usage: 'used_in_project' }],
  },
  {
    slug: 'react-skill',
    name: 'React',
    category: 'production_engineering',
    evidence: [{ projectSlug: 'pe-cdss', usage: 'used_in_project' }],
  },
  {
    slug: 'rest-json-rpc',
    name: 'REST / JSON-RPC',
    category: 'production_engineering',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },
  {
    slug: 'testing-skill',
    name: 'Testing',
    category: 'production_engineering',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },
  {
    // Confirmed directly by Johar (2026-07-31, see docs/CONTENT_FACTS.md).
    slug: 'docker-skill',
    name: 'Docker',
    category: 'production_engineering',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },
  {
    // Confirmed directly by Johar (2026-07-31, see docs/CONTENT_FACTS.md).
    slug: 'github-actions-skill',
    name: 'GitHub Actions',
    category: 'production_engineering',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },
  {
    slug: 'pydantic-skill',
    name: 'Pydantic',
    category: 'production_engineering',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },

  // Platforms and Tools
  {
    slug: 'chromadb-skill',
    name: 'ChromaDB',
    category: 'platforms_tools',
    evidence: [{ projectSlug: 'pe-cdss', usage: 'used_in_project' }],
  },
  {
    slug: 'pinecone',
    name: 'Pinecone',
    category: 'platforms_tools',
    evidence: [{ projectSlug: 'goa-legislative-rag', usage: 'used_in_project' }],
  },
  {
    slug: 'huggingface',
    name: 'Hugging Face',
    category: 'platforms_tools',
    evidence: [{ projectSlug: 'pe-cdss', usage: 'used_in_project' }],
  },
  {
    slug: 'ollama-skill',
    name: 'Ollama',
    category: 'platforms_tools',
    evidence: [{ projectSlug: 'pe-cdss', usage: 'used_in_project' }],
  },
  {
    slug: 'langgraph-skill',
    name: 'LangGraph',
    category: 'platforms_tools',
    evidence: [{ projectSlug: 'swiggy-instamart-assistant', usage: 'used_in_project' }],
  },
  {
    slug: 'openai-api',
    name: 'OpenAI API',
    category: 'platforms_tools',
    evidence: [{ projectSlug: 'goa-legislative-rag', usage: 'used_in_project' }],
  },
];
