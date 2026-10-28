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

test("conta passo a passo segue a fórmula frete + lucro", async () => {
  const { passosConta } = await import("./cotacao-lista.ts");
  const texto = passosConta(
    {
      id: "1",
      categoria_id: "c",
      descricao: "iPhone",
      preco_usd: 1250,
      ordem: 0,
      preco_venda: 8685,
      custo_brl: 6985.5,
      frete_brl: 698.55,
      lucro_brl: 1000,
      margem_extra_brl: 0,
      antes_arredondar: 8684.05,
      taxa_pct: 10,
      margem_pct: 0,
    },
    5.5884,
  ).replace(/\u00a0/g, " ");
  assert.equal(
    texto,
    "US$ 1.250,00 × R$ 5,5884 = R$ 6.985,50 → + 10% de frete = R$ 7.684,05 → + R$ 1.000,00 de lucro = R$ 8.684,05 → arredondado R$ 8.685,00",
  );
});
