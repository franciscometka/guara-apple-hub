import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { carregarCotacao, configurarCotacao } from "@/lib/cotacao.functions";
import { campoCotacao, decimal, numero, type Arredondamento } from "@/lib/cotacao";

export const Route = createFileRoute("/admin/cotacao/configuracao")({
  ssr: false,
  beforeLoad: async () => { await exigirSessaoAdmin(); const dados = await carregarCotacao({ data: {} }); if (!dados.gerente) throw redirect({ to: "/admin/cotacao" }); return { cotacaoConfig: dados }; },
  head: () => ({ meta: [{ title: "Configuração de Cotação — Guara iPhones" }, { name: "description", content: "Configurações gerenciais de preços internos da Guara iPhones." }, { property: "og:title", content: "Configuração de Cotação — Guara iPhones" }, { property: "og:description", content: "Configurações gerenciais de preços internos da Guara iPhones." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Configuracao,
});
function Configuracao() {
  const { cotacaoConfig: dados } = Route.useRouteContext();
  const salvar = useServerFn(configurarCotacao);
  const carregar = useServerFn(carregarCotacao);
  const qc = useQueryClient();
  const [dolar, setDolar] = useState(numero(dados.config.dolar));
  const [arredondamento, setArredondamento] = useState<Arredondamento>(dados.config.arredondamento);
  const [categorias, setCategorias] = useState(dados.categorias.map(c => ({ ...c, margem: String(c.margem_pct ?? 8), taxa: String(c.taxa_pct ?? 0) })));
  const [salvando, setSalvando] = useState(false);
  function alterar(index: number, campo: "nome" | "margem" | "taxa" | "ativo", valor: string | boolean) { setCategorias(atual => atual.map((c, i) => i === index ? { ...c, [campo]: valor } : c)); }
  async function enviar() {
    setSalvando(true);
    try { await salvar({ data: { dolar: decimal(dolar), arredondamento, categorias: categorias.map((c, i) => ({ id: c.id, nome: c.nome, ...(c.slug ? { slug: c.slug } : {}), ativo: c.ativo, ordem: i, margem_pct: decimal(c.margem), taxa_pct: decimal(c.taxa) })) } }); const atual = await carregar({ data: {} }); setCategorias(atual.categorias.map(c => ({ ...c, margem: String(c.margem_pct ?? 8), taxa: String(c.taxa_pct ?? 0) }))); await qc.invalidateQueries({ queryKey: ["admin", "cotacao"] }); toast.success("Configuração salva."); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível salvar."); }
    finally { setSalvando(false); }
  }
  return <AdminShell titulo="Configuração de cotação" acoes={<Button variant="outline" asChild className="min-h-11"><Link to="/admin/cotacao"><ArrowLeft />Cotação</Link></Button>}>
    <form onSubmit={e => { e.preventDefault(); void enviar(); }} className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium">Dólar do dia (R$)<input className={`${campoCotacao} mt-2`} inputMode="decimal" value={dolar} onChange={e => setDolar(e.target.value)} required /></label><label className="block text-sm font-medium">Arredondamento<select className={`${campoCotacao} mt-2`} value={arredondamento} onChange={e => setArredondamento(e.target.value as Arredondamento)}><option value="nenhum">Nenhum</option><option value="inteiro">Para cima ao inteiro</option><option value="90">Terminar em ,90</option><option value="00">Terminar em ,00</option></select></label></div>
      <section className="border-t border-border pt-6"><h2 className="text-xl font-semibold">Categorias</h2><div className="mt-4 space-y-4">{categorias.map((c, i) => <div key={c.id || `nova-${i}`} className="grid items-end gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-[2fr_1fr_1fr_auto]"><label className="block text-sm font-medium">Nome<input aria-label={`Nome da categoria ${i+1}`} className={`${campoCotacao} mt-2`} value={c.nome} onChange={e => alterar(i, "nome", e.target.value)} required maxLength={100} /></label><label className="block text-sm font-medium">Margem (%)<input aria-label={`Margem ${c.nome || i+1}`} className={`${campoCotacao} mt-2`} inputMode="decimal" value={c.margem} onChange={e => alterar(i, "margem", e.target.value)} required /></label><label className="block text-sm font-medium">Taxa / frete (%)<input aria-label={`Taxa ${c.nome || i+1}`} className={`${campoCotacao} mt-2`} inputMode="decimal" value={c.taxa} onChange={e => alterar(i, "taxa", e.target.value)} required /></label><label className="flex min-h-12 items-center gap-2 text-sm"><input type="checkbox" className="size-5 accent-primary" checked={c.ativo} onChange={e => alterar(i, "ativo", e.target.checked)} />Ativa</label></div>)}</div><Button type="button" variant="outline" className="mt-4 min-h-11" onClick={() => setCategorias(atual => [...atual, { id: "", nome: "", ativo: true, ordem: atual.length, margem: "8", taxa: "0", margem_pct: 8, taxa_pct: 0 }])}><Plus />Nova categoria</Button></section>
      <Button type="submit" className="min-h-12" disabled={salvando}><Save />{salvando ? "Salvando…" : "Salvar configuração"}</Button>
    </form>
  </AdminShell>;
}