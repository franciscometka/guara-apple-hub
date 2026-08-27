import { queryOptions } from "@tanstack/react-query";
import { listarFotosProduto, listarProdutosPublicos } from "./produtos.functions";

export const produtosPublicosQuery = () =>
  queryOptions({
    queryKey: ["produtos", "publicos"],
    queryFn: () => listarProdutosPublicos(),
    staleTime: 60_000,
  });

export const fotosProdutoQuery = (produtoId: string) =>
  queryOptions({
    queryKey: ["produtos", "fotos", produtoId],
    queryFn: () => listarFotosProduto({ data: produtoId }),
    staleTime: 60_000,
  });
