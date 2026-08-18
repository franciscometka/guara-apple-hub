import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Sessão do cliente no site público (usada só para trocar o link do menu). */
export function useSessao() {
  const [logado, setLogado] = useState<boolean | null>(null);

  useEffect(() => {
    let ativo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (ativo) setLogado(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLogado(Boolean(session));
    });
    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return logado;
}
