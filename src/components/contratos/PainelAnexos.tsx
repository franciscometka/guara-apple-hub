import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Download,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  anexosDoTipo,
  baixarAnexo,
  definirVisibilidade,
  enviarAnexo,
  PODE_SER_PUBLICO,
  removerAnexo,
  tamanhoLegivel,
  temPrevia,
  TIPOS_ANEXO,
  urlAssinada,
  validarArquivo,
  type DefTipoAnexo,
} from "@/lib/contratos/anexos";
import type { ContratoAnexoRow } from "@/lib/contratos/database";
import { dataParaBR } from "@/lib/contratos/validadores";

/**
 * Anexos do dossiê, um bloco por tipo. Nota fiscal e as três fotos são de
 * arquivo único: enviar de novo substitui o anterior. Os demais acumulam.
 */
export function PainelAnexos({
  dossieId,
  anexos,
  contratoId,
}: {
  dossieId: string;
  anexos: ContratoAnexoRow[];
  contratoId?: string | null;
}) {
  const queryClient = useQueryClient();
  const [ocupado, setOcupado] = useState<string | null>(null);

  // Duas telas leem estes anexos: o dossiê inteiro e o contrato (só a lista).
  const recarregar = () => {
    queryClient.invalidateQueries({ queryKey: ["contratos", "dossie", dossieId] });
    queryClient.invalidateQueries({ queryKey: ["contratos", "anexos", dossieId] });
    queryClient.invalidateQueries({ queryKey: ["contratos", "dossies"] });
    queryClient.invalidateQueries({ queryKey: ["contratos", "lista"] });
  };

  const enviar = useMutation({
    mutationFn: ({ def, arquivo }: { def: DefTipoAnexo; arquivo: File }) => {
      const atuais = anexosDoTipo(anexos, def.tipo);
      return enviarAnexo({
        dossieId,
        tipo: def.tipo,
        arquivo,
        contratoId: contratoId ?? null,
        substituir: def.multiplos ? undefined : atuais[0],
      });
    },
    onMutate: ({ def }) => setOcupado(def.tipo),
    onSettled: () => setOcupado(null),
    onSuccess: () => {
      toast.success("Arquivo anexado ao dossiê.");
      recarregar();
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível anexar o arquivo."),
  });

  const remover = useMutation({
    mutationFn: (anexo: ContratoAnexoRow) => removerAnexo(anexo),
    onMutate: (anexo) => setOcupado(anexo.id),
    onSettled: () => setOcupado(null),
    onSuccess: () => {
      toast.success("Anexo removido.");
      recarregar();
    },
    onError: () => toast.error("Não foi possível remover o anexo."),
  });

  const visibilidade = useMutation({
    mutationFn: ({ anexo, visivel }: { anexo: ContratoAnexoRow; visivel: boolean }) =>
      definirVisibilidade(anexo, visivel),
    onMutate: ({ anexo }) => setOcupado(anexo.id),
    onSettled: () => setOcupado(null),
    onSuccess: (_dados, { visivel }) => {
      toast.success(visivel ? "Agora aparece na página do QR Code." : "Saiu da página do QR Code.");
      recarregar();
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível mudar a visibilidade."),
  });

  const baixar = useMutation({
    mutationFn: async (anexo: ContratoAnexoRow) => {
      const blob = await baixarAnexo(anexo);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = anexo.nome_original;
      link.click();
      URL.revokeObjectURL(url);
    },
    onError: () => toast.error("Não foi possível baixar o arquivo."),
  });

  return (
    <div className="space-y-4">
      {TIPOS_ANEXO.map((def) => {
        const doTipo = anexosDoTipo(anexos, def.tipo);
        const faltando = def.exigido && doTipo.length === 0;

        return (
          <section
            key={def.tipo}
            className={
              faltando
                ? "rounded-lg border border-amber-500/40 bg-amber-50/40 p-5"
                : "rounded-lg border border-border bg-background p-5"
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-48 flex-1">
                <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                  {def.rotulo}
                  {def.exigido && doTipo.length > 0 && (
                    <Check
                      size={15}
                      strokeWidth={2}
                      aria-label="Enviado"
                      className="text-emerald-700"
                    />
                  )}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{def.ajuda}</p>
                {faltando && (
                  <p className="mt-1 text-sm font-medium text-amber-900">
                    Falta este arquivo para o dossiê ficar completo.
                  </p>
                )}
              </div>

              <BotaoEnviar
                def={def}
                temArquivo={doTipo.length > 0}
                enviando={ocupado === def.tipo}
                aoEscolher={(arquivo) => enviar.mutate({ def, arquivo })}
              />
            </div>

            {doTipo.length > 0 && (
              <ul className="mt-4 space-y-3">
                {doTipo.map((anexo) => (
                  <li
                    key={anexo.id}
                    className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3"
                  >
                    <Miniatura anexo={anexo} />

                    <div className="min-w-40 flex-1">
                      <p className="break-all text-sm font-medium text-foreground">
                        {anexo.nome_original}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[tamanhoLegivel(anexo.tamanho), dataParaBR(anexo.criado_em)]
                          .filter(Boolean)
                          .join(" · ")}
                        {anexo.visivel_publico ? " · visível no QR Code" : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => baixar.mutate(anexo)}
                        title="Baixar"
                        className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-violet"
                      >
                        <Download size={16} strokeWidth={1.5} aria-hidden="true" />
                        <span className="sr-only">Baixar {anexo.nome_original}</span>
                      </button>

                      {PODE_SER_PUBLICO(anexo.tipo) && (
                        <button
                          type="button"
                          disabled={ocupado === anexo.id}
                          onClick={() =>
                            visibilidade.mutate({ anexo, visivel: !anexo.visivel_publico })
                          }
                          title={
                            anexo.visivel_publico
                              ? "Esconder da página do QR Code"
                              : "Mostrar na página do QR Code"
                          }
                          className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-violet disabled:opacity-60"
                        >
                          {anexo.visivel_publico ? (
                            <Eye size={16} strokeWidth={1.5} aria-hidden="true" />
                          ) : (
                            <EyeOff size={16} strokeWidth={1.5} aria-hidden="true" />
                          )}
                          <span className="sr-only">
                            {anexo.visivel_publico
                              ? `Esconder ${anexo.nome_original} da página do QR Code`
                              : `Mostrar ${anexo.nome_original} na página do QR Code`}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={ocupado === anexo.id}
                        onClick={() => {
                          if (window.confirm(`Remover “${anexo.nome_original}” do dossiê?`)) {
                            remover.mutate(anexo);
                          }
                        }}
                        title="Remover"
                        className="inline-flex size-11 items-center justify-center rounded-full border border-destructive/40 text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-60"
                      >
                        <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
                        <span className="sr-only">Remover {anexo.nome_original}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

/** Input de arquivo escondido, acionado por um botão de verdade. */
function BotaoEnviar({
  def,
  temArquivo,
  enviando,
  aoEscolher,
}: {
  def: DefTipoAnexo;
  temArquivo: boolean;
  enviando: boolean;
  aoEscolher: (arquivo: File) => void;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const rotulo = def.multiplos ? "Adicionar" : temArquivo ? "Substituir" : "Enviar";

  return (
    <>
      <input
        ref={entrada}
        type="file"
        accept={def.aceita.join(",")}
        className="sr-only"
        onChange={(e) => {
          const arquivo = e.target.files?.[0];
          e.target.value = "";
          if (!arquivo) return;
          // Avisa antes de subir: erro de formato ou de tamanho não precisa de
          // ida ao servidor.
          const recusa = validarArquivo(def, arquivo);
          if (recusa) {
            toast.error(recusa);
            return;
          }
          aoEscolher(arquivo);
        }}
      />
      <button
        type="button"
        disabled={enviando}
        onClick={() => entrada.current?.click()}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet disabled:opacity-60"
      >
        {enviando ? (
          <Loader2
            size={15}
            strokeWidth={1.5}
            aria-hidden="true"
            className="motion-safe:animate-spin"
          />
        ) : def.multiplos ? (
          <Plus size={15} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Upload size={15} strokeWidth={1.5} aria-hidden="true" />
        )}
        {enviando ? "Enviando…" : rotulo}
      </button>
    </>
  );
}

/**
 * Miniatura do anexo. O bucket é privado, então a imagem vem por URL assinada
 * de curta duração; HEIC e PDF ficam no ícone.
 */
function Miniatura({ anexo }: { anexo: ContratoAnexoRow }) {
  const imagem = temPrevia(anexo.mime);

  const { data: url } = useQuery({
    queryKey: ["contratos", "anexo-url", anexo.id],
    queryFn: () => urlAssinada(anexo.path),
    enabled: imagem,
    staleTime: 8 * 60 * 1000,
  });

  if (imagem && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img
          src={url}
          alt={`Anexo: ${anexo.nome_original}`}
          loading="lazy"
          className="size-16 rounded-md border border-border object-cover"
        />
      </a>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-16 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground"
    >
      {anexo.mime?.startsWith("image/") ? (
        <ImageIcon size={20} strokeWidth={1.5} />
      ) : (
        <FileText size={20} strokeWidth={1.5} />
      )}
    </span>
  );
}
