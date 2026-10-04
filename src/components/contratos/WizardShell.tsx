import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

/**
 * Casca do assistente: nome do modelo, barra de progresso "Passo 3 de 11" e os
 * botões Voltar / Salvar e sair / Continuar.
 *
 * A animação de troca de passo e a da barra respeitam `prefers-reduced-motion`
 * (ver as classes `motion-safe:` abaixo).
 */
export function WizardShell({
  modelo,
  numero,
  passoAtual,
  total,
  salvando,
  salvoEm,
  podeContinuar,
  ultimo,
  ocultarContinuar,
  aoVoltar,
  aoContinuar,
  aoSairSalvando,
  children,
}: {
  modelo: string;
  numero: string;
  passoAtual: number;
  total: number;
  salvando: boolean;
  salvoEm: Date | null;
  podeContinuar: boolean;
  ultimo: boolean;
  /** A tela de revisão tem o próprio botão de avanço. */
  ocultarContinuar?: boolean | undefined;
  aoVoltar: () => void;
  aoContinuar: () => void;
  aoSairSalvando: () => void;
  children: ReactNode;
}) {
  const progresso = total > 0 ? ((passoAtual + 1) / total) * 100 : 0;

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-base font-semibold text-foreground">{modelo}</p>
            <p className="text-sm text-muted-foreground">
              Contrato {numero} · Passo {passoAtual + 1} de {total}
            </p>
          </div>

          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={passoAtual + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label="Progresso do preenchimento"
          >
            <div
              className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-[250ms] motion-safe:ease-out"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {children}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={aoVoltar}
            disabled={passoAtual === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-violet disabled:opacity-40"
          >
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
            Voltar
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span aria-live="polite" className="text-xs text-muted-foreground">
              {salvando ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2
                    size={13}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="motion-safe:animate-spin"
                  />
                  Salvando…
                </span>
              ) : salvoEm ? (
                "Salvo agora há pouco"
              ) : (
                ""
              )}
            </span>

            <button
              type="button"
              onClick={aoSairSalvando}
              className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-violet"
            >
              Salvar e sair
            </button>

            {!ocultarContinuar && (
              <button
                type="button"
                onClick={aoContinuar}
                disabled={!podeContinuar}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
              >
                {ultimo ? (
                  <>
                    <Check size={16} strokeWidth={2} aria-hidden="true" />
                    Revisar
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Um passo do assistente. A `key` do React muda a cada passo, então o fade com
 * deslocamento de 12 px roda na troca — e só quando o sistema não pede
 * movimento reduzido.
 */
export function StepCard({
  titulo,
  ajuda,
  children,
}: {
  titulo: string;
  ajuda?: string | undefined;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-background p-6 motion-safe:animate-[passo_180ms_ease-out]">
      <h1 className="font-display text-xl font-semibold text-foreground">{titulo}</h1>
      {ajuda && <p className="mt-1.5 text-sm text-muted-foreground">{ajuda}</p>}
      <div className="mt-6 grid grid-cols-6 gap-x-4 gap-y-5">{children}</div>
    </section>
  );
}
