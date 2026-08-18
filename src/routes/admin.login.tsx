import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [
      { title: "Entrar no painel — Guara iPhones" },
      {
        name: "description",
        content: "Acesso restrito ao painel administrativo da Guara iPhones.",
      },
      { property: "og:title", content: "Entrar no painel — Guara iPhones" },
      {
        property: "og:description",
        content: "Acesso restrito ao painel administrativo da Guara iPhones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });
    setEnviando(false);
    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-soft"
      >
        <h1 className="font-display text-xl font-semibold text-foreground">
          Painel Guara iPhones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesso restrito à equipe.
        </p>

        <label className="mt-6 block text-sm font-medium text-foreground">
          E-mail
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-foreground">
          Senha
          <input
            type="password"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
          />
        </label>

        {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
