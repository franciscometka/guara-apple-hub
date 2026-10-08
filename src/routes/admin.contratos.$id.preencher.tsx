import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { StepCard, WizardShell } from "@/components/contratos/WizardShell";
import { CampoDinamico } from "@/components/contratos/CampoDinamico";
import { abrirEtapa, carregarContrato, salvarRascunho } from "@/lib/contratos/assistente";
import { obterEtapaModelo, obterModelo } from "@/lib/contratos/campos";
import {
  camposVisiveis,
  passosVisiveis,
  validarPasso,
  valorLegivel,
  type DadosContrato,
  type DefPasso,
  type ValorCampo,
} from "@/lib/contratos/campos/tipos";
import { carregarDadosLoja, configuracaoCompleta } from "@/lib/contratos/loja-config";
import { nomeDoModelo, ROTULO_ETAPA } from "@/lib/contratos/modelos/catalogo";
import type { EtapaContrato } from "@/lib/contratos/database";

const ETAPAS_VALIDAS: EtapaContrato[] = ["principal", "entrega", "diagnostico", "conclusao"];

export const Route = createFileRoute("/admin/contratos/$id/preencher")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  validateSearch: (busca: Record<string, unknown>): { etapa?: EtapaContrato } => {
    const etapa = busca["etapa"];
    return typeof etapa === "string" && ETAPAS_VALIDAS.includes(etapa as EtapaContrato)
      ? { etapa: etapa as EtapaContrato }
      : {};
  },
  head: () => ({
    meta: [
      { property: "og:title", content: "Preencher contrato — Painel Guara iPhones" },
      { property: "og:description", content: "Assistente de preenchimento de contrato." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Preencher contrato — Painel Guara iPhones" },
      { name: "description", content: "Assistente de preenchimento de contrato." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Assistente,
});

const INTERVALO_SALVAMENTO = 1500;

function Assistente() {
  const { id } = Route.useParams();
  const { etapa: etapaBuscada } = Route.useSearch();
  const etapaAlvo: EtapaContrato = etapaBuscada ?? "principal";

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["contratos", "contrato", id],
    queryFn: () => carregarContrato(id),
  });
  const { data: loja } = useQuery({
    queryKey: ["contratos", "loja-config"],
    queryFn: carregarDadosLoja,
  });

  // A etapa pedida pode ainda não existir no banco: ela nasce aqui, na
  // primeira vez que alguém a abre.
  const [criandoEtapa, setCriandoEtapa] = useState(false);
  const existente = data?.etapas.find((e) => e.etapa === etapaAlvo);

  useEffect(() => {
    if (!data || existente || criandoEtapa) return;
    setCriandoEtapa(true);
    void abrirEtapa(id, etapaAlvo)
      .then(() => refetch())
      .catch(() => toast.error("Não foi possível abrir esta etapa."))
      .finally(() => setCriandoEtapa(false));
  }, [data, existente, criandoEtapa, id, etapaAlvo, refetch]);

  if (isPending || !loja) {
    return <p className="p-8 text-sm text-muted-foreground">Carregando contrato…</p>;
  }
  if (error || !data) {
    return <p className="p-8 text-sm text-destructive">Não foi possível abrir este contrato.</p>;
  }
  if (!configuracaoCompleta(loja)) {
    return <Navigate to="/admin/contratos/configuracao" />;
  }
  if (!existente) {
    return <p className="p-8 text-sm text-muted-foreground">Abrindo a etapa…</p>;
  }

  // Depois de gerado o PDF os dados estão travados: o lugar de olhar é o detalhe.
  if (existente.status !== "rascunho") {
    return <Navigate to="/admin/contratos/$id" params={{ id }} />;
  }

  const modelo = obterModelo(data.contrato.modelo_slug);
  const daPrincipal = data.etapas.find((e) => e.etapa === "principal");

  return (
    <Preenchimento
      key={existente.id}
      contratoId={id}
      numero={data.contrato.numero}
      modeloSlug={data.contrato.modelo_slug}
      etapa={etapaAlvo}
      etapaId={existente.id}
      passoInicial={existente.passo_atual}
      dadosIniciais={{
        ...(modelo.daLoja?.(loja) ?? {}),
        // A etapa posterior enxerga o que já foi preenchido na principal.
        ...((daPrincipal?.dados as DadosContrato) ?? {}),
        ...((existente.dados as DadosContrato) ?? {}),
      }}
    />
  );
}

function Preenchimento({
  contratoId,
  numero,
  modeloSlug,
  etapa,
  etapaId,
  passoInicial,
  dadosIniciais,
}: {
  contratoId: string;
  numero: string;
  modeloSlug: string;
  etapa: EtapaContrato;
  etapaId: string;
  passoInicial: number;
  dadosIniciais: DadosContrato;
}) {
  const navigate = useNavigate();
  const modelo = obterModelo(modeloSlug);
  const etapaModelo = obterEtapaModelo(modelo, etapa);

  const [dados, setDados] = useState<DadosContrato>(dadosIniciais);
  const [indice, setIndice] = useState(passoInicial);
  const [tocados, setTocados] = useState<Record<string, boolean>>({});
  const [salvando, setSalvando] = useState(false);
  const [salvoEm, setSalvoEm] = useState<Date | null>(null);
  const primeiroCampo = useRef<HTMLDivElement>(null);

  const passos = useMemo(
    () => passosVisiveis(etapaModelo.passos, dados),
    [etapaModelo.passos, dados],
  );
  const posicao = Math.min(indice, passos.length - 1);
  const passo = passos[posicao] as DefPasso;
  const ultimoAntesDaRevisao = posicao === passos.length - 2;

  const erros = useMemo(() => validarPasso(passo, dados), [passo, dados]);
  const podeContinuar = Object.keys(erros).length === 0;

  const salvar = useCallback(
    async (dadosAtuais: DadosContrato, passoAtual: number) => {
      setSalvando(true);
      try {
        await salvarRascunho(etapaId, dadosAtuais, passoAtual);
        setSalvoEm(new Date());
      } catch {
        toast.error("Não foi possível salvar o rascunho.");
      } finally {
        setSalvando(false);
      }
    },
    [etapaId],
  );

  // Salvamento automático: 1,5 s depois da última tecla.
  useEffect(() => {
    const timer = setTimeout(() => void salvar(dados, posicao), INTERVALO_SALVAMENTO);
    return () => clearTimeout(timer);
  }, [dados, posicao, salvar]);

  // Foco no primeiro campo a cada troca de passo.
  useEffect(() => {
    const alvo = primeiroCampo.current?.querySelector<HTMLElement>(
      "input:not([type=radio]), select, textarea, input[type=radio]",
    );
    alvo?.focus();
  }, [posicao]);

  const mudar = (nome: string, valor: ValorCampo) =>
    setDados((atual) => ({ ...atual, [nome]: valor }));

  const sair = (nome: string) => setTocados((t) => ({ ...t, [nome]: true }));

  const erroDe = (nome: string) => (tocados[nome] ? erros[nome] : undefined);

  function continuar() {
    if (!podeContinuar) {
      setTocados(Object.fromEntries(Object.keys(erros).map((n) => [n, true])));
      return;
    }
    const proximo = Math.min(posicao + 1, passos.length - 1);
    setIndice(proximo);
    void salvar(dados, proximo);
  }

  function voltar() {
    const anterior = Math.max(0, posicao - 1);
    setIndice(anterior);
    void salvar(dados, anterior);
  }

  async function sairSalvando() {
    await salvar(dados, posicao);
    navigate({ to: "/admin/contratos/$id", params: { id: contratoId } });
  }

  // Enter avança quando o passo está válido, exceto dentro de textarea.
  function aoTeclar(evento: React.KeyboardEvent) {
    if (evento.key !== "Enter") return;
    if ((evento.target as HTMLElement).tagName === "TEXTAREA") return;
    evento.preventDefault();
    if (podeContinuar) continuar();
  }

  const nome =
    modelo.etapas.length > 1
      ? `${nomeDoModelo(modeloSlug)} · ${ROTULO_ETAPA[etapa]}`
      : nomeDoModelo(modeloSlug);

  return (
    <WizardShell
      modelo={nome}
      numero={numero}
      passoAtual={posicao}
      total={passos.length}
      salvando={salvando}
      salvoEm={salvoEm}
      podeContinuar={podeContinuar}
      ultimo={ultimoAntesDaRevisao}
      ocultarContinuar={passo.tipo === "revisao"}
      aoVoltar={voltar}
      aoContinuar={continuar}
      aoSairSalvando={() => void sairSalvando()}
    >
      <div ref={primeiroCampo} onKeyDown={aoTeclar}>
        {passo.tipo === "revisao" ? (
          <Revisao
            passos={passos}
            dados={dados}
            contratoId={contratoId}
            aoEditar={(i) => setIndice(i)}
            aoRevisar={() => void salvar(dados, posicao)}
          />
        ) : (
          <StepCard key={passo.id} titulo={passo.titulo} ajuda={passo.ajuda}>
            {camposVisiveis(passo, dados).map((campo, i) => (
              <CampoDinamico
                key={campo.nome}
                def={campo}
                dados={dados}
                erro={erroDe(campo.nome)}
                aoMudar={mudar}
                aoSair={sair}
                autoFocus={i === 0}
              />
            ))}
          </StepCard>
        )}
      </div>
    </WizardShell>
  );
}

/** Tela final: tudo organizado por bloco, com "Editar" em cada um. */
function Revisao({
  passos,
  dados,
  contratoId,
  aoEditar,
  aoRevisar,
}: {
  passos: DefPasso[];
  dados: DadosContrato;
  contratoId: string;
  aoEditar: (indice: number) => void;
  aoRevisar: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background p-6">
        <h1 className="font-display text-xl font-semibold text-foreground">Revisão</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Confira tudo antes de gerar o PDF. Depois de gerado, os dados ficam travados — para
          corrigir, é preciso cancelar e criar uma nova versão.
        </p>
      </div>

      {passos.map((passo, i) => {
        if (passo.tipo === "revisao") return null;
        const campos = camposVisiveis(passo, dados);
        if (campos.length === 0) return null;

        return (
          <section key={passo.id} className="rounded-lg border border-border bg-background p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-foreground">
                {passo.titulo}
              </h2>
              <button
                type="button"
                onClick={() => aoEditar(i)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
              >
                <Pencil size={14} strokeWidth={1.5} aria-hidden="true" />
                Editar
              </button>
            </div>

            <dl className="mt-3 divide-y divide-border">
              {campos.map((campo) => (
                <div
                  key={campo.nome}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-2"
                >
                  <dt className="text-sm text-muted-foreground">{campo.rotulo}</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {valorLegivel(campo, dados) || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      <button
        type="button"
        onClick={() => {
          aoRevisar();
          navigate({ to: "/admin/contratos/$id", params: { id: contratoId } });
        }}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
      >
        Ir para a geração do PDF
      </button>
    </div>
  );
}
