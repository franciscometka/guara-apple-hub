import type { CategoriaDB, CondicaoDB } from "@/lib/produtos-shared";

/**
 * Uma pill do filtro do catálogo. Quase toda pill é só uma categoria, mas
 * iPhone é dividido em duas pelo campo `condicao`.
 */
export interface FiltroCatalogo {
  id: string;
  rotulo: string;
  /** Ausente = todas as categorias. */
  categoria?: CategoriaDB;
  /** Ausente = todas as condições. */
  condicoes?: readonly CondicaoDB[];
}

export const FILTROS_CATALOGO = [
  { id: "todos", rotulo: "Todos" },
  { id: "iphone-lacrado", rotulo: "iPhone lacrado", categoria: "iPhone", condicoes: ["Lacrado"] },
  {
    id: "iphone-seminovos",
    rotulo: "iPhone seminovos",
    categoria: "iPhone",
    // "Vitrine" entra aqui: não é lacrado, então acompanha os seminovos.
    condicoes: ["Seminovo", "Vitrine"],
  },
  { id: "ipad", rotulo: "iPad", categoria: "iPad" },
  { id: "apple-watch", rotulo: "Apple Watch", categoria: "Apple Watch" },
  { id: "airpods", rotulo: "AirPods", categoria: "AirPods" },
  { id: "mac", rotulo: "Mac", categoria: "Mac" },
  { id: "acessorios", rotulo: "Acessórios", categoria: "Acessórios" },
  { id: "carregadores", rotulo: "Carregadores", categoria: "Carregadores" },
] as const satisfies readonly FiltroCatalogo[];

export type FiltroCatalogoId = (typeof FILTROS_CATALOGO)[number]["id"];

/** Pill selecionada quando a página abre. */
export const FILTRO_PADRAO: FiltroCatalogoId = "todos";

export function filtroPorId(id: FiltroCatalogoId): FiltroCatalogo {
  return FILTROS_CATALOGO.find((f) => f.id === id) ?? FILTROS_CATALOGO[0];
}

export function combinaComFiltro(
  produto: { categoria: CategoriaDB; condicao: CondicaoDB },
  filtro: FiltroCatalogo,
): boolean {
  if (filtro.categoria && produto.categoria !== filtro.categoria) return false;
  if (filtro.condicoes && !filtro.condicoes.includes(produto.condicao)) return false;
  return true;
}
