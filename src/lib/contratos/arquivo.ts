import { LIMITE_ARQUIVO_BYTES } from "./database";
import { ERROS } from "./validadores";

const MIME_POR_EXTENSAO: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
};

/** Celulares podem informar um tipo vazio ou genérico para arquivos válidos. */
export function mimeDe(arquivo: File): string {
  const tipo = arquivo.type.toLowerCase().split(";")[0]?.trim() ?? "";
  if (tipo && tipo !== "application/octet-stream" && tipo !== "binary/octet-stream") {
    return tipo;
  }
  const extensao = (arquivo.name.split(".").pop() ?? "").toLowerCase();
  return MIME_POR_EXTENSAO[extensao] ?? tipo;
}

export function validarPdfAssinado(arquivo: File): string | null {
  if (arquivo.size === 0) return "Esse arquivo está vazio.";
  if (arquivo.size > LIMITE_ARQUIVO_BYTES) return ERROS.arquivoGrande;
  if (mimeDe(arquivo) !== "application/pdf") return "Envie o contrato assinado em PDF.";
  return null;
}