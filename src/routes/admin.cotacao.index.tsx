import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Copy, Save, Settings, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { CotacaoHistorico } from "@/components/admin/CotacaoHistorico";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { carregarCotacao, calcularCotacao, salvarDolar } from "@/lib/cotacao.functions";
import { campoCotacao, decimal, moeda, numero, dataHora, type ResultadoCotacao } from "@/lib/cotacao";

const cotacaoQuery = { queryKey: ["admin", "cotacao"], queryFn: () => carregarCotacao({ data: {} }) };
export const Route = createFileRoute("/admin/cotacao/")({
  ssr: false, beforeLoad: exigirSessaoAdmin,
  loader: ({ context }) => context.queryClient.ensureQueryData(cotacaoQuery),
  head: () => ({ meta: [{ title: "Cotação — Painel Guara iPhones" }, { name: "description", content: "Cotações internas de preços de venda da Guara iPhones." }, { property: "og:title", content: "Cotação — Painel Guara iPhones" }, { property: "og:description", content: "Cotações internas de preços de venda da Guara iPhones." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Cotacao,
});
function Cotacao() {
  const { data: dados } = useSuspenseQuery(cotacaoQuery);
  const calcular = useServerFn(calcularCotacao);
  const gravarDolar = useServerFn(salvarDolar);
  const carregar = useServerFn(carregarCotacao);
  const qc = useQueryClient();
  const [dolar, setDolar] = useState(numero(dados.config.dolar));
  const [categoria, setCategoria] = useState(dados.categorias.find(c => c.ativo)?.id ?? "");
  const [usd, setUsd] = useState("");
  const [descricao, setDescricao] = useState("");
  const [margem, setMargem] = useState("");
  const [resultado, setResultado] = useState<ResultadoCotacao | null>(null);
  const [calculando, setCalculando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [verConta, setVerConta] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [lista, setLista] = useState(dados);
  const [dolarPendente, setDolarPendente] = useState<number | null>(null);
  const confirmado = useRef(dados.config.dolar);
  const revisao = useRef(0);
  useEffect(() => { setLista(dados); }, [dados]);
  useEffect(() => {
    let cancelado = false;
    const timer = setTimeout(() => { carregar({ data: { busca, categoria: filtro } }).then(d => { if (!cancelado) setLista(d); }).catch(() => { if (!cancelado) toast.error("Não foi possível carregar o histórico."); }); }, 250);
    return () => { cancelado = true; clearTimeout(timer); };
  }, [busca, filtro, dados, carregar]);
  useEffect(() => {
    const atual = ++revisao.current;
    setResultado(null); setErro("");
    if (!categoria || !(decimal(usd) > 0) || !(decimal(dolar) > 0)) { setCalculando(false); return; }
    setCalculando(true);
    const timer = setTimeout(() => {
      calcular({ data: { categoria_id: categoria, preco_usd: decimal(usd), dolar: decimal(dolar), descricao, ...(dados.gerente && margem !== "" ? { margem_pct: decimal(margem) } : {}) } })
        .then(r => { if (atual === revisao.current) setResultado(r); })
        .catch(e => { if (atual === revisao.current) setErro(e instanceof Error ? e.message : "Não foi possível calcular."); })
        .finally(() => { if (atual === revisao.current) setCalculando(false); });
    }, 300);
    return () => { clearTimeout(timer); revisao.current++; };
  }, [categoria, usd, dolar, margem, descricao, dados.gerente, dados.config, dados.categorias, calcular]);
  async function salvar() {
    setSalvando(true);
    try {
      await calcular({ data: { categoria_id: categoria, preco_usd: decimal(usd), dolar: decimal(dolar), descricao, salvar: true, ...(dados.gerente && margem !== "" ? { margem_pct: decimal(margem) } : {}) } });
      await qc.invalidateQueries({ queryKey: ["admin", "cotacao"] });
      toast.success("Cotação salva.");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível salvar."); }
    finally { setSalvando(false); }
  }
  async function confirmarDolar() {
    if (dolarPendente === null) return;
    setSalvando(true);
    try { await gravarDolar({ data: { dolar: dolarPendente } }); confirmado.current = dolarPendente; setDolarPendente(null); await qc.invalidateQueries({ queryKey: ["admin", "cotacao"] }); toast.success("Dólar atualizado para a equipe."); }
    catch { toast.error("Não foi possível atualizar o dólar."); } finally { setSalvando(false); }
  }
  return <AdminShell titulo="Cotação" acoes={dados.gerente && <Button variant="outline" asChild className="min-h-11"><Link to="/admin/cotacao/configuracao"><Settings />Configuração</Link></Button>}>
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <label className="block text-sm font-medium">Cotação do dólar (R$)<input className={`${campoCotacao} mt-2`} inputMode="decimal" value={dolar} onChange={e => setDolar(e.target.value)} onBlur={() => { const valor = decimal(dolar); if (valor > 0 && valor !== confirmado.current) setDolarPendente(valor); }} /><span className="mt-2 block text-xs text-muted-foreground">Atualizado em {dataHora(dados.config.dolar_atualizado_em)}</span></label>
        <label className="block text-sm font-medium">Categoria<select className={`${campoCotacao} mt-2`} value={categoria} onChange={e => setCategoria(e.target.value)}>{dados.categorias.filter(c => c.ativo).map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></label>
        <label className="block text-sm font-medium">Descrição do produto <span className="text-muted-foreground">(opcional)</span><input className={`${campoCotacao} mt-2`} maxLength={500} value={descricao} onChange={e => setDescricao(e.target.value)} /></label>
        <label className="block text-sm font-medium">Preço do produto (US$)<input className={`${campoCotacao} mt-2`} inputMode="decimal" placeholder="0,00" value={usd} onChange={e => setUsd(e.target.value)} /></label>
        {dados.gerente && <label className="block text-sm font-medium">Margem desta cotação (%) <span className="text-muted-foreground">(opcional)</span><input className={`${campoCotacao} mt-2`} inputMode="decimal" placeholder="Margem da categoria" value={margem} onChange={e => setMargem(e.target.value)} /></label>}
      </div>
      <div className="border-t border-border py-6 lg:border-l lg:border-t-0 lg:pl-8">
        <p className="text-sm font-semibold text-muted-foreground">PREÇO DE VENDA</p>
        <p aria-live="polite" className="mt-4 break-words font-display text-4xl font-semibold text-primary sm:text-5xl">{calculando ? "Calculando…" : resultado ? moeda(resultado.preco_venda) : "R$ —"}</p>
        {erro && <p role="alert" className="mt-4 text-sm text-destructive">{erro}</p>}
        <div className="mt-8 flex flex-wrap gap-3"><Button variant="outline" className="min-h-12" disabled={!resultado || calculando} onClick={async () => { if (!resultado) return; try { await navigator.clipboard.writeText(moeda(resultado.preco_venda)); toast.success("Preço copiado."); } catch { toast.error("Não foi possível copiar o preço."); } }}><Copy />Copiar preço</Button><Button className="min-h-12" disabled={!resultado || calculando || salvando} onClick={salvar}><Save />{salvando ? "Salvando…" : "Salvar cotação"}</Button></div>
        {dados.gerente && resultado && <div className="mt-6"><Button variant="ghost" aria-expanded={verConta} onClick={() => setVerConta(!verConta)}><ChevronDown />Ver a conta</Button>{verConta && <div className="mt-3 space-y-2 border-l-2 border-primary pl-4 text-sm"><p>US$ {numero(decimal(usd))} × {moeda(decimal(dolar))} = {moeda(resultado.preco_sem_taxa ?? 0)}</p><p>+ {resultado.taxa_pct}% de taxa = {moeda(resultado.custo_brl ?? 0)}</p><p>+ {resultado.margem_pct}% de margem = {moeda(resultado.preco_bruto ?? 0)}</p><p className="font-semibold">Arredondado: {moeda(resultado.preco_venda)}</p></div>}</div>}
      </div>
    </div>
    <CotacaoHistorico dados={lista} busca={busca} categoria={filtro} onBusca={setBusca} onCategoria={setFiltro} />
    {dolarPendente !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"><div role="dialog" aria-modal="true" aria-labelledby="salvar-dolar-titulo" className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-lg"><h2 id="salvar-dolar-titulo" className="text-lg font-semibold">Salvar como novo dólar do dia?</h2><p className="mt-3 text-muted-foreground">{moeda(dolarPendente)}</p><div className="mt-6 flex flex-wrap gap-3"><Button autoFocus disabled={salvando} onClick={confirmarDolar}>Sim, salvar</Button><Button variant="outline" disabled={salvando} onClick={() => { confirmado.current = dolarPendente; setDolarPendente(null); }}>Não, só nesta cotação</Button></div></div></div>}
  </AdminShell>;
}