import { test } from "node:test";
import assert from "node:assert/strict";
import { decimal, validarEntradaCotacao } from "./cotacao";

const entrada = { categoria_id: "iphone", preco_usd: 800, dolar: 5.5, descricao: "" };
test("aceita vírgula e ponto como separador decimal", () => {
  assert.equal(decimal("5,50"), 5.5); assert.equal(decimal("5.50"), 5.5); assert.equal(decimal("1.250,50"), 1250.5);
});
test("dólar deve ser maior que zero", () => {
  assert.throws(() => validarEntradaCotacao({ ...entrada, dolar: 0 }));
  assert.throws(() => validarEntradaCotacao({ ...entrada, dolar: -1 }));
});
test("preço USD deve ser maior que zero", () => {
  assert.throws(() => validarEntradaCotacao({ ...entrada, preco_usd: 0 }));
  assert.throws(() => validarEntradaCotacao({ ...entrada, preco_usd: NaN }));
});
test("margem permite de 0 até 100 inclusive", () => {
  assert.equal(validarEntradaCotacao({ ...entrada, margem_pct: 0 }).margem_pct, 0);
  assert.equal(validarEntradaCotacao({ ...entrada, margem_pct: 100 }).margem_pct, 100);
  assert.throws(() => validarEntradaCotacao({ ...entrada, margem_pct: 100.01 }));
  assert.throws(() => validarEntradaCotacao({ ...entrada, margem_pct: -0.01 }));
});