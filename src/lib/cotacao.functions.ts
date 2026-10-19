import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { validarEntradaCotacao, type DadosCotacao, type EntradaCotacao, type ResultadoCotacao, type CategoriaCotacao, type Arredondamento } from "./cotacao";
import type { Json } from "@/integrations/supabase/types";
import { aplicarCambio, cacheCambioValido, consultarCambio, type CambioAtual } from "./cotacao-cambio";

export const buscarDolarAoVivo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { forcar?: boolean }) => ({ forcar: data.forcar === true }))
  .handler(async ({ context, data }): Promise<CambioAtual> => {
    const acesso = await context.supabase.rpc("cotacao_operar", { acao: "inicial", entrada: {} });
    if (acesso.error) throw new Error("Acesso restrito à equipe.");
    const { config } = acesso.data as unknown as DadosCotacao;
    // Privileged cache access is allowed only after the team RPC authorizes the caller.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cache } = await supabaseAdmin.from("cotacao_cambio_cache").select("*").eq("id", true).maybeSingle();
    let cambio = !data.forcar && cache && cacheCambioValido(cache) ? cache : await consultarCambio();
    if (cambio && cambio !== cache) {
      const { error } = await supabaseAdmin.from("cotacao_cambio_cache").upsert({ ...cambio, id: true });
      if (error) cambio = null;
    }
    if (!cambio) return { dolar: config.dolar, base: config.dolar, acrescimo_pct: 0, fonte: "salvo", provedor: "Último valor salvo", horario: config.dolar_atualizado_em };
    return aplicarCambio(cambio, config.dolar_tipo, config.dolar_acrescimo_pct);
  });

export const carregarCotacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { busca?: string; categoria?: string }) => ({ busca: data.busca?.slice(0, 500) ?? "", categoria: data.categoria ?? "" }))
  .handler(async ({ data, context }) => {
    const resposta = await context.supabase.rpc("cotacao_operar", { acao: "inicial", entrada: data });
    if (resposta.error) throw new Error("Não foi possível carregar a cotação. Acesso restrito à equipe.");
    return resposta.data as unknown as DadosCotacao;
  });

export const calcularCotacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: EntradaCotacao & { salvar?: boolean }) => ({ ...validarEntradaCotacao(data), salvar: Boolean(data.salvar) }))
  .handler(async ({ data, context }) => {
    const resposta = await context.supabase.rpc("cotacao_operar", { acao: data.salvar ? "salvar" : "calcular", entrada: data as unknown as Json });
    if (resposta.error) throw new Error("Não foi possível calcular. Confira os valores e seu acesso.");
    return resposta.data as unknown as ResultadoCotacao;
  });

export const salvarDolar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { dolar: number }) => {
    if (!Number.isFinite(data.dolar) || data.dolar <= 0) throw new Error("Dólar deve ser maior que zero.");
    return data;
  })
  .handler(async ({ data, context }) => {
    const resposta = await context.supabase.rpc("cotacao_operar", { acao: "dolar", entrada: data });
    if (resposta.error) throw new Error("Não foi possível salvar o dólar.");
    return { ok: true };
  });

export const configurarCotacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { dolar: number; arredondamento: Arredondamento; categorias: CategoriaCotacao[]; dolar_tipo?: "ask" | "bid"; dolar_acrescimo_pct?: number }) => {
    if (data.dolar_tipo !== undefined && !["ask", "bid"].includes(data.dolar_tipo)) throw new Error("Selecione compra ou venda.");
    if (data.dolar_acrescimo_pct !== undefined && (!Number.isFinite(data.dolar_acrescimo_pct) || data.dolar_acrescimo_pct < 0 || data.dolar_acrescimo_pct > 100)) throw new Error("Acréscimo deve estar entre 0 e 100%.");
    if (!Number.isFinite(data.dolar) || data.dolar <= 0 || !["nenhum", "inteiro", "90", "00"].includes(data.arredondamento)) throw new Error("Configuração inválida.");
    if (data.categorias.length > 100 || data.categorias.some(c => !c.nome.trim() || !Number.isFinite(c.margem_pct) || Number(c.margem_pct) < 0 || Number(c.margem_pct) > 100 || !Number.isFinite(c.taxa_pct) || Number(c.taxa_pct) < 0 || Number(c.taxa_pct) > 100)) throw new Error("Preencha nomes, margens e taxas entre 0 e 100%.");
    return data;
  })
  .handler(async ({ data, context }) => {
    const resposta = await context.supabase.rpc("cotacao_operar", { acao: "configurar", entrada: data as unknown as Json });
    if (resposta.error) throw new Error("Não foi possível salvar. Configuração exclusiva de gerente.");
    return { ok: true };
  });