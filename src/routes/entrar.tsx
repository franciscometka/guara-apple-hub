import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { cadastrarCliente, entrarCliente, entrarComGoogle, mensagemErroAuth } from "@/lib/conta";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — Guara iPhones" },
      {
        name: "description",
        content:
          "Acesse sua conta na Guara iPhones ou crie um cadastro rápido com nome, telefone e e-mail. Navegar no site não exige login.",
      },
      { property: "og:title", content: "Entrar ou criar conta — Guara iPhones" },
      {
        property: "og:description",
        content:
          "Acesse sua conta na Guara iPhones ou crie um cadastro rápido com nome, telefone e e-mail.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EntrarPage,
});

const campo =
  "mt-2 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

function EntrarPage() {
  const navigate = useNavigate();
  const [aba, setAba] = useState<"entrar" | "cadastro">("entrar");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function trocarAba(nova: "entrar" | "cadastro") {
    setAba(nova);
    setErro(null);
    setAviso(null);
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setEnviando(true);
    try {
      if (aba === "entrar") {
        await entrarCliente(email, senha);
        navigate({ to: "/minha-conta", replace: true });
      } else {
        const { precisaConfirmar } = await cadastrarCliente({
          nome,
          telefone,
          email,
          senha,
        });
        if (precisaConfirmar) {
          setAviso("Cadastro criado! Confirme o link que enviamos no seu e-mail para entrar.");
        } else {
          navigate({ to: "/minha-conta", replace: true });
        }
      }
    } catch (erroCapturado) {
      setErro(mensagemErroAuth(erroCapturado));
    } finally {
      setEnviando(false);
    }
  }

  async function google() {
    setErro(null);
    setAviso(null);
    try {
      await entrarComGoogle();
    } catch (erroCapturado) {
      setErro(mensagemErroAuth(erroCapturado));
    }
  }

  return (
    <section className="bg-background pt-28 pb-20 md:pt-36">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            {aba === "entrar" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A conta é opcional — você pode navegar e comprar pelo WhatsApp sem cadastro.
          </p>

          <div
            role="tablist"
            aria-label="Entrar ou criar conta"
            className="mt-8 flex rounded-full border border-border p-1"
          >
            {(["entrar", "cadastro"] as const).map((valor) => (
              <button
                key={valor}
                type="button"
                role="tab"
                aria-selected={aba === valor}
                onClick={() => trocarAba(valor)}
                className={`min-h-11 flex-1 rounded-full text-sm font-semibold transition-colors ${
                  aba === valor
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {valor === "entrar" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={enviar} className="mt-8">
            {aba === "cadastro" && (
              <>
                <label className="block text-sm font-medium text-foreground">
                  Nome
                  <input
                    required
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={campo}
                  />
                </label>
                <label className="mt-4 block text-sm font-medium text-foreground">
                  Telefone
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="(42) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={campo}
                  />
                </label>
              </>
            )}

            <label
              className={`block text-sm font-medium text-foreground ${
                aba === "cadastro" ? "mt-4" : ""
              }`}
            >
              E-mail
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={campo}
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-foreground">
              Senha
              <input
                required
                type="password"
                minLength={6}
                autoComplete={aba === "entrar" ? "current-password" : "new-password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={campo}
              />
            </label>

            {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}
            {aviso && <p className="mt-4 text-sm text-violet-deep">{aviso}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
            >
              {enviando ? "Enviando…" : aba === "entrar" ? "Entrar" : "Criar minha conta"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={google}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet"
          >
            <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.8 6.1C12.2 13.2 17.6 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8.3h12.9c-.3 2.1-1.7 5.3-4.9 7.4l7.6 5.9c4.5-4.2 6.9-10.3 6.9-17.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.3 28.7A14.6 14.6 0 019.5 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 000 24c0 3.9.9 7.5 2.5 10.8l7.8-6.1z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 11.9-2.1 15.6-5.9l-7.6-5.9c-2 1.4-4.7 2.4-8 2.4-6.4 0-11.8-3.7-13.7-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
              />
            </svg>
            Entrar com Google
          </button>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Coletamos apenas nome, telefone e e-mail.{" "}
            <Link to="/" className="underline hover:text-foreground">
              Voltar pro início
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
