import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/** Barra fina de progresso de leitura. Anima só transform (GPU). */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed top-0 left-0 z-[60] h-0.5 w-full origin-left bg-violet"
    />
  );
}
