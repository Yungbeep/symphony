"use client";

/**
 * Maps tool IDs to simple icon representations.
 * In production, these would be real brand SVGs.
 * For now, uses distinctive letter/color combos.
 */

const TOOL_COLORS: Record<string, string> = {
  chatgpt: "#10a37f",
  claude: "#d4a574",
  github: "#8b949e",
  supabase: "#3ecf8e",
  clerk: "#6c47ff",
  vercel: "#ffffff",
  resend: "#ffffff",
  cloudflare: "#f6821f",
  namecheap: "#ff5722",
  posthog: "#f54e00",
  sentry: "#362d59",
  whop: "#ff6243",
};

const TOOL_LETTERS: Record<string, string> = {
  chatgpt: "G",
  claude: "C",
  github: "GH",
  supabase: "SB",
  clerk: "CK",
  vercel: "V",
  resend: "R",
  cloudflare: "CF",
  namecheap: "NC",
  posthog: "PH",
  sentry: "S",
  whop: "W",
};

interface ToolIconProps {
  toolId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ToolIcon({ toolId, size = "md", className = "" }: ToolIconProps) {
  const color = TOOL_COLORS[toolId] ?? "#7c82f8";
  const letter = TOOL_LETTERS[toolId] ?? toolId[0]?.toUpperCase() ?? "?";

  const sizeClasses = {
    sm: "w-6 h-6 text-[9px]",
    md: "w-8 h-8 text-[10px]",
    lg: "w-10 h-10 text-[11px]",
  };

  return (
    <div
      className={`rounded-lg flex items-center justify-center font-semibold tracking-tight shrink-0 ${sizeClasses[size]} ${className}`}
      style={{
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color: color,
        border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {letter}
    </div>
  );
}