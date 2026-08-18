import type { Database } from "@/integrations/supabase/types";

export const BUCKET_FOTOS = "produtos-fotos";

export const CATEGORIAS_DB = [
  "iPhone",
  "iPad",
  "Apple Watch",
  "AirPods",
  "Mac",
  "Acessórios",
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
