import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size="sm" />
        <p className="text-sm text-muted">
          Built for AI power users. Not affiliated with any model provider.
        </p>
      </div>
    </footer>
  );
}
