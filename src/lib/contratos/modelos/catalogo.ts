import type { EtapaContrato } from "../database";

/**
 * Catálogo dos modelos de contrato: o que a tela de escolha mostra e o que a
 * lista usa no filtro. O texto das cláusulas de cada modelo fica em um arquivo
 * próprio ao lado deste, versionado por `versao`.
 */

export type ModeloSlug =
  "termo-garantia-novo" | "pre-reserva-iphone-18" | "checklist-assistencia" | "upgrade-aparelho" | "compra-iphone";

export interface ModeloCatalogo {
  slug: ModeloSlug;
  /** Nome curto, como aparece no card e na lista. */
  nome: string;
  /** Título oficial impresso no PDF. */
  titulo: string;
  /** Uma linha dizendo quando usar. */
  quandoUsar: string;
  /** Etapas que o modelo gera, na ordem em que são liberadas. */
  etapas: EtapaContrato[];
}

export const MODELOS: ModeloCatalogo[] = [
  {
    slug: "compra-iphone",
    nome: "Compra de iPhone (sem upgrade)",
    titulo: "Contrato de Compra de iPhone",
    quandoUsar: "Cliente compra um iPhone sem entregar aparelho antigo.",
    etapas: ["principal"],
  },
  {
    slug: "termo-garantia-novo",
    nome: "Termo de Garantia (aparelho novo)",
    titulo: "Termo de Garantia de Aparelho Celular Novo",
    quandoUsar: "Entrega de aparelho novo, junto com a nota fiscal.",
    etapas: ["principal"],
  },
  {
    slug: "pre-reserva-iphone-18",
    nome: "Pré-reserva de iPhone 18",
    titulo: "Contrato de Pré-Reserva de Iphone 18 e Condições para Futura Compra e Venda",
    quandoUsar: "Cliente paga sinal e reserva um aparelho que ainda vai chegar.",
    etapas: ["principal", "entrega"],
  },
  {
    slug: "checklist-assistencia",
    nome: "Entrada para assistência técnica",
    titulo: "Checklist de Entrada de Aparelho para Assistência Técnica",
    quandoUsar: "Cliente deixa o aparelho na loja para análise ou reparo.",
    etapas: ["principal", "diagnostico", "conclusao"],
  },
  {
    slug: "upgrade-aparelho",
    nome: "Upgrade (troca com aparelho usado)",
    titulo: "Contrato de Upgrade de Aparelho Celular Apple",
    quandoUsar: "Cliente entrega um aparelho usado como parte do pagamento.",
    etapas: ["principal"],
  },
];

export const modeloPorSlug = (slug: string): ModeloCatalogo | undefined =>
  MODELOS.find((m) => m.slug === slug);

/** Nome curto para a lista, mesmo que o slug não seja mais reconhecido. */
export const nomeDoModelo = (slug: string): string => modeloPorSlug(slug)?.nome ?? slug;

/** Rótulos das etapas, usados no detalhe e no histórico de status. */
export const ROTULO_ETAPA: Record<EtapaContrato, string> = {
  principal: "Contrato principal",
  entrega: "Entrega e aceite",
  diagnostico: "Diagnóstico e orçamento",
  conclusao: "Conclusão e retirada",
};
