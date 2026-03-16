import { Logo } from "@/components/ui/Logo";

export function V2Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-[12px] text-muted-2">
        <Logo size="sm" />
        <span>Built for builders. Not another chatbot skin.</span>
      </div>
    </footer>
  );
}