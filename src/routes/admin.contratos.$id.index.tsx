import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Download,
  FileCheck2,
  FileText,
  Loader2,
  Lock,
  Pencil,
  Smartphone,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { DossieBadge, StatusBadge } from "@/components/contratos/StatusBadge";
import { PainelAnexos } from "@/components/contratos/PainelAnexos";
import { BlocoQrCode } from "@/components/contratos/BlocoQrCode";
import { listarAnexos, pendenciasDeAnexo } from "@/lib/contratos/anexos";
import { nomeDoAparelho } from "@/lib/contratos/dossies";
import {
  baixarArquivo,
  cancelarContrato,
  carregarContrato,
  enviarAssinado,
  gerarEGravarPdf,
} from "@/lib/contratos/assistente";
import { etapaPrincipal, obterEtapaModelo, obterModelo } from "@/lib/contratos/campos";
import { camposVisiveis, passosVisiveis, valorLegivel } from "@/lib/contratos/campos/tipos";
import type { DadosContrato } from "@/lib/contratos/campos/tipos";
import { baixarPdf } from "@/lib/contratos/gerar-pdf";
import { carregarDadosLoja } from "@/lib/contratos/loja-config";
import { nomeDoModelo, ROTULO_ETAPA } from "@/lib/contratos/modelos/catalogo";
import type { ContratoEtapaRow, EtapaContrato } from "@/lib/contratos/database";
import { LIMITE_ARQUIVO_BYTES } from "@/lib/contratos/database";
import { ERROS } from "@/lib/contratos/validadores";

export const Route = createFileRoute("/admin/contratos/$id/")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { property: "og:title", content: "Contrato — Painel Guara iPhones" },
      { property: "og:description", content: "Detalhe do contrato e do dossiê." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Contrato — Painel Guara iPhones" },
      { name: "description", content: "Detalhe do contrato e do dossiê." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DetalheContrato,
});

function DetalheContrato() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [gerando, setGerando] = useState<EtapaContrato | null>(null);

  const { data, isPending, error } = useQuery({
    queryKey: ["contratos", "contrato", id],
    queryFn: () => carregarContrato(id),
  });
  const { data: loja } = useQuery({
    queryKey: ["contratos", "loja-config"],
    queryFn: carregarDadosLoja,
  });

  const dossieId = data?.contrato.dossie_id ?? null;
  const { data: anexos } = useQuery({
    queryKey: ["contratos", "anexos", dossieId],
    queryFn: () => listarAnexos(dossieId as string),
    enabled: Boolean(dossieId),
  });

  const recarregar = () => {
    queryClient.invalidateQueries({ queryKey: ["contratos", "contrato", id] });
    queryClient.invalidateQueries({ queryKey: ["contratos", "lista"] });
  };

  const gerar = useMutation({
    mutationFn: async (etapa: EtapaContrato) => {
      if (!data || !loja) throw new Error("Contrato não carregado.");
      const modelo = obterModelo(data.contrato.modelo_slug);
      const etapaModelo = obterEtapaModelo(modelo, etapa);
      const linha = data.etapas.find((e) => e.etapa === etapa);
      if (!linha) throw new Error("Etapa ainda não foi aberta.");

      // A etapa posterior imprime também o que veio da principal.
      const daPrincipal =
        (data.etapas.find((e) => e.etapa === "principal")?.dados as DadosContrato) ?? {};
      const dados: DadosContrato = {
        ...daPrincipal,
        ...((linha.dados as DadosContrato) ?? {}),
      };

      const resultado = await gerarEGravarPdf(
        data.contrato,
        linha,
        modelo,
        etapaModelo,
        dados,
        loja,
      );
      baixarPdf(resultado.pdf.blob, `${data.contrato.numero}-${etapa}.pdf`);
      return resultado;
    },
    onMutate: (etapa) => setGerando(etapa),
    onSettled: () => setGerando(null),
    onSuccess: () => {
      toast.success("PDF gerado. Os dados desta etapa estão travados a partir de agora.");
      recarregar();
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível gerar o PDF."),
  });

  const baixar = useMutation({
    mutationFn: async (caminho: string) => {
      const blob = await baixarArquivo(caminho);
      baixarPdf(blob, caminho.split("/").pop() ?? "contrato.pdf");
    },
    onError: () => toast.error("Não foi possível baixar o arquivo."),
  });

  const assinar = useMutation({
    mutationFn: async ({ linha, arquivo }: { linha: ContratoEtapaRow; arquivo: File }) => {
      if (!data) throw new Error("Contrato não carregado.");
      if (arquivo.size > LIMITE_ARQUIVO_BYTES) throw new Error(ERROS.arquivoGrande);
      const modelo = obterModelo(data.contrato.modelo_slug);
      await enviarAssinado(
        data.contrato,
        linha,
        arquivo,
        linha.etapa === etapaPrincipal(modelo).etapa,
      );
    },
    onSuccess: () => {
      toast.success("PDF assinado enviado.");
      recarregar();
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível enviar o arquivo."),
  });

  const cancelar = useMutation({
    mutationFn: () => cancelarContrato(id),
    onSuccess: () => {
      toast.success("Contrato cancelado.");
      recarregar();
    },
    onError: () => toast.error("Não foi possível cancelar o contrato."),
  });

  if (isPending) {
    return (
      <AdminShell titulo="Contrato">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </AdminShell>
    );
  }
  if (error || !data) {
    return (
      <AdminShell titulo="Contrato">
        <p className="text-sm text-destructive">Não foi possível abrir este contrato.</p>
      </AdminShell>
    );
  }

  const { contrato } = data;
  const modelo = obterModelo(contrato.modelo_slug);
  const principal = data.etapas.find((e) => e.etapa === etapaPrincipal(modelo).etapa);
  const dadosPrincipal = ((principal?.dados as DadosContrato) ?? {}) as DadosContrato;
  const cancelado = contrato.status === "cancelado";

  return (
    <AdminShell
      titulo={`Contrato ${contrato.numero}`}
      acoes={
        <Link
          to="/admin/contratos"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
        >
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Voltar
        </Link>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={contrato.status} />
        <span className="text-sm text-muted-foreground">
          {nomeDoModelo(contrato.modelo_slug)} · versão {contrato.modelo_versao}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          {passosVisiveis(etapaPrincipal(modelo).passos, dadosPrincipal).map((passo) => {
            const campos = camposVisiveis(passo, dadosPrincipal);
            if (campos.length === 0 || passo.tipo === "revisao") return null;

            return (
              <section key={passo.id} className="rounded-lg border border-border bg-background p-5">
                <h2 className="font-display text-base font-semibold text-foreground">
                  {passo.titulo}
                </h2>
                <dl className="mt-3 divide-y divide-border">
                  {campos.map((campo) => (
                    <div
                      key={campo.nome}
                      className="flex flex-wrap items-baseline justify-between gap-2 py-2"
                    >
                      <dt className="text-sm text-muted-foreground">{campo.rotulo}</dt>
                      <dd className="text-sm font-medium text-foreground">
                        {valorLegivel(campo, dadosPrincipal) || "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}

          {data.dossie && (
            <section className="rounded-lg border border-border bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                    <Smartphone size={16} strokeWidth={1.5} aria-hidden="true" />
                    Dossiê do aparelho
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {nomeDoAparelho(data.dossie)}
                    {data.dossie.imei1 ? ` · IMEI ${data.dossie.imei1}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {anexos && <DossieBadge completo={pendenciasDeAnexo(anexos).length === 0} />}
                  <Link
                    to="/admin/dossies/$id"
                    params={{ id: data.dossie.id }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
                  >
                    Abrir dossiê
                  </Link>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                Anexe aqui a nota fiscal de entrada e as fotos do aparelho. Os arquivos ficam no
                dossiê, não no contrato — valem para todos os contratos deste aparelho.
              </p>

              <div className="mt-4">
                <BlocoQrCode dossie={data.dossie} />
              </div>

              <div className="mt-4">
                <PainelAnexos
                  dossieId={data.dossie.id}
                  anexos={anexos ?? []}
                  contratoId={contrato.id}
                />
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          {modelo.etapas.map((etapaModelo) => {
            const linha = data.etapas.find((e) => e.etapa === etapaModelo.etapa);
            const anterior = etapaModelo.dependeDe
              ? data.etapas.find((e) => e.etapa === etapaModelo.dependeDe)
              : undefined;
            const bloqueada = Boolean(
              etapaModelo.dependeDe && (!anterior || anterior.status === "rascunho"),
            );

            return (
              <CartaoEtapa
                key={etapaModelo.etapa}
                contratoId={id}
                etapa={etapaModelo.etapa}
                titulo={ROTULO_ETAPA[etapaModelo.etapa]}
                quando={etapaModelo.quando}
                linha={linha}
                bloqueada={bloqueada}
                dependeDe={etapaModelo.dependeDe}
                rascunho={!linha || linha.status === "rascunho"}
                cancelado={cancelado}
                gerando={gerando === etapaModelo.etapa}
                enviando={assinar.isPending}
                aoGerar={() => gerar.mutate(etapaModelo.etapa)}
                aoBaixar={(caminho) => baixar.mutate(caminho)}
                aoAssinar={(arquivo) => {
                  if (linha) assinar.mutate({ linha, arquivo });
                }}
              />
            );
          })}

          {!cancelado && (
            <section className="rounded-lg border border-border bg-background p-5">
              <h2 className="font-display text-base font-semibold text-foreground">Cancelar</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Contrato emitido não é editado nem excluído. Para corrigir, cancele e crie uma nova
                versão.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Cancelar este contrato? Ele continua no histórico, mas não pode ser reaberto.",
                    )
                  ) {
                    cancelar.mutate();
                  }
                }}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-destructive/40 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
              >
                Cancelar contrato
              </button>
            </section>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}

/** Um bloco por etapa: preencher, gerar PDF, baixar e enviar o assinado. */
function CartaoEtapa({
  contratoId,
  etapa,
  titulo,
  quando,
  linha,
  bloqueada,
  dependeDe,
  rascunho,
  cancelado,
  gerando,
  enviando,
  aoGerar,
  aoBaixar,
  aoAssinar,
}: {
  contratoId: string;
  etapa: EtapaContrato;
  titulo: string;
  quando: string | undefined;
  linha: ContratoEtapaRow | undefined;
  bloqueada: boolean;
  dependeDe: EtapaContrato | undefined;
  rascunho: boolean;
  cancelado: boolean;
  gerando: boolean;
  enviando: boolean;
  aoGerar: () => void;
  aoBaixar: (caminho: string) => void;
  aoAssinar: (arquivo: File) => void;
}) {
  const entrada = useRef<HTMLInputElement>(null);

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base font-semibold text-foreground">{titulo}</h2>
        {linha && <StatusBadge status={linha.status} />}
      </div>
      {quando && <p className="mt-1 text-sm text-muted-foreground">{quando}</p>}

      {bloqueada ? (
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <Lock size={15} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0" />
          Liberada depois que “{dependeDe ? ROTULO_ETAPA[dependeDe] : ""}” gerar o PDF.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {rascunho && !cancelado && (
            <>
              <Link
                to="/admin/contratos/$id/preencher"
                params={{ id: contratoId }}
                search={{ etapa }}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
              >
                <Pencil size={15} strokeWidth={1.5} aria-hidden="true" />
                {linha ? "Continuar preenchimento" : "Preencher"}
              </Link>

              {linha && (
                <button
                  type="button"
                  onClick={aoGerar}
                  disabled={gerando}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {gerando ? (
                    <Loader2
                      size={15}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="motion-safe:animate-spin"
                    />
                  ) : (
                    <FileText size={15} strokeWidth={1.5} aria-hidden="true" />
                  )}
                  {gerando ? "Gerando…" : "Gerar PDF"}
                </button>
              )}
            </>
          )}

          {linha?.pdf_path && (
            <button
              type="button"
              onClick={() => aoBaixar(linha.pdf_path as string)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
            >
              <Download size={15} strokeWidth={1.5} aria-hidden="true" />
              Baixar PDF
            </button>
          )}

          {linha?.pdf_path && !cancelado && (
            <>
              <input
                ref={entrada}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => {
                  const arquivo = e.target.files?.[0];
                  if (arquivo) aoAssinar(arquivo);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => entrada.current?.click()}
                disabled={enviando}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet disabled:opacity-60"
              >
                <Upload size={15} strokeWidth={1.5} aria-hidden="true" />
                {enviando ? "Enviando…" : "Enviar PDF assinado"}
              </button>
            </>
          )}

          {linha?.assinado_path && (
            <button
              type="button"
              onClick={() => aoBaixar(linha.assinado_path as string)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
            >
              <FileCheck2 size={15} strokeWidth={1.5} aria-hidden="true" />
              Baixar assinado
            </button>
          )}

          {linha?.pdf_sha256 && (
            <p className="break-all text-xs text-muted-foreground">SHA-256: {linha.pdf_sha256}</p>
          )}
        </div>
      )}
    </section>
  );
}
