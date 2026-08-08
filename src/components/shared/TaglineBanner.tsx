import { motion, useReducedMotion } from "motion/react";
import { Reveal, EASE_OUT } from "@/components/ui/Reveal";

/** Seção puramente tipográfica: a frase é a protagonista. */
const WORDS = ["Somos", "apaixonados", "pela", "Apple"];

export function TaglineBanner() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="tagline-banner"
      className="relative isolate overflow-hidden bg-ink"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-violet)_55%,transparent),transparent_70%)] opacity-25 blur-3xl"
      />
      <Reveal className="relative mx-auto max-w-[1000px] px-6 py-20 text-center md:py-28 lg:py-36">
        <p className="type-caption text-violet-glow">Guara iPhones</p>
        <motion.h2
          id="tagline-banner"
          className="type-display mt-5 text-white uppercase"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {WORDS.map((word) => (
            <motion.span
              key={word}
              className="inline-block"
              variants={{
                hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: EASE_OUT },
                },
              }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.h2>
        <p className="type-body-lg mx-auto mt-6 max-w-[620px] text-white/65">
          Não é slogan de marketing. É o que a gente faz o dia inteiro aqui em
          Guarapuava: vender, cuidar e consertar Apple — e só Apple.
        </p>
      </Reveal>
    </section>
  );
}

