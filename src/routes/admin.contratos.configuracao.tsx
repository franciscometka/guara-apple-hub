import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { exigirSessaoAdmin } from "@/lib/admin-guard";
import { CampoTexto } from "@/components/contratos/inputs/Campo";
import { CepInput } from "@/components/contratos/inputs/CepInput";
import { CpfCnpjInput } from "@/components/contratos/inputs/CpfCnpjInput";
import { PhoneInput } from "@/components/contratos/inputs/PhoneInput";
import {
  carregarDadosLoja,
  LOJA_VAZIA,
  ROTULOS_LOJA,
  salvarDadosLoja,
  validarDadosLoja,
  type DadosLoja,
} from "@/lib/contratos/loja-config";
import { UFS } from "@/lib/contratos/validadores";

export const Route = createFileRoute("/admin/contratos/configuracao")({
  ssr: false,
  beforeLoad: exigirSessaoAdmin,
  head: () => ({
    meta: [
      { title: "Dados da loja — Painel Guara iPhones" },
      {
        name: "description",
        content: "Dados da loja usados em todos os contratos.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfiguracaoContratos,
});

function ConfiguracaoContratos() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dados, setDados] = useState<DadosLoja>(LOJA_VAZIA);
  const [erros, setErros] = useState<Partial<Record<keyof DadosLoja, string>>>({});
  const [tocados, setTocados] = useState<Partial<Record<keyof DadosLoja, boolean>>>({});

  const { data: salvos, isPending } = useQuery({
    queryKey: ["contratos", "loja-config"],
    queryFn: carregarDadosLoja,
  });

  useEffect(() => {
    if (salvos) setDados(salvos);
  }, [salvos]);

  const salvar = useMutation({
    mutationFn: salvarDadosLoja,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos", "loja-config"] });
      toast.success("Dados da loja salvos.");
      navigate({ to: "/admin/contratos" });
    },
    onError: () => toast.error("Não foi possível salvar os dados da loja."),
  });

  // Só mostra erro de campo que o usuário já visitou, para não encher a tela
  // de vermelho antes de ele digitar qualquer coisa.
  const erroDe = (campo: keyof DadosLoja) => (tocados[campo] ? erros[campo] : undefined);

  const mudar = (campo: keyof DadosLoja) => (valor: string) => {
    const novo = { ...dados, [campo]: valor };
    setDados(novo);
    setErros(validarDadosLoja(novo));
  };

  const sair = (campo: keyof DadosLoja) => () => {
    setTocados((t) => ({ ...t, [campo]: true }));
    setErros(validarDadosLoja(dados));
  };

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const encontrados = validarDadosLoja(dados);
    setErros(encontrados);
    setTocados(
      Object.fromEntries(Object.keys(ROTULOS_LOJA).map((c) => [c, true])) as Record<
        keyof DadosLoja,
        boolean
      >,
    );

    if (Object.keys(encontrados).length > 0) {
      toast.error("Confira os campos destacados.");
      return;
    }
    salvar.mutate(dados);
  }

  return (
    <AdminShell
      titulo="Dados da loja"
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
      <p className="max-w-2xl text-sm text-muted-foreground">
        Estes dados entram como EMPRESA/VENDEDORA em todos os contratos. Preencha uma vez; os
        assistentes só mostram uma tela de conferência.
      </p>

      {isPending ? (
        <p className="mt-8 text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <form onSubmit={enviar} className="mt-8 max-w-3xl space-y-8" noValidate>
          <section className="space-y-4 rounded-lg border border-border bg-background p-5">
            <h2 className="font-display text-base font-semibold text-foreground">Identificação</h2>
            <CampoTexto
              rotulo={ROTULOS_LOJA.razao_social}
              valor={dados.razao_social}
              aoMudar={mudar("razao_social")}
              aoSair={sair("razao_social")}
              erro={erroDe("razao_social")}
            />
            <CpfCnpjInput
              rotulo={ROTULOS_LOJA.cnpj}
              tipo="cnpj"
              valor={dados.cnpj}
              aoMudar={mudar("cnpj")}
              aoSair={sair("cnpj")}
              erro={erroDe("cnpj")}
            />
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-background p-5">
            <h2 className="font-display text-base font-semibold text-foreground">Endereço</h2>
            <CampoTexto
              rotulo={ROTULOS_LOJA.endereco}
              ajuda="Rua, número, complemento e bairro."
              valor={dados.endereco}
              aoMudar={mudar("endereco")}
              aoSair={sair("endereco")}
              erro={erroDe("endereco")}
            />
            <div className="grid gap-4 sm:grid-cols-[1fr_7rem_10rem]">
              <CampoTexto
                rotulo={ROTULOS_LOJA.cidade}
                valor={dados.cidade}
                aoMudar={mudar("cidade")}
                aoSair={sair("cidade")}
                erro={erroDe("cidade")}
              />
              <div className="space-y-1.5">
                <label htmlFor="loja-uf" className="block text-sm font-medium text-foreground">
                  {ROTULOS_LOJA.uf}
                </label>
                <select
                  id="loja-uf"
                  value={dados.uf}
                  aria-invalid={Boolean(erroDe("uf"))}
                  onChange={(e) => mudar("uf")(e.target.value)}
                  onBlur={sair("uf")}
                  className={`min-h-11 w-full rounded-md border bg-background px-3 text-sm text-foreground ${
                    erroDe("uf") ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">—</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
                <p aria-live="polite" className="text-xs font-medium text-destructive">
                  {erroDe("uf") ?? ""}
                </p>
              </div>
              <CepInput
                rotulo={ROTULOS_LOJA.cep}
                valor={dados.cep}
                aoMudar={mudar("cep")}
                aoSair={sair("cep")}
                erro={erroDe("cep")}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-background p-5">
            <h2 className="font-display text-base font-semibold text-foreground">
              Contato e atendimento
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <PhoneInput
                rotulo={ROTULOS_LOJA.telefone}
                valor={dados.telefone}
                aoMudar={mudar("telefone")}
                aoSair={sair("telefone")}
                erro={erroDe("telefone")}
              />
              <CampoTexto
                rotulo={ROTULOS_LOJA.email}
                inputMode="email"
                valor={dados.email}
                aoMudar={mudar("email")}
                aoSair={sair("email")}
                erro={erroDe("email")}
              />
            </div>
            <CampoTexto
              rotulo={ROTULOS_LOJA.canal_atendimento}
              ajuda="Canal oficial citado nas cláusulas de garantia e reclamação. Ex.: WhatsApp (91) 90000-0000."
              valor={dados.canal_atendimento}
              aoMudar={mudar("canal_atendimento")}
              aoSair={sair("canal_atendimento")}
              erro={erroDe("canal_atendimento")}
            />
            <CampoTexto
              rotulo={ROTULOS_LOJA.endereco_atendimento}
              ajuda="Endereço informado ao cliente para acionar a garantia."
              valor={dados.endereco_atendimento}
              aoMudar={mudar("endereco_atendimento")}
              aoSair={sair("endereco_atendimento")}
              erro={erroDe("endereco_atendimento")}
            />
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-background p-5">
            <h2 className="font-display text-base font-semibold text-foreground">
              Representante legal
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoTexto
                rotulo={ROTULOS_LOJA.representante}
                valor={dados.representante}
                aoMudar={mudar("representante")}
                aoSair={sair("representante")}
                erro={erroDe("representante")}
              />
              <CpfCnpjInput
                rotulo={ROTULOS_LOJA.representante_cpf}
                tipo="cpf"
                valor={dados.representante_cpf}
                aoMudar={mudar("representante_cpf")}
                aoSair={sair("representante_cpf")}
                erro={erroDe("representante_cpf")}
              />
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={salvar.isPending}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              <Check size={16} strokeWidth={2} aria-hidden="true" />
              {salvar.isPending ? "Salvando…" : "Salvar dados da loja"}
            </button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
