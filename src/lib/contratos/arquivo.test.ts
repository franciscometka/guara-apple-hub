import { describe, expect, test } from "bun:test";
import { mimeDe, validarPdfAssinado } from "./arquivo";
import { validarArquivo, defDoTipo } from "./anexos";

describe("PDFs selecionados no navegador", () => {
  test("aceita PDF informado como tipo genérico nos anexos", () => {
    const arquivo = new File(["%PDF-1.4"], "contrato.PDF", { type: "application/octet-stream" });
    expect(mimeDe(arquivo)).toBe("application/pdf");
    expect(validarArquivo(defDoTipo("outro"), arquivo)).toBeNull();
  });
  test("aceita PDF sem tipo informado no envio de assinado", () => {
    expect(validarPdfAssinado(new File(["%PDF-1.4"], "assinado.pdf"))).toBeNull();
  });
  test("aceita PDF de tipo binário genérico no envio de assinado", () => {
    expect(validarPdfAssinado(new File(["%PDF-1.4"], "assinado.pdf", { type: "binary/octet-stream" }))).toBeNull();
  });
  test("não substitui um tipo específico incompatível pela extensão", () => {
    expect(validarPdfAssinado(new File(["imagem"], "assinado.pdf", { type: "image/png" }))).not.toBeNull();
  });
  test("arquivo vazio é recusado", () => {
    expect(validarPdfAssinado(new File([], "assinado.pdf", { type: "application/pdf" }))).not.toBeNull();
  });
  test("limite permanece em 20 MiB", () => {
    const limite = 20 * 1024 * 1024;
    expect(validarPdfAssinado(new File([new Uint8Array(limite)], "assinado.pdf", { type: "application/pdf" }))).toBeNull();
    expect(validarPdfAssinado(new File([new Uint8Array(limite + 1)], "assinado.pdf", { type: "application/pdf" }))).not.toBeNull();
  });
});