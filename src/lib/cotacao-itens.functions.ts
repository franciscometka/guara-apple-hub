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
    if (r.error) {
      // 42883 / PGRST202: a função ainda não existe (migration pendente).
      if (r.error.code === "42883" || r.error.code === "PGRST202")
        throw new Error("Banco desatualizado: falta aplicar a migration cotacao_itens.");
      throw new Error(erroAcesso);
    }
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
  .inputValidator(
    (data: { id: string; descricao: string; preco_usd: number; lucro_brl?: number | null }) => {
      if (!Number.isFinite(data.preco_usd) || data.preco_usd < 0 || data.preco_usd >= 10_000_000)
        throw new Error("Custo em US$ inválido.");
      const lucro = data.lucro_brl ?? undefined;
      if (lucro !== undefined && (!Number.isFinite(lucro) || lucro < 0 || lucro >= 10_000_000))
        throw new Error("Lucro inválido.");
      return {
        id: String(data.id),
        descricao: String(data.descricao ?? "").slice(0, 500),
        preco_usd: data.preco_usd,
        lucro_brl: data.lucro_brl === undefined ? undefined : (lucro ?? null),
      };
    },
  )
  .handler(async ({ data, context }) => {
    const r = await context.supabase
      .from("cotacao_itens")
      .update({ descricao: data.descricao, preco_usd: data.preco_usd })
      .eq("id", data.id);
    if (r.error) throw new Error("Não foi possível salvar a linha.");
    // Só gerente envia lucro; null = volta ao lucro padrão da aba. A função checa o papel.
    if (data.lucro_brl !== undefined) {
      const l = await context.supabase.rpc("cotacao_item_lucro", {
        p_item: data.id,
        ...(data.lucro_brl === null ? {} : { p_lucro: data.lucro_brl }),
      });
      if (l.error) throw new Error("Somente gerente altera o lucro.");
    }
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

export const ajustarCategoriaCotacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { categoria_id: string; taxa_pct?: number; lucro_brl?: number }) => {
    if (
      data.taxa_pct !== undefined &&
      (!Number.isFinite(data.taxa_pct) || data.taxa_pct < 0 || data.taxa_pct > 100)
    )
      throw new Error("Frete deve estar entre 0 e 100%.");
    if (
      data.lucro_brl !== undefined &&
      (!Number.isFinite(data.lucro_brl) || data.lucro_brl < 0 || data.lucro_brl >= 10_000_000)
    )
      throw new Error("Lucro inválido.");
    return {
      categoria_id: String(data.categoria_id),
      taxa_pct: data.taxa_pct,
      lucro_brl: data.lucro_brl,
    };
  })
  .handler(async ({ data, context }) => {
    const r = await context.supabase.rpc("cotacao_categoria_ajustar", {
      p_categoria: data.categoria_id,
      ...(data.taxa_pct !== undefined ? { p_frete: data.taxa_pct } : {}),
      ...(data.lucro_brl !== undefined ? { p_lucro: data.lucro_brl } : {}),
    });
    if (r.error) throw new Error("Somente gerente altera frete e lucro.");
    return { ok: true };
  });
