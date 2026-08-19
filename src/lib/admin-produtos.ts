import { supabase } from "@/integrations/supabase/client";
import { BUCKET_FOTOS, slugify, urlFoto, type ProdutoRow } from "./produtos-shared";

export interface ProdutoAdmin extends ProdutoRow {
  fotoUrl: string;
}

const SELECT =
  "id, slug, nome, categoria, condicao, detalhe, preco, em_estoque, destaque, ativo, imagem_url, criado_em, atualizado_em";

export async function listarProdutosAdmin(): Promise<ProdutoAdmin[]> {
  const { data, error } = await supabase
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
}

async function subirFoto(slug: string, arquivo: File): Promise<string> {
  const ext = arquivo.name.split(".").pop()?.toLowerCase() || "webp";
  const caminho = `${slug}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET_FOTOS)
    .upload(caminho, arquivo, { contentType: arquivo.type, upsert: true });
  if (error) throw error;
  return caminho;
}

export async function criarProduto(dados: DadosProduto, foto: File | null): Promise<string> {
  const slug = `${slugify(dados.nome)}-${Date.now().toString(36)}`;
  const imagem_url = foto ? await subirFoto(slug, foto) : null;
  const { data, error } = await supabase
    .from("produtos")
    .insert({ ...dados, slug, imagem_url })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function atualizarProduto(
  id: string,
  slug: string,
  dados: DadosProduto,
  foto: File | null,
): Promise<void> {
  const imagem_url = foto ? await subirFoto(slug, foto) : null;
  const patch = imagem_url ? { ...dados, imagem_url } : { ...dados };
  const { error } = await supabase.from("produtos").update(patch).eq("id", id);
  if (error) throw error;
}

export async function alternarAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("produtos").update({ ativo }).eq("id", id);
  if (error) throw error;
}

export async function excluirProduto(id: string): Promise<void> {
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) throw error;
}
