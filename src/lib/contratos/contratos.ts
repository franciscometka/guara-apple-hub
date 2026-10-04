import { db, type ContratoRow, type DossieRow, type StatusContrato } from "./database";

/** Lista de contratos com o aparelho do dossiê, para a tela /admin/contratos. */

export interface ContratoDaLista extends ContratoRow {
  dossie: Pick<DossieRow, "id" | "modelo" | "marca" | "imei1" | "token_ativo"> | null;
}

export const POR_PAGINA = 20;

export interface FiltrosContratos {
  busca?: string;
  modeloSlug?: string;
  status?: StatusContrato | "todos";
  pagina?: number;
}

export interface PaginaContratos {
  itens: ContratoDaLista[];
  total: number;
}

const SELECT =
  "id, numero, dossie_id, modelo_slug, modelo_versao, status, cliente_nome, cliente_cpf, " +
  "substitui_contrato_id, criado_por, criado_em, atualizado_em, assinado_em, cancelado_em, " +
  "dossie:dossies (id, modelo, marca, imei1, token_ativo)";

export async function listarContratos(filtros: FiltrosContratos = {}): Promise<PaginaContratos> {
  const pagina = filtros.pagina ?? 0;
  const de = pagina * POR_PAGINA;

  let consulta = db
    .from("contratos")
    .select(SELECT, { count: "exact" })
    .order("criado_em", { ascending: false })
    .range(de, de + POR_PAGINA - 1);

  if (filtros.modeloSlug && filtros.modeloSlug !== "todos") {
    consulta = consulta.eq("modelo_slug", filtros.modeloSlug);
  }
  if (filtros.status && filtros.status !== "todos") {
    consulta = consulta.eq("status", filtros.status);
  }

  // Busca por nome do cliente, CPF ou número do contrato. O IMEI é filtrado
  // depois, porque vive na tabela do dossiê.
  const termo = filtros.busca?.trim();
  if (termo) {
    const limpo = termo.replace(/[%,()]/g, "");
    consulta = consulta.or(
      `numero.ilike.%${limpo}%,cliente_nome.ilike.%${limpo}%,cliente_cpf.ilike.%${limpo}%`,
    );
  }

  const { data, error, count } = await consulta;
  if (error) throw error;

  return { itens: (data ?? []) as unknown as ContratoDaLista[], total: count ?? 0 };
}

/**
 * Busca por IMEI. O IMEI vive na tabela do dossiê, então são duas consultas:
 * primeiro os dossiês que casam, depois os contratos deles.
 */
export async function buscarPorImei(imei: string): Promise<ContratoDaLista[]> {
  const digitos = imei.replace(/\D+/g, "");
  if (digitos.length < 4) return [];

  const { data: dossies, error: erroDossies } = await db
    .from("dossies")
    .select("id")
    .ilike("imei1", `%${digitos}%`)
    .limit(POR_PAGINA);
  if (erroDossies) throw erroDossies;

  const ids = (dossies ?? []).map((d) => d.id);
  if (ids.length === 0) return [];

  const { data, error } = await db
    .from("contratos")
    .select(SELECT)
    .in("dossie_id", ids)
    .order("criado_em", { ascending: false })
    .limit(POR_PAGINA);
  if (error) throw error;

  return (data ?? []) as unknown as ContratoDaLista[];
}
