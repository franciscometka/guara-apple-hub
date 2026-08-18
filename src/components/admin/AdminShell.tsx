import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Package } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AdminShell({
  titulo,
  acoes,
  children,
}: {
  titulo: string;
  acoes?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 font-display text-base font-semibold text-foreground"
          >
            <Package size={18} strokeWidth={1.5} aria-hidden="true" />
            Painel Guara iPhones
          </Link>
          <button
            type="button"
            onClick={sair}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-violet hover:text-violet-deep"
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden="true" />
            Sair
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {titulo}
          </h1>
          {acoes}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
