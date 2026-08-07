import { motion, useReducedMotion } from "motion/react";
import { useOpenNow } from "@/hooks/useOpenNow";

export function OpenNowBadge() {
  const open = useOpenNow();
  const reduce = useReducedMotion();

  if (open === null) {
    return (
      <span className="type-caption inline-flex items-center gap-2 text-muted-foreground">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-muted-foreground/50"
        />
        Carregando...
      </span>
    );
  }

  return (
    <span
      aria-live="polite"
      className={
        open
          ? "type-caption inline-flex items-center gap-2 text-success"
          : "type-caption inline-flex items-center gap-2 text-muted-foreground"
      }
    >
      {open && !reduce ? (
        <motion.span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-success"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <span
          aria-hidden="true"
          className={
            open
              ? "h-2 w-2 rounded-full bg-success"
              : "h-2 w-2 rounded-full bg-muted-foreground"
          }
        />
      )}
      {open ? "Aberto agora" : "Fechado agora"}
    </span>
  );
}
