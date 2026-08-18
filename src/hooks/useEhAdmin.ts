import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Indica se a conta logada está na lista de administradores.
 * Serve só para mostrar/esconder atalhos na interface — a proteção real das
 * rotas e dos dados continua sendo feita pelo guard e pelas regras do banco.
 */
export function useEhAdmin(): boolean {
  const [ehAdmin, setEhAdmin] = useState(false);

  useEffect(() => {
    let ativo = true;

    function checar(userId: string | undefined) {
      if (!userId) {
        if (ativo) setEhAdmin(false);
        return;
      }
      supabase.rpc("eh_admin", { _user_id: userId }).then(({ data }) => {
        if (ativo) setEhAdmin(Boolean(data));
      });
    }

    supabase.auth.getSession().then(({ data }) => {
      checar(data.session?.user.id);
    });

    // Callback não-async de propósito: aguardar chamadas do Supabase aqui
    // dentro pode travar o cliente de auth.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      checar(session?.user.id);
    });

    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return ehAdmin;
}
