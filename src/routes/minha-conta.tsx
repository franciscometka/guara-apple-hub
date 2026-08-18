import {
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { supabase } from "@/integrations/supabase/client";
import { mensagemErroAuth, obterMeuPerfil, salvarMeuPerfil } from "@/lib/conta";

export const Route = createFileRoute("/minha-conta")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/entrar" });
  },
  head: () => ({
    meta: [
      { title: "Minha conta — Guara iPhones" },
      {
        name: "description",
        content:
          "Veja e atualize seus dados de contato na Guara iPhones: nome, telefone e e-mail.",
      },
      { property: "og:title", content: "Minha conta — Guara iPhones" },
      {
        property: "og:description",
        content: "Veja e atualize seus dados de contato na Guara iPhones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MinhaConta,
});

const campo =
  "mt-2 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

function MinhaConta() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: perfil, isPending } = useQuery({
    queryKey: ["meu-perfil"],
    queryFn: obterMeuPerfil,
  });

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!perfil) return;
    setNome(perfil.nome ?? "");
    setTelefone(perfil.telefone ?? "");
    setEmail(perfil.email ?? "");
  }, [perfil]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setSalvando(true);
    try {
      await salvarMeuPerfil({ nome, telefone, email });
      await queryClient.invalidateQueries({ queryKey: ["meu-perfil"] });
      setAviso("Dados atualizados.");
    } catch (erroCapturado) {
      setErro(mensagemErroAuth(erroCapturado));
    } finally {
      setSalvando(false);
    }
  }

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <section className="bg-background pt-28 pb-20 md:pt-36">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Minha conta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Seus dados de contato na Guara iPhones.
          </p>

          {isPending ? (
            <p className="mt-8 text-sm text-muted-foreground">Carregando…</p>
          ) : (
            <form onSubmit={salvar} className="mt-8">
              <label className="block text-sm font-medium text-foreground">
                Nome
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoComplete="name"
                  className={campo}
                />
              </label>
              <label className="mt-4 block text-sm font-medium text-foreground">
                Telefone
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  autoComplete="tel"
                  className={campo}
                />
              </label>
              <label className="mt-4 block text-sm font-medium text-foreground">
                E-mail de contato
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={campo}
                />
              </label>

              {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}
              {aviso && <p className="mt-4 text-sm text-violet-deep">{aviso}</p>}

              <button
                type="submit"
                disabled={salvando}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
              >
                {salvando ? "Salvando…" : "Salvar alterações"}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={sair}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
            Sair da conta
          </button>
        </div>
      </Container>
    </section>
  );
}
