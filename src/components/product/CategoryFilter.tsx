import { motion, useReducedMotion } from "motion/react";
import { CATEGORIAS, type Categoria } from "@/data/products";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  ativa,
  onChange,
}: {
  ativa: Categoria | "Todos";
  onChange: (c: Categoria | "Todos") => void;
}) {
  const reduce = useReducedMotion();
  const opcoes: (Categoria | "Todos")[] = ["Todos", ...CATEGORIAS];

  return (
    <div
      role="tablist"
      aria-label="Filtrar produtos por categoria"
      className="flex flex-wrap gap-2.5"
    >
      {opcoes.map((op) => {
        const selected = op === ativa;
        return (
          <motion.button
            key={op}
            role="tab"
            aria-selected={selected}
            type="button"
            onClick={() => onChange(op)}
            {...(reduce ? {} : { whileTap: { scale: 0.97 } })}
            className={cn(
              "relative min-h-11 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
              selected
                ? "border-transparent grad-cta text-white"
                : "border-border bg-background text-foreground hover:border-violet hover:text-violet-deep",
            )}
          >
            {op}
          </motion.button>
        );
      })}
    </div>
  );
}
