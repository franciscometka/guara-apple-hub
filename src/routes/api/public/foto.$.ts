import { createFileRoute } from "@tanstack/react-router";
import { BUCKET_FOTOS } from "@/lib/produtos-shared";

export const Route = createFileRoute("/api/public/foto/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const caminho = (params as { _splat?: string })._splat ?? "";
        // Somente nomes simples de arquivo do bucket de fotos.
        if (!caminho || !/^[A-Za-z0-9._-]+$/.test(caminho)) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { data, error } = await supabaseAdmin.storage
          .from(BUCKET_FOTOS)
          .download(caminho);

        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "image/webp",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
