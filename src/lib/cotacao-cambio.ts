export type CambioBruto = { bid: number; ask: number; provedor: string; cotado_em: string; consultado_em: string };
export type CambioAtual = { dolar: number; base: number; acrescimo_pct: number; fonte: "ao_vivo" | "salvo"; provedor: string; horario: string };
export const cambioNumero = (valor: number) => new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(valor);
export function horarioCambio(horario: string, provedor: string) {
  if (provedor.includes("referência diária")) return `referência de ${horario.slice(0, 10).split("-").reverse().join("/")}`;
  return `atualizado às ${new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).format(new Date(horario))}`;
}
export function cacheCambioValido(cache: CambioBruto, agora = Date.now()) {
  return agora - Date.parse(cache.consultado_em) < 60_000 && agora >= Date.parse(cache.consultado_em);
}
export function aplicarCambio(cache: CambioBruto, tipo: "ask" | "bid", acrescimo: number): CambioAtual {
  const base = cache[tipo];
  return { dolar: base * (1 + acrescimo / 100), base, acrescimo_pct: acrescimo, fonte: "ao_vivo", provedor: cache.provedor, horario: cache.cotado_em };
}
function positivo(valor: unknown) {
  const n = Number(valor);
  if (!Number.isFinite(n) || n <= 0) throw new Error("Câmbio inválido");
  return n;
}
export async function consultarCambio(fetcher: typeof fetch = fetch): Promise<CambioBruto | null> {
  try {
    const r = await fetcher("https://economia.awesomeapi.com.br/json/last/USD-BRL", { signal: AbortSignal.timeout(3000) });
    if (!r.ok) throw new Error("Fonte indisponível");
    const json = await r.json() as { USDBRL?: { bid: string; ask: string; timestamp: string } };
    if (!json.USDBRL) throw new Error("Formato inválido");
    const horario = new Date(positivo(json.USDBRL.timestamp) * 1000).toISOString();
    return { bid: positivo(json.USDBRL.bid), ask: positivo(json.USDBRL.ask), provedor: "AwesomeAPI", cotado_em: horario, consultado_em: new Date().toISOString() };
  } catch { /* Try the free ECB reference source before using the saved value. */ }
  try {
    const r = await fetcher("https://api.frankfurter.dev/v1/latest?base=USD&symbols=BRL", { signal: AbortSignal.timeout(2000) });
    if (!r.ok) throw new Error("Fonte indisponível");
    const json = await r.json() as { date: string; rates?: { BRL?: number } };
    const valor = positivo(json.rates?.BRL);
    return { bid: valor, ask: valor, provedor: "Frankfurter · referência diária BCE", cotado_em: new Date(`${json.date}T00:00:00Z`).toISOString(), consultado_em: new Date().toISOString() };
  } catch { return null; }
}