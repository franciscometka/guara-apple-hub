import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { depoimentos } from "@/data/testimonials";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.6h11.9c-.2 2-1.5 5-4.4 7l6.7 5.2c4-3.7 6.9-9.1 6.9-15.8z"
      />
      <path
        fill="#34A853"
        d="M24 46c6 0 11-2 14.7-5.4l-6.7-5.2c-1.8 1.3-4.3 2.2-8 2.2-5.8 0-10.7-3.8-12.4-9.1l-7 5.4C8.2 41.1 15.5 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.6 28.5A13.6 13.6 0 0 1 10.9 24c0-1.6.3-3.1.7-4.5l-7-5.4A22 22 0 0 0 2 24c0 3.5.9 6.9 2.6 9.9l7-5.4z"
      />
      <path
        fill="#EA4335"
        d="M24 10.2c4.1 0 7 1.8 8.6 3.3l6.3-6.1C35 3.8 30 2 24 2 15.5 2 8.2 6.9 4.6 14.1l7 5.4C13.3 14.1 18.2 10.2 24 10.2z"
      />
    </svg>
  );
}

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const total = depoimentos.length;

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + total) % total), [total]);

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
      aria-label="Avaliações de clientes no Google"
    >
      <div className="relative min-h-[280px] rounded-lg border border-border bg-background p-7 shadow-soft md:min-h-[240px] md:p-10">
        <Quote size={24} strokeWidth={1.5} className="text-violet" aria-hidden="true" />
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
                <span className="block font-semibold text-foreground">{atual.nome}</span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-muted-foreground">
                  <GoogleMark />
                  Avaliação no Google
                </span>
              </span>
            </footer>
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
