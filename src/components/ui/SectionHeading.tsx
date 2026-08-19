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
      className={cn("max-w-[720px]", align === "center" && "mx-auto text-center", className)}
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
      <h2 id={id} className={cn("type-h2", tone === "dark" ? "text-white" : "text-foreground")}>
        {title}
      </h2>
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
        className={cn(
          "mt-5 block h-px w-16 origin-left",
          align === "center" && "mx-auto origin-center",
          tone === "dark" ? "bg-violet-glow" : "bg-violet",
        )}
      />
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
