import { CampoTexto } from "./Campo";
import { formatarImei } from "@/lib/contratos/validadores";

const AJUDA_IMEI = "Disque *#06# no aparelho ou veja em Ajustes > Geral > Sobre.";

/** IMEI: 15 dígitos, conferidos por Luhn na validação do passo. */
export function ImeiInput({
  rotulo,
  erro,
  valor,
  aoMudar,
  aoSair,
  autoFocus,
}: {
  rotulo: string;
  erro?: string | undefined;
  valor: string;
  aoMudar: (valor: string) => void;
  aoSair?: (() => void) | undefined;
  autoFocus?: boolean | undefined;
}) {
  return (
    <CampoTexto
      rotulo={rotulo}
      ajuda={AJUDA_IMEI}
      erro={erro}
      valor={valor}
      aoMudar={aoMudar}
      aoSair={aoSair}
      mascara={formatarImei}
      inputMode="numeric"
      autoFocus={autoFocus}
      placeholder="000000000000000"
    />
  );
}
