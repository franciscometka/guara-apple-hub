import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Exclusão de cadastro de cliente (pedidos de LGPD).
 * Remove o perfil e a conta de acesso. Só administradores podem chamar.
 */
export const excluirCadastroCliente = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => {
    if (!input?.id || typeof input.id !== "string") {
      throw new Error("Cadastro inválido.");
    }
    return { id: input.id };
  })
  .handler(async ({ data, context }) => {
    const { data: ehAdmin, error: erroAdmin } = await context.supabase.rpc(
      "eh_admin",
      { _user_id: context.userId },
    );
    if (erroAdmin || !ehAdmin) throw new Error("Acesso restrito.");

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    // Impede que um admin remova a própria conta ou de outro admin por engano.
    const { data: alvoEhAdmin } = await supabaseAdmin.rpc("eh_admin", {
      _user_id: data.id,
    });
    if (alvoEhAdmin) throw new Error("Contas da equipe não podem ser removidas aqui.");

    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("perfis").delete().eq("id", data.id);
    return { ok: true };
  });
