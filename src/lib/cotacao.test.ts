import { test } from "node:test";
import assert from "node:assert/strict";
import { decimal } from "./cotacao";

test("aceita vírgula e ponto como separador decimal", () => {
  assert.equal(decimal("5,50"), 5.5); assert.equal(decimal("5.50"), 5.5); assert.equal(decimal("1.250,50"), 1250.5);
});
test("texto vazio ou inválido não vira número", () => {
  assert.equal(Number.isNaN(decimal("")), true); assert.equal(Number.isNaN(decimal("abc")), true);
});
