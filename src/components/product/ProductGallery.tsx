import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Foto principal + miniaturas. Com uma foto só, mostra apenas a principal —
 * a faixa de miniaturas nem chega a renderizar.
 */
export function ProductGallery({ fotos, alt }: { fotos: string[]; alt: string }) {
  const [ativa, setAtiva] = useState(0);

  // A galeria carrega as fotos extras depois da principal; se a lista encolher
  // (troca de produto), o índice precisa voltar para um valor válido.
  useEffect(() => {
    setAtiva((i) => (i < fotos.length ? i : 0));
  }, [fotos.length]);

  if (fotos.length === 0) {
    return (
      <div
        className="flex aspect-square items-center justify-center rounded-lg border border-border bg-muted"
        role="img"
        aria-label={`Sem foto disponível de ${alt}`}
      >
        <span className="text-sm text-muted-foreground">Sem foto disponível</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-8">
        <img
          src={fotos[ativa]}
          alt={alt}
          width={900}
          height={900}
          fetchPriority="high"
          className="h-full w-full object-contain"
        />
      </div>

      {fotos.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {fotos.map((foto, i) => (
            <button
              key={foto}
              type="button"
              onClick={() => setAtiva(i)}
              aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
              aria-current={i === ativa}
              className={cn(
                "flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border bg-background p-1.5 transition-colors",
                i === ativa
                  ? "border-violet"
                  : "border-border hover:border-violet-glow focus-visible:border-violet-glow",
              )}
            >
              <img
                src={foto}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
