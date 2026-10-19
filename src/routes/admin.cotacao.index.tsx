import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Settings, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { CotacaoAba, type LinhaCotacao } from "@/components/admin/CotacaoAba";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { carregarCotacao, salvarDolar, buscarDolarAoVivo } from "@/lib/cotacao.functions";
import {
  ajustarMargemCategoria,
  criarItemCotacao,
  excluirItemCotacao,
  listarItensCotacao,
  salvarItemCotacao,
} from "@/lib/cotacao-itens.functions";
import { campoCotacao, decimal, moeda, numero, dataHora } from "@/lib/cotacao";
import { cambioNumero, type CambioAtual } from "@/lib/cotacao-cambio";
import type { ItemLista, ListaCotacao } from "@/lib/cotacao-lista";

const cotacaoQuery = {
  queryKey: ["admin", "cotacao"],
  queryFn: () => carregarCotacao({ data: {} }),
};
export const Route = createFileRoute("/admin/cotacao/")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  loader: ({ context }) => context.queryClient.ensureQueryData(cotacaoQuery),
  head: () => ({
    meta: [
      { title: "Cotação — Painel Guara iPhones" },
      { name: "description", content: "Lista de preços interna da Guara iPhones." },
      { property: "og:title", content: "Cotação — Painel Guara iPhones" },
      { property: "og:description", content: "Lista de preços interna da Guara iPhones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Cotacao,
});

const ATRASO_SALVAR = 700;

function Cotacao() {
  const { data: dados } = useSuspenseQuery(cotacaoQuery);
  const qc = useQueryClient();
  const gravarDolar = useServerFn(salvarDolar);
  const buscarCambio = useServerFn(buscarDolarAoVivo);
  const listar = useServerFn(listarItensCotacao);
  const criar = useServerFn(criarItemCotacao);
  const salvarItem = useServerFn(salvarItemCotacao);
  const excluir = useServerFn(excluirItemCotacao);
  const ajustarMargem = useServerFn(ajustarMargemCategoria);

  // ---- Dólar (3.1) ----
  const [dolar, setDolar] = useState(numero(dados.config.dolar));
  const [modo, setModo] = useState<"ao_vivo" | "manual">("ao_vivo");
  const modoRef = useRef<"ao_vivo" | "manual">("ao_vivo");
  const [cambio, setCambio] = useState<CambioAtual | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const atualizarRef = useRef(false);
  const [dolarPendente, setDolarPendente] = useState<number | null>(null);
  const [salvandoDolar, setSalvandoDolar] = useState(false);
  async function atualizarCambio(forcar = false) {
    if (atualizarRef.current) return;
    atualizarRef.current = true;
    setAtualizando(true);
    try {
      const atual = await buscarCambio({ data: { forcar } });
      setCambio(atual);
      if (modoRef.current === "ao_vivo") setDolar(cambioNumero(atual.dolar));
    } catch {
      const salvo: CambioAtual = {
        dolar: dados.config.dolar,
        base: dados.config.dolar,
        acrescimo_pct: 0,
        fonte: "salvo",
        provedor: "Último valor salvo",
        horario: dados.config.dolar_atualizado_em,
      };
      setCambio(salvo);
      if (modoRef.current === "ao_vivo") setDolar(cambioNumero(salvo.dolar));
    } finally {
      atualizarRef.current = false;
      setAtualizando(false);
    }
  }
  function mudarModo(valor: "ao_vivo" | "manual") {
    modoRef.current = valor;
    setModo(valor);
    setDolarPendente(null);
    if (valor === "ao_vivo") {
      if (cambio) setDolar(cambioNumero(cambio.dolar));
      void atualizarCambio();
    }
  }
  useEffect(() => {
    void atualizarCambio();
    const timer = setInterval(() => {
      void atualizarCambio();
    }, 300_000);
    return () => clearInterval(timer);
  }, []);
  async function confirmarDolar() {
    if (dolarPendente === null) return;
    setSalvandoDolar(true);
    try {
      await gravarDolar({ data: { dolar: dolarPendente } });
      setDolarPendente(null);
      await qc.invalidateQueries({ queryKey: ["admin", "cotacao"] });
      toast.success("Dólar atualizado para a equipe.");
    } catch {
      toast.error("Não foi possível atualizar o dólar.");
    } finally {
      setSalvandoDolar(false);
    }
  }
  const dolarNum = decimal(dolar);

  // ---- Lista de preços ----
  const [lista, setLista] = useState<ListaCotacao | null>(null);
  const [linhas, setLinhas] = useState<LinhaCotacao[] | null>(null);
  const linhasRef = useRef<LinhaCotacao[]>([]);
  const [precos, setPrecos] = useState<Map<string, ItemLista>>(new Map());
  const [pendentes, setPendentes] = useState<Set<string>>(new Set());
  const [aba, setAba] = useState("");
  const [erroLista, setErroLista] = useState("");
  const [status, setStatus] = useState<"salvo" | "salvando" | "erro">("salvo");
  const [novaId, setNovaId] = useState<string | null>(null);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const revisao = useRef(0);
  const dolarRef = useRef(dolarNum);
  dolarRef.current = dolarNum;

  const recarregar = useCallback(async () => {
    const valor = dolarRef.current;
    if (!(valor > 0)) return;
    const atual = ++revisao.current;
    try {
      const r = await listar({ data: { dolar: valor } });
      if (atual !== revisao.current) return;
      setErroLista("");
      setLista(r);
      setPrecos(new Map(r.itens.map((i) => [i.id, i])));
      setLinhas((anterior) => {
        if (anterior) return anterior;
        const inicial = r.itens.map((i) => ({
          id: i.id,
          categoria_id: i.categoria_id,
          descricao: i.descricao,
          usd: i.preco_usd ? numero(i.preco_usd) : "",
          ordem: i.ordem,
        }));
        linhasRef.current = inicial;
        return inicial;
      });
    } catch (e) {
      if (atual === revisao.current)
        setErroLista(e instanceof Error ? e.message : "Não foi possível carregar a lista.");
    }
  }, [listar]);

  // Dólar mudou (ao vivo ou digitado): recalcula o preço de todas as linhas de todas as abas.
  useEffect(() => {
    if (!(dolarNum > 0)) return;
    const t = setTimeout(() => {
      void recarregar();
    }, 250);
    return () => clearTimeout(t);
  }, [dolarNum, recarregar]);
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const categorias = lista?.categorias ?? [];
  const abaAtiva = categorias.some((c) => c.id === aba) ? aba : (categorias[0]?.id ?? "");

  function agendarSalvar(id: string) {
    const anterior = timers.current.get(id);
    if (anterior) clearTimeout(anterior);
    setPendentes((p) => new Set(p).add(id));
    setStatus("salvando");
    timers.current.set(
      id,
      setTimeout(() => {
        void gravar(id);
      }, ATRASO_SALVAR),
    );
  }
  async function gravar(id: string) {
    timers.current.delete(id);
    const linha = linhasRef.current.find((l) => l.id === id);
    if (!linha) {
      limparPendente(id);
      return;
    }
    const usd = linha.usd.trim() === "" ? 0 : decimal(linha.usd);
    if (!Number.isFinite(usd) || usd < 0) {
      limparPendente(id);
      setStatus("erro");
      toast.error("Custo em US$ inválido.");
      return;
    }
    try {
      await salvarItem({ data: { id, descricao: linha.descricao, preco_usd: usd } });
      if (!timers.current.has(id)) {
        await recarregar();
        limparPendente(id);
      }
      setStatus(timers.current.size > 0 ? "salvando" : "salvo");
    } catch (e) {
      limparPendente(id);
      setStatus("erro");
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar.");
    }
  }
  function limparPendente(id: string) {
    setPendentes((p) => {
      const n = new Set(p);
      n.delete(id);
      return n;
    });
  }
  function editar(id: string, patch: Partial<Pick<LinhaCotacao, "descricao" | "usd">>) {
    const novas = linhasRef.current.map((l) => (l.id === id ? { ...l, ...patch } : l));
    linhasRef.current = novas;
    setLinhas(novas);
    agendarSalvar(id);
  }
  async function adicionar() {
    if (!abaAtiva) return;
    const daAba = linhasRef.current.filter((l) => l.categoria_id === abaAtiva);
    const ordem = daAba.reduce((m, l) => Math.max(m, l.ordem), -1) + 1;
    try {
      const { id } = await criar({ data: { categoria_id: abaAtiva, ordem } });
      const novas = [
        ...linhasRef.current,
        { id, categoria_id: abaAtiva, descricao: "", usd: "", ordem },
      ];
      linhasRef.current = novas;
      setLinhas(novas);
      setNovaId(id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível adicionar o produto.");
    }
  }
  async function remover(id: string) {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    const anterior = linhasRef.current;
    const novas = anterior.filter((l) => l.id !== id);
    linhasRef.current = novas;
    setLinhas(novas);
    limparPendente(id);
    try {
      await excluir({ data: { id } });
      setPrecos((p) => {
        const n = new Map(p);
        n.delete(id);
        return n;
      });
    } catch (e) {
      linhasRef.current = anterior;
      setLinhas(anterior);
      toast.error(e instanceof Error ? e.message : "Não foi possível excluir a linha.");
    }
  }
  async function mudarMargem(categoriaId: string, margem: number) {
    await ajustarMargem({ data: { categoria_id: categoriaId, margem_pct: margem } });
    await recarregar();
  }

  const gerente = lista?.gerente ?? dados.gerente;
  const aguardandoDolar = modo === "ao_vivo" && cambio === null;
  const textoFonte =
    modo === "manual"
      ? "Valor manual · só nesta cotação"
      : atualizando && !cambio
        ? "Consultando dólar ao vivo…"
        : cambio?.fonte === "ao_vivo"
          ? `Dólar ao vivo: R$ ${cambioNumero(cambio.dolar)}${gerente && cambio.acrescimo_pct > 0 ? ` (${cambioNumero(cambio.base)} + ${cambio.acrescimo_pct}%)` : ""} · ${dataHora(cambio.horario)} · ${cambio.provedor}`
          : `Dólar ao vivo indisponível. Usando o último valor salvo (${dataHora(cambio?.horario ?? dados.config.dolar_atualizado_em)})`;

  return (
    <AdminShell
      titulo="Cotação"
      acoes={
        gerente && (
          <Button variant="outline" asChild className="min-h-11">
            <Link to="/admin/cotacao/configuracao">
              <Settings />
              Configuração
            </Link>
          </Button>
        )
      }
    >
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <div className="min-w-0">
            <div className="flex items-end gap-2">
              <label className="block text-sm font-medium">
                Dólar (R$)
                <input
                  aria-label="Dólar (R$)"
                  className={`${campoCotacao} mt-2 w-40`}
                  inputMode="decimal"
                  value={dolar}
                  onChange={(e) => {
                    modoRef.current = "manual";
                    setModo("manual");
                    setDolar(e.target.value);
                  }}
                />
              </label>
              <Button
                variant="outline"
                className="min-h-12"
                disabled={atualizando}
                onClick={() => void atualizarCambio(true)}
                title="Atualizar dólar"
                aria-label="Atualizar dólar"
              >
                <RefreshCw className={atualizando ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>
          <div role="group" aria-label="Modo do dólar" className="flex gap-2">
            <Button
              variant={modo === "ao_vivo" ? "default" : "outline"}
              onClick={() => mudarModo("ao_vivo")}
            >
              Ao vivo
            </Button>
            <Button
              variant={modo === "manual" ? "default" : "outline"}
              onClick={() => mudarModo("manual")}
            >
              Manual
            </Button>
          </div>
          {modo === "manual" && (
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => mudarModo("ao_vivo")}>
                Voltar ao dólar ao vivo
              </Button>
              <Button
                variant="ghost"
                disabled={!(dolarNum > 0)}
                onClick={() => setDolarPendente(dolarNum)}
              >
                Salvar dólar para a equipe
              </Button>
            </div>
          )}
          <p className="ml-auto text-xs text-muted-foreground" role="status">
            {status === "salvando"
              ? "Salvando…"
              : status === "erro"
                ? "Não foi possível salvar"
                : "Salvo"}
          </p>
        </div>
        <p role="status" className="mt-2 text-xs text-muted-foreground">
          {textoFonte}
        </p>
      </div>

      {erroLista && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {erroLista}
        </p>
      )}
      {!lista && !erroLista && (
        <p className="mt-8 text-sm text-muted-foreground">Carregando lista de preços…</p>
      )}
      {lista && categorias.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Nenhuma categoria ativa.{" "}
          {gerente ? "Crie uma em Configuração." : "Peça a um gerente para configurar."}
        </p>
      )}
      {lista && linhas && categorias.length > 0 && (
        <Tabs value={abaAtiva} onValueChange={setAba} className="mt-6">
          <TabsList className="h-auto flex-wrap justify-start">
            {categorias.map((c) => (
              <TabsTrigger key={c.id} value={c.id} className="min-h-10 px-4">
                {c.nome}
              </TabsTrigger>
            ))}
          </TabsList>
          {categorias.map((c) => (
            <TabsContent key={c.id} value={c.id}>
              <CotacaoAba
                categoria={c}
                gerente={gerente}
                linhas={linhas.filter((l) => l.categoria_id === c.id)}
                precos={precos}
                pendentes={pendentes}
                desatualizado={aguardandoDolar}
                dolar={dolarNum}
                novaId={novaId}
                onAdicionar={() => void adicionar()}
                onEditar={editar}
                onExcluir={(id) => void remover(id)}
                onMargem={(m) => mudarMargem(c.id, m)}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      {dolarPendente !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="salvar-dolar-titulo"
            className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-lg"
          >
            <h2 id="salvar-dolar-titulo" className="text-lg font-semibold">
              Salvar como novo dólar do dia?
            </h2>
            <p className="mt-3 text-muted-foreground">{moeda(dolarPendente)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button autoFocus disabled={salvandoDolar} onClick={confirmarDolar}>
                Sim, salvar
              </Button>
              <Button
                variant="outline"
                disabled={salvandoDolar}
                onClick={() => setDolarPendente(null)}
              >
                Não, só nesta cotação
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
