import { motion, useReducedMotion } from "motion/react";
import { FILTROS_CATALOGO, type FiltroCatalogoId } from "@/data/categorias";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  ativa,
  onChange,
}: {
  ativa: FiltroCatalogoId;
  onChange: (id: FiltroCatalogoId) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Filtrar produtos por categoria"
      className="flex flex-wrap gap-2.5"
    >
      {FILTROS_CATALOGO.map((filtro) => {
        const selected = filtro.id === ativa;
        return (
          <motion.button
            key={filtro.id}
            role="tab"
            aria-selected={selected}
            type="button"
            onClick={() => onChange(filtro.id)}
            {...(reduce ? {} : { whileTap: { scale: 0.97 } })}
            className={cn(
              "relative min-h-11 rounded-full border px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
              selected
                ? "border-transparent grad-cta text-white"
                : "border-border bg-background text-foreground hover:border-violet hover:text-violet-deep",
            )}
          >
            {filtro.rotulo}
          </motion.button>
        );
      })}
    </div>
  );
}
