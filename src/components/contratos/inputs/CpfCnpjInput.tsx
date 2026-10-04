import { CampoTexto } from "./Campo";
import { formatarCnpj, formatarCpf, formatarCpfCnpj } from "@/lib/contratos/validadores";

/**
 * CPF, CNPJ, ou os dois no mesmo campo. A máscara é aplicada a cada tecla e o
 * valor guardado continua sendo o texto formatado (os validadores limpam).
 */
export function CpfCnpjInput({
  rotulo,
  erro,
  valor,
  aoMudar,
  aoSair,
  tipo = "cpf",
  ajuda,
  autoFocus,
}: {
  rotulo: string;
  erro?: string | undefined;
  valor: string;
  aoMudar: (valor: string) => void;
  aoSair?: (() => void) | undefined;
  tipo?: "cpf" | "cnpj" | "ambos" | undefined;
  ajuda?: string | undefined;
  autoFocus?: boolean | undefined;
}) {
  const mascara = tipo === "cnpj" ? formatarCnpj : tipo === "ambos" ? formatarCpfCnpj : formatarCpf;

  return (
    <CampoTexto
      rotulo={rotulo}
      ajuda={ajuda}
      erro={erro}
      valor={valor}
      aoMudar={aoMudar}
      aoSair={aoSair}
      mascara={mascara}
      inputMode="numeric"
      autoFocus={autoFocus}
      placeholder={tipo === "cnpj" ? "00.000.000/0000-00" : "000.000.000-00"}
    />
  );
}
