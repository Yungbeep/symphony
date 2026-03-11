"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background — single restrained glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-accent/[0.04] blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Pain-aware subhead */}
        <p className="text-sm text-muted tracking-wide mb-8 animate-fade-in">
          You think in one model. You build in another. You lose context in between.
        </p>

        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-[-0.035em] leading-[1.08] mb-7 animate-fade-in-up">
          Stop switching tabs.
          <br />
          <span className="text-muted">Start working.</span>
        </h1>

        <p className="text-lg text-muted leading-relaxed max-w-lg mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          Symphony is a unified workspace for AI-native work.
          Every model, every session, every prompt — one environment
          that keeps up with how you actually think.
        </p>

        <div
          className="flex items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <Link href="/workspace">
            <Button size="lg" className="group">
              Open Workspace
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Button>
          </Link>
        </div>
      </div>

      {/* Subtle scroll line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-muted-2/40 to-transparent" />
      </div>
    </section>
  );
}
