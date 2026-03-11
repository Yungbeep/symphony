"use client";

export function Preview() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            A workspace that feels right
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Clean panels. Fast navigation. Every detail considered.
          </p>
        </div>

        {/* Workspace mockup */}
        <div className="relative rounded-2xl border border-border overflow-hidden shadow-2xl shadow-black/20">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="ml-3 text-xs text-muted font-mono">symphony — workspace</span>
          </div>

          {/* App body */}
          <div className="flex h-[400px] bg-background">
            {/* Sidebar mock */}
            <div className="w-56 border-r border-border bg-surface p-4 space-y-3">
              <div className="text-xs text-muted uppercase tracking-wider mb-4">Projects</div>
              {["Web App Rebuild", "Data Pipeline", "API Design"].map((name, i) => (
                <div
                  key={name}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                    i === 0 ? "bg-accent/10 text-accent" : "text-muted"
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: ["#6366f1", "#8b5cf6", "#a855f7"][i] }}
                  />
                  {name}
                </div>
              ))}
              <div className="!mt-6 text-xs text-muted uppercase tracking-wider mb-3">Recent</div>
              {["React architecture", "Pipeline optimization"].map((name) => (
                <div key={name} className="px-3 py-2 text-sm text-muted/70 truncate">
                  {name}
                </div>
              ))}
            </div>

            {/* Main area mock */}
            <div className="flex-1 flex flex-col">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <span className="text-sm font-medium">React architecture discussion</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-accent/10 text-accent font-medium">
                    Claude Sonnet 4
                  </span>
                </div>
              </div>

              {/* Messages mock */}
              <div className="flex-1 p-5 space-y-4 overflow-hidden">
                <div className="flex justify-end">
                  <div className="max-w-sm px-4 py-3 rounded-2xl rounded-tr-md bg-accent/15 text-sm">
                    What&apos;s the best way to structure a large React app?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-md px-4 py-3 rounded-2xl rounded-tl-md bg-surface-2 text-sm text-muted">
                    For large React applications, I recommend a layered architecture with feature-based folders...
                  </div>
                </div>
              </div>

              {/* Input mock */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface">
                  <span className="flex-1 text-sm text-muted/50">Message Symphony...</span>
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
