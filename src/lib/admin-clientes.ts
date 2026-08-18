import { supabase } from "@/integrations/supabase/client";
import type { Perfil } from "./conta";

export async function listarPerfis(): Promise<Perfil[]> {
  const { data, error } = await supabase
    .from("perfis")
    .select("id, nome, telefone, email, criado_em")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
