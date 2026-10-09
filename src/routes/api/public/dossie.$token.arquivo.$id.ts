import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/dossie/$token/arquivo/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const indisponivel = () => new Response("Arquivo indisponível", {
          status: 404, headers: { "cache-control": "no-store" },
        });
        try {
          const { resolverDossiePublico } = await import("@/lib/contratos/dossie-publico.server");
          const { getRequest } = await import("@tanstack/react-start/server");
          // A mesma validação de token, visibilidade, limite e auditoria da página.
          const resposta = await resolverDossiePublico(params.token, getRequest());
          if (!resposta.ok || !resposta.dossie.anexos.some((a) => a.id === params.id)) return indisponivel();
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: anexo } = await supabaseAdmin.from("contrato_anexos")
            .select("path, mime, nome_original, visivel_publico, tipo")
            .eq("id", params.id).eq("visivel_publico", true).neq("tipo", "documento_pessoal").maybeSingle();
          if (!anexo) return indisponivel();
          const { data, error } = await supabaseAdmin.storage.from("contratos").download(anexo.path);
          if (error || !data) return indisponivel();
          return new Response(data, { headers: {
            "content-type": anexo.mime || data.type || "application/octet-stream",
            "content-disposition": `inline; filename*=UTF-8''${encodeURIComponent(anexo.nome_original)}`,
            "cache-control": "private, no-store",
            "x-content-type-options": "nosniff",
          } });
        } catch {
          return indisponivel();
        }
      },
    },
  },
});