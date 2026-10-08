import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, Check, FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { DossieBadge, StatusBadge } from "@/components/contratos/StatusBadge";
import { PainelAnexos } from "@/components/contratos/PainelAnexos";
import { BlocoQrCode } from "@/components/contratos/BlocoQrCode";
import { CampoTexto } from "@/components/contratos/inputs/Campo";
import { ImeiInput } from "@/components/contratos/inputs/ImeiInput";
import { DateTimeField } from "@/components/contratos/inputs/DateTimeField";
import {
  carregarDossie,
  nomeDoAparelho,
  pendenciasDoDossie,
  ROTULO_ORIGEM,
  ROTULOS_APARELHO,
  salvarAparelho,
  type CamposDoAparelho,
  type DossieCompleto,
} from "@/lib/contratos/dossies";
import { nomeDoModelo, ROTULO_ETAPA } from "@/lib/contratos/modelos/catalogo";
import { dataParaBR, dataValida, ERROS, imeiValido, soDigitos } from "@/lib/contratos/validadores";

export const Route = createFileRoute("/admin/dossies/$id/")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { property: "og:title", content: "Dossiê do aparelho — Painel Guara iPhones" },
      { property: "og:description", content: "Contratos, nota fiscal e fotos do aparelho." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Dossiê do aparelho — Painel Guara iPhones" },
      { name: "description", content: "Contratos, nota fiscal e fotos do aparelho." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DetalheDossie,
});

function DetalheDossie() {
  const { id } = Route.useParams();

  const { data, isPending, error } = useQuery({
    queryKey: ["contratos", "dossie", id],
    queryFn: () => carregarDossie(id),
  });

  if (isPending) {
    return (
      <AdminShell titulo="Dossiê do aparelho">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </AdminShell>
    );
  }
  if (error || !data) {
    return (
      <AdminShell titulo="Dossiê do aparelho">
        <p className="text-sm text-destructive">Não foi possível abrir este dossiê.</p>
      </AdminShell>
    );
  }

  const faltas = pendenciasDoDossie(data);

  return (
    <AdminShell
      titulo={nomeDoAparelho(data.dossie)}
      acoes={
        <Link
          to="/admin/dossies"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
        >
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Voltar
        </Link>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <DossieBadge completo={faltas.length === 0} />
        <span className="text-sm text-muted-foreground">
          {ROTULO_ORIGEM[data.dossie.origem]}
          {data.dossie.imei1 ? ` · IMEI ${data.dossie.imei1}` : ""}
        </span>
      </div>

      {faltas.length > 0 ? (
        <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-50 p-4">
          <p className="flex items-start gap-2 text-sm font-medium text-amber-900">
            <AlertTriangle
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            Falta para o dossiê ficar completo: {faltas.join(", ")}.
          </p>
        </div>
      ) : (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-600/40 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
          <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
          Dossiê completo: contrato assinado, nota fiscal de entrada e as três fotos.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">Anexos</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tudo fica no armazenamento privado da loja. O olho decide o que a página do QR Code
              mostra.
            </p>
            <div className="mt-4">
              <PainelAnexos dossieId={id} anexos={data.anexos} />
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <BlocoQrCode dossie={data.dossie} />
          <FichaDoAparelho completo={data} />
          <ContratosDoDossie completo={data} />
        </aside>
      </div>
    </AdminShell>
  );
}

/** Identificação do aparelho, corrigível sem tocar no contrato já emitido. */
function FichaDoAparelho({ completo }: { completo: DossieCompleto }) {
  const queryClient = useQueryClient();
  const { dossie } = completo;

  const doBanco = (): CamposDoAparelho => ({
    marca: dossie.marca ?? "",
    modelo: dossie.modelo ?? "",
    cor: dossie.cor ?? "",
    capacidade: dossie.capacidade ?? "",
    imei1: dossie.imei1 ?? "",
    imei2: dossie.imei2 ?? "",
    serie: dossie.serie ?? "",
    adquirido_em: dossie.adquirido_em ?? "",
  });

  const [campos, setCampos] = useState<CamposDoAparelho>(doBanco);
  const [erros, setErros] = useState<Partial<Record<keyof CamposDoAparelho, string>>>({});

  // Depois de salvar, a query recarrega e os campos voltam a refletir o banco.
  useEffect(() => {
    setCampos(doBanco());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dossie.atualizado_em]);

  const mudar = (chave: keyof CamposDoAparelho, valor: string) =>
    setCampos((atual) => ({ ...atual, [chave]: valor }));

  const salvar = useMutation({
    mutationFn: async () => {
      const encontrados: Partial<Record<keyof CamposDoAparelho, string>> = {};
      if (!campos.modelo?.trim()) encontrados.modelo = ERROS.obrigatorio;
      for (const chave of ["imei1", "imei2"] as const) {
        const valor = soDigitos(campos[chave] ?? "");
        if (valor && !imeiValido(valor)) encontrados[chave] = ERROS.imei;
      }
      if (campos.adquirido_em && !dataValida(campos.adquirido_em)) {
        encontrados.adquirido_em = ERROS.data;
      }
      setErros(encontrados);
      if (Object.keys(encontrados).length > 0) {
        throw new Error("Confira os campos destacados.");
      }
      await salvarAparelho(dossie.id, campos);
    },
    onSuccess: () => {
      toast.success("Ficha do aparelho atualizada.");
      queryClient.invalidateQueries({ queryKey: ["contratos", "dossie", dossie.id] });
      queryClient.invalidateQueries({ queryKey: ["contratos", "dossies"] });
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível salvar."),
  });

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <h2 className="font-display text-base font-semibold text-foreground">Ficha do aparelho</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Corrige a identificação do aparelho. O PDF do contrato não muda — ele é imutável desde que
        foi gerado.
      </p>

      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          salvar.mutate();
        }}
      >
        <CampoTexto
          rotulo={ROTULOS_APARELHO.marca}
          valor={campos.marca ?? ""}
          aoMudar={(v) => mudar("marca", v)}
          obrigatorio={false}
        />
        <CampoTexto
          rotulo={ROTULOS_APARELHO.modelo}
          erro={erros.modelo}
          valor={campos.modelo ?? ""}
          aoMudar={(v) => mudar("modelo", v)}
        />
        <CampoTexto
          rotulo={ROTULOS_APARELHO.cor}
          valor={campos.cor ?? ""}
          aoMudar={(v) => mudar("cor", v)}
          obrigatorio={false}
        />
        <CampoTexto
          rotulo={ROTULOS_APARELHO.capacidade}
          valor={campos.capacidade ?? ""}
          aoMudar={(v) => mudar("capacidade", v)}
          obrigatorio={false}
        />
        <ImeiInput
          rotulo={ROTULOS_APARELHO.imei1}
          erro={erros.imei1}
          valor={campos.imei1 ?? ""}
          aoMudar={(v) => mudar("imei1", v)}
        />
        <ImeiInput
          rotulo={ROTULOS_APARELHO.imei2}
          erro={erros.imei2}
          valor={campos.imei2 ?? ""}
          aoMudar={(v) => mudar("imei2", v)}
        />
        <CampoTexto
          rotulo={ROTULOS_APARELHO.serie}
          valor={campos.serie ?? ""}
          aoMudar={(v) => mudar("serie", v)}
          obrigatorio={false}
        />
        <DateTimeField
          rotulo={ROTULOS_APARELHO.adquirido_em}
          erro={erros.adquirido_em}
          data={campos.adquirido_em ?? ""}
          aoMudarData={(v) => mudar("adquirido_em", v)}
        />

        <button
          type="submit"
          disabled={salvar.isPending}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Save size={15} strokeWidth={1.5} aria-hidden="true" />
          {salvar.isPending ? "Salvando…" : "Salvar ficha"}
        </button>
      </form>
    </section>
  );
}

/** Contratos ligados a este aparelho, com o status de cada etapa. */
function ContratosDoDossie({ completo }: { completo: DossieCompleto }) {
  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <h2 className="font-display text-base font-semibold text-foreground">Contratos</h2>

      {completo.contratos.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Nenhum contrato aponta para este aparelho.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {completo.contratos.map((contrato) => (
            <li key={contrato.id}>
              <Link
                to="/admin/contratos/$id"
                params={{ id: contrato.id }}
                className="block rounded-md border border-border p-3 transition-colors hover:border-violet"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText size={15} strokeWidth={1.5} aria-hidden="true" />
                    {contrato.numero}
                  </p>
                  <StatusBadge status={contrato.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {nomeDoModelo(contrato.modelo_slug)} · {dataParaBR(contrato.criado_em)}
                </p>
                {contrato.etapas.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {contrato.etapas.map((etapa) => (
                      <li key={etapa.id} className="text-xs text-muted-foreground">
                        {ROTULO_ETAPA[etapa.etapa]}:{" "}
                        {etapa.assinado_path
                          ? "assinado"
                          : etapa.pdf_path
                            ? "PDF gerado, sem assinatura"
                            : "rascunho"}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
