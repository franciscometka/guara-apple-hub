import { Campo, CampoTexto, CampoTextoLongo } from "./inputs/Campo";
import { classesInput } from "./inputs/estilos";
import { CepInput } from "./inputs/CepInput";
import { CpfCnpjInput } from "./inputs/CpfCnpjInput";
import { DateTimeField } from "./inputs/DateTimeField";
import { ImeiInput } from "./inputs/ImeiInput";
import { MoneyInput } from "./inputs/MoneyInput";
import { PhoneInput } from "./inputs/PhoneInput";
import { SimNaoToggle } from "./inputs/SimNaoToggle";
import {
  numeroDe,
  textoDe,
  type DadosContrato,
  type DefCampo,
  type ValorCampo,
} from "@/lib/contratos/campos/tipos";
import { UFS } from "@/lib/contratos/validadores";
import { cn } from "@/lib/utils";

/**
 * Desenha um campo a partir da sua definição. É o que permite descrever os
 * assistentes como dados: nenhuma tela de modelo precisa de JSX próprio.
 */

const LARGURAS = {
  cheia: "sm:col-span-6",
  meia: "sm:col-span-3",
  terco: "sm:col-span-2",
} as const;

export function CampoDinamico({
  def,
  dados,
  erro,
  aoMudar,
  aoSair,
  autoFocus,
}: {
  def: DefCampo;
  dados: DadosContrato;
  erro?: string | undefined;
  aoMudar: (nome: string, valor: ValorCampo) => void;
  aoSair: (nome: string) => void;
  autoFocus?: boolean | undefined;
}) {
  const valor = textoDe(dados, def.nome);
  const dispensado = Boolean(def.naoSeAplica) && valor === def.naoSeAplica?.texto;

  const mudar = (novo: ValorCampo) => aoMudar(def.nome, novo);
  const sair = () => aoSair(def.nome);
  const classe = cn("col-span-6", LARGURAS[def.largura ?? "cheia"]);

  // Campo com dispensa explícita: a escolha vem antes do valor, e escolher
  // "não se aplica" já deixa o campo válido com o texto que vai no PDF.
  if (def.naoSeAplica) {
    return (
      <div className={cn(classe, "space-y-2")}>
        <SimNaoToggle
          rotulo={def.rotulo}
          valor={dispensado ? "dispensa" : "informar"}
          opcoes={[
            { valor: "informar", texto: "Informar" },
            { valor: "dispensa", texto: def.naoSeAplica.rotuloBotao },
          ]}
          aoMudar={(escolha) => mudar(escolha === "dispensa" ? (def.naoSeAplica?.texto ?? "") : "")}
        />
        {!dispensado && (
          <CampoBase
            def={def}
            dados={dados}
            valor={valor}
            erro={erro}
            mudar={mudar}
            sair={sair}
            autoFocus={autoFocus}
            semRotulo
          />
        )}
      </div>
    );
  }

  return (
    <div className={classe}>
      <CampoBase
        def={def}
        dados={dados}
        valor={valor}
        erro={erro}
        mudar={mudar}
        sair={sair}
        autoFocus={autoFocus}
      />
    </div>
  );
}

function CampoBase({
  def,
  dados,
  valor,
  erro,
  mudar,
  sair,
  autoFocus,
  semRotulo,
}: {
  def: DefCampo;
  dados: DadosContrato;
  valor: string;
  erro: string | undefined;
  mudar: (valor: ValorCampo) => void;
  sair: () => void;
  autoFocus?: boolean | undefined;
  semRotulo?: boolean | undefined;
}) {
  const rotulo = semRotulo ? `${def.rotulo} — valor` : def.rotulo;

  switch (def.tipo) {
    case "cpf":
    case "cnpj":
      return (
        <CpfCnpjInput
          rotulo={rotulo}
          tipo={def.tipo}
          ajuda={def.ajuda}
          erro={erro}
          valor={valor}
          aoMudar={mudar}
          aoSair={sair}
          autoFocus={autoFocus}
        />
      );

    case "telefone":
      return (
        <PhoneInput
          rotulo={rotulo}
          ajuda={def.ajuda}
          erro={erro}
          valor={valor}
          aoMudar={mudar}
          aoSair={sair}
          autoFocus={autoFocus}
        />
      );

    case "cep":
      return (
        <CepInput
          rotulo={rotulo}
          erro={erro}
          valor={valor}
          aoMudar={mudar}
          aoSair={sair}
          autoFocus={autoFocus}
        />
      );

    case "imei":
      return (
        <ImeiInput
          rotulo={rotulo}
          erro={erro}
          valor={valor}
          aoMudar={mudar}
          aoSair={sair}
          autoFocus={autoFocus}
        />
      );

    case "dinheiro":
      return (
        <MoneyInput
          rotulo={rotulo}
          ajuda={def.ajuda}
          erro={erro}
          valor={numeroDe(dados, def.nome)}
          aoMudar={mudar}
          aoSair={sair}
          autoFocus={autoFocus}
        />
      );

    case "data":
      return (
        <DateTimeField
          rotulo={rotulo}
          ajuda={def.ajuda}
          erro={erro}
          data={valor}
          aoMudarData={mudar}
          aoSair={sair}
          autoFocus={autoFocus}
        />
      );

    case "hora":
      return (
        <Campo rotulo={rotulo} ajuda={def.ajuda} erro={erro}>
          {(props) => (
            <input
              {...props}
              type="time"
              value={valor}
              autoFocus={autoFocus}
              onChange={(e) => mudar(e.target.value)}
              onBlur={sair}
            />
          )}
        </Campo>
      );

    case "opcoes":
      return (
        <SimNaoToggle
          rotulo={rotulo}
          ajuda={def.ajuda}
          erro={erro}
          valor={valor === "" ? null : valor}
          opcoes={def.opcoes ?? []}
          aoMudar={mudar}
        />
      );

    case "uf":
      return (
        <Campo rotulo={rotulo} ajuda={def.ajuda} erro={erro}>
          {(props) => (
            <select
              {...props}
              className={classesInput(Boolean(erro))}
              value={valor}
              autoFocus={autoFocus}
              onChange={(e) => mudar(e.target.value)}
              onBlur={sair}
            >
              <option value="">—</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          )}
        </Campo>
      );

    case "textoLongo":
      return (
        <CampoTextoLongo
          rotulo={rotulo}
          ajuda={def.ajuda}
          erro={erro}
          valor={valor}
          aoMudar={mudar}
          aoSair={sair}
          autoFocus={autoFocus}
        />
      );

    case "numero":
      return (
        <CampoTexto
          rotulo={rotulo}
          ajuda={def.ajuda}
          erro={erro}
          valor={valor}
          aoMudar={(v) => mudar(v.replace(/\D+/g, ""))}
          aoSair={sair}
          inputMode="numeric"
          autoFocus={autoFocus}
        />
      );

    case "ultimos4":
      return (
        <CampoTexto
          rotulo={rotulo}
          ajuda="Informe somente os 4 últimos dígitos. Nunca digite o número completo."
          erro={erro}
          valor={valor}
          aoMudar={(v) => mudar(v.replace(/\D+/g, "").slice(0, 4))}
          aoSair={sair}
          inputMode="numeric"
          autoFocus={autoFocus}
        />
      );

    case "leitura":
      return (
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border py-2">
          <span className="text-sm text-muted-foreground">{def.rotulo}</span>
          <span className="text-sm font-medium text-foreground">{valor || "—"}</span>
        </div>
      );

    default:
      return (
        <CampoTexto
          rotulo={rotulo}
          ajuda={def.ajuda}
          erro={erro}
          valor={valor}
          aoMudar={mudar}
          aoSair={sair}
          autoFocus={autoFocus}
        />
      );
  }
}
