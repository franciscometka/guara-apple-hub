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
  | { t: "espaco"; altura?: number }
  | { t: "quebraPagina" };

/** Linha de crédito que vai no rodapé de toda página gerada. */
export const CREDITO_MODELO =
  "© 2026 Maués Advogados Associados. Modelo disponibilizado gratuitamente no Autorizados " +
  "Experience 2026 para uso dos participantes. Proibida sua comercialização sem autorização " +
  "do escritório. Direitos reservados nos termos da Lei nº 9.610/1998";

export interface DefModelo {
  slug: ModeloSlug;
  /** Trocar o texto de uma cláusula exige subir esta versão. */
  versao: string;
  etapa: EtapaContrato;
  /** Título impresso no topo do PDF. */
  titulo: string;
  passos: readonly DefPasso[];
  documento: readonly BlocoDoc[];
  /** Valores que já vêm prontos dos dados da loja. */
  daLoja?: ((loja: DadosLoja) => DadosContrato) | undefined;
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
