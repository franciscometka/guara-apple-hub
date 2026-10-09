import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { mimeDe, validarPdfAssinado } from "./arquivo";
import { validarArquivo, defDoTipo } from "./anexos";

function expect(actual: unknown) {
  return {
    toBe: (expected: unknown) => assert.equal(actual, expected),
    toBeNull: () => assert.equal(actual, null),
    not: { toBeNull: () => assert.notEqual(actual, null) },
  };
}

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
  test("PDF assinado aceita até 80 MiB e recusa acima do limite", () => {
    const limite = 80 * 1024 * 1024;
    expect(validarPdfAssinado(new File([new Uint8Array(limite)], "assinado.pdf", { type: "application/pdf" }))).toBeNull();
    expect(validarPdfAssinado(new File([new Uint8Array(limite + 1)], "assinado.pdf", { type: "application/pdf" }))).not.toBeNull();
  });
  test("anexos aceitam PDF de 60 MiB e até 80 MiB, mas recusam acima", () => {
    const def = defDoTipo("outro");
    for (const tamanho of [60, 80]) {
      expect(validarArquivo(def, new File([new Uint8Array(tamanho * 1024 * 1024)], "anexo.pdf", { type: "application/pdf" }))).toBeNull();
    }
    expect(validarArquivo(def, new File([new Uint8Array(80 * 1024 * 1024 + 1)], "anexo.pdf", { type: "application/pdf" }))).not.toBeNull();
  });
});