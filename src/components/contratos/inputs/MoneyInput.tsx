import { Campo } from "./Campo";
import { classesInput } from "./estilos";
import { formatarValor, lerCentavos } from "@/lib/contratos/validadores";

/**
 * Valor em reais. O que é digitado entra como centavos (digitar "1234" vira
 * 12,34) e o estado guardado é sempre número, não texto.
 */
export function MoneyInput({
  rotulo,
  erro,
  valor,
  aoMudar,
  aoSair,
  ajuda,
  autoFocus,
  desabilitado,
}: {
  rotulo: string;
  erro?: string | undefined;
  valor: number;
  aoMudar: (valor: number) => void;
  aoSair?: (() => void) | undefined;
  ajuda?: string | undefined;
  autoFocus?: boolean | undefined;
  desabilitado?: boolean | undefined;
}) {
  return (
    <Campo rotulo={rotulo} ajuda={ajuda} erro={erro}>
      {(props) => (
        <div className="flex items-stretch">
          <span
            aria-hidden="true"
            className="inline-flex min-h-11 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground"
          >
            R$
          </span>
          <input
            {...props}
            className={classesInput(Boolean(erro), "rounded-l-none text-right tabular-nums")}
            type="text"
            inputMode="numeric"
            value={formatarValor(valor)}
            autoFocus={autoFocus}
            disabled={desabilitado}
            onChange={(e) => aoMudar(lerCentavos(e.target.value))}
            onBlur={aoSair}
          />
        </div>
      )}
    </Campo>
  );
}
