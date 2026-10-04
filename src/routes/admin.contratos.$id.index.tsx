import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ArrowLeft, Download, FileCheck2, FileText, Loader2, Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { StatusBadge } from "@/components/contratos/StatusBadge";
import {
  baixarArquivo,
  cancelarContrato,
  carregarContrato,
  enviarAssinado,
  etapaDe,
  gerarEGravarPdf,
} from "@/lib/contratos/assistente";
import { obterModelo } from "@/lib/contratos/campos";
import { camposVisiveis, passosVisiveis, textoDe } from "@/lib/contratos/campos/tipos";
import type { DadosContrato } from "@/lib/contratos/campos/tipos";
import { baixarPdf } from "@/lib/contratos/gerar-pdf";
import { carregarDadosLoja } from "@/lib/contratos/loja-config";
import { nomeDoModelo, ROTULO_ETAPA } from "@/lib/contratos/modelos/catalogo";
import { LIMITE_ARQUIVO_BYTES } from "@/lib/contratos/database";
import { ERROS } from "@/lib/contratos/validadores";

export const Route = createFileRoute("/admin/contratos/$id/")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
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
  const entradaAssinado = useRef<HTMLInputElement>(null);
  const [gerando, setGerando] = useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ["contratos", "contrato", id],
    queryFn: () => carregarContrato(id),
  });
  const { data: loja } = useQuery({
    queryKey: ["contratos", "loja-config"],
    queryFn: carregarDadosLoja,
  });

  const recarregar = () => {
    queryClient.invalidateQueries({ queryKey: ["contratos", "contrato", id] });
    queryClient.invalidateQueries({ queryKey: ["contratos", "lista"] });
  };

  const gerar = useMutation({
    mutationFn: async () => {
      if (!data || !loja) throw new Error("Contrato não carregado.");
      const modelo = obterModelo(data.contrato.modelo_slug);
      const etapa = etapaDe(data, modelo.etapa);
      if (!etapa) throw new Error("Etapa não encontrada.");

      const resultado = await gerarEGravarPdf(
        data.contrato,
        etapa,
        modelo,
        (etapa.dados as DadosContrato) ?? {},
        loja,
      );
      baixarPdf(resultado.pdf.blob, `${data.contrato.numero}-${modelo.slug}.pdf`);
      return resultado;
    },
    onMutate: () => setGerando(true),
    onSettled: () => setGerando(false),
    onSuccess: () => {
      toast.success("PDF gerado. Os dados do contrato estão travados a partir de agora.");
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
    mutationFn: async (arquivo: File) => {
      if (!data) throw new Error("Contrato não carregado.");
      const modelo = obterModelo(data.contrato.modelo_slug);
      const etapa = etapaDe(data, modelo.etapa);
      if (!etapa) throw new Error("Etapa não encontrada.");
      if (arquivo.size > LIMITE_ARQUIVO_BYTES) throw new Error(ERROS.arquivoGrande);
      await enviarAssinado(data.contrato, etapa, arquivo);
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
  const etapa = etapaDe(data, modelo.etapa);
  const dados = ((etapa?.dados as DadosContrato) ?? {}) as DadosContrato;
  const rascunho = contrato.status === "rascunho";
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          {passosVisiveis(modelo.passos, dados).map((passo) => {
            const campos = camposVisiveis(passo, dados);
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
                        {textoDe(dados, campo.nome) || "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-border bg-background p-5">
            <h2 className="font-display text-base font-semibold text-foreground">
              {ROTULO_ETAPA[modelo.etapa]}
            </h2>

            <div className="mt-4 space-y-3">
              {rascunho && (
                <>
                  <Link
                    to="/admin/contratos/$id/preencher"
                    params={{ id }}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
                  >
                    <Pencil size={15} strokeWidth={1.5} aria-hidden="true" />
                    Continuar preenchimento
                  </Link>

                  <button
                    type="button"
                    onClick={() => gerar.mutate()}
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
                </>
              )}

              {etapa?.pdf_path && (
                <button
                  type="button"
                  onClick={() => baixar.mutate(etapa.pdf_path as string)}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
                >
                  <Download size={15} strokeWidth={1.5} aria-hidden="true" />
                  Baixar PDF
                </button>
              )}

              {etapa?.pdf_path && !cancelado && (
                <>
                  <input
                    ref={entradaAssinado}
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const arquivo = e.target.files?.[0];
                      if (arquivo) assinar.mutate(arquivo);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => entradaAssinado.current?.click()}
                    disabled={assinar.isPending}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet disabled:opacity-60"
                  >
                    <Upload size={15} strokeWidth={1.5} aria-hidden="true" />
                    {assinar.isPending ? "Enviando…" : "Enviar PDF assinado"}
                  </button>
                </>
              )}

              {etapa?.assinado_path && (
                <button
                  type="button"
                  onClick={() => baixar.mutate(etapa.assinado_path as string)}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
                >
                  <FileCheck2 size={15} strokeWidth={1.5} aria-hidden="true" />
                  Baixar assinado
                </button>
              )}
            </div>

            {etapa?.pdf_sha256 && (
              <p className="mt-4 break-all text-xs text-muted-foreground">
                SHA-256 do PDF: {etapa.pdf_sha256}
              </p>
            )}
          </section>

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
