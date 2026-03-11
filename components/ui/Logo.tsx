import { Waves } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-[15px]", md: "text-lg", lg: "text-2xl" };
  const iconSizes = { sm: 16, md: 20, lg: 26 };

  return (
    <div className={`flex items-center gap-2 ${sizes[size]}`}>
      <Waves size={iconSizes[size]} className="text-accent" />
      <span className="font-semibold tracking-[-0.02em]">Symphony</span>
    </div>
  );
}
