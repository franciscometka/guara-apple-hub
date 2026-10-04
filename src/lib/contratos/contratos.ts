import { db, type ContratoRow, type DossieRow, type StatusContrato } from "./database";
import { anexosCompletos } from "./anexos";

/** Lista de contratos com o aparelho do dossiê, para a tela /admin/contratos. */

export interface ContratoDaLista extends ContratoRow {
  dossie: Pick<DossieRow, "id" | "modelo" | "marca" | "imei1" | "token_ativo"> | null;
  /** Nota fiscal de entrada e as três fotos já anexadas? */
  dossieCompleto: boolean;
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

  return { itens: await comCompletude(data ?? []), total: count ?? 0 };
}

/**
 * O selo de dossiê completo depende dos anexos, que vivem em outra tabela.
 * Uma consulta só, restrita aos dossiês da página.
 */
async function comCompletude(linhas: unknown[]): Promise<ContratoDaLista[]> {
  const itens = linhas as ContratoDaLista[];
  const ids = [...new Set(itens.map((c) => c.dossie_id).filter((id): id is string => Boolean(id)))];
  if (ids.length === 0) return itens.map((c) => ({ ...c, dossieCompleto: false }));

  const { data: anexos, error } = await db
    .from("contrato_anexos")
    .select("dossie_id, tipo")
    .in("dossie_id", ids);
  if (error) throw error;

  return itens.map((contrato) => ({
    ...contrato,
    dossieCompleto:
      contrato.dossie_id !== null &&
      anexosCompletos((anexos ?? []).filter((a) => a.dossie_id === contrato.dossie_id)),
  }));
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

  return comCompletude(data ?? []);
}
