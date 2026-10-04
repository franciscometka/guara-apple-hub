import { cn } from "@/lib/utils";
import type { StatusContrato } from "@/lib/contratos/database";

const ESTILOS: Record<StatusContrato, { texto: string; classe: string }> = {
  rascunho: {
    texto: "Rascunho",
    classe: "border-border bg-muted text-muted-foreground",
  },
  pdf_gerado: {
    texto: "PDF gerado",
    classe: "border-violet/40 bg-accent text-accent-foreground",
  },
  assinado: {
    texto: "Assinado",
    classe: "border-emerald-600/40 bg-emerald-50 text-emerald-800",
  },
  arquivado: {
    texto: "Arquivado",
    classe: "border-border bg-background text-foreground",
  },
  cancelado: {
    texto: "Cancelado",
    classe: "border-destructive/40 bg-destructive/5 text-destructive",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: StatusContrato;
  className?: string | undefined;
}) {
  const { texto, classe } = ESTILOS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        classe,
        className,
      )}
    >
      {texto}
    </span>
  );
}

/** Selo de completude do dossiê, usado na lista e no detalhe. */
export function DossieBadge({ completo }: { completo: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        completo
          ? "border-emerald-600/40 bg-emerald-50 text-emerald-800"
          : "border-amber-500/40 bg-amber-50 text-amber-800",
      )}
    >
      {completo ? "Dossiê completo" : "Dossiê incompleto"}
    </span>
  );
}
