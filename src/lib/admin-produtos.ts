import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DatabaseComProdutoFotos } from "./database-extensions";
import { BUCKET_FOTOS, slugify, urlFoto, type ProdutoRow } from "./produtos-shared";

const supabaseComGaleria = supabase as unknown as SupabaseClient<DatabaseComProdutoFotos>;

export interface ProdutoAdmin extends ProdutoRow {
  fotoUrl: string;
}

const SELECT =
  "id, slug, nome, categoria, condicao, detalhe, preco, em_estoque, destaque, ativo, imagem_url, criado_em, atualizado_em, sku, bateria, cor, em_promocao, preco_promocional";

export async function listarProdutosAdmin(): Promise<ProdutoAdmin[]> {
  const { data, error } = await supabaseComGaleria
    .from("produtos")
    .select(SELECT)
    .order("criado_em", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    fotoUrl: urlFoto(row.imagem_url),
  }));
}

export async function obterProdutoAdmin(id: string): Promise<ProdutoAdmin> {
  const { data, error } = await supabase.from("produtos").select(SELECT).eq("id", id).single();
  if (error) throw error;

  return { ...data, fotoUrl: urlFoto(data.imagem_url) };
}

export interface DadosProduto {
  nome: string;
  categoria: string;
  condicao: string;
  detalhe: string;
  preco: number | null;
  em_estoque: boolean;
  destaque: boolean;
  ativo: boolean;
  sku: string | null;
  bateria: number | null;
  cor: string | null;
  em_promocao: boolean;
  preco_promocional: number | null;
}

async function subirFoto(slug: string, arquivo: File, sufixo = ""): Promise<string> {
  const ext = arquivo.name.split(".").pop()?.toLowerCase() || "webp";
  const caminho = `${slug}-${Date.now()}${sufixo}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET_FOTOS)
    .upload(caminho, arquivo, { contentType: arquivo.type, upsert: true });
  if (error) throw error;
  return caminho;
}

/** Fotos extras da galeria, já como URL servida por /api/public/foto. */
export interface FotoGaleria {
  id: string;
  url: string;
}

export async function listarFotosGaleria(produtoId: string): Promise<FotoGaleria[]> {
  const { data, error } = await supabaseComGaleria
    .from("produto_fotos")
    .select("id, caminho")
    .eq("produto_id", produtoId)
    .order("ordem", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((f) => ({ id: f.id, url: urlFoto(f.caminho) }));
}

async function subirGaleria(produtoId: string, slug: string, fotos: File[]): Promise<void> {
  if (fotos.length === 0) return;

  // A ordem continua de onde a galeria atual parou, para não embaralhar
  // as fotos já cadastradas.
  const { data: existentes } = await supabaseComGaleria
    .from("produto_fotos")
    .select("ordem")
    .eq("produto_id", produtoId)
    .order("ordem", { ascending: false })
    .limit(1);
  const base = (existentes?.[0]?.ordem ?? -1) + 1;

  const linhas = [];
  for (const [i, arquivo] of fotos.entries()) {
    const caminho = await subirFoto(slug, arquivo, `-g${i}`);
    linhas.push({ produto_id: produtoId, caminho, ordem: base + i });
  }

  const { error } = await supabaseComGaleria.from("produto_fotos").insert(linhas);
  if (error) throw error;
}

export async function excluirFotoGaleria(id: string): Promise<void> {
  const { error } = await supabaseComGaleria.from("produto_fotos").delete().eq("id", id);
  if (error) throw error;
}

export async function criarProduto(
  dados: DadosProduto,
  foto: File | null,
  galeria: File[] = [],
): Promise<string> {
  const slug = `${slugify(dados.nome)}-${Date.now().toString(36)}`;
  const imagem_url = foto ? await subirFoto(slug, foto) : null;
  const { data, error } = await supabase
    .from("produtos")
    .insert({ ...dados, slug, imagem_url })
    .select("id")
    .single();
  if (error) throw error;

  await subirGaleria(data.id, slug, galeria);
  return data.id;
}

export async function atualizarProduto(
  id: string,
  slug: string,
  dados: DadosProduto,
  foto: File | null,
  galeria: File[] = [],
): Promise<void> {
  const imagem_url = foto ? await subirFoto(slug, foto) : null;
  const patch = imagem_url ? { ...dados, imagem_url } : { ...dados };
  const { error } = await supabase.from("produtos").update(patch).eq("id", id);
  if (error) throw error;

  await subirGaleria(id, slug, galeria);
}

export async function alternarAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("produtos").update({ ativo }).eq("id", id);
  if (error) throw error;
}

export async function excluirProduto(id: string): Promise<void> {
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) throw error;
}
