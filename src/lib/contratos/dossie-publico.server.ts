import { defDoTipo, TIPOS_ANEXO, temPrevia } from "./anexos";
import { type ClienteContratos, type ResultadoAcesso } from "./database";
import { nomeDoAparelho, pendenciasDoDossie } from "./dossies";
import { sha256 } from "./hash";
import { type AnexoPublico, type RespostaDossiePublico } from "./dossie-publico";
import { anexoPodeSerPublicado, urlDoAnexoPublico } from "./acesso-anexo-publico";

/**
 * Tudo que a página pública /d/<token> faz do lado do servidor.
 *
 * Este módulo só existe no servidor (`.server.ts`, carregado por import
 * dinâmico dentro da server function). É aqui que mora a service role key, o
 * sal do hash de IP e o rate limit — nada disso pode chegar ao navegador.
 */

/** Formato do token gerado em token.ts: 32 caracteres base62. */
const TOKEN_VALIDO = /^[0-9A-Za-z]{24,64}$/;

/**
 * Janela curta, por instância do servidor: segura a rajada de um robô. O teto
 * é folgado de propósito — um funcionário conferindo etiquetas em série na
 * loja sai do mesmo IP e não pode esbarrar no limite.
 */
const JANELA_MS = 60_000;
const MAX_NA_JANELA = 20;

/** Janela longa, contada no banco: vale para todas as instâncias juntas. */
const JANELA_LONGA_MIN = 60;
const MAX_NA_JANELA_LONGA = 200;

// ---------------------------------------------------------------------------
// Identificação do visitante
// ---------------------------------------------------------------------------

/**
 * IP de quem pediu a página. `cf-connecting-ip` é o cabeçalho que a borda
 * escreve e o visitante não consegue forjar; os outros são o plano B de
 * ambientes sem Cloudflare na frente.
 */
function ipDaRequisicao(request: Request | undefined): string {
  const cabecalhos = request?.headers;
  if (!cabecalhos) return "sem-ip";

  const direto = cabecalhos.get("cf-connecting-ip") ?? cabecalhos.get("x-real-ip");
  if (direto) return direto.trim();

  const encadeado = cabecalhos.get("x-forwarded-for");
  if (encadeado) return (encadeado.split(",")[0] ?? "").trim() || "sem-ip";

  return "sem-ip";
}

/**
 * O IP puro nunca é gravado. O que vai para `dossie_acessos` é um SHA-256 do
 * IP com sal secreto — sem o sal, os quatro bilhões de IPv4 poderiam ser
 * testados um a um até casar o hash.
 */
async function hashDoIp(ip: string): Promise<string> {
  const sal = process.env["DOSSIE_IP_SALT"] ?? process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "guara";
  const digest = await sha256(new TextEncoder().encode(`${sal}|${ip}`));
  // Metade do hash já é mais do que suficiente para contar acessos.
  return digest.slice(0, 32);
}

// ---------------------------------------------------------------------------
// Rate limit
// ---------------------------------------------------------------------------

const janelas = new Map<string, number[]>();
const limitesRegistrados = new Map<string, number>();

function limparJanelas(agora: number): void {
  for (const [chave, marcas] of janelas) {
    if (marcas.every((t) => agora - t >= JANELA_MS)) janelas.delete(chave);
  }
  for (const [chave, quando] of limitesRegistrados) {
    if (agora - quando >= JANELA_MS) limitesRegistrados.delete(chave);
  }
}

/** Anota o acesso na janela curta e diz se o visitante passou do teto. */
function estourouJanelaCurta(ipHash: string): boolean {
  const agora = Date.now();
  const marcas = (janelas.get(ipHash) ?? []).filter((t) => agora - t < JANELA_MS);
  marcas.push(agora);
  janelas.set(ipHash, marcas);

  if (janelas.size > 5_000) limparJanelas(agora);

  return marcas.length > MAX_NA_JANELA;
}

/**
 * Evita encher `dossie_acessos` de linhas "limite": quem está em rajada gera
 * no máximo um registro por minuto.
 */
function deveRegistrarLimite(ipHash: string): boolean {
  const agora = Date.now();
  const ultimo = limitesRegistrados.get(ipHash);
  if (ultimo !== undefined && agora - ultimo < JANELA_MS) return false;
  limitesRegistrados.set(ipHash, agora);
  return true;
}

/** Teto da última hora, no banco: sobrevive a uma troca de instância. */
async function estourouJanelaLonga(admin: ClienteContratos, ipHash: string): Promise<boolean> {
  const desde = new Date(Date.now() - JANELA_LONGA_MIN * 60_000).toISOString();
  const { count, error } = await admin
    .from("dossie_acessos")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("acessado_em", desde);

  // Falha na contagem não pode derrubar a página: a janela curta segue de pé.
  if (error) return false;
  return (count ?? 0) >= MAX_NA_JANELA_LONGA;
}

// ---------------------------------------------------------------------------
// Registro de acesso
// ---------------------------------------------------------------------------

async function registrarAcesso(
  admin: ClienteContratos,
  dados: {
    dossieId: string | null;
    ipHash: string;
    userAgent: string | null;
    resultado: ResultadoAcesso;
  },
): Promise<void> {
  const { error } = await admin.from("dossie_acessos").insert({
    dossie_id: dados.dossieId,
    ip_hash: dados.ipHash,
    user_agent: dados.userAgent?.slice(0, 300) ?? null,
    resultado: dados.resultado,
  });
  // O log é auditoria, não é o produto: se falhar, a página ainda abre.
  if (error) console.error("[dossie] falha ao registrar acesso:", error.message);
}

// ---------------------------------------------------------------------------
// Montagem da página
// ---------------------------------------------------------------------------

/** Ordem dos blocos na página pública: a mesma da tela de anexos do painel. */
function ordemDoTipo(tipo: string): number {
  const i = TIPOS_ANEXO.findIndex((def) => def.tipo === tipo);
  return i === -1 ? TIPOS_ANEXO.length : i;
}

/**
 * Resolve o token do QR Code. Qualquer recusa — token malformado, inexistente,
 * desativado ou acima do limite de acessos — volta como `{ ok: false }`, para
 * que de fora não dê para distinguir um caso do outro.
 */
export async function resolverDossiePublico(
  token: string,
  request: Request | undefined,
): Promise<RespostaDossiePublico> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const admin = supabaseAdmin as unknown as ClienteContratos;

  const ipHash = await hashDoIp(ipDaRequisicao(request));
  const userAgent = request?.headers?.get("user-agent") ?? null;

  const negar = async (resultado: ResultadoAcesso, dossieId: string | null = null) => {
    await registrarAcesso(admin, { dossieId, ipHash, userAgent, resultado });
    return { ok: false as const };
  };

  // 1. Rate limit antes de qualquer consulta: quem está em rajada não chega
  //    nem a gastar uma leitura da tabela de dossiês.
  const curta = estourouJanelaCurta(ipHash);
  if (curta || (await estourouJanelaLonga(admin, ipHash))) {
    if (deveRegistrarLimite(ipHash)) {
      await registrarAcesso(admin, { dossieId: null, ipHash, userAgent, resultado: "limite" });
    }
    return { ok: false };
  }

  // 2. Formato do token, para barrar lixo antes de ir ao banco.
  if (!TOKEN_VALIDO.test(token)) return negar("token_invalido");

  const { data: dossie, error } = await admin
    .from("dossies")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("[dossie] falha ao consultar token:", error.message);
    return { ok: false };
  }
  if (!dossie) return negar("token_invalido");
  if (!dossie.token_ativo) return negar("token_desativado", dossie.id);

  // 3. Anexos, contratos e dados da loja. Os contratos entram só para o selo
  //    de completude: nada deles aparece na página.
  const [{ data: anexos }, { data: contratos }, { data: loja }] = await Promise.all([
    admin
      .from("contrato_anexos")
      .select("*")
      .eq("dossie_id", dossie.id)
      .order("criado_em", { ascending: true }),
    admin.from("contratos").select("*").eq("dossie_id", dossie.id),
    admin.from("loja_config").select("*").eq("id", true).maybeSingle(),
  ]);

  const idsContratos = (contratos ?? []).map((c) => c.id);
  const { data: etapas } = idsContratos.length
    ? await admin.from("contrato_etapas").select("*").in("contrato_id", idsContratos)
    : { data: [] };

  const completo =
    pendenciasDoDossie({
      dossie,
      anexos: anexos ?? [],
      contratos: (contratos ?? []).map((contrato) => ({
        ...contrato,
        etapas: (etapas ?? []).filter((e) => e.contrato_id === contrato.id),
      })),
    }).length === 0;

  // 4. Só o que a loja marcou como visível — e documento do cliente fica de
  //    fora mesmo que alguém tenha conseguido marcá-lo.
  const publicaveis = (anexos ?? [])
    .filter(anexoPodeSerPublicado)
    .sort((a, b) => ordemDoTipo(a.tipo) - ordemDoTipo(b.tipo));

  const publicados: AnexoPublico[] = publicaveis.flatMap((anexo) => {
    return [
      {
        id: anexo.id,
        rotulo: defDoTipo(anexo.tipo).rotulo,
        url: urlDoAnexoPublico(token, anexo.id),
        imagem: temPrevia(anexo.mime),
      },
    ];
  });

  await registrarAcesso(admin, { dossieId: dossie.id, ipHash, userAgent, resultado: "ok" });

  return {
    ok: true,
    dossie: {
      loja: {
        nome: loja?.razao_social ?? "",
        cnpj: loja?.cnpj ?? "",
        cidade: [loja?.cidade, loja?.uf].filter(Boolean).join(" / "),
        telefone: loja?.telefone ?? "",
        canal: loja?.canal_atendimento ?? "",
      },
      aparelho: {
        nome: nomeDoAparelho(dossie),
        modelo: dossie.modelo ?? "",
        cor: dossie.cor ?? "",
        capacidade: dossie.capacidade ?? "",
        imei: dossie.imei1 ?? "",
        serie: dossie.serie ?? "",
      },
      adquiridoEm: dossie.adquirido_em ?? "",
      completo,
      anexos: publicados,
    },
  };
}

