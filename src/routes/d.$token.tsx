import { createFileRoute } from "@tanstack/react-router";
import { FileText, ShieldCheck, Smartphone } from "lucide-react";
import { DocumentoPublico } from "@/components/contratos/DocumentoPublico";
import type { ReactNode } from "react";
import { consultarDossiePublico } from "@/lib/contratos/dossie-publico.functions";
import {
  DETALHE_INDISPONIVEL,
  INDISPONIVEL,
  type DossiePublico,
} from "@/lib/contratos/dossie-publico";
import { dataParaBR } from "@/lib/contratos/validadores";

/**
 * Página pública do QR Code do aparelho.
 *
 * Sem login, sem menu e sem rodapé do site (o __root reconhece /d/ e entrega
 * a casca vazia). Quem escaneia a etiqueta cai aqui e vê a procedência do
 * aparelho; tudo o que aparece foi liberado anexo por anexo no painel.
 */
export const Route = createFileRoute("/d/$token")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Documentação do aparelho — Guara iPhones" },
      { property: "og:description", content: "Documentação de procedência do aparelho, publicada pela loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Documentação do aparelho — Guara iPhones" },
      {
        name: "description",
        content: "Documentação de procedência do aparelho, publicada pela loja.",
      },
      // Página de um aparelho específico: não entra em buscador nem passa
      // autoridade de link para lugar nenhum.
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  // Os links dos anexos duram 10 minutos: toda visita revalida no servidor.
  shouldReload: true,
  loader: ({ params }) => consultarDossiePublico({ data: params.token }),
  component: PaginaPublica,
  errorComponent: () => <Indisponivel />,
  pendingComponent: () => (
    <Moldura>
      <p className="text-sm text-muted-foreground">Carregando a documentação…</p>
    </Moldura>
  ),
});

function PaginaPublica() {
  const resposta = Route.useLoaderData();
  if (!resposta.ok) return <Indisponivel />;
  return <Documentacao dossie={resposta.dossie} />;
}

/** Fundo e largura, iguais nos dois estados da página. */
function Moldura({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted/30 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">{children}</div>
    </div>
  );
}

/**
 * Token inválido, inexistente, desativado ou acima do limite de acessos: a
 * mensagem é sempre esta, sem dizer qual dos casos aconteceu.
 */
function Indisponivel() {
  return (
    <Moldura>
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <h1 className="font-display text-xl font-semibold text-foreground">{INDISPONIVEL}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{DETALHE_INDISPONIVEL}</p>
      </div>
    </Moldura>
  );
}

function Documentacao({ dossie }: { dossie: DossiePublico }) {
  const { loja, aparelho } = dossie;

  return (
    <Moldura>
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Documentação do aparelho
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
          {aparelho.nome}
        </h1>
        {loja.nome && (
          <p className="mt-2 text-sm text-muted-foreground">
            Publicada por {loja.nome}
            {loja.cidade ? ` · ${loja.cidade}` : ""}
          </p>
        )}
      </header>

      <div className="mt-6 flex justify-center">
        <SeloCompletude completo={dossie.completo} />
      </div>

      <section className="mt-6 rounded-xl border border-border bg-background p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
          <Smartphone size={16} strokeWidth={1.5} aria-hidden="true" />
          Aparelho
        </h2>
        <dl className="mt-3 divide-y divide-border">
          <Linha rotulo="Modelo" valor={aparelho.modelo} />
          <Linha rotulo="Cor" valor={aparelho.cor} />
          <Linha rotulo="Capacidade" valor={aparelho.capacidade} />
          <Linha rotulo="IMEI" valor={aparelho.imei} mono />
          <Linha rotulo="Número de série" valor={aparelho.serie} mono />
          <Linha rotulo="Entrou na loja em" valor={dataParaBR(dossie.adquiridoEm)} />
        </dl>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-background p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
          <FileText size={16} strokeWidth={1.5} aria-hidden="true" />
          Documentos
        </h2>

        {dossie.anexos.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            A loja ainda não publicou documentos deste aparelho.
          </p>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {dossie.anexos.map((anexo) => (
                <li key={anexo.id}>
                  <DocumentoPublico anexo={anexo} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {(loja.cnpj || loja.telefone || loja.canal) && (
        <section className="mt-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-display text-base font-semibold text-foreground">Loja</h2>
          <dl className="mt-3 divide-y divide-border">
            <Linha rotulo="Razão social" valor={loja.nome} />
            <Linha rotulo="CNPJ" valor={loja.cnpj} mono />
            <Linha rotulo="Cidade" valor={loja.cidade} />
            <Linha rotulo="Telefone" valor={loja.telefone} />
            <Linha rotulo="Atendimento" valor={loja.canal} />
          </dl>
        </section>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Esta página é gerada pela loja a partir do dossiê do aparelho. Documentos pessoais de
        clientes nunca são publicados aqui.
      </p>
    </Moldura>
  );
}

function SeloCompletude({ completo }: { completo: boolean }) {
  if (completo) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-emerald-600/40 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
        <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
        Documentação completa
      </p>
    );
  }

  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-900">
      Documentação em andamento
    </p>
  );
}

function Linha({ rotulo, valor, mono }: { rotulo: string; valor: string; mono?: boolean }) {
  if (!valor) return null;
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 py-2">
      <dt className="text-sm text-muted-foreground">{rotulo}</dt>
      <dd className={mono ? "font-mono text-sm text-foreground" : "text-sm text-foreground"}>
        {valor}
      </dd>
    </div>
  );
}

