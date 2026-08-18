import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/** Roda no cliente (rotas /admin usam ssr: false). */
export async function exigirSessaoAdmin() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect({ to: "/admin/login" });
  return { user: data.user };
}
