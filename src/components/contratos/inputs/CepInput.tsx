import { CampoTexto } from "./Campo";
import { formatarCep } from "@/lib/contratos/validadores";

/** CEP com máscara 00000-000. */
export function CepInput({
  rotulo = "CEP",
  erro,
  valor,
  aoMudar,
  aoSair,
  autoFocus,
}: {
  rotulo?: string | undefined;
  erro?: string | undefined;
  valor: string;
  aoMudar: (valor: string) => void;
  aoSair?: (() => void) | undefined;
  autoFocus?: boolean | undefined;
}) {
  return (
    <CampoTexto
      rotulo={rotulo}
      erro={erro}
      valor={valor}
      aoMudar={aoMudar}
      aoSair={aoSair}
      mascara={formatarCep}
      inputMode="numeric"
      autoFocus={autoFocus}
      placeholder="00000-000"
    />
  );
}
