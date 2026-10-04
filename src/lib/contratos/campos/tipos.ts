import {
  formatarDinheiro,
  cepValido,
  cnpjValido,
  cpfValido,
  dataValida,
  emailValido,
  ERROS,
  horaValida,
  imeiValido,
  pareceNumeroDeCartao,
  telefoneValido,
  ufValida,
  ultimos4Validos,
} from "../validadores";

/**
 * Definição dos assistentes em DADOS, não em JSX.
 *
 * Um modelo novo entra no sistema criando um arquivo de passos (este formato)
 * e um arquivo de texto do contrato — nenhuma tela precisa ser escrita de novo,
 * porque um único motor interpreta estas definições.
 */

/** Texto impresso no PDF quando a cláusula prevê "se aplicável" e não se aplica. */
export const NAO_SE_APLICA = "não se aplica";

/** Variante para o IMEI 2 de aparelho com um chip só. */
export const NAO_POSSUI = "não possui";

/** Variante para a pessoa autorizada opcional do checklist. */
export const NAO_HA = "não há";

export type TipoCampo =
  | "texto"
  | "textoLongo"
  | "cpf"
  | "cnpj"
  | "telefone"
  | "cep"
  | "email"
  | "imei"
  | "dinheiro"
  | "data"
  | "hora"
  | "numero"
  | "uf"
  | "opcoes"
  | "ultimos4"
  /** Tabela Regular / Falha / N/T / N/A com coluna de detalhes. */
  | "checklist"
  /** Mostrado no passo de conferência, nunca editado ali. */
  | "leitura";

export interface OpcaoCampo {
  valor: string;
  texto: string;
}

/** Uma linha da tabela de checklist. */
export interface LinhaChecklist {
  id: string;
  rotulo: string;
}

export type SituacaoChecklist = "regular" | "falha" | "nt" | "na";

export const SITUACOES: readonly { valor: SituacaoChecklist; texto: string }[] = [
  { valor: "regular", texto: "Regular" },
  { valor: "falha", texto: "Falha" },
  { valor: "nt", texto: "N/T" },
  { valor: "na", texto: "N/A" },
];

/** "Falha" e "N/T" exigem texto na coluna Detalhes. */
export const EXIGE_DETALHE: readonly SituacaoChecklist[] = ["falha", "nt"];

export interface ItemChecklist {
  /** Situação marcada. */
  s?: SituacaoChecklist;
  /** Detalhes. */
  d?: string;
}

export type ValoresChecklist = Record<string, ItemChecklist>;

/** O checklist é guardado como JSON dentro de um único campo. */
export function lerChecklist(dados: DadosContrato, nome: string): ValoresChecklist {
  const bruto = dados[nome];
  if (typeof bruto !== "string" || bruto === "") return {};
  try {
    return JSON.parse(bruto) as ValoresChecklist;
  } catch {
    return {};
  }
}

export const gravarChecklist = (valores: ValoresChecklist): string => JSON.stringify(valores);

/** Texto legível de uma linha, para a revisão e para o PDF. */
export function descreverChecklist(item: ItemChecklist | undefined): string {
  if (!item?.s) return "—";
  const rotulo = SITUACOES.find((o) => o.valor === item.s)?.texto ?? item.s;
  return item.d ? `${rotulo} — ${item.d}` : rotulo;
}

export interface SaidaNaoSeAplica {
  /** O que vai impresso no PDF. */
  texto: string;
  /** O que o botão diz na tela. */
  rotuloBotao: string;
}

export interface DefCampo {
  nome: string;
  rotulo: string;
  tipo: TipoCampo;
  ajuda?: string | undefined;
  opcoes?: readonly OpcaoCampo[] | undefined;
  /** Quando presente, a tela oferece o botão explícito de dispensa. */
  naoSeAplica?: SaidaNaoSeAplica | undefined;
  /** Linhas da tabela, quando o tipo é "checklist". */
  linhas?: readonly LinhaChecklist[] | undefined;
  largura?: "cheia" | "meia" | "terco" | undefined;
  /** Validação extra que depende dos outros campos já preenchidos. */
  validar?: ((valor: string, dados: DadosContrato) => string | null) | undefined;
  /** Só aparece quando a condição for verdadeira. */
  quando?: ((dados: DadosContrato) => boolean) | undefined;
}

export type TipoPasso = "campos" | "conferencia" | "revisao";

export interface DefPasso {
  id: string;
  titulo: string;
  ajuda?: string | undefined;
  tipo?: TipoPasso | undefined;
  campos: readonly DefCampo[];
  /** Passo condicional: só entra na contagem quando a condição bate. */
  quando?: ((dados: DadosContrato) => boolean) | undefined;
  /** Validação do passo inteiro — somas que precisam fechar, por exemplo. */
  validar?: ((dados: DadosContrato) => Record<string, string>) | undefined;
}

/** Tudo é string, menos dinheiro, que é número. */
export type ValorCampo = string | number;
export type DadosContrato = Record<string, ValorCampo>;

export const textoDe = (dados: DadosContrato, nome: string): string => {
  const v = dados[nome];
  return typeof v === "string" ? v : v === undefined ? "" : String(v);
};

export const numeroDe = (dados: DadosContrato, nome: string): number => {
  const v = dados[nome];
  return typeof v === "number" ? v : Number(v) || 0;
};

// ---------------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------------

/** Erro do campo, ou null quando está válido. */
export function validarCampo(def: DefCampo, dados: DadosContrato): string | null {
  if (def.tipo === "leitura") return null;

  const bruto = dados[def.nome];
  const valor = typeof bruto === "string" ? bruto.trim() : bruto;

  // Dispensa explícita satisfaz o campo e imprime o texto combinado no PDF.
  if (def.naoSeAplica && valor === def.naoSeAplica.texto) return null;

  if (def.tipo === "checklist") {
    const marcados = lerChecklist(dados, def.nome);
    for (const linha of def.linhas ?? []) {
      const item = marcados[linha.id];
      if (!item?.s) return "Marque uma situação em cada linha da tabela.";
      if (EXIGE_DETALHE.includes(item.s) && !item.d?.trim()) {
        return "Falha e N/T precisam de detalhe em todas as linhas marcadas.";
      }
    }
    return null;
  }

  if (def.tipo === "dinheiro") {
    const numero = typeof valor === "number" ? valor : Number(valor);
    if (!Number.isFinite(numero) || numero <= 0) return ERROS.valorPositivo;
    return def.validar?.(String(numero), dados) ?? null;
  }

  const texto = typeof valor === "string" ? valor : valor === undefined ? "" : String(valor);
  if (texto === "") return ERROS.obrigatorio;

  switch (def.tipo) {
    case "cpf":
      if (!cpfValido(texto)) return ERROS.cpf;
      break;
    case "cnpj":
      if (!cnpjValido(texto)) return ERROS.cnpj;
      break;
    case "cep":
      if (!cepValido(texto)) return ERROS.cep;
      break;
    case "telefone":
      if (!telefoneValido(texto)) return ERROS.telefone;
      break;
    case "email":
      if (!emailValido(texto)) return ERROS.email;
      break;
    case "imei":
      if (!imeiValido(texto)) return ERROS.imei;
      break;
    case "data":
      if (!dataValida(texto)) return ERROS.data;
      break;
    case "hora":
      if (!horaValida(texto)) return ERROS.hora;
      break;
    case "uf":
      if (!ufValida(texto)) return ERROS.uf;
      break;
    case "ultimos4":
      if (!ultimos4Validos(texto)) return ERROS.ultimos4;
      break;
    case "numero":
      if (!/^\d+$/.test(texto)) return ERROS.obrigatorio;
      break;
    case "opcoes":
      if (!def.opcoes?.some((o) => o.valor === texto)) return ERROS.obrigatorio;
      break;
    case "texto":
    case "textoLongo":
      // Nenhum campo livre pode receber um número de cartão colado.
      if (pareceNumeroDeCartao(texto)) return ERROS.cartaoCompleto;
      break;
    default:
      break;
  }

  return def.validar?.(texto, dados) ?? null;
}

/** Campos do passo que estão visíveis com os dados atuais. */
export const camposVisiveis = (passo: DefPasso, dados: DadosContrato): DefCampo[] =>
  passo.campos.filter((c) => !c.quando || c.quando(dados));

/** Todos os erros do passo, por nome de campo. */
export function validarPasso(passo: DefPasso, dados: DadosContrato): Record<string, string> {
  const erros: Record<string, string> = {};

  if (passo.tipo !== "conferencia" && passo.tipo !== "revisao") {
    for (const campo of camposVisiveis(passo, dados)) {
      const erro = validarCampo(campo, dados);
      if (erro) erros[campo.nome] = erro;
    }
  }

  return { ...erros, ...(passo.validar?.(dados) ?? {}) };
}

/**
 * Valor do campo em texto legível, para a tela de revisão e para o detalhe do
 * contrato: dinheiro com máscara e checklist resumido linha a linha.
 */
export function valorLegivel(def: DefCampo, dados: DadosContrato): string {
  if (def.tipo === "checklist") {
    const marcados = lerChecklist(dados, def.nome);
    const preenchidas = (def.linhas ?? []).filter((l) => marcados[l.id]?.s).length;
    const total = (def.linhas ?? []).length;
    return `${preenchidas} de ${total} linhas marcadas`;
  }

  const bruto = dados[def.nome];
  if (typeof bruto === "number") return formatarDinheiro(bruto);
  return textoDe(dados, def.nome);
}

export const passoValido = (passo: DefPasso, dados: DadosContrato): boolean =>
  Object.keys(validarPasso(passo, dados)).length === 0;

/** Passos que entram no fluxo com os dados atuais (condicionais resolvidos). */
export const passosVisiveis = (passos: readonly DefPasso[], dados: DadosContrato): DefPasso[] =>
  passos.filter((p) => !p.quando || p.quando(dados));

/** Todo o assistente está preenchido? Usado para liberar "Gerar PDF". */
export const tudoValido = (passos: readonly DefPasso[], dados: DadosContrato): boolean =>
  passosVisiveis(passos, dados).every((p) => passoValido(p, dados));
