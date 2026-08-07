import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_SOFT } from "./Reveal";

export function AnimatedGlow({
  className,
  animate = true,
}: {
  className?: string | undefined;
  animate?: boolean | undefined;
}) {
  const reduce = useReducedMotion();
  const shouldAnimate = animate && !reduce;

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "glow-radial pointer-events-none absolute inset-x-0 top-0 h-[60vh]",
        className,
      )}
      initial={shouldAnimate ? { opacity: 0, scale: 0.7 } : { opacity: 0.35 }}
      animate={{ opacity: 0.35, scale: 1 }}
      transition={
        shouldAnimate ? { duration: 1.2, ease: EASE_SOFT } : { duration: 0.2 }
      }
    />
  );
}
