import type { TechnologyCategory } from '../types';

// The compact 3-5 tag badges shown on each project card. Deliberately a
// smaller, concrete list than the skills capability map — every entry here
// is a technology explicitly named in docs/CONTENT_FACTS.md for at least
// one flagship project, OR directly confirmed by Johar (2026-07-31: PyTorch,
// TensorFlow, Docker, GitHub Actions — see docs/CONTENT_FACTS.md).
export const technologies: { slug: string; name: string; category: TechnologyCategory }[] = [
  { slug: 'fastapi', name: 'FastAPI', category: 'production_engineering' },
  { slug: 'react', name: 'React', category: 'production_engineering' },
  { slug: 'vite', name: 'Vite', category: 'production_engineering' },
  { slug: 'pydantic', name: 'Pydantic', category: 'production_engineering' },
  { slug: 'oauth-pkce', name: 'OAuth 2.1 + PKCE', category: 'production_engineering' },
  { slug: 'json-rpc', name: 'JSON-RPC', category: 'production_engineering' },
  { slug: 'chromadb', name: 'ChromaDB', category: 'platforms_tools' },
  { slug: 'ollama', name: 'Ollama', category: 'platforms_tools' },
  { slug: 'langgraph', name: 'LangGraph', category: 'platforms_tools' },
  { slug: 'multimodal-rag', name: 'Multimodal RAG', category: 'applied_ai' },
  { slug: 'sqlite', name: 'SQLite', category: 'data_engineering' },
  { slug: 'python', name: 'Python', category: 'data_engineering' },
  { slug: 'pandas', name: 'pandas', category: 'data_engineering' },
  { slug: 'fastf1', name: 'FastF1', category: 'data_engineering' },
  { slug: 'jolpica-api', name: 'Jolpica API', category: 'data_engineering' },
  { slug: 'openf1-api', name: 'OpenF1 API', category: 'data_engineering' },
  { slug: 'efficientnet', name: 'EfficientNet', category: 'deep_learning' },
  { slug: 'transfer-learning', name: 'Transfer Learning', category: 'deep_learning' },
  { slug: 'image-augmentation', name: 'Image Augmentation', category: 'deep_learning' },
  { slug: 'gpt-4', name: 'GPT-4', category: 'platforms_tools' },
  { slug: 'pinecone', name: 'Pinecone', category: 'platforms_tools' },
  { slug: 'embeddings', name: 'Embeddings', category: 'applied_ai' },
  { slug: 'pytorch', name: 'PyTorch', category: 'deep_learning' },
  { slug: 'docker', name: 'Docker', category: 'production_engineering' },
  { slug: 'github-actions', name: 'GitHub Actions', category: 'production_engineering' },
];
