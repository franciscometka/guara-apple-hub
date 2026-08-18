import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  assinarFotos,
  paraProdutoView,
  type ProdutoView,
} from "./produtos-shared";

export const listarProdutosPublicos = createServerFn({
  method: "GET",
}).handler(async (): Promise<ProdutoView[]> => {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

  const cliente = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const { data, error } = await cliente
    .from("produtos")
    .select(
      "id, slug, nome, categoria, condicao, detalhe, preco, em_estoque, destaque, ativo, imagem_url, criado_em, atualizado_em",
    )
    .eq("ativo", true)
    .order("destaque", { ascending: false })
    .order("criado_em", { ascending: true });

  if (error) {
    console.error("[produtos] falha ao listar produtos:", error.message);
    return [];
  }

  const rows = data ?? [];
  const fotos = await assinarFotos(
    cliente,
    rows.map((r) => r.imagem_url ?? ""),
  );

  return rows.map((row) => paraProdutoView(row, fotos));
});
