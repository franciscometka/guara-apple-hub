import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export type SectionVariant = "light" | "off" | "dark" | "tint";

const variants: Record<SectionVariant, string> = {
  light: "bg-background text-foreground",
  off: "bg-off-white text-foreground",
  dark: "bg-ink text-white",
  tint: "bg-violet-tint text-foreground",
};

export function Section({
  children,
  variant = "light",
  className,
  innerClassName,
  id,
  labelledBy,
  narrow,
}: {
  children: ReactNode;
  variant?: SectionVariant | undefined;
  className?: string | undefined;
  innerClassName?: string | undefined;
  id?: string | undefined;
  labelledBy?: string | undefined;
  narrow?: boolean | undefined;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative overflow-hidden py-20 md:py-28 lg:py-36",
        variants[variant],
        className,
      )}
    >
      <Container className={cn("relative", innerClassName)} narrow={narrow}>
        {children}
      </Container>
    </section>
  );
}
