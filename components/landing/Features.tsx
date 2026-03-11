"use client";

import {
  Layers,
  Palette,
  FolderOpen,
  BookMarked,
  ArrowLeftRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ArrowLeftRight,
    title: "Multi-Provider",
    description:
      "Switch between OpenAI, Anthropic, Google, and Mistral in one click. Compare outputs side by side.",
  },
  {
    icon: FolderOpen,
    title: "Project Organization",
    description:
      "Group sessions into projects. Keep research, coding, and brainstorming separate and searchable.",
  },
  {
    icon: BookMarked,
    title: "Prompt Library",
    description:
      "Save, tag, and reuse your best prompts. Build a personal toolkit for recurring workflows.",
  },
  {
    icon: Palette,
    title: "Theme System",
    description:
      "Dark and light modes with premium aesthetics. Designed for long sessions and visual clarity.",
  },
  {
    icon: Layers,
    title: "Split View",
    description:
      "Run parallel conversations or compare model responses. Power-user layouts for complex tasks.",
  },
  {
    icon: Zap,
    title: "Keyboard-First",
    description:
      "Fast navigation with shortcuts. Focus mode, quick model switching, and instant prompt insertion.",
  },
];

export function Features() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for how you actually work
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Not another chatbot wrapper. Symphony is a workspace designed
            around the workflows AI power users need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-surface p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="mb-5 inline-flex items-center justify-center w-11 h-11 rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
