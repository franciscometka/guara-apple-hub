import { test } from "node:test";
import assert from "node:assert/strict";
import { anexoPodeSerPublicado, imagemHeic, urlDoAnexoPublico } from "./acesso-anexo-publico";

test("documento pessoal permanece privado mesmo marcado como público", () => {
  assert.equal(anexoPodeSerPublicado({ tipo: "documento_pessoal", visivel_publico: true }), false);
});
test("contrato não publicado permanece privado", () => {
  assert.equal(anexoPodeSerPublicado({ tipo: "contrato_assinado", visivel_publico: false }), false);
});
test("fotos e PDFs explicitamente publicados podem abrir", () => {
  for (const tipo of ["foto_frente", "foto_traseira", "nota_fiscal_entrada", "contrato_assinado"]) {
    assert.equal(anexoPodeSerPublicado({ tipo, visivel_publico: true }), true);
  }
});
test("link público usa o mesmo site e não depende da URL de armazenamento", () => {
  assert.equal(urlDoAnexoPublico("abc", "123"), "/api/public/dossie/abc/arquivo/123");
});
test("HEIC e HEIF requerem conversão, JPEG e PDF não", () => {
  assert.equal(imagemHeic("image/heic"), true);
  assert.equal(imagemHeic("image/heif; charset=binary"), true);
  assert.equal(imagemHeic("image/jpeg"), false);
  assert.equal(imagemHeic("application/pdf"), false);
});