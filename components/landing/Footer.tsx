import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <Logo size="sm" />
        <p className="text-xs text-muted-2">
          Independent workspace. Not affiliated with any model provider.
        </p>
      </div>
    </footer>
  );
}
