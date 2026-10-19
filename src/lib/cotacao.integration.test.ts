import { test } from "node:test";
import assert from "node:assert/strict";

// Run against an isolated authenticated fixture with COTACAO_TEST_URL,
// COTACAO_TEST_KEY, COTACAO_MANAGER_TOKEN and COTACAO_EMPLOYEE_TOKEN.
const enabled = Boolean(process.env['COTACAO_TEST_URL'] && process.env['COTACAO_MANAGER_TOKEN'] && process.env['COTACAO_EMPLOYEE_TOKEN']);
async function rpc(token: string | undefined, acao: string, entrada: Record<string, unknown> = {}) {
  const response = await fetch(`${process.env['COTACAO_TEST_URL']}/rest/v1/rpc/cotacao_operar`, { method: "POST", headers: { apikey: process.env['COTACAO_TEST_KEY'] ?? "", Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ acao, entrada }) });
  return { ok: response.ok, data: await response.json() };
}
test("USD 800, dólar 5.50 e markup 8% produzem 4752", { skip: !enabled }, async () => {
  const { data } = await rpc(process.env['COTACAO_MANAGER_TOKEN'], "inicial");
  const categoria = data.categorias.find((c: { nome: string }) => c.nome === "iPhones");
  assert.equal(categoria.margem_pct, 8); assert.equal(categoria.taxa_pct, 0);
  const calculo = await rpc(process.env['COTACAO_MANAGER_TOKEN'], "calcular", { categoria_id: categoria.id, preco_usd: 800, dolar: 5.5 });
  assert.equal(calculo.data.custo_brl, 4400); assert.equal(calculo.data.preco_venda, 4752);
});
test("funcionário não recebe custo/margem nem pode sobrescrever margem", { skip: !enabled }, async () => {
  const { data } = await rpc(process.env['COTACAO_EMPLOYEE_TOKEN'], "inicial");
  assert.equal(data.gerente, false);
  for (const row of [...data.categorias, ...data.historico]) {
    assert.equal(Object.hasOwn(row, "margem_pct"), false); assert.equal(Object.hasOwn(row, "custo_brl"), false);
  }
  const categoria = data.categorias.find((c: { nome: string }) => c.nome === "iPhones");
  const entrada = { categoria_id: categoria.id, preco_usd: 800, dolar: 5.5 };
  const calculo = await rpc(process.env['COTACAO_EMPLOYEE_TOKEN'], "calcular", entrada);
  assert.deepEqual(calculo.data, { preco_venda: 4752 });
  assert.equal((await rpc(process.env['COTACAO_EMPLOYEE_TOKEN'], "calcular", { ...entrada, margem_pct: 1 })).ok, false);
  assert.equal((await rpc(process.env['COTACAO_EMPLOYEE_TOKEN'], "configurar")).ok, false);
});
test("histórico conserva a margem usada quando configuração muda", { skip: !enabled }, async () => {
  const inicial = (await rpc(process.env['COTACAO_MANAGER_TOKEN'], "inicial")).data;
  const cat = inicial.categorias.find((c: { nome: string }) => c.nome === "iPhones");
  const historico = inicial.historico.find((h: { descricao: string }) => h.descricao === "VALIDACAO COTACAO 20261019");
  assert.ok(historico); assert.equal(historico.preco_venda, 4752);
  try {
    assert.equal((await rpc(process.env['COTACAO_MANAGER_TOKEN'], "configurar", { ...inicial.config, categorias: inicial.categorias.map((c: { id: string }) => c.id === cat.id ? { ...c, margem_pct: 10 } : c) })).ok, true);
    const calculo = await rpc(process.env['COTACAO_MANAGER_TOKEN'], "calcular", { categoria_id: cat.id, preco_usd: 800, dolar: 5.5 });
    assert.equal(calculo.data.preco_venda, 4840);
    const atualizado = (await rpc(process.env['COTACAO_MANAGER_TOKEN'], "inicial")).data.historico.find((h: { id: string }) => h.id === historico.id);
    assert.equal(atualizado.preco_venda, 4752); assert.equal(atualizado.margem_pct, 8);
  } finally { await rpc(process.env['COTACAO_MANAGER_TOKEN'], "configurar", { ...inicial.config, categorias: inicial.categorias }); }
});