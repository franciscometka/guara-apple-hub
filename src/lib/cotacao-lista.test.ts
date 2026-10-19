import assert from "node:assert/strict";
import test from "node:test";
import { precoCurto, textoListaWhatsapp } from "./cotacao-lista.ts";

test("preço inteiro sai sem centavos, como na mensagem de WhatsApp", () => {
  assert.equal(precoCurto(7990).replace(/\u00a0/g, " "), "R$ 7.990");
  assert.equal(precoCurto(7990.5).replace(/\u00a0/g, " "), "R$ 7.990,50");
});

test("lista do WhatsApp traz só descrição e preço, pulando linhas vazias", () => {
  const texto = textoListaWhatsapp([
    { descricao: "iPhone 17 Pro 256GB", preco_usd: 1200, preco_venda: 7990 },
    { descricao: "", preco_usd: 10, preco_venda: 100 },
    { descricao: "Sem custo", preco_usd: 0, preco_venda: 0 },
  ]).replace(/\u00a0/g, " ");
  assert.equal(texto, "iPhone 17 Pro 256GB — R$ 7.990");
});
