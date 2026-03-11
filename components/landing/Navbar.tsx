"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
        <Logo size="sm" />
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link href="/workspace">
            <Button size="sm">Open Workspace</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
