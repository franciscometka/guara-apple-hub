import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { MODELO_COMPRA } from "./campos/compra-iphone";
import { MODELO_UPGRADE } from "./campos/upgrade-aparelho";
import { MODELOS } from "./modelos/catalogo";
import { dadosParaImpressao } from "./gerar-pdf";
import { passosVisiveis, tudoValido } from "./campos/tipos";
import { cpfValido, imeiValido } from "./validadores";
import { dadosCompraFicticia } from "./compra-iphone.fixture";

function expect(actual: unknown) {
  return {
    toBe: (expected: unknown) => assert.equal(actual, expected),
    toEqual: (expected: unknown) => assert.deepEqual(actual, expected),
    toContain: (expected: unknown) => assert.ok(Array.isArray(actual) && actual.includes(expected)),
    toBeDefined: () => assert.notEqual(actual, undefined),
    toMatchObject: (expected: Record<string, unknown>) => {
      assert.ok(actual && typeof actual === "object");
      for (const [key, value] of Object.entries(expected)) assert.deepEqual(Reflect.get(actual, key), value);
    },
    not: { toBe: (expected: unknown) => assert.notEqual(actual, expected) },
  };
}

const etapa = MODELO_COMPRA.etapas[0];
if (!etapa) throw new Error("Compra sem etapa principal");

describe("Compra de iPhone sem aparelho de entrada", () => {
  test("registra um quinto identificador independente", () => {
    expect(MODELOS.map(m => m.slug)).toContain("compra-iphone");
    expect(new Set(MODELOS.map(m => m.slug)).size).toBe(5);
    expect(MODELO_COMPRA).not.toBe(MODELO_UPGRADE);
  });
  test("remove as seções originais 3 e 6 e as dependentes 4 e 5", () => {
    const secoes = etapa.documento.filter(b => b.t === "secao");
    expect(secoes.map(b => b.numero)).toEqual(["1", "2", "3", "4", "5", "Anexo 1"]);
    const originais = MODELO_UPGRADE.etapas[0]?.documento.filter(b => b.t === "secao");
    for (const numero of ["3", "4", "5", "6"]) {
      const original = originais?.find(b => b.numero === numero);
      expect(original).toBeDefined();
      expect(secoes.some(b => b.titulo === original?.titulo)).toBe(false);
    }
  });
  test("numera os subitens sem lacunas", () => {
    for (const numero of [1, 2, 3, 4, 5]) {
      const subitens = etapa.documento.filter(b => b.t === "p" && b.prefixo?.startsWith(`${numero}.`));
      expect(subitens.map(b => b.t === "p" ? b.prefixo : undefined)).toEqual(
        subitens.map((_, i) => `${numero}.${i + 1}.`),
      );
    }
  });
  test("não coleta identificadores, avaliação ou abatimento do usado", () => {
    const nomes = etapa.passos.flatMap(p => p.campos.map(c => c.nome));
    expect(nomes.filter(n => /^(entrada_|avaliacao_|procedencia_|valor_abatido|valor_complemento)/.test(n))).toEqual([]);
    expect(nomes).toContain("consumidor_cpf");
    expect(nomes).toContain("adquirido_imei1");
    expect(nomes).toContain("pagamento_meio");
    expect(nomes).toContain("adquirido_valor_venda");
  });
  test("vincula o dossiê ao iPhone vendido", () => {
    expect(MODELO_COMPRA.dossie?.(dadosCompraFicticia())).toMatchObject({
      origem: "venda", imei1: "490154203237518", modelo: "iPhone 18 Pro Max",
      adquiridoEm: "2026-10-08",
    });
  });
  test("imprime não se aplica nos campos de parcelamento inativo", () => {
    const dados = dadosCompraFicticia();
    for (const campo of etapa.passos.find(p => p.id === "parcelamento")?.campos ?? []) delete dados[campo.nome];
    const impressao = dadosParaImpressao(MODELO_COMPRA, etapa, dados);
    expect(impressao["parcelas_quantidade"]).toBe("não se aplica");
    expect(impressao["parcelas_valor"]).toBe("não se aplica");
    expect(passosVisiveis(etapa.passos, dados).some(p => p.id === "parcelamento")).toBe(false);
  });
  test("aceita os dados fictícios válidos pedidos", () => {
    expect(cpfValido("529.982.247-25")).toBe(true);
    expect(imeiValido("490154203237518")).toBe(true);
    expect(tudoValido(etapa.passos, dadosCompraFicticia())).toBe(true);
    expect(tudoValido(etapa.passos, dadosCompraFicticia(true))).toBe(true);
  });
});