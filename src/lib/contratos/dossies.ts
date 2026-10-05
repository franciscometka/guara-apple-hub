import {
  db,
  type ContratoAnexoRow,
  type ContratoEtapaRow,
  type ContratoRow,
  type DossieRow,
  type OrigemDossie,
} from "./database";
import { listarAnexos, pendenciasDeAnexo } from "./anexos";
import { gerarToken } from "./token";
import { soDigitos } from "./validadores";

/**
 * O dossiê é a ficha do aparelho: identificação, contratos emitidos e anexos.
 * É o que a etiqueta de QR Code aponta e o que a loja abre numa fiscalização.
 */

export const ROTULO_ORIGEM: Record<OrigemDossie, string> = {
  venda: "Aparelho vendido",
  assistencia: "Aparelho do cliente (assistência)",
  upgrade_entrada: "Entrada de upgrade",
  upgrade_venda: "Vendido em upgrade",
};

export const POR_PAGINA = 20;

/** "iPhone 15 Pro 256 GB Titânio Natural", com o que houver preenchido. */
export function nomeDoAparelho(
  dossie: Pick<DossieRow, "marca" | "modelo" | "capacidade" | "cor">,
): string {
  const partes = [dossie.marca, dossie.modelo, dossie.capacidade, dossie.cor]
    .map((p) => p?.trim())
    .filter((p): p is string => Boolean(p));
  return partes.length > 0 ? partes.join(" ") : "Aparelho sem identificação";
}

export interface DossieDaLista extends DossieRow {
  /** Quantos contratos apontam para este dossiê. */
  contratos: number;
  /** Anexos exigidos que ainda faltam. */
  faltando: number;
}

export interface PaginaDossies {
  itens: DossieDaLista[];
  total: number;
}

export interface FiltrosDossies {
  busca?: string;
  origem?: OrigemDossie | "todas";
  pagina?: number;
}

/**
 * Lista paginada. A contagem de contratos e a completude dos anexos saem de
 * duas consultas extras, restritas aos dossiês da página.
 */
export async function listarDossies(filtros: FiltrosDossies = {}): Promise<PaginaDossies> {
  const pagina = filtros.pagina ?? 0;
  const de = pagina * POR_PAGINA;

  let consulta = db
    .from("dossies")
    .select("*", { count: "exact" })
    .order("criado_em", { ascending: false })
    .range(de, de + POR_PAGINA - 1);

  if (filtros.origem && filtros.origem !== "todas") {
    consulta = consulta.eq("origem", filtros.origem);
  }

  const termo = filtros.busca?.trim();
  if (termo) {
    const limpo = termo.replace(/[%,()]/g, "");
    const digitos = soDigitos(termo);
    const partes = [`modelo.ilike.%${limpo}%`, `serie.ilike.%${limpo}%`];
    if (digitos.length >= 4) {
      partes.push(`imei1.ilike.%${digitos}%`, `imei2.ilike.%${digitos}%`);
    }
    consulta = consulta.or(partes.join(","));
  }

  const { data, error, count } = await consulta;
  if (error) throw error;

  const dossies = data ?? [];
  const ids = dossies.map((d) => d.id);
  if (ids.length === 0) return { itens: [], total: count ?? 0 };

  const [{ data: contratos }, { data: anexos }] = await Promise.all([
    db.from("contratos").select("id, dossie_id").in("dossie_id", ids),
    db.from("contrato_anexos").select("id, dossie_id, tipo").in("dossie_id", ids),
  ]);

  const itens = dossies.map((dossie) => ({
    ...dossie,
    contratos: (contratos ?? []).filter((c) => c.dossie_id === dossie.id).length,
    faltando: pendenciasDeAnexo((anexos ?? []).filter((a) => a.dossie_id === dossie.id)).length,
  }));

  return { itens, total: count ?? 0 };
}

export interface ContratoDoDossie extends ContratoRow {
  etapas: ContratoEtapaRow[];
}

export interface DossieCompleto {
  dossie: DossieRow;
  contratos: ContratoDoDossie[];
  anexos: ContratoAnexoRow[];
}

export async function carregarDossie(id: string): Promise<DossieCompleto> {
  const { data: dossie, error } = await db.from("dossies").select("*").eq("id", id).single();
  if (error) throw error;

  const { data: contratos, error: erroContratos } = await db
    .from("contratos")
    .select("*")
    .eq("dossie_id", id)
    .order("criado_em", { ascending: false });
  if (erroContratos) throw erroContratos;

  const ids = (contratos ?? []).map((c) => c.id);
  let etapas: ContratoEtapaRow[] = [];
  if (ids.length > 0) {
    const { data, error: erroEtapas } = await db
      .from("contrato_etapas")
      .select("*")
      .in("contrato_id", ids)
      .order("criado_em", { ascending: true });
    if (erroEtapas) throw erroEtapas;
    etapas = data ?? [];
  }

  return {
    dossie,
    contratos: (contratos ?? []).map((contrato) => ({
      ...contrato,
      etapas: etapas.filter((e) => e.contrato_id === contrato.id),
    })),
    anexos: await listarAnexos(id),
  };
}

/** Campos do aparelho que a tela do dossiê deixa corrigir. */
export type CamposDoAparelho = Pick<
  DossieRow,
  "marca" | "modelo" | "cor" | "capacidade" | "imei1" | "imei2" | "serie" | "adquirido_em"
>;

export const ROTULOS_APARELHO: Record<keyof CamposDoAparelho, string> = {
  marca: "Marca",
  modelo: "Modelo",
  cor: "Cor",
  capacidade: "Capacidade",
  imei1: "IMEI 1",
  imei2: "IMEI 2",
  serie: "Número de série",
  adquirido_em: "Entrou na loja em",
};

/**
 * Corrige a identificação do aparelho. Não mexe no contrato já emitido: o PDF
 * é imutável de propósito, isto aqui é a ficha do aparelho.
 */
export async function salvarAparelho(id: string, campos: CamposDoAparelho): Promise<void> {
  const { error } = await db
    .from("dossies")
    .update({
      marca: campos.marca?.trim() || null,
      modelo: campos.modelo?.trim() || null,
      cor: campos.cor?.trim() || null,
      capacidade: campos.capacidade?.trim() || null,
      imei1: soDigitos(campos.imei1 ?? "") || null,
      imei2: soDigitos(campos.imei2 ?? "") || null,
      serie: campos.serie?.trim() || null,
      adquirido_em: campos.adquirido_em || null,
    })
    .eq("id", id);
  if (error) throw error;
}

/** O que falta para o dossiê estar pronto para uma fiscalização. */
export function pendenciasDoDossie(completo: DossieCompleto): string[] {
  const faltas = pendenciasDeAnexo(completo.anexos).map((def) => def.rotulo);

  if (!completo.dossie.imei1) faltas.push("IMEI do aparelho");

  const semAssinatura = completo.contratos.some(
    (c) => c.status !== "cancelado" && !c.etapas.some((e) => e.assinado_path),
  );
  if (semAssinatura) faltas.push("Contrato assinado");

  return faltas;
}

export const dossieCompleto = (completo: DossieCompleto): boolean =>
  pendenciasDoDossie(completo).length === 0;

// ---------------------------------------------------------------------------
// QR Code do aparelho
// ---------------------------------------------------------------------------

/**
 * Liga e desliga a página pública sem trocar o token. Desligado, o endereço
 * da etiqueta passa a responder "Documentação indisponível"; religado, a mesma
 * etiqueta volta a funcionar.
 */
export async function definirQrAtivo(id: string, ativo: boolean): Promise<void> {
  const { error } = await db.from("dossies").update({ token_ativo: ativo }).eq("id", id);
  if (error) throw error;
}

/**
 * Sorteia um token novo. O endereço antigo morre na hora — toda etiqueta já
 * colada neste aparelho precisa ser reimpressa. Só faz sentido quando o
 * endereço antigo vazou.
 */
export async function gerarNovoToken(id: string): Promise<string> {
  const token = gerarToken();
  const { data, error } = await db
    .from("dossies")
    .update({ token, token_ativo: true })
    .eq("id", id)
    .select("token")
    .single();
  if (error) throw error;
  return data.token;
}
