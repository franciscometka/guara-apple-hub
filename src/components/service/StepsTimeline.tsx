import { motion, useReducedMotion } from "motion/react";
import { PASSOS } from "@/data/services";
import { cn } from "@/lib/utils";

export function StepsTimeline({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const reduce = useReducedMotion();
  const dark = tone === "dark";

  return (
    <motion.ol
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
      className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6"
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-5 right-0 left-0 hidden h-px md:block",
          dark ? "bg-white/10" : "bg-border",
        )}
      >
        <motion.div
          className={cn("h-px origin-left", dark ? "bg-violet-soft" : "bg-violet")}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {PASSOS.map((passo) => (
        <motion.li
          key={passo.numero}
          className="relative"
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 16 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
        >
          <motion.span
            variants={{
              hidden: { scale: reduce ? 1 : 0 },
              show: {
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              },
            }}
            className={cn(
              "font-display relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
              dark ? "bg-violet text-white" : "grad-cta text-white",
            )}
          >
            {passo.numero}
          </motion.span>
          <h3
            className={cn(
              "font-display mt-5 text-base font-semibold",
              dark ? "text-white" : "text-foreground",
            )}
          >
            {passo.titulo}
          </h3>
          <p
            className={cn(
              "mt-2 text-sm",
              dark ? "text-white/60" : "text-muted-foreground",
            )}
          >
            {passo.texto}
          </p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
