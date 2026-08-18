import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Roda no cliente (rotas /admin usam ssr: false).
 * Além de exigir sessão, checa se a conta está na lista de administradores.
 * A autorização real é garantida pelas regras de acesso do banco (RLS).
 */
export async function exigirSessaoAdmin() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect({ to: "/admin/login" });

  const { data: ehAdmin } = await supabase.rpc("eh_admin", {
    _user_id: data.user.id,
  });
  if (!ehAdmin) throw redirect({ to: "/admin/login", search: { negado: true } });

  return { user: data.user };
}

export async function contaEhAdmin(): Promise<boolean> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const { data: ehAdmin } = await supabase.rpc("eh_admin", {
    _user_id: data.user.id,
  });
  return Boolean(ehAdmin);
}
