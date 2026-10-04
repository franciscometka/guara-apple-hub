import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Escolha entre duas ou três opções exclusivas (Sim / Não / Não sabe,
 * Sim / Não se aplica…). Sai como radiogroup dentro de um fieldset para a
 * navegação por teclado e pelo leitor de tela ficar correta.
 */
export function SimNaoToggle<T extends string>({
  rotulo,
  ajuda,
  erro,
  valor,
  opcoes,
  aoMudar,
}: {
  rotulo: string;
  ajuda?: string | undefined;
  erro?: string | undefined;
  valor: T | null;
  opcoes: readonly { valor: T; texto: string }[];
  aoMudar: (valor: T) => void;
}) {
  const nome = useId();
  const idErro = `${nome}-erro`;
  const idAjuda = `${nome}-ajuda`;

  return (
    <fieldset
      className="space-y-1.5"
      aria-describedby={
        [ajuda ? idAjuda : null, erro ? idErro : null].filter(Boolean).join(" ") || undefined
      }
    >
      <legend className="text-sm font-medium text-foreground">{rotulo}</legend>

      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const marcado = valor === opcao.valor;
          return (
            <label
              key={opcao.valor}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-colors",
                marcado
                  ? "border-violet bg-accent text-accent-foreground"
                  : "border-input text-foreground hover:border-violet",
                erro && !marcado && "border-destructive/50",
              )}
            >
              <input
                type="radio"
                name={nome}
                value={opcao.valor}
                checked={marcado}
                onChange={() => aoMudar(opcao.valor)}
                className="sr-only"
              />
              {opcao.texto}
            </label>
          );
        })}
      </div>

      {ajuda && (
        <p id={idAjuda} className="text-xs text-muted-foreground">
          {ajuda}
        </p>
      )}
      <p id={idErro} aria-live="polite" className="text-xs font-medium text-destructive">
        {erro ?? ""}
      </p>
    </fieldset>
  );
}
