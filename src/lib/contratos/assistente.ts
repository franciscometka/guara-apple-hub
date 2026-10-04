import {
  BUCKET_CONTRATOS,
  db,
  type ContratoEtapaRow,
  type ContratoRow,
  type DossieRow,
  type EtapaContrato,
} from "./database";
import type { DadosContrato } from "./campos/tipos";
import type { DefEtapaModelo, DefModelo, ProdutoDoCatalogo } from "./modelos/tipos";
import { gerarPdf, type PdfGerado } from "./gerar-pdf";
import { gerarToken } from "./token";
import type { DadosLoja } from "./loja-config";
import { soDigitos } from "./validadores";

/**
 * Ciclo de vida de um contrato: criar o rascunho, salvar o preenchimento a
 * cada passo e fechar a etapa gerando o PDF.
 */

export interface ContratoCompleto {
  contrato: ContratoRow;
  etapas: ContratoEtapaRow[];
  dossie: DossieRow | null;
}

async function usuarioAtual(): Promise<string | null> {
  const { data } = await db.auth.getUser();
  return data.user?.id ?? null;
}

/** Cria o contrato em rascunho e a etapa principal vazia. */
export async function criarContrato(
  modelo: DefModelo,
  produto?: ProdutoDoCatalogo | undefined,
): Promise<string> {
  const criadoPor = await usuarioAtual();

  const { data: contrato, error } = await db
    .from("contratos")
    .insert({
      modelo_slug: modelo.slug,
      modelo_versao: modelo.versao,
      status: "rascunho",
      criado_por: criadoPor,
    })
    .select("*")
    .single();
  if (error) throw error;

  const principal = modelo.etapas[0];
  if (!principal) throw new Error("Modelo sem etapas.");

  // Sementes do rascunho: numeração própria do modelo (ordem de serviço) e os
  // valores que já nascem preenchidos, como a data e a hora de agora.
  const dados: DadosContrato = {
    ...(modelo.padroes?.() ?? {}),
    ...(produto ? (modelo.doProduto?.(produto) ?? {}) : {}),
  };
  if (modelo.semente) {
    const { data: numero, error: erroNumero } = await db.rpc("proximo_numero", {
      _escopo: modelo.semente.escopo,
    });
    if (erroNumero) throw erroNumero;
    dados[modelo.semente.campo] = numero;
  }

  const { error: erroEtapa } = await db.from("contrato_etapas").insert({
    contrato_id: contrato.id,
    etapa: principal.etapa,
    status: "rascunho",
    dados,
    passo_atual: 0,
  });
  if (erroEtapa) throw erroEtapa;

  return contrato.id;
}

/**
 * Cria a linha da etapa seguinte na hora em que ela é aberta pela primeira vez
 * (entrega, diagnóstico, conclusão).
 */
export async function abrirEtapa(
  contratoId: string,
  etapa: EtapaContrato,
): Promise<ContratoEtapaRow> {
  const { data: existente } = await db
    .from("contrato_etapas")
    .select("*")
    .eq("contrato_id", contratoId)
    .eq("etapa", etapa)
    .maybeSingle();
  if (existente) return existente;

  const { data, error } = await db
    .from("contrato_etapas")
    .insert({ contrato_id: contratoId, etapa, status: "rascunho", dados: {}, passo_atual: 0 })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function carregarContrato(id: string): Promise<ContratoCompleto> {
  const { data: contrato, error } = await db.from("contratos").select("*").eq("id", id).single();
  if (error) throw error;

  const { data: etapas, error: erroEtapas } = await db
    .from("contrato_etapas")
    .select("*")
    .eq("contrato_id", id)
    .order("criado_em", { ascending: true });
  if (erroEtapas) throw erroEtapas;

  let dossie: DossieRow | null = null;
  if (contrato.dossie_id) {
    const { data } = await db.from("dossies").select("*").eq("id", contrato.dossie_id).single();
    dossie = data ?? null;
  }

  return { contrato, etapas: etapas ?? [], dossie };
}

export const etapaDe = (
  completo: ContratoCompleto,
  etapa: EtapaContrato,
): ContratoEtapaRow | undefined => completo.etapas.find((e) => e.etapa === etapa);

/** Salvamento automático do rascunho, a cada passo do assistente. */
export async function salvarRascunho(
  etapaId: string,
  dados: DadosContrato,
  passoAtual: number,
): Promise<void> {
  const { error } = await db
    .from("contrato_etapas")
    .update({ dados, passo_atual: passoAtual })
    .eq("id", etapaId);
  if (error) throw error;
}

/**
 * Procura um dossiê com o mesmo IMEI para reaproveitar; se não houver, cria um
 * novo já com o token do QR Code.
 */
async function dossieDoAparelho(
  modelo: DefModelo,
  dados: DadosContrato,
  produtoId: string | null,
): Promise<string> {
  const info = modelo.dossie?.(dados);
  if (!info) throw new Error("Este modelo não define qual aparelho vira dossiê.");

  const imei = soDigitos(info.imei1);
  if (imei) {
    const { data: existente } = await db
      .from("dossies")
      .select("id")
      .eq("imei1", imei)
      .limit(1)
      .maybeSingle();
    if (existente) return existente.id;
  }

  const criadoPor = await usuarioAtual();
  const { data, error } = await db
    .from("dossies")
    .insert({
      token: gerarToken(),
      token_ativo: true,
      produto_id: produtoId,
      marca: info.marca,
      modelo: info.modelo,
      cor: info.cor,
      capacidade: info.capacidade,
      imei1: imei,
      imei2: soDigitos(info.imei2) || info.imei2,
      serie: info.serie,
      origem: info.origem,
      adquirido_em: info.adquiridoEm || null,
      criado_por: criadoPor,
    })
    .select("id")
    .single();
  if (error) throw error;

  return data.id;
}

export interface ResultadoGeracao {
  pdf: PdfGerado;
  caminho: string;
  dossieId: string;
}

/**
 * Fecha a etapa: gera o PDF, guarda no bucket privado, grava o hash SHA-256 e
 * trava os dados. A partir daqui o conteúdo não é mais editável — para
 * corrigir, cancela-se o contrato e cria-se uma nova versão.
 */
export async function gerarEGravarPdf(
  contrato: ContratoRow,
  etapa: ContratoEtapaRow,
  modelo: DefModelo,
  etapaModelo: DefEtapaModelo,
  dados: DadosContrato,
  loja: DadosLoja,
  produtoId: string | null = null,
): Promise<ResultadoGeracao> {
  const dossieId = contrato.dossie_id ?? (await dossieDoAparelho(modelo, dados, produtoId));

  const pdf = await gerarPdf(modelo, etapaModelo, dados, loja.razao_social);
  const caminho = `dossies/${dossieId}/contratos/${contrato.id}-${etapa.etapa}.pdf`;

  const { error: erroUpload } = await db.storage
    .from(BUCKET_CONTRATOS)
    .upload(caminho, pdf.blob, { contentType: "application/pdf", upsert: true });
  if (erroUpload) throw erroUpload;

  // A etapa precisa sair de "rascunho" só depois de os dados estarem salvos:
  // o gatilho do banco congela `dados` a partir desse momento.
  const { error: erroEtapa } = await db
    .from("contrato_etapas")
    .update({
      dados,
      status: "pdf_gerado",
      pdf_path: caminho,
      pdf_sha256: pdf.sha256,
      gerado_em: new Date().toISOString(),
    })
    .eq("id", etapa.id);
  if (erroEtapa) throw erroEtapa;

  const principal = etapaModelo.etapa === modelo.etapas[0]?.etapa;
  const identificacao = principal ? modelo.identificacao?.(dados) : undefined;

  // Só a etapa principal move o status do contrato; as demais (entrega,
  // diagnóstico, conclusão) andam com status próprio.
  const { error: erroContrato } = await db
    .from("contratos")
    .update({
      dossie_id: dossieId,
      ...(principal
        ? {
            status: "pdf_gerado" as const,
            cliente_nome: identificacao?.nome ?? null,
            cliente_cpf: identificacao?.cpf ?? null,
          }
        : {}),
    })
    .eq("id", contrato.id);
  if (erroContrato) throw erroContrato;

  return { pdf, caminho, dossieId };
}

/** Baixa do bucket privado um PDF já gerado. */
export async function baixarArquivo(caminho: string): Promise<Blob> {
  const { data, error } = await db.storage.from(BUCKET_CONTRATOS).download(caminho);
  if (error) throw error;
  return data;
}

/** Envia o PDF assinado (gov.br ou papel digitalizado) e fecha o ciclo. */
export async function enviarAssinado(
  contrato: ContratoRow,
  etapa: ContratoEtapaRow,
  arquivo: File,
  principal = true,
): Promise<void> {
  const caminho = `dossies/${contrato.dossie_id}/contratos/${contrato.id}-${etapa.etapa}-assinado.pdf`;

  const { error: erroUpload } = await db.storage
    .from(BUCKET_CONTRATOS)
    .upload(caminho, arquivo, { contentType: arquivo.type || "application/pdf", upsert: true });
  if (erroUpload) throw erroUpload;

  const agora = new Date().toISOString();
  const { error: erroEtapa } = await db
    .from("contrato_etapas")
    .update({ status: "assinado", assinado_path: caminho, assinado_em: agora })
    .eq("id", etapa.id);
  if (erroEtapa) throw erroEtapa;

  if (principal) {
    const { error: erroContrato } = await db
      .from("contratos")
      .update({ status: "assinado", assinado_em: agora })
      .eq("id", contrato.id);
    if (erroContrato) throw erroContrato;
  }
}

export async function cancelarContrato(id: string): Promise<void> {
  const { error } = await db
    .from("contratos")
    .update({ status: "cancelado", cancelado_em: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function arquivarContrato(id: string): Promise<void> {
  const { error } = await db.from("contratos").update({ status: "arquivado" }).eq("id", id);
  if (error) throw error;
}
