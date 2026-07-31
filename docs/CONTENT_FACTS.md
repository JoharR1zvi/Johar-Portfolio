# Content Facts

The compact factual source of truth for all portfolio content, transcribed
from the project specification document so future work doesn't require
re-parsing the source document. When sources disagree,
this file's precedence order governs. Never invent facts beyond what's here;
missing information gets an explicit placeholder or hidden draft state, never
a fabricated value.

## Source precedence (highest to lowest)

1. Direct corrections/confirmations from Johar, dated (see "Direct confirmations" below for ones given after the master prompt).
2. Direct corrections in the master prompt dated 2026-07-31.
3. The current one-page AI/ML resume (`JoharInfo/Johar_Rizvi_Resume_AIML_OnePage_1.docx`).
4. The live GitHub repository state.
5. The Swiggy project notes (`JoharInfo/Swiggy Instamart Agent - Project Notes.pdf`), except where overridden above.
6. The F1 project brief (`JoharInfo/F1_Race_Predictor_Project_Report.docx`) — treated as a working draft, targets/results may change.
7. The older verbose CV (`JoharInfo/Johar_Rizvi_CV.pdf`) — supplemental background/older projects only, **never a source for anything publishable verbatim** (see privacy exclusions).

## Direct confirmations from Johar (post-launch, dated)

- **2026-07-31**: Confirmed personal fluency with **PyTorch, TensorFlow, Docker, and GitHub Actions** — these were previously omitted from the skills capability map and skin-lesion project's technology tags because the master prompt's illustrative list didn't have project-level confirmation for them. Seeded: PyTorch as `used_in_project` on the skin-lesion classifier (the project's stated deep-learning framework); TensorFlow as `exploring` on the same project (confirmed fluency, but PyTorch is the framework actually used there); Docker and GitHub Actions as `used_in_project` on the Swiggy Instamart assistant.
- **2026-07-31**: All portfolio project case-study copy should be written in first person ("I built...", not "Johar built...") — this is Johar's own voice addressing a recruiter directly, not third-party documentation.

## Public identity and contact data

- Name: Johar Rizvi
- Primary title: Applied AI/ML Engineer
- Supporting descriptor: Data Scientist | Healthcare AI
- Location: Oldenburg, Germany
- Public email: thejoharrizvi@gmail.com
- GitHub: JoharR1zvi — https://github.com/JoharR1zvi
- LinkedIn: https://www.linkedin.com/in/johar-rizvi/
- MSc: Data Science and Machine Learning, Carl von Ossietzky University of Oldenburg, Oct 2025 – Present (no graduation date — do not invent one). Specialization wording: medical data / Data Science and Machine Learning in Medicine and Health Care.
- BEng: Information Technology, Padre Conceicao College of Engineering, Aug 2020 – Jul 2024.
- Languages: English (native), Hindi (native), German (A2, learning — never imply fluency).

## Privacy exclusions — never publish, never store outside this reference file

Street address, phone/WhatsApp number, passport details, date of birth, place of birth, nationality, or any other private identifier from the older CV. Must never appear in HTML, metadata, structured data, database seeds, logs, test fixtures, or the RAG knowledge base.

## Locked positioning and voice

Hero must use one identity, not five job titles. Recommended hero copy, tone rules, and banned buzzwords (AI enthusiast/ninja/wizard/rockstar/"cutting-edge expert"/"production-grade" unless truly earned) are specified in section 5 of the master prompt — use verbatim as the starting draft, editable later. Healthcare content always uses "prototype"/"decision-support" language with explicit non-diagnostic limitations.

## Flagship projects (homepage priority order)

### 1. PE-CDSS — Multimodal Clinical Guideline RAG

- Status: Completed academic prototype · Group MSc project
- Johar's contribution: designed and implemented the multimodal RAG guideline assistant — **not** the entire clinical system
- Repo: https://github.com/JoharR1zvi/PE_CDSS (shown as a fork on GitHub — must state contribution boundary clearly)
- Safety label: Research/educational prototype — not a diagnostic tool
- Key proof points: pdfplumber text extraction, structured table extraction, local LLaVA (via Ollama) figure/flowchart descriptions, local all-MiniLM-L6-v2 embeddings in ChromaDB with page/content-type metadata, parallel general + table-only retrieval, translate-at-the-edges bilingual architecture, React/Vite + FastAPI, citations shown in chat UI.

### 2. Swiggy Instamart Agentic Shopping Assistant

- Status: Working proof-of-concept/MVP · Two-person team project
- **Current truth (overrides older notes)**: core flows work; integration has been tested with a real Swiggy developer key. Never expose that key; never let anonymous visitors trigger purchase actions.
- Repo/demo: manually managed, not assumed public — support private/coming-soon state
- Public demo must be mock/sanitized only — no real key, account, address, cart, checkout, or purchase action ever
- Key proof points: LangGraph StateGraph orchestrator, 5 user-facing capabilities (meal suggestions, recurring grocery lists, photo/voice discovery, recipe-to-cart planning, conversational cart editing), 13 typed JSON-RPC MCP tool wrappers, OAuth 2.1+PKCE, SQLite checkpointing, APScheduler, human-in-the-loop approval pauses, Pydantic structured outputs, 55+ mocked tests
- "What broke and what we learned" is a feature, not a liability — present engineering maturity, not current broken status: stale state, router misclassification, code-fenced JSON, dead node wiring, fallback search, address binding, mock-vs-live assumptions
- Never claim production-ready or that a real purchase occurred unless Johar later supplies that exact verified fact

### 3. Formula 1 Race Outcome Predictor

- Status: In progress · Personal MSc data science project
- Repo: https://github.com/JoharR1zvi/F1-race-predictor
- **Caveat**: targets, modelling choices, and metrics may change — never freeze unstable claims in UI code
- Stable facts safe to show now: Jolpica + FastF1 + OpenF1 data integrated for 2022–2025; ~100,000 lap-level records, 1,838-row race-entry master dataset; caching/retry/backoff/rate-limit handling; a bridge-table fix that prevented a many-to-many join explosion; weather/qualifying/DNF data-quality fixes; leakage-aware rolling features (`shift(1)`) and time-based validation
- **Do not show final accuracy/ROC-AUC/best-model claims** until Johar confirms the final target and validated results
- **Documentation mismatch to fix before launch**: the public README currently says feature engineering/modelling are not started, which is stale — add to launch checklist

### 4. CNN-Based Skin-Lesion Classification

- Status: Completed bachelor's capstone · Four-person team, Johar was team lead
- Repo not currently public
- Safety label: Academic image-classification prototype — not a diagnostic tool
- EfficientNet transfer-learning, 7-class dermatoscopic classification
- **The resume's reported 90% accuracy must be stored with a verification flag** and only displayed publicly once Johar supplies dataset/evaluation context or explicitly approves the claim
- Prefer "skin-lesion classification" over "skin cancer detection" in all copy

## Supporting work and archive (lower priority)

- Goa Legislative Assembly RAG assistant — internship project (Inertia Technologies, Jul–Aug 2023), natural-language search over 3,000+ pages/records, GPT-4, Ada embeddings, Pinecone.
- Cafe POS and business analytics system — include only once screenshots/architecture/code exist.
- College textbook software, hotel booking software, automatic irrigation system, robotics competition, Sudoku solver — optional archive/timeline only, not the main project grid, unless evidence is added.

## Journey / timeline facts

- MSc Data Science and Machine Learning, Carl von Ossietzky University of Oldenburg, Oct 2025 – Present.
- Junior Technical Project Manager, Remote Software Solutions (FLR Spectron), Jul 2024 – Sep 2025 — 5+ technical projects, cross-functional delivery. The "$1M+ budget" statement is used only because it's in the current resume — keep wording precise, non-sensational.
- Artificial Intelligence Intern, Inertia Technologies, Jul–Aug 2023 — RAG assistant over 3,000+ pages of Goa Legislative Assembly records (GPT-4, embeddings, Pinecone).
- BEng Information Technology, Padre Conceicao College of Engineering, Aug 2020 – Jul 2024.
- Python for Data Science and Machine Learning Bootcamp — low-priority certificate.
- IELTS Band 8.0 — belongs under languages/communication, not as a technical certification.

## GitHub review findings to act on

- Public repos currently: F1-race-predictor, PE_CDSS, and the profile config repo.
- Profile README is outdated (says "currently learning Python") — draft a replacement in `GITHUB_PROFILE_README_DRAFT.md`, do not push without explicit approval.
- F1 README says feature engineering/modelling not started — stale vs. the actual project brief; add to pre-launch checklist.
- PE_CDSS shows as a fork — portfolio copy must clearly state the RAG feature was Johar's contribution to a group project.
- Swiggy project is not publicly visible on GitHub — support manually-managed repo/demo link and private/coming-soon state.
