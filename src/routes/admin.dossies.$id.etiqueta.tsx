import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { QrCode } from "@/components/contratos/QrCode";
import { carregarDossie, nomeDoAparelho } from "@/lib/contratos/dossies";
import { urlDoDossie } from "@/lib/contratos/token";
import { soDigitos } from "@/lib/contratos/validadores";
import type { DossieRow } from "@/lib/contratos/database";

export const Route = createFileRoute("/admin/dossies/$id/etiqueta")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { property: "og:title", content: "Etiqueta do aparelho — Painel Guara iPhones" },
      { property: "og:description", content: "Impressão da etiqueta com QR Code do aparelho." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Etiqueta do aparelho — Painel Guara iPhones" },
      { name: "description", content: "Impressão da etiqueta com QR Code do aparelho." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaginaEtiqueta,
});

type Formato = "50x30" | "40x25" | "a4";

interface DefFormato {
  rotulo: string;
  ajuda: string;
  /** Medidas da etiqueta, em milímetros. */
  largura: number;
  altura: number;
  /** Lado do QR dentro da etiqueta, em milímetros. */
  qr: number;
  /** Corpo do texto, em pontos: modelo, IMEI e chamada. */
  fonte: [number, number, number];
  /** Valor do `size` do `@page`. */
  pagina: string;
  /** Uma etiqueta por página, ou várias numa folha A4? */
  folha: "unica" | "grade";
}

const FORMATOS: Record<Formato, DefFormato> = {
  "50x30": {
    rotulo: "50 × 30 mm (padrão)",
    ajuda: "Uma etiqueta por página. É a medida de rolo mais comum em impressora térmica.",
    largura: 50,
    altura: 30,
    qr: 22,
    fonte: [7.5, 6.5, 5.5],
    pagina: "50mm 30mm",
    folha: "unica",
  },
  "40x25": {
    rotulo: "40 × 25 mm",
    ajuda: "Uma etiqueta por página, para aparelho pequeno ou caixa estreita.",
    largura: 40,
    altura: 25,
    qr: 18,
    fonte: [6.5, 5.5, 4.8],
    pagina: "40mm 25mm",
    folha: "unica",
  },
  a4: {
    rotulo: "Folha A4 com várias etiquetas",
    ajuda: "Etiquetas de 50 × 30 mm numa folha comum, com guia de corte tracejada.",
    largura: 50,
    altura: 30,
    qr: 22,
    fonte: [7.5, 6.5, 5.5],
    pagina: "A4",
    folha: "grade",
  },
};

const ORDEM: Formato[] = ["50x30", "40x25", "a4"];

/** Máximo que cabe em A4 retrato com 8 mm de margem: 3 colunas × 8 linhas. */
const POR_FOLHA_A4 = 24;

function PaginaEtiqueta() {
  const { id } = Route.useParams();
  const [formato, setFormato] = useState<Formato>("50x30");
  const [quantidade, setQuantidade] = useState(1);

  // Mesma chave da ficha do dossiê: vindo de lá, abre sem nova consulta.
  const { data, isPending, error } = useQuery({
    queryKey: ["contratos", "dossie", id],
    queryFn: () => carregarDossie(id),
  });

  const def = FORMATOS[formato];
  const maximo = def.folha === "grade" ? POR_FOLHA_A4 * 4 : 20;
  const total = Math.min(Math.max(1, quantidade), maximo);

  return (
    <div className="min-h-dvh bg-muted/30 print:min-h-0 print:bg-white">
      <style>{cssDeImpressao(def)}</style>

      <div className="print:hidden">
        <header className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <h1 className="font-display text-lg font-semibold text-foreground">
              Etiqueta do aparelho
            </h1>
            <Link
              to="/admin/dossies/$id"
              params={{ id }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
            >
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
              Voltar ao dossiê
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 pt-6">
          {isPending && <p className="text-sm text-muted-foreground">Carregando…</p>}
          {error && <p className="text-sm text-destructive">Não foi possível abrir este dossiê.</p>}

          {data && !data.dossie.token_ativo && (
            <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-50 p-4 text-sm font-medium text-amber-900">
              O QR Code deste aparelho está desativado. A etiqueta imprime, mas quem escanear vai
              ver “Documentação indisponível” até você reativar na ficha do dossiê.
            </p>
          )}

          {data && (
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="block">
                  <span className="text-sm font-medium text-foreground">Tamanho</span>
                  <select
                    value={formato}
                    onChange={(e) => setFormato(e.target.value as Formato)}
                    className="mt-1 block min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  >
                    {ORDEM.map((chave) => (
                      <option key={chave} value={chave}>
                        {FORMATOS[chave].rotulo}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    {def.folha === "grade" ? "Quantas etiquetas" : "Quantas cópias"}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={maximo}
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value) || 1)}
                    className="mt-1 block min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground sm:w-32"
                  />
                </label>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{def.ajuda}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Na janela de impressão, deixe as margens em zero e desligue “ajustar à página” para
                a etiqueta sair no tamanho certo.
              </p>

              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                <Printer size={16} strokeWidth={1.5} aria-hidden="true" />
                Imprimir
              </button>
            </div>
          )}

          {data && (
            <p className="mt-6 text-sm font-medium text-foreground">
              Prévia — {nomeDoAparelho(data.dossie)}
            </p>
          )}
        </div>
      </div>

      {data && (
        <div className="mx-auto max-w-4xl px-4 py-6 print:max-w-none print:p-0">
          <Folha dossie={data.dossie} def={def} total={total} />
        </div>
      )}
    </div>
  );
}

/**
 * A folha impressa. Em `unica`, cada etiqueta vira uma página; em `grade`, as
 * etiquetas se acomodam numa A4 e a quebra de página é automática.
 */
function Folha({ dossie, def, total }: { dossie: DossieRow; def: DefFormato; total: number }) {
  const url = urlDoDossie(dossie.token);

  return (
    <div
      id="folha"
      className={
        def.folha === "grade"
          ? "flex flex-wrap gap-[2mm] rounded-lg bg-white p-[2mm] shadow-sm print:gap-[2mm] print:rounded-none print:p-0 print:shadow-none"
          : "flex flex-wrap gap-4 print:gap-0"
      }
    >
      {Array.from({ length: total }, (_, i) => (
        <Etiqueta key={i} url={url} dossie={dossie} def={def} />
      ))}
    </div>
  );
}

/** "IMEI •••• 4321" — na etiqueta vai só o final, que é o que se confere. */
function finalDoImei(dossie: DossieRow): string {
  const imei = soDigitos(dossie.imei1 ?? "");
  if (imei.length >= 4) return `IMEI •••• ${imei.slice(-4)}`;

  const serie = (dossie.serie ?? "").trim();
  if (serie.length >= 4) return `Série •••• ${serie.slice(-4)}`;

  return "IMEI não informado";
}

function Etiqueta({ url, dossie, def }: { url: string; dossie: DossieRow; def: DefFormato }) {
  const [fonteModelo, fonteImei, fonteChamada] = def.fonte;
  const modelo = [dossie.modelo, dossie.capacidade].filter(Boolean).join(" ") || "Aparelho";

  return (
    <div
      className="etiqueta flex items-center gap-[2mm] overflow-hidden border border-dashed border-border bg-white p-[2mm] text-black print:border-dashed print:border-neutral-300"
      style={{ width: `${def.largura}mm`, height: `${def.altura}mm` }}
    >
      <QrCode
        valor={url}
        alt={`QR Code da documentação: ${url}`}
        className="qr shrink-0"
        // Alto o bastante para imprimir nítido mesmo numa térmica de 300 dpi.
        pixels={512}
      />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate font-semibold" style={{ fontSize: `${fonteModelo}pt` }}>
          {modelo}
        </p>
        <p className="mt-[0.5mm] truncate" style={{ fontSize: `${fonteImei}pt` }}>
          {finalDoImei(dossie)}
        </p>
        <p className="mt-[0.8mm]" style={{ fontSize: `${fonteChamada}pt` }}>
          Escaneie para ver a documentação
        </p>
      </div>
    </div>
  );
}

/**
 * O `@page` precisa de CSS de verdade — não existe utilitário de Tailwind
 * para ele —, então o tamanho do papel entra por uma folha de estilo montada
 * a cada troca de formato.
 */
function cssDeImpressao(def: DefFormato): string {
  const margem = def.folha === "grade" ? "8mm" : "0";
  const quebra = def.folha === "grade" ? "auto" : "page";

  // Na etiqueta avulsa o papel tem exatamente a medida do adesivo: a borda
  // tracejada sairia impressa e ainda arriscaria empurrar 1 px para uma
  // segunda página em branco. Na A4 ela fica, porque é a guia de corte.
  const borda = def.folha === "grade" ? "" : "\n  .etiqueta { border: 0; }";

  return `
.etiqueta .qr { width: ${def.qr}mm; height: ${def.qr}mm; }

@media print {
  @page { size: ${def.pagina}; margin: ${margem}; }

  html, body { margin: 0; padding: 0; background: #fff; }

  #folha { width: auto; }
${borda}
  .etiqueta {
    break-inside: avoid;
    page-break-inside: avoid;
    break-after: ${quebra};
    page-break-after: ${quebra};
  }

  .etiqueta:last-child { break-after: auto; page-break-after: auto; }
}
`;
}
