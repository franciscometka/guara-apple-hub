import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Check, Copy, EyeOff, Printer, QrCode as IconeQr, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QrCode } from "@/components/contratos/QrCode";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { definirQrAtivo, gerarNovoToken } from "@/lib/contratos/dossies";
import { urlDoDossie } from "@/lib/contratos/token";
import type { DossieRow } from "@/lib/contratos/database";

/**
 * O bloco de QR Code do aparelho: código, endereço público, atalho para a
 * etiqueta e os dois botões que mexem no token.
 *
 * Aparece na ficha do dossiê e no bloco do dossiê dentro do contrato.
 */
export function BlocoQrCode({
  dossie,
}: {
  dossie: Pick<DossieRow, "id" | "token" | "token_ativo">;
}) {
  const queryClient = useQueryClient();
  const { copied, copy } = useCopyToClipboard();
  const [confirmacao, setConfirmacao] = useState<"desativar" | "novo" | null>(null);

  const url = urlDoDossie(dossie.token);
  const ativo = dossie.token_ativo;

  // As telas do dossiê e do contrato leem o mesmo dossiê por chaves
  // diferentes: invalidar o módulo inteiro é mais barato que caçar cada uma.
  const recarregar = () => queryClient.invalidateQueries({ queryKey: ["contratos"] });

  const alternar = useMutation({
    mutationFn: (proximo: boolean) => definirQrAtivo(dossie.id, proximo),
    onSuccess: (_, proximo) => {
      toast.success(
        proximo
          ? "QR Code reativado. As etiquetas já coladas voltaram a funcionar."
          : "QR Code desativado. O endereço passa a responder “Documentação indisponível”.",
      );
      recarregar();
    },
    onError: () => toast.error("Não foi possível alterar o QR Code."),
  });

  const trocar = useMutation({
    mutationFn: () => gerarNovoToken(dossie.id),
    onSuccess: () => {
      toast.success("Novo QR Code gerado. Imprima e cole a etiqueta nova no aparelho.");
      recarregar();
    },
    onError: () => toast.error("Não foi possível gerar um QR Code novo."),
  });

  const ocupado = alternar.isPending || trocar.isPending;

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
          <IconeQr size={16} strokeWidth={1.5} aria-hidden="true" />
          QR Code do aparelho
        </h2>
        <span
          className={
            ativo
              ? "inline-flex items-center rounded-full border border-emerald-600/40 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
              : "inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"
          }
        >
          {ativo ? "Ativo" : "Desativado"}
        </span>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        Aponta para a página pública com a documentação do aparelho. Quem escaneia não precisa de
        login e vê só o que estiver marcado como visível nos anexos.
      </p>

      <div className="mt-4 flex flex-wrap items-start gap-4">
        <div className="relative">
          <QrCode
            valor={url}
            alt={`QR Code da documentação do aparelho: ${url}`}
            className={`w-36 rounded-md border border-border bg-white p-2 ${ativo ? "" : "opacity-30"}`}
          />
          {!ativo && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                Desativado
              </span>
            </span>
          )}
        </div>

        <div className="min-w-[14rem] flex-1 space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Endereço da etiqueta</p>
            <p className="mt-1 break-all font-mono text-xs text-foreground">{url}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(url)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
            >
              {copied ? (
                <Check size={15} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Copy size={15} strokeWidth={1.5} aria-hidden="true" />
              )}
              {copied ? "Copiado" : "Copiar link"}
            </button>

            <Link
              to="/admin/dossies/$id/etiqueta"
              params={{ id: dossie.id }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
            >
              <Printer size={15} strokeWidth={1.5} aria-hidden="true" />
              Imprimir etiqueta
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {ativo ? (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => setConfirmacao("desativar")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet disabled:opacity-60"
          >
            <EyeOff size={15} strokeWidth={1.5} aria-hidden="true" />
            Desativar QR
          </button>
        ) : (
          <button
            type="button"
            disabled={ocupado}
            onClick={() => alternar.mutate(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet disabled:opacity-60"
          >
            <IconeQr size={15} strokeWidth={1.5} aria-hidden="true" />
            Reativar QR
          </button>
        )}

        <button
          type="button"
          disabled={ocupado}
          onClick={() => setConfirmacao("novo")}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-destructive/40 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-60"
        >
          <RefreshCw size={15} strokeWidth={1.5} aria-hidden="true" />
          Gerar novo QR
        </button>
      </div>

      <Confirmacao
        aberto={confirmacao === "desativar"}
        titulo="Desativar o QR Code deste aparelho?"
        acao="Desativar"
        aoFechar={() => setConfirmacao(null)}
        aoConfirmar={() => alternar.mutate(false)}
      >
        As etiquetas continuam coladas, mas quem escanear vai ver só “Documentação indisponível”. Dá
        para reativar depois: o endereço é o mesmo e as etiquetas voltam a funcionar.
      </Confirmacao>

      <Confirmacao
        aberto={confirmacao === "novo"}
        titulo="Gerar um QR Code novo?"
        acao="Gerar novo QR"
        destrutivo
        aoFechar={() => setConfirmacao(null)}
        aoConfirmar={() => trocar.mutate()}
      >
        <strong className="font-semibold text-foreground">
          As etiquetas já coladas neste aparelho deixam de funcionar na hora.
        </strong>{" "}
        O endereço atual morre e você precisa imprimir e colar a etiqueta nova. Só faça isso se o
        endereço antigo vazou. Para só tirar a página do ar temporariamente, use “Desativar QR”.
      </Confirmacao>
    </section>
  );
}

function Confirmacao({
  aberto,
  titulo,
  acao,
  destrutivo = false,
  children,
  aoFechar,
  aoConfirmar,
}: {
  aberto: boolean;
  titulo: string;
  acao: string;
  destrutivo?: boolean;
  children: ReactNode;
  aoFechar: () => void;
  aoConfirmar: () => void;
}) {
  return (
    <AlertDialog open={aberto} onOpenChange={(v) => !v && aoFechar()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={aoConfirmar}
            className={destrutivo ? "bg-destructive text-white hover:bg-destructive/90" : undefined}
          >
            {acao}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
