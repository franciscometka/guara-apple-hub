import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { paraProdutoView, urlFoto, type ProdutoView } from "./produtos-shared";

function clientePublico() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

  return createClient<Database>(url, key, {
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
}

export const listarProdutosPublicos = createServerFn({
  method: "GET",
}).handler(async (): Promise<ProdutoView[]> => {
  const { data, error } = await clientePublico()
    .from("produtos")
    .select(
      "id, slug, nome, categoria, condicao, detalhe, preco, em_estoque, destaque, ativo, imagem_url, criado_em, atualizado_em, sku, bateria, cor, em_promocao, preco_promocional",
    )
    .eq("ativo", true)
    .order("destaque", { ascending: false })
    .order("criado_em", { ascending: true });

  if (error) {
    console.error("[produtos] falha ao listar produtos:", error.message);
    return [];
  }

  return (data ?? []).map((row) => paraProdutoView(row));
});

/** Fotos extras da galeria (a principal continua em `produtos.imagem_url`). */
export const listarFotosProduto = createServerFn({ method: "GET" })
  .inputValidator((produtoId: string) => produtoId)
  .handler(async ({ data: produtoId }): Promise<string[]> => {
    const { data, error } = await clientePublico()
      .from("produto_fotos")
      .select("caminho, ordem")
      .eq("produto_id", produtoId)
      .order("ordem", { ascending: true });

    if (error) {
      console.error("[produtos] falha ao listar fotos:", error.message);
      return [];
    }

    return (data ?? []).map((f) => urlFoto(f.caminho));
  });
