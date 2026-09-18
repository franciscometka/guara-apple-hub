import type { Database } from "@/integrations/supabase/types";

export const BUCKET_FOTOS = "produtos-fotos";

export const CATEGORIAS_DB = [
  "iPhone",
  "iPad",
  "Apple Watch",
  "AirPods",
  "Mac",
  "Acessórios",
  "Carregadores",
] as const;
export type CategoriaDB = (typeof CATEGORIAS_DB)[number];

export const CONDICOES_DB = ["Lacrado", "Seminovo", "Vitrine"] as const;
export type CondicaoDB = (typeof CONDICOES_DB)[number];

export type ProdutoRow = Database["public"]["Tables"]["produtos"]["Row"];

/** Forma consumida pelos componentes visuais do site. */
export interface ProdutoView {
  id: string;
  slug: string;
  nome: string;
  categoria: CategoriaDB;
  condicao: CondicaoDB;
  detalhe: string;
  imagem: string;
  preco: number | null;
  emEstoque: boolean;
  destaque: boolean;
  sku: string | null;
  bateria: number | null;
  cor: string | null;
  emPromocao: boolean;
  precoPromocional: number | null;
  criadoEm: string;
}

/**
 * URL estável (mesma no servidor e no cliente) para a foto guardada no bucket
 * privado — servida pela rota /api/public/foto/$.
 */
export function urlFoto(caminho: string | null): string {
  if (!caminho) return "";
  return `/api/public/foto/${caminho}`;
}

export function paraProdutoView(row: ProdutoRow): ProdutoView {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    categoria: row.categoria as CategoriaDB,
    condicao: row.condicao as CondicaoDB,
    detalhe: row.detalhe ?? "",
    imagem: urlFoto(row.imagem_url),
    preco: row.preco === null ? null : Number(row.preco),
    emEstoque: row.em_estoque,
    destaque: row.destaque,
    sku: row.sku,
    bateria: row.bateria,
    cor: row.cor,
    emPromocao: row.em_promocao,
    precoPromocional: row.preco_promocional === null ? null : Number(row.preco_promocional),
    criadoEm: row.criado_em,
  };
}

export function slugify(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Min\u00fasculas e sem acento \u2014 o cliente digita "pelicula", acha "Pel\u00edcula". */
function normalizarBusca(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Busca do cat\u00e1logo p\u00fablico, por nome e SKU. Cada palavra digitada precisa
 * aparecer em algum lugar do produto, em qualquer ordem: "13 pink" encontra
 * "IPHONE 13 PINK 128GB SEMINOVO". Termo vazio n\u00e3o filtra nada.
 */
export function combinaComBusca(
  produto: Pick<ProdutoView, "nome" | "sku">,
  termo: string,
): boolean {
  const palavras = normalizarBusca(termo).split(/\s+/).filter(Boolean);
  if (palavras.length === 0) return true;

  const alvo = normalizarBusca(`${produto.nome} ${produto.sku ?? ""}`);
  return palavras.every((p) => alvo.includes(p));
}
