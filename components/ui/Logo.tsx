import { Waves } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };
  const iconSizes = { sm: 18, md: 22, lg: 32 };

  return (
    <div className={`flex items-center gap-2.5 ${sizes[size]}`}>
      <div className="relative">
        <Waves size={iconSizes[size]} className="text-accent" />
      </div>
      <span className="font-semibold tracking-tight">Symphony</span>
    </div>
  );
}
