import { CampoTexto } from "./Campo";
import { formatarTelefone } from "@/lib/contratos/validadores";

/** Telefone/WhatsApp brasileiro, com DDD. */
export function PhoneInput({
  rotulo,
  erro,
  valor,
  aoMudar,
  aoSair,
  ajuda,
  autoFocus,
}: {
  rotulo: string;
  erro?: string | undefined;
  valor: string;
  aoMudar: (valor: string) => void;
  aoSair?: (() => void) | undefined;
  ajuda?: string | undefined;
  autoFocus?: boolean | undefined;
}) {
  return (
    <CampoTexto
      rotulo={rotulo}
      ajuda={ajuda}
      erro={erro}
      valor={valor}
      aoMudar={aoMudar}
      aoSair={aoSair}
      mascara={formatarTelefone}
      inputMode="tel"
      autoFocus={autoFocus}
      placeholder="(91) 90000-0000"
    />
  );
}
