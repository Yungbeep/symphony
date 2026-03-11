"use client";

export function Preview() {
  return (
    <section className="py-28 px-6 section-glow">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            See the workspace
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Projects on the left. Conversation in the center.
            Model selector in the bar. Everything reachable.
          </p>
        </div>

        {/* Workspace mockup */}
        <div className="relative rounded-xl border border-border overflow-hidden shadow-2xl shadow-black/30">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-2 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-3 text-[11px] text-muted-2 font-mono tracking-wide">
              symphony
            </span>
          </div>

          {/* App body */}
          <div className="flex h-[440px] bg-background">
            {/* Sidebar */}
            <div className="w-52 border-r border-border bg-surface flex flex-col">
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-surface-2 text-muted-2 text-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  Search...
                </div>
              </div>
              <div className="px-3 flex-1">
                <div className="text-[10px] text-muted-2 uppercase tracking-[0.1em] px-2 py-1.5 mb-1">
                  Projects
                </div>
                {[
                  { name: "Platform Migration", color: "#7c82f8", active: true },
                  { name: "ML Infrastructure", color: "#6d9cf8", active: false },
                  { name: "Core API", color: "#8b7cf8", active: false },
                ].map((p) => (
                  <div
                    key={p.name}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs mb-0.5 ${
                      p.active
                        ? "bg-accent-subtle text-accent"
                        : "text-muted"
                    }`}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: p.color }}
                    />
                    <span className="truncate">{p.name}</span>
                  </div>
                ))}
                <div className="text-[10px] text-muted-2 uppercase tracking-[0.1em] px-2 py-1.5 mt-4 mb-1">
                  Sessions
                </div>
                {[
                  { name: "Migration strategy — monolith to services", active: true },
                  { name: "Eval harness for retrieval pipeline", active: false },
                  { name: "TypeScript conditional types", active: false },
                  { name: "Incident post-mortem", active: false },
                ].map((s) => (
                  <div
                    key={s.name}
                    className={`px-2.5 py-1.5 rounded-md text-xs mb-0.5 truncate ${
                      s.active
                        ? "bg-accent-subtle text-accent"
                        : "text-muted/70"
                    }`}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-2 border-b border-border shrink-0">
                <span className="text-xs font-medium truncate">
                  Migration strategy — monolith to services
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-surface-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4a574]" />
                    <span className="text-muted">Claude Opus 4</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden px-6 py-5 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[75%] px-3.5 py-2.5 rounded-xl rounded-tr-sm bg-accent-subtle text-xs leading-relaxed">
                    We have a Django monolith handling 40k RPM. Walk me through the risks of strangler-fig migration I&apos;m not seeing.
                  </div>
                </div>
                {/* Assistant message */}
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-surface-2 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><path d="M12 3v18M5.5 8l13 8M5.5 16l13-8"/></svg>
                  </div>
                  <div className="max-w-[80%]">
                    <div className="px-3.5 py-2.5 rounded-xl rounded-tl-sm bg-surface border border-border text-xs leading-relaxed text-muted">
                      The strangler fig is the right instinct — but the risks people underestimate are operational, not architectural:
                      <br /><br />
                      <span className="text-foreground font-medium">1. Distributed transaction boundaries</span> — Your monolith gets implicit consistency across 12 domains. The moment you extract one service, every cross-domain write becomes coordination...
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-2">
                      <div className="w-1 h-1 rounded-full bg-[#d4a574]" />
                      Claude Opus 4 · 2m ago
                    </div>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-border bg-surface">
                  <span className="flex-1 text-xs text-muted-2">Continue this thread...</span>
                  <div className="w-6 h-6 rounded-md bg-accent/15 flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
                      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt library panel (partial view) */}
            <div className="w-48 border-l border-border bg-surface flex flex-col">
              <div className="px-3 py-2.5 border-b border-border text-[10px] text-muted-2 uppercase tracking-[0.1em]">
                Prompts
              </div>
              <div className="px-2.5 py-2 space-y-1.5">
                {["Adversarial Review", "Senior Explainer", "Decision Matrix", "Test Strategy"].map(
                  (name) => (
                    <div
                      key={name}
                      className="px-2.5 py-2 rounded-md border border-border text-[11px] text-muted hover:border-accent/20 transition-colors"
                    >
                      {name}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
