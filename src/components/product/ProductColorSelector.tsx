import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/GuaraButton";
import { formatarCor, hexDaCor, type OpcaoVariante } from "@/lib/produto-variantes";
import { cn } from "@/lib/utils";

export function ProductColorSelector({
  cores,
  onSelect,
  dark = false,
}: {
  cores: OpcaoVariante[];
  onSelect?: ((slug: string) => void) | undefined;
  dark?: boolean | undefined;
}) {
  if (cores.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className={cn("text-sm font-semibold", dark ? "text-primary-foreground" : "text-foreground")}>
        Escolha a Cor
      </h2>
      <div className="mt-3 flex flex-wrap gap-3" role="list" aria-label="Cores disponíveis">
        {cores.map((cor) => {
          const classes = cn(
            "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors",
            cor.atual ? "border-violet" : dark ? "border-primary-foreground/25 hover:border-violet-glow" : "border-border hover:border-violet-glow",
            cor.emEstoque ? "" : "opacity-40",
          );
          const swatch = (
            <span
              aria-hidden="true"
              className="h-7 w-7 rounded-full border border-foreground/10"
              style={{ backgroundColor: hexDaCor(cor.valor) }}
            />
          );

          return onSelect ? (
            <Button
              key={cor.valor}
              variant="secondary"
              size="sm"
              onClick={() => onSelect(cor.slug)}
              ariaLabel={formatarCor(cor.valor)}
              className={cn(classes, "min-h-0 p-0", dark && "bg-transparent")}
            >
              {swatch}
            </Button>
          ) : (
            <Link
              key={cor.valor}
              to="/produtos/$slug"
              params={{ slug: cor.slug }}
              title={formatarCor(cor.valor)}
              aria-label={formatarCor(cor.valor)}
              aria-current={cor.atual ? "true" : undefined}
              className={classes}
            >
              {swatch}
            </Link>
          );
        })}
      </div>
    </div>
  );
}