import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { depoimentos } from "@/data/testimonials";

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const total = depoimentos.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [paused, go]);

  const atual = depoimentos[index] ?? depoimentos[0];
  if (!atual) return null;

  return (
    <div
      className="mt-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      role="group"
      aria-roledescription="carrossel"
      aria-label="Depoimentos de clientes"
    >
      <div className="relative min-h-[260px] rounded-lg border border-border bg-background p-7 shadow-soft md:min-h-[220px] md:p-10">
        <Quote
          size={24}
          strokeWidth={1.5}
          className="text-violet"
          aria-hidden="true"
        />
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: reduce ? 0.2 : 0.4 }}
            className="mt-5"
          >
            <p className="type-body-lg text-foreground">{atual.texto}</p>
            <footer className="mt-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-tint text-sm font-semibold text-violet-deep"
              >
                {atual.nome.charAt(0)}
              </span>
              <span className="text-sm">
                <span className="block font-semibold text-foreground">
                  {atual.nome}
                </span>
                <span className="block text-muted-foreground">
                  {atual.cidade}
                </span>
              </span>
            </footer>
            {atual.placeholder && (
              <p className="mt-5 text-xs text-muted-foreground">
                Conteúdo provisório — aguardando as avaliações reais dos
                clientes.
              </p>
            )}
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2" aria-hidden="true">
          {depoimentos.map((_, i) => (
            <span
              key={i}
              className={
                i === index
                  ? "h-1.5 w-6 rounded-full bg-violet"
                  : "h-1.5 w-1.5 rounded-full bg-border"
              }
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Depoimento anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-violet hover:text-violet-deep"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próximo depoimento"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-violet hover:text-violet-deep"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
