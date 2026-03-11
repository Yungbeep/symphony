"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted mb-4">
          <Sparkles size={14} className="text-accent" />
          <span>Your AI workflow, unified</span>
        </div>

        <Logo size="lg" />

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
          One workspace.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
            Every model.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto leading-relaxed">
          Symphony is a premium environment for AI power users.
          Organize sessions, switch providers, save prompts, and work
          faster — all in one polished interface.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/workspace">
            <Button size="lg" className="group">
              Open Workspace
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/50">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted/30" />
      </div>
    </section>
  );
}
