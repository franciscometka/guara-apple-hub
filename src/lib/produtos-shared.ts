import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const BUCKET_FOTOS = "produtos-fotos";
export const ASSINATURA_SEGUNDOS = 60 * 60 * 24 * 7; // 7 dias

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

type ClienteSupabase = SupabaseClient<Database>;

/** Gera URLs assinadas para as fotos guardadas no bucket privado. */
export async function assinarFotos(
  cliente: ClienteSupabase,
  caminhos: string[],
): Promise<Record<string, string>> {
  const unicos = [...new Set(caminhos.filter(Boolean))];
  if (unicos.length === 0) return {};

  const { data, error } = await cliente.storage
    .from(BUCKET_FOTOS)
    .createSignedUrls(unicos, ASSINATURA_SEGUNDOS);

  if (error || !data) {
    console.warn("[produtos] falha ao assinar fotos:", error?.message);
    return {};
  }

  const mapa: Record<string, string> = {};
  data.forEach((item, i) => {
    const caminho = item.path ?? unicos[i];
    if (caminho && item.signedUrl) mapa[caminho] = item.signedUrl;
  });
  return mapa;
}

export function paraProdutoView(
  row: ProdutoRow,
  fotos: Record<string, string>,
): ProdutoView {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    categoria: row.categoria as CategoriaDB,
    condicao: row.condicao as CondicaoDB,
    detalhe: row.detalhe ?? "",
    imagem: row.imagem_url ? (fotos[row.imagem_url] ?? "") : "",
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
