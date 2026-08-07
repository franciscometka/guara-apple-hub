import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "violet" | "dark" | "success";

export function GuaraBadge({
  children,
  tone = "violet",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone | undefined;
  className?: string | undefined;
}) {
  const tones: Record<BadgeTone, string> = {
    violet: "bg-violet-tint text-violet-deep",
    dark: "bg-white/8 text-violet-glow",
    success: "bg-success/12 text-success",
  };
  return (
    <span
      className={cn(
        "type-caption inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
