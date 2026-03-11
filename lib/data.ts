import { Model, Project, SavedPrompt, Session, Message } from "./types";

export const models: Model[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", tag: "Fast" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "anthropic", tag: "Balanced" },
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "anthropic", tag: "Powerful" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google" },
  { id: "mistral-large", name: "Mistral Large", provider: "mistral" },
];

const msg = (id: string, role: "user" | "assistant", content: string, minutesAgo: number, model?: string): Message => ({
  id,
  role,
  content,
  timestamp: new Date(Date.now() - minutesAgo * 60000),
  model,
});

export const sampleSessions: Session[] = [
  {
    id: "s1",
    title: "React architecture discussion",
    model: models[2],
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 600000),
    messages: [
      msg("m1", "user", "What's the best way to structure a large React application with shared state across deeply nested components?", 30),
      msg("m2", "assistant", "For large React applications, I recommend a layered architecture:\n\n**1. Feature-based folder structure**\nOrganize by feature rather than by type. Each feature folder contains its components, hooks, utils, and types.\n\n**2. State management strategy**\n- **Local state**: `useState` for component-specific state\n- **Shared state**: React Context for theme/auth, or Zustand/Jotai for complex cross-cutting state\n- **Server state**: TanStack Query for API data with caching\n\n**3. Component layers**\n- `ui/` — Pure presentational components (buttons, inputs)\n- `features/` — Business logic components\n- `layouts/` — Page shells and navigation\n\n**4. Custom hooks**\nExtract shared logic into hooks. Keep components thin — they should mostly compose hooks and render UI.\n\nThis approach scales well because each feature is self-contained, and the dependency graph stays clean.", 28, "Claude Sonnet 4"),
      msg("m3", "user", "How would you handle authentication state specifically?", 15),
      msg("m4", "assistant", "Authentication is best handled with a dedicated context provider at the app root:\n\n```tsx\n// auth-context.tsx\nconst AuthContext = createContext<AuthState>(null!);\n\nexport function AuthProvider({ children }: { children: ReactNode }) {\n  const [user, setUser] = useState<User | null>(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    // Check session on mount\n    checkSession().then(setUser).finally(() => setLoading(false));\n  }, []);\n\n  return (\n    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>\n      {children}\n    </AuthContext.Provider>\n  );\n}\n```\n\nKey principles:\n- Keep the auth provider at the root but keep it lean\n- Use a `loading` state to prevent flash of unauthenticated content\n- Store tokens in httpOnly cookies, not localStorage\n- Create a `useAuth()` hook for clean access anywhere", 12, "Claude Sonnet 4"),
    ],
  },
  {
    id: "s2",
    title: "Python data pipeline optimization",
    model: models[0],
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    messages: [
      msg("m5", "user", "I have a pandas pipeline processing 2M rows and it's taking 45 seconds. How can I speed it up?", 120),
      msg("m6", "assistant", "Here are the highest-impact optimizations, roughly in order of effort:\n\n**1. Use vectorized operations** (biggest win)\nReplace `.apply()` and `.iterrows()` with native pandas/numpy operations. A vectorized operation on 2M rows can be 100x faster.\n\n**2. Optimize dtypes**\n```python\ndf['category_col'] = df['category_col'].astype('category')\ndf['int_col'] = pd.to_numeric(df['int_col'], downcast='integer')\n```\nThis alone can cut memory usage by 70% and speed up groupby operations.\n\n**3. Use PyArrow backend**\n```python\ndf = pd.read_csv('data.csv', engine='pyarrow', dtype_backend='pyarrow')\n```\n\n**4. Consider Polars for the hot path**\nIf specific transformations are bottlenecks, Polars can be 5-10x faster than pandas for grouped aggregations.\n\n**5. Profile first**\n```python\nimport line_profiler\n# Identify which specific operations are slow\n```\n\nWhat does your pipeline look like? I can give more targeted advice.", 118, "GPT-4o"),
    ],
  },
  {
    id: "s3",
    title: "API design review",
    model: models[4],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 82800000),
    messages: [
      msg("m7", "user", "Review this REST API design for a task management system and suggest improvements.", 1440),
      msg("m8", "assistant", "I'd suggest several improvements to make this API more consistent and scalable:\n\n**Naming & Structure**\n- Use plural nouns: `/tasks` not `/task`\n- Nest related resources: `/projects/{id}/tasks`\n- Use kebab-case for multi-word paths: `/task-comments`\n\n**Pagination**\n- Add cursor-based pagination for list endpoints\n- Return metadata: `{ data: [...], cursor: \"abc\", hasMore: true }`\n\n**Filtering & Sorting**\n- Support query params: `GET /tasks?status=open&sort=-createdAt`\n- Use a consistent filter syntax across all list endpoints\n\n**Error Responses**\n- Standardize error format with machine-readable codes\n- Include field-level validation errors for 422 responses\n\n**Versioning**\n- Use header-based versioning: `Accept: application/vnd.api+json;version=1`\n- Avoid URL-based versioning (`/v1/`) — it complicates routing\n\nOverall the foundation is solid. These changes will make it more predictable for consumers.", 1435, "Gemini 2.5 Pro"),
    ],
  },
];

export const sampleProjects: Project[] = [
  {
    id: "p1",
    name: "Web App Rebuild",
    sessions: [sampleSessions[0]],
    color: "#6366f1",
  },
  {
    id: "p2",
    name: "Data Pipeline",
    sessions: [sampleSessions[1]],
    color: "#8b5cf6",
  },
  {
    id: "p3",
    name: "API Design",
    sessions: [sampleSessions[2]],
    color: "#a855f7",
  },
];

export const savedPrompts: SavedPrompt[] = [
  {
    id: "sp1",
    title: "Code Review",
    content: "Review the following code for bugs, performance issues, and best practice violations. Be specific and suggest fixes.",
    tags: ["development", "review"],
  },
  {
    id: "sp2",
    title: "Explain Like I'm Senior",
    content: "Explain this concept assuming I'm a senior engineer. Skip basics, focus on nuances, trade-offs, and edge cases.",
    tags: ["learning", "technical"],
  },
  {
    id: "sp3",
    title: "Architecture Decision",
    content: "I need to decide between the following approaches. Compare them on: performance, maintainability, team familiarity, and long-term scalability.",
    tags: ["architecture", "decision"],
  },
  {
    id: "sp4",
    title: "Write Tests",
    content: "Write comprehensive tests for the following code. Include edge cases, error scenarios, and boundary conditions.",
    tags: ["testing", "development"],
  },
  {
    id: "sp5",
    title: "Refactor Prompt",
    content: "Refactor this code to improve readability and maintainability. Preserve behavior exactly. Explain each change.",
    tags: ["development", "refactoring"],
  },
  {
    id: "sp6",
    title: "Debug Assistant",
    content: "Help me debug this issue. Here's what I've tried, the error I'm seeing, and the expected behavior. Walk me through a systematic diagnosis.",
    tags: ["debugging", "development"],
  },
];

export const providerColors: Record<string, string> = {
  openai: "#10a37f",
  anthropic: "#d4a574",
  google: "#4285f4",
  mistral: "#ff7000",
};
