import { Model, Project, SavedPrompt, Session, Message } from "./types";

export const models: Model[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", tag: "Fast" },
  { id: "o3", name: "o3", provider: "openai", tag: "Reasoning" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "anthropic", tag: "Balanced" },
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "anthropic", tag: "Deep" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google" },
  { id: "mistral-large", name: "Mistral Large", provider: "mistral" },
];

const msg = (
  id: string,
  role: "user" | "assistant",
  content: string,
  minutesAgo: number,
  model?: string
): Message => ({
  id,
  role,
  content,
  timestamp: new Date(Date.now() - minutesAgo * 60000),
  model,
});

export const sampleSessions: Session[] = [
  {
    id: "s1",
    title: "Migration strategy — monolith to services",
    model: models[3],
    createdAt: new Date(Date.now() - 5400000),
    updatedAt: new Date(Date.now() - 300000),
    messages: [
      msg(
        "m1",
        "user",
        "We have a Django monolith handling 40k RPM across 12 domain areas. Leadership wants microservices. I think we should strangler-fig it. Walk me through the risks I'm not seeing.",
        45
      ),
      msg(
        "m2",
        "assistant",
        "The strangler fig is the right instinct — but the risks people underestimate here are operational, not architectural:\n\n**1. Distributed transaction boundaries**\nYour monolith currently gets implicit transactional consistency across those 12 domains. The moment you extract even one service, every cross-domain write becomes a coordination problem. Map your transaction boundaries before you extract anything.\n\n**2. Data gravity**\nThe hardest part won't be splitting code — it'll be splitting the database. Shared tables, implicit joins across domains, and reporting queries that touch everything. You need a domain-ownership map of every table before you start.\n\n**3. Operational readiness gap**\nGoing from \"deploy one thing\" to \"deploy and observe 4-5 things\" requires observability infrastructure most teams don't have. You need distributed tracing, centralized logging, and per-service SLOs before the first extraction — not after.\n\n**4. Team topology mismatch**\nMicroservices only work if team boundaries match service boundaries. If two teams still share a service, you've added network latency for no organizational benefit.\n\n**5. The performance cliff**\nAt 40k RPM, you're probably relying on in-process calls between domains that are currently sub-millisecond. Those become network calls with serialization overhead. Profile the hot paths first — some domains may need to stay co-located.\n\nMy recommendation: extract one low-coupling domain as a proof of concept. Billing or notifications are classic candidates. Build the operational muscle before touching anything in the critical path.",
        42,
        "Claude Opus 4"
      ),
      msg(
        "m3",
        "user",
        "Good. The database coupling is our biggest fear. We have 340 tables and no clear ownership map. How do you recommend we build one?",
        20
      ),
      msg(
        "m4",
        "assistant",
        "Start with the data, not the org chart:\n\n**Phase 1: Automated discovery**\nQuery your foreign key relationships and generate a dependency graph:\n\n```sql\nSELECT\n  tc.table_name AS source_table,\n  ccu.table_name AS referenced_table,\n  tc.constraint_name\nFROM information_schema.table_constraints tc\nJOIN information_schema.constraint_column_usage ccu\n  ON tc.constraint_name = ccu.constraint_name\nWHERE tc.constraint_type = 'FOREIGN KEY'\nORDER BY source_table;\n```\n\nThis gives you explicit relationships. The implicit ones — tables joined in application code without foreign keys — are where the real coupling hides.\n\n**Phase 2: Query analysis**\nPull your slow query log and application query patterns. Any query that joins tables from different candidate domains is a coupling point you'll need to resolve.\n\n**Phase 3: Write-path mapping**\nFor each table, identify which code paths write to it. If multiple domains write to the same table, that table is contested territory.\n\n**Phase 4: Cluster assignment**\nGroup tables by connectivity. Tables with high internal coupling and low external coupling belong together — this is a graph partitioning problem.\n\nThe output: a spreadsheet with every table, its owning domain, external consumers, and access pattern. That document becomes your extraction roadmap.",
        16,
        "Claude Opus 4"
      ),
    ],
  },
  {
    id: "s2",
    title: "Eval harness for retrieval pipeline",
    model: models[0],
    createdAt: new Date(Date.now() - 14400000),
    updatedAt: new Date(Date.now() - 7200000),
    messages: [
      msg(
        "m5",
        "user",
        "I need to build an evaluation harness for our RAG pipeline. We have 200 test questions with ground-truth answers and source documents. What metrics should I track and how should I structure the harness?",
        180
      ),
      msg(
        "m6",
        "assistant",
        "For a RAG eval harness you need metrics at two levels — retrieval quality and generation quality — and the infrastructure to run them reproducibly.\n\n**Retrieval metrics**\n- **Recall@k**: Of the relevant documents, how many appear in the top k retrieved?\n- **MRR**: How high does the first relevant document appear? LLMs weight earlier context more heavily.\n- **Precision@k**: What fraction of retrieved documents are actually relevant? High precision = less noise in the context window.\n\n**Generation metrics**\n- **Faithfulness**: Does the answer only contain claims supported by retrieved documents?\n- **Answer correctness**: Semantic similarity to ground truth. Use LLM-as-judge with a rubric.\n- **Answer relevance**: Does the response actually address the question?\n\n**Harness structure**\n```python\n@dataclass\nclass EvalCase:\n    question: str\n    ground_truth: str\n    source_doc_ids: list[str]\n\n@dataclass\nclass EvalResult:\n    case: EvalCase\n    retrieved_docs: list[str]\n    generated_answer: str\n    retrieval_scores: dict[str, float]\n    generation_scores: dict[str, float]\n    latency_ms: float\n\ndef run_eval(cases: list[EvalCase], pipeline: Pipeline) -> list[EvalResult]:\n    results = []\n    for case in cases:\n        t0 = time.perf_counter()\n        docs = pipeline.retrieve(case.question)\n        answer = pipeline.generate(case.question, docs)\n        latency = (time.perf_counter() - t0) * 1000\n\n        results.append(EvalResult(\n            case=case,\n            retrieved_docs=docs,\n            generated_answer=answer,\n            retrieval_scores=score_retrieval(docs, case.source_doc_ids),\n            generation_scores=score_generation(answer, case.ground_truth),\n            latency_ms=latency,\n        ))\n    return results\n```\n\nKey decisions: version your test set, store results with pipeline config hashes for comparison, and run LLM scoring at temperature 0 for reproducibility.",
        175,
        "GPT-4o"
      ),
    ],
  },
  {
    id: "s3",
    title: "TypeScript conditional types — mental model",
    model: models[2],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 82800000),
    messages: [
      msg(
        "m7",
        "user",
        "I keep hitting a wall with conditional types in TypeScript. I understand the basics but I can't build the type-level logic I need for our API layer. Give me the mental model, not the syntax.",
        1440
      ),
      msg(
        "m8",
        "assistant",
        "The mental model: **conditional types are pattern matching on the type level.**\n\nThink of `T extends U ? X : Y` not as an if-statement, but as a pattern match. You're asking: does the shape T fit inside the shape U?\n\nThe key insight: **`infer` is a capture group.** Like regex capture groups extract parts of a string, `infer` extracts parts of a type.\n\n```typescript\n// If T is a Promise of something, capture that something\ntype Unwrap<T> = T extends Promise<infer R> ? R : T;\n\n// If T is a function, capture its return type\ntype ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;\n```\n\nThe second insight: **conditional types distribute over unions.** When T is `A | B | C`, the conditional runs for each member separately:\n\n```typescript\ntype Stringify<T> = T extends number ? string : T;\n\n// Stringify<number | boolean>\n// = Stringify<number> | Stringify<boolean>\n// = string | boolean\n```\n\nThis is both the most powerful and most confusing behavior. It's why you sometimes need `[T] extends [U]` — wrapping in a tuple prevents distribution.\n\n**For your API layer**: define your schema as a type literal, then use mapped types + conditional types + `infer` to derive request/response types from route definitions. The type system becomes a compile-time code generator.\n\nShow me your API layer structure and I'll build the specific utility types.",
        1435,
        "Claude Sonnet 4"
      ),
    ],
  },
  {
    id: "s4",
    title: "Incident post-mortem — rate limiter outage",
    model: models[0],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 170000000),
    messages: [
      msg(
        "m9",
        "user",
        "We had a 47-minute outage last night. A config change to our rate limiter caused all API requests to return 429s. I need to write the post-mortem. Help me structure it so it leads to real action items, not blame.",
        2880
      ),
      msg(
        "m10",
        "assistant",
        "Structure for systemic improvement, not narrative:\n\n**Impact**: 47-minute full API outage. All authenticated endpoints returned 429. Quantify affected users, failed requests, and downstream impact.\n\n**Timeline** (UTC, tight):\n- HH:MM — Config deployed\n- HH:MM — First alerts (note detection latency)\n- HH:MM — On-call acknowledges\n- HH:MM — Root cause identified\n- HH:MM — Rollback initiated\n- HH:MM — Recovery confirmed\n\n**Root cause**: Be precise. Not \"config change broke things\" — instead: \"per-tenant limit was set to 0 instead of 10000 because the config format expects requests-per-second but the value was entered as requests-per-minute, and no validation rejects zero-values.\"\n\n**Contributing factors** (where the real learning is):\n- Why did the config format allow this ambiguity?\n- Why no validation for obviously wrong values?\n- Why didn't staging catch it?\n- Why was detection latency N minutes?\n\n**Action items** (each: owner, deadline, priority):\n1. Config validation rejecting limit values below a sane minimum\n2. Integration test: deploy config to staging, verify baseline traffic passes\n3. Lower 429-spike alerting threshold\n4. Rate limiter config changes require peer review\n\nEvery action item should make this class of failure harder or faster to detect.",
        2875,
        "GPT-4o"
      ),
    ],
  },
];

export const sampleProjects: Project[] = [
  {
    id: "p1",
    name: "Platform Migration",
    sessions: [sampleSessions[0]],
    color: "#7c82f8",
  },
  {
    id: "p2",
    name: "ML Infrastructure",
    sessions: [sampleSessions[1]],
    color: "#6d9cf8",
  },
  {
    id: "p3",
    name: "Core API",
    sessions: [sampleSessions[2], sampleSessions[3]],
    color: "#8b7cf8",
  },
];

export const savedPrompts: SavedPrompt[] = [
  {
    id: "sp1",
    title: "Adversarial Review",
    content:
      "Review this code as if you're trying to break it. Focus on edge cases, concurrency issues, security holes, and implicit assumptions. Don't suggest style changes.",
    tags: ["code", "review"],
  },
  {
    id: "sp2",
    title: "Senior Explainer",
    content:
      "Explain this assuming I'm a senior engineer. Skip the basics. Focus on non-obvious trade-offs, failure modes, and things that only matter at scale.",
    tags: ["learning"],
  },
  {
    id: "sp3",
    title: "Decision Matrix",
    content:
      "I need to choose between these approaches. Compare on: correctness guarantees, operational complexity, failure blast radius, team ramp-up time, and migration path from current state.",
    tags: ["architecture"],
  },
  {
    id: "sp4",
    title: "Test Strategy",
    content:
      "Design a test strategy for this component. Cover: unit tests for pure logic, integration tests for boundaries, and the specific edge cases most likely to cause production incidents.",
    tags: ["testing", "code"],
  },
  {
    id: "sp5",
    title: "Post-Mortem Structure",
    content:
      "Help me write a post-mortem for this incident. Structure: impact quantification, precise timeline, root cause chain (not symptoms), contributing systemic factors, and action items with owners.",
    tags: ["operations"],
  },
  {
    id: "sp6",
    title: "API Contract Review",
    content:
      "Review this API design for backwards compatibility, versioning strategy, error contract completeness, and whether the naming will still make sense in two years.",
    tags: ["architecture", "review"],
  },
];

/**
 * Mock handoff responses — keyed by target model ID.
 * Each returns a believable response to common handoff scenarios
 * (architecture, code review, implementation). In production these
 * would come from real provider APIs.
 */
export const handoffResponses: Record<string, (context: string) => string> = {
  "gpt-4o": (context) =>
    `Looking at the context you've handed off, here's my take:\n\n${context.length > 200 ? "This is a substantial thread. Let me focus on the actionable parts.\n\n" : ""}**Quick assessment:**\nThe approach outlined is solid. A few things I'd tighten up:\n\n1. **Error boundaries** — the current thinking assumes the happy path. Add explicit failure modes for each step.\n2. **Sequencing** — some of these steps can be parallelized. Don't serialize what can overlap.\n3. **Validation** — before committing to this direction, define the acceptance criteria. What does "done" look like?\n\nI can draft implementation code for any of these if you want to move from planning to execution.`,

  "o3": (context) =>
    `Let me reason through this step by step.\n\n${context.length > 200 ? "Given the depth of the prior conversation, I'll focus on the core decision points.\n\n" : ""}**Reasoning chain:**\n\n→ The initial framing is correct but under-constrained. The solution space is larger than presented.\n→ There are at least two non-obvious failure modes: state inconsistency during the transition, and the observability gap between old and new behavior.\n→ The recommended sequence has an implicit dependency that isn't called out — step 3 requires step 1 to be fully validated, not just deployed.\n\n**Key insight:** The real risk isn't in the implementation — it's in the rollback plan. If step 2 fails, can you cleanly revert without data loss? That question should be answered before moving forward.\n\n**Recommendation:** Build a decision gate between each phase. Proceeding without one is how 47-minute outages become 4-hour outages.`,

  "claude-sonnet-4": (context) =>
    `Continuing from the handoff:\n\n${context.length > 200 ? "I've reviewed the full thread. Here's where I think the conversation should go next.\n\n" : ""}The analysis so far is thorough on the **what** and **why** — but light on the **how**. Let me close that gap.\n\n**Implementation sketch:**\n\n\`\`\`typescript\n// Phase 1: Define the boundary contract\ninterface MigrationGate {\n  phase: string;\n  preconditions: () => Promise<boolean>;\n  execute: () => Promise<void>;\n  rollback: () => Promise<void>;\n  validate: () => Promise<boolean>;\n}\n\n// Phase 2: Wire the gates\nconst gates: MigrationGate[] = [\n  {\n    phase: \"schema-separation\",\n    preconditions: async () => await verifyNoActiveWrites(),\n    execute: async () => await splitSharedTables(),\n    rollback: async () => await restoreOriginalSchema(),\n    validate: async () => await runIntegrationSuite(),\n  },\n];\n\`\`\`\n\nEach gate is independently testable and reversible. The key property: **no gate mutates shared state until its preconditions pass.**\n\nWant me to flesh out the full gate sequence for your specific domain areas?`,

  "claude-opus-4": (context) =>
    `I've reviewed the full context from the handoff. Let me offer a different perspective.\n\n${context.length > 200 ? "The prior conversation did good work establishing the problem space. Where I'll add value is in reframing the approach.\n\n" : ""}**The deeper question here isn't technical — it's organizational.**\n\nYou can have a technically sound migration plan that fails because it requires sustained coordination across teams that don't share priorities. Before optimizing the technical sequence, map the organizational dependencies:\n\n1. **Who owns the shared tables today?** Not on paper — in practice. Who gets paged when they break?\n2. **What's the incentive structure?** Teams that own stable services have no incentive to absorb migration risk for another team's extraction.\n3. **Where's the forcing function?** Without external pressure (scaling limits, compliance, talent retention), migrations stall at ~30% completion.\n\nThe technical plan should encode these realities. Build gates not just around technical preconditions, but around organizational readiness: team staffing, on-call coverage, and stakeholder sign-off.\n\n**My recommendation:** Treat this as a sociotechnical problem. The architecture follows the org chart — so fix the org chart first, or accept that the architecture will reflect the current one.`,

  "gemini-2.5-pro": (context) =>
    `Thanks for the context handoff. Let me synthesize and add my perspective.\n\n${context.length > 200 ? "There's a lot of good thinking in the thread already. I'll focus on gaps and alternatives.\n\n" : ""}**Alternative framing:**\n\nThe conversation has been centered on a phased migration. But there's a third option worth considering: **modular monolith** as an intermediate step.\n\nInstead of going directly from monolith → microservices:\n\n1. Extract domain modules within the monolith\n2. Enforce strict interface boundaries (no cross-module DB access)\n3. Add module-level metrics and monitoring\n4. Only extract to a service when you have data proving the module needs independent scaling\n\n**Why this might be better:**\n- You get 80% of the organizational benefit (clear ownership) without the operational complexity\n- You can measure actual coupling before committing to network boundaries\n- Rollback is trivial — it's still one deployment unit\n\n**Data point:** Teams that go directly to microservices from a monolith report 2-3x the migration timeline versus those that do modular monolith first.\n\nThis isn't the exciting answer, but it might be the right one for 40k RPM with 12 domain areas.`,

  "mistral-large": (context) =>
    `Context received. Here's my analysis.\n\n${context.length > 200 ? "Building on the existing discussion:\n\n" : ""}**Summary of what's been established:**\n- The problem is well-defined\n- The directional approach is sound\n- The main risks are operational, not architectural\n\n**What I'd add:**\n\nThe conversation hasn't addressed **testing strategy** for the migration itself. You need:\n\n1. **Shadow traffic** — replay production traffic against the new path and diff the results\n2. **Contract tests** — verify that the extracted service honors the same invariants as the monolith code path\n3. **Chaos injection** — deliberately fail the new service and verify the fallback works\n\nWithout these, you're flying blind after each extraction step. The eval harness concept from your other session would actually map well here — treat the migration as a pipeline with measurable quality gates.\n\nShall I draft the testing matrix?`,
};

export const providerColors: Record<string, string> = {
  openai: "#10a37f",
  anthropic: "#d4a574",
  google: "#4285f4",
  mistral: "#ff7000",
};

export const providerNames: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  mistral: "Mistral",
};
