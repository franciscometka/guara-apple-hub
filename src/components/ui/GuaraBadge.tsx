import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "pink" | "dark" | "success";

export function GuaraBadge({
  children,
  tone = "pink",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone | undefined;
  className?: string | undefined;
}) {
  const tones: Record<BadgeTone, string> = {
    pink: "bg-pink-tint text-pink-deep",
    dark: "bg-white/8 text-pink-glow",
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
