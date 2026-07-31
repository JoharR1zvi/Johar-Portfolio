import type { ProjectSeed } from '../../types';

// Source: docs/CONTENT_FACTS.md + master prompt section 10.2. The status
// override is deliberate and important: core flows are tested against a
// real Swiggy developer key, but this must never be presented as
// production-ready, and the public demo must never make live calls.
export const swiggy: ProjectSeed = {
  slug: 'swiggy-instamart-assistant',
  status: 'mvp_poc',
  projectType: 'team',
  teamSize: 2,
  role: 'Co-developed the agent architecture as part of a two-person team',
  homepagePriority: 2,
  safetyLabel: null,
  githubUrl: null,
  demoUrl: null,
  isRepoPublic: false,
  published: true,
  title: 'Swiggy Instamart Agentic Shopping Assistant',
  oneLiner:
    'A conversational grocery assistant on Swiggy Instamart’s MCP interface, tested end-to-end with a real developer key.',
  recruiterSummary:
    "A conversational grocery assistant built on Swiggy Instamart's MCP interface. It can reason over prior purchases, suggest meals, turn recipes into live-catalog shopping plans, support voice/photo discovery, edit carts conversationally, and pause for human approval before checkout.",
  sections: [
    {
      key: 'executive_summary',
      heading: 'Executive summary',
      body: `A working proof-of-concept / MVP built by a two-person team: a conversational grocery assistant on Swiggy Instamart's MCP (Model Context Protocol) interface. Core flows work and the integration has been tested end-to-end with a real Swiggy developer key — this is not just a mocked demo, though it is also not a production system. The assistant can reason over prior purchases, suggest meals, turn recipes into live-catalog shopping plans, support voice and photo-based discovery, edit carts conversationally, and pause for human approval before checkout.`,
    },
    {
      key: 'problem_users_constraints',
      heading: 'Problem, users, and constraints',
      body: `Grocery shopping apps require a lot of manual searching and cart-building even when the user already knows roughly what they want ("something for a vegetarian dinner tonight"). The goal was a conversational layer on top of a real commerce catalog that can turn an intent like that into an actual, editable shopping cart — while keeping a human explicitly in the loop before anything is purchased.

A hard constraint throughout: this is a real commerce integration, so no output from the public version of this project may expose a real account, address, cart, checkout flow, or the Swiggy developer key itself.`,
    },
    {
      key: 'role_contribution',
      heading: "Johar's role and contribution boundary",
      body: `This was a two-person team project. Johar co-developed the agent architecture — the LangGraph orchestration, the tool-calling layer against the Swiggy MCP interface, and the testing strategy described below.`,
    },
    {
      key: 'architecture',
      heading: 'System architecture',
      body: `A LangGraph StateGraph orchestrates the whole assistant using shared typed state and intent-based routing, dispatching a user's message to the right capability: meal suggestions, recurring grocery lists, photo/voice discovery, recipe-to-cart planning, or conversational cart editing.

Underneath, thirteen typed JSON-RPC tool wrappers talk to the Swiggy Instamart MCP interface, with OAuth 2.1 + PKCE handling authentication and address-aware calls accounting for delivery location. SQLite backs checkpointing and persistence across a conversation, and APScheduler drives recurring grocery lists on a schedule.`,
    },
    {
      key: 'data_retrieval_model',
      heading: 'Agent behavior and safety design',
      body: `The assistant pauses for human-in-the-loop approval at two key points: before finalizing product choices and before cart checkout — nothing is purchased without an explicit human confirmation step. Cart operations themselves go through Pydantic structured outputs rather than free-form text parsing, so a malformed model response can't silently corrupt a cart. Where the catalog search doesn't have an exact match, deterministic bounded search fallbacks handle quantity and synonym mismatches rather than leaving the user with a dead end.`,
    },
    {
      key: 'evaluation_results',
      heading: 'Evaluation and results',
      body: `55+ mocked tests cover ranking, dietary gates, quantity calculations, routing, persistence, and state regressions. Beyond mocked testing, the integration has been exercised against a real Swiggy developer key — this real-key testing is what surfaced the protocol and LLM-output issues described in "What broke and what we learned," several of which mocked tests alone could not have exposed.

**This is a working proof-of-concept, not a production system.** It is not claimed to be production-ready, anonymous visitors cannot place real orders through it, and no claim is made about a completed real purchase.`,
    },
    {
      key: 'engineering_decisions',
      heading: 'Key engineering decisions',
      body: `- **Human-in-the-loop by design, not as an afterthought** — approval gates before product selection and before checkout are built into the graph itself, not bolted on.
- **Pydantic structured outputs for every cart-mutating operation** — trades some model flexibility for guaranteed-parseable, safe operations.
- **Deterministic bounded fallback search** rather than relying entirely on the LLM to handle catalog-matching edge cases like quantity or synonym mismatches.`,
    },
    {
      key: 'failures_lessons',
      heading: 'What broke and what we learned',
      body: `Real-key integration testing surfaced issues that mocked tests alone could not expose — presented here as evidence of the debugging and engineering process, not as the project's current state:

- **Stale state** carried over between conversation turns in ways the mocked tests hadn't caught.
- **Router misclassification**, where the intent router sent a message down the wrong capability path.
- **Code-fenced JSON** — the LLM occasionally wrapped structured output in markdown code fences, breaking naive JSON parsing.
- **Dead node wiring** in the LangGraph graph that mocked test paths didn't exercise.
- **Fallback search gaps** exposed only once real catalog data was in play.
- **Address binding** issues specific to real address-aware API calls.
- **Mock-vs-live assumptions** that held in testing but didn't match the real MCP interface's actual behavior.

Each of these has since informed the current design (e.g. the structured-output and fallback-search decisions above).`,
    },
    {
      key: 'deployment_testing_security',
      heading: 'Deployment, testing, and security',
      body: `Testing spans 55+ mocked tests plus real-key integration testing (see above). The real Swiggy developer key used for that testing is never exposed publicly, and the public-facing version of this project (the site's interactive lab simulator) makes no live Swiggy calls at all — it runs against a deterministic mocked state machine instead.`,
    },
    {
      key: 'limitations_responsible_use',
      heading: 'Limitations and responsible use',
      body: `This is a working proof-of-concept / MVP, not a production system. It should not be described or understood as production-ready. Anonymous visitors to the public site cannot place real orders through any part of this project, and no claim is made that a real purchase has been completed through it.`,
    },
    {
      key: 'future_improvements',
      heading: 'Future improvements',
      body: `Continued hardening against the real MCP interface's edge cases, informed directly by the real-key testing findings above.`,
    },
    {
      key: 'links_resources',
      heading: 'Links and resources',
      body: `The repository and any live demo for this project are manually managed and not assumed to be public. A public interactive simulator of the agent's decision graph is available in the site's AI Lab, running entirely on mocked data.`,
    },
  ],
  metrics: [
    {
      key: 'mocked_tests',
      valueText: '55+ mocked tests',
      verified: true,
    },
    {
      key: 'mcp_tool_wrappers',
      valueText: '13 typed JSON-RPC tool wrappers',
      verified: true,
    },
    {
      key: 'user_facing_capabilities',
      valueText: '5 user-facing capabilities',
      verified: true,
    },
  ],
  technologies: [
    { slug: 'langgraph', usage: 'used_in_project' },
    { slug: 'pydantic', usage: 'used_in_project' },
    { slug: 'sqlite', usage: 'used_in_project' },
    { slug: 'oauth-pkce', usage: 'used_in_project' },
    { slug: 'json-rpc', usage: 'used_in_project' },
  ],
};
