import type { DefPasso, DadosContrato } from "../campos/tipos";
import type { EtapaContrato, OrigemDossie } from "../database";
import type { DadosLoja } from "../loja-config";
import type { ModeloSlug } from "./catalogo";

/**
 * Representação do documento em blocos. O texto das cláusulas é transcrito
 * literalmente do PDF original; as lacunas viram marcadores {{campo}}, que o
 * gerador substitui pelos dados preenchidos no assistente.
 *
 * Nenhuma cláusula é resumida, reescrita ou "melhorada".
 */
export type BlocoDoc =
  /** Título do documento, centralizado. */
  | { t: "titulo"; texto: string }
  /** Cabeçalho de seção numerada, como "1 | Da Garantia". */
  | { t: "secao"; numero: string; titulo: string }
  /** Parágrafo justificado. `prefixo` sai em negrito (o "1.1." da cláusula). */
  | { t: "p"; texto: string; prefixo?: string }
  /** Linha em negrito usada como rótulo de bloco ("DADOS DO APARELHO"). */
  | { t: "rotulo"; texto: string }
  /** Lista com marcadores. */
  | { t: "itens"; itens: string[] }
  /** Grade de duas colunas, cada célula um "Rótulo: valor". */
  | { t: "grade"; linhas: [string, string][] }
  /** Bloco de assinaturas lado a lado. */
  | { t: "assinaturas"; colunas: { titulo: string; linhas: string[] }[] }
  /** Tabela Regular / Falha / N/T / N/A, alimentada por um campo de checklist. */
  | { t: "checklist"; campo: string; linhas: readonly LinhaChecklist[] }
  | { t: "espaco"; altura?: number }
  | { t: "quebraPagina" };

export interface LinhaChecklist {
  id: string;
  rotulo: string;
}

/** Linha de crédito que vai no rodapé de toda página gerada. */
export const CREDITO_MODELO =
  "© 2026 Maués Advogados Associados. Modelo disponibilizado gratuitamente no Autorizados " +
  "Experience 2026 para uso dos participantes. Proibida sua comercialização sem autorização " +
  "do escritório. Direitos reservados nos termos da Lei nº 9.610/1998";

/**
 * Uma etapa do modelo: o conjunto de perguntas e o documento que ela gera.
 *
 * O Termo de Garantia e o Upgrade têm uma só; a Pré-reserva tem a principal e a
 * de entrega; o Checklist de assistência tem entrada, diagnóstico e conclusão.
 * Cada etapa gera o seu próprio PDF e tem a sua própria assinatura.
 */
export interface DefEtapaModelo {
  etapa: EtapaContrato;
  /** Título impresso no topo do PDF desta etapa. */
  titulo: string;
  /** Uma linha explicando quando esta etapa é preenchida. */
  quando?: string | undefined;
  passos: readonly DefPasso[];
  documento: readonly BlocoDoc[];
  /** Só é liberada depois que esta outra etapa gerou o PDF. */
  dependeDe?: EtapaContrato | undefined;
}

export interface DefModelo {
  slug: ModeloSlug;
  /** Trocar o texto de uma cláusula exige subir esta versão. */
  versao: string;
  /** Título geral do modelo. */
  titulo: string;
  /** A primeira é sempre a principal, criada junto com o contrato. */
  etapas: readonly DefEtapaModelo[];
  /** Valores que já vêm prontos dos dados da loja. */
  daLoja?: ((loja: DadosLoja) => DadosContrato) | undefined;
  /**
   * Número sequencial próprio do modelo, pedido ao banco na criação — é o que
   * dá à assistência técnica a numeração de ordem de serviço.
   */
  semente?: { campo: string; escopo: "os" } | undefined;
  /** Valores sugeridos na criação do rascunho, como a data e a hora de agora. */
  padroes?: (() => DadosContrato) | undefined;
  /** Pré-preenchimento vindo de um produto do catálogo. */
  doProduto?: ((produto: ProdutoDoCatalogo) => DadosContrato) | undefined;
  /**
   * Campos calculados na hora de gerar o PDF (o dia, o mês por extenso e o ano
   * a partir da data de fechamento, por exemplo). Não são guardados no banco.
   */
  derivados?: ((dados: DadosContrato) => DadosContrato) | undefined;
  /** Nome e CPF que aparecem na lista de contratos. */
  identificacao?: ((dados: DadosContrato) => IdentificacaoCliente) | undefined;
  /** Qual aparelho deste contrato vira dossiê. */
  dossie?: ((dados: DadosContrato) => DadosDoDossie) | undefined;
}

/** O que o catálogo tem para oferecer ao assistente. */
export interface ProdutoDoCatalogo {
  id: string;
  nome: string;
  cor: string;
  condicao: string;
  preco: number;
}

export interface IdentificacaoCliente {
  nome: string;
  cpf: string;
}

export interface DadosDoDossie {
  origem: OrigemDossie;
  marca: string;
  modelo: string;
  cor: string;
  capacidade: string;
  imei1: string;
  imei2: string;
  serie: string;
  /** Data de aquisição mostrada na página pública do QR (ISO curto). */
  adquiridoEm: string;
}
