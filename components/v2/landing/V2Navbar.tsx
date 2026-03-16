"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function V2Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/v2" className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="text-[10px] font-medium text-accent px-1.5 py-0.5 rounded bg-accent-subtle">
            V2
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/v2/new"
            className="px-4 py-1.5 rounded-md bg-accent text-white text-[13px] font-medium hover:bg-accent-hover transition-colors"
          >
            New project
          </Link>
        </div>
      </div>
    </nav>
  );
}