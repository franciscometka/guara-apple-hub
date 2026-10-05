import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { RespostaDossiePublico } from "./dossie-publico";

/**
 * Porta de entrada da página pública /d/<token>.
 *
 * Nada de validação de token acontece no navegador: a função roda no servidor,
 * carrega o módulo com a service role key por import dinâmico e devolve só o
 * que pode ser mostrado — já com os links assinados de 10 minutos.
 */
export const consultarDossiePublico = createServerFn({ method: "GET" })
  .inputValidator((token: unknown) => (typeof token === "string" ? token.slice(0, 80) : ""))
  .handler(async ({ data }): Promise<RespostaDossiePublico> => {
    // Lido antes de qualquer await: é daqui que saem o IP e o user agent.
    const request = getRequest();

    const { resolverDossiePublico } = await import("./dossie-publico.server");

    try {
      return await resolverDossiePublico(data, request);
    } catch (erro) {
      // Página pública não mostra defeito interno: cai na mesma mensagem
      // genérica de token inválido.
      console.error("[dossie] falha ao abrir a página pública:", erro);
      return { ok: false };
    }
  });
