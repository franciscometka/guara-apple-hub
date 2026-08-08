import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Reveal, EASE_OUT } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  id,
  className,
}: {
  eyebrow?: string | undefined;
  title: ReactNode;
  subtitle?: string | undefined;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-[720px]",
        align === "center" && "mx-auto text-center",
        className,
      )}
      y={40}
    >
      {eyebrow && (
        <p
          className={cn(
            "type-caption mb-4",
            tone === "dark" ? "text-violet-soft" : "text-violet-deep",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          "type-h2",
          tone === "dark" ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "type-body-lg mt-5",
            tone === "dark" ? "text-white/65" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
