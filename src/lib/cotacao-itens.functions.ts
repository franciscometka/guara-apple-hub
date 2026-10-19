import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ListaCotacao } from "./cotacao-lista";

const erroAcesso = "Acesso restrito à equipe.";

export const listarItensCotacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { dolar: number }) => {
    if (!Number.isFinite(data.dolar) || data.dolar <= 0)
      throw new Error("Dólar deve ser maior que zero.");
    return { dolar: data.dolar };
  })
  .handler(async ({ data, context }): Promise<ListaCotacao> => {
    const r = await context.supabase.rpc("cotacao_itens_listar", { p_dolar: data.dolar });
    if (r.error) throw new Error(erroAcesso);
    return r.data as unknown as ListaCotacao;
  });

export const criarItemCotacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { categoria_id: string; ordem: number }) => ({
    categoria_id: String(data.categoria_id),
    ordem: Math.trunc(Number(data.ordem)) || 0,
  }))
  .handler(async ({ data, context }) => {
    const r = await context.supabase
      .from("cotacao_itens")
      .insert({ categoria_id: data.categoria_id, ordem: data.ordem })
      .select("id")
      .single();
    if (r.error) throw new Error("Não foi possível adicionar o produto.");
    return { id: r.data.id };
  });

export const salvarItemCotacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; descricao: string; preco_usd: number }) => {
    if (!Number.isFinite(data.preco_usd) || data.preco_usd < 0 || data.preco_usd >= 10_000_000)
      throw new Error("Custo em US$ inválido.");
    return {
      id: String(data.id),
      descricao: String(data.descricao ?? "").slice(0, 500),
      preco_usd: data.preco_usd,
    };
  })
  .handler(async ({ data, context }) => {
    const r = await context.supabase
      .from("cotacao_itens")
      .update({ descricao: data.descricao, preco_usd: data.preco_usd })
      .eq("id", data.id);
    if (r.error) throw new Error("Não foi possível salvar a linha.");
    return { ok: true };
  });

export const excluirItemCotacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    const r = await context.supabase.from("cotacao_itens").delete().eq("id", data.id);
    if (r.error) throw new Error("Não foi possível excluir a linha.");
    return { ok: true };
  });

export const ajustarMargemCategoria = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { categoria_id: string; margem_pct: number }) => {
    if (!Number.isFinite(data.margem_pct) || data.margem_pct < 0 || data.margem_pct > 100)
      throw new Error("Margem deve estar entre 0 e 100%.");
    return { categoria_id: String(data.categoria_id), margem_pct: data.margem_pct };
  })
  .handler(async ({ data, context }) => {
    const r = await context.supabase.rpc("cotacao_categoria_margem", {
      p_categoria: data.categoria_id,
      p_margem: data.margem_pct,
    });
    if (r.error) throw new Error("Somente gerente altera a margem.");
    return { ok: true };
  });
