import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { BUCKET_FOTOS } from "@/lib/produtos-shared";

// Cliente anônimo: a policy de RLS do bucket já libera SELECT público em
// storage.objects para produtos-fotos, então não precisa da service role key.
function clienteFotosPublico() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const Route = createFileRoute("/api/public/foto/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const caminho = (params as { _splat?: string })._splat ?? "";
        // Somente nomes simples de arquivo do bucket de fotos.
        if (!caminho || !/^[A-Za-z0-9._-]+$/.test(caminho)) {
          return new Response("Not found", { status: 404 });
        }

        const { data, error } = await clienteFotosPublico()
          .storage.from(BUCKET_FOTOS)
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
