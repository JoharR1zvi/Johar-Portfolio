-- Extensions needed by the core schema. pgvector is added in a later
-- migration once the RAG pipeline is actually built (Phase 5) — enabling it
-- now with no consumer would be dead weight.
create extension if not exists pgcrypto with schema extensions;
