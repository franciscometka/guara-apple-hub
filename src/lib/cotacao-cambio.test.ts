import { test } from "node:test";
import assert from "node:assert/strict";
import { aplicarCambio, cacheCambioValido, consultarCambio } from "./cotacao-cambio";

const cache = { bid: 5.5, ask: 5.523, provedor: "AwesomeAPI", cotado_em: "2026-10-19T17:32:00Z", consultado_em: "2026-10-19T17:32:00Z" };
test("cache dura 60 segundos", () => {
  const inicio = Date.parse(cache.consultado_em);
  assert.equal(cacheCambioValido(cache, inicio + 59999), true);
  assert.equal(cacheCambioValido(cache, inicio + 60000), false);
});
test("venda ask e acréscimo 1% são aplicados ao dólar ao vivo", () => {
  assert.equal(aplicarCambio(cache, "ask", 0).dolar, 5.523);
  assert.equal(Number(aplicarCambio(cache, "ask", 1).dolar.toFixed(4)), 5.5782);
  assert.equal(aplicarCambio(cache, "bid", 0).dolar, 5.5);
});
test("AwesomeAPI usa ask, bid e timestamp reais do formato USD-BRL", async () => {
  const fake = (async () => new Response(JSON.stringify({ USDBRL: { ask: "5.5230", bid: "5.5000", timestamp: "1792431120" } }))) as typeof fetch;
  const result = await consultarCambio(fake);
  assert.equal(result?.ask, 5.523); assert.equal(result?.bid, 5.5); assert.equal(result?.provedor, "AwesomeAPI");
});
test("segunda fonte é usada quando AwesomeAPI falha", async () => {
  let chamadas = 0;
  const fake = (async () => { chamadas++; return chamadas === 1 ? new Response("", { status: 429 }) : new Response(JSON.stringify({ date: "2026-10-19", rates: { BRL: 5.0453 } })); }) as typeof fetch;
  const result = await consultarCambio(fake);
  assert.equal(chamadas, 2); assert.equal(result?.ask, 5.0453); assert.match(result?.provedor ?? "", /Frankfurter/);
});
test("falha das duas fontes retorna fallback sem lançar erro", async () => {
  const fake = (async () => { throw new Error("Sem rede"); }) as typeof fetch;
  assert.equal(await consultarCambio(fake), null);
});
test("Frankfurter é marcada como referência diária, nunca como ao vivo", () => {
  const ref = { bid: 5.0453, ask: 5.0453, provedor: "Frankfurter · referência diária BCE", cotado_em: "2026-10-19T00:00:00Z", consultado_em: "2026-10-19T17:32:00Z" };
  assert.equal(aplicarCambio(ref, "ask", 0).fonte, "referencia");
  assert.equal(aplicarCambio(cache, "ask", 0).fonte, "ao_vivo");
});
