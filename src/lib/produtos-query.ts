import { queryOptions } from "@tanstack/react-query";
import { listarProdutosPublicos } from "./produtos.functions";

export const produtosPublicosQuery = () =>
  queryOptions({
    queryKey: ["produtos", "publicos"],
    queryFn: () => listarProdutosPublicos(),
    staleTime: 60_000,
  });
