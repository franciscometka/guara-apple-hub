import {
  BUCKET_CONTRATOS,
  db,
  LIMITE_ARQUIVO_BYTES,
  type ContratoAnexoRow,
  type TipoAnexo,
} from "./database";
import { ERROS } from "./validadores";
import { mimeDe } from "./arquivo";
export { mimeDe } from "./arquivo";

/**
 * Anexos do dossiê: nota fiscal de entrada, fotos do aparelho e documentos
 * soltos. Tudo vai para o bucket privado `contratos`; quem decide o que a
 * página do QR mostra é a coluna `visivel_publico`, anexo por anexo.
 */

export const MIME_IMAGEM = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const MIME_DOCUMENTO = ["application/pdf", ...MIME_IMAGEM] as const;

/** Formatos que o navegador não desenha em <img>, mas que aceitamos guardar. */
const SEM_PREVIA = ["image/heic", "image/heif"];

export interface DefTipoAnexo {
  tipo: TipoAnexo;
  rotulo: string;
  ajuda: string;
  /** MIME types aceitos; vira também o `accept` do input. */
  aceita: readonly string[];
  /** Mais de um arquivo do mesmo tipo? (fotos avulsas, documentos) */
  multiplos: boolean;
  /** Conta para o selo "dossiê completo". */
  exigido: boolean;
  /** Já nasce visível na página do QR Code. */
  publicoPorPadrao: boolean;
}

/**
 * A ordem desta lista é a ordem dos blocos na tela do dossiê — e também a
 * ordem em que a página pública lista os documentos.
 */
export const TIPOS_ANEXO: readonly DefTipoAnexo[] = [
  {
    tipo: "nota_fiscal_entrada",
    rotulo: "Nota fiscal de entrada",
    ajuda: "A nota que comprova a origem legal do aparelho. PDF ou foto legível.",
    aceita: MIME_DOCUMENTO,
    multiplos: false,
    exigido: true,
    publicoPorPadrao: true,
  },
  {
    tipo: "foto_frente",
    rotulo: "Foto da frente",
    ajuda: "Tela ligada, aparelho inteiro no quadro.",
    aceita: MIME_IMAGEM,
    multiplos: false,
    exigido: true,
    publicoPorPadrao: true,
  },
  {
    tipo: "foto_traseira",
    rotulo: "Foto da traseira",
    ajuda: "Traseira inteira, mostrando marcas e estado real.",
    aceita: MIME_IMAGEM,
    multiplos: false,
    exigido: true,
    publicoPorPadrao: true,
  },
  {
    tipo: "foto_imei",
    rotulo: "Foto do IMEI",
    ajuda: "Tela de *#06# ou a gravação na bandeja. O número tem que estar legível.",
    aceita: MIME_IMAGEM,
    multiplos: false,
    exigido: true,
    publicoPorPadrao: true,
  },
  {
    tipo: "contrato_assinado",
    rotulo: "Contrato assinado (avulso)",
    ajuda:
      "Só para papéis que não saíram do assistente. O assinado de cada etapa já fica no contrato.",
    aceita: MIME_DOCUMENTO,
    multiplos: true,
    exigido: false,
    publicoPorPadrao: false,
  },
  {
    tipo: "documento_pessoal",
    rotulo: "Documento do cliente",
    ajuda: "RG, CNH ou comprovante. Nunca fica visível na página do QR Code.",
    aceita: MIME_DOCUMENTO,
    multiplos: true,
    exigido: false,
    publicoPorPadrao: false,
  },
  {
    tipo: "outro",
    rotulo: "Outros arquivos",
    ajuda: "Laudos, prints de conversa, comprovantes de pagamento.",
    aceita: MIME_DOCUMENTO,
    multiplos: true,
    exigido: false,
    publicoPorPadrao: false,
  },
];

export const defDoTipo = (tipo: TipoAnexo): DefTipoAnexo =>
  TIPOS_ANEXO.find((t) => t.tipo === tipo) ?? {
    tipo,
    rotulo: tipo,
    ajuda: "",
    aceita: MIME_DOCUMENTO,
    multiplos: true,
    exigido: false,
    publicoPorPadrao: false,
  };

/** Documento pessoal nunca vai para a página pública, nem por engano. */
export const PODE_SER_PUBLICO = (tipo: TipoAnexo): boolean => tipo !== "documento_pessoal";

export const temPrevia = (mime: string | null): boolean =>
  mime !== null && mime.startsWith("image/") && !SEM_PREVIA.includes(mime);

const EXTENSAO_POR_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

const extensaoDoNome = (nome: string): string => (nome.split(".").pop() ?? "").toLowerCase();

/** Extensão a partir do MIME, com o nome original como segunda opção. */
function extensaoDe(arquivo: File): string {
  const porMime = EXTENSAO_POR_MIME[mimeDe(arquivo)];
  if (porMime) return porMime;
  const doNome = extensaoDoNome(arquivo.name);
  return /^[a-z0-9]{1,5}$/.test(doNome) ? doNome : "bin";
}

/** Mensagem de recusa, ou `null` quando o arquivo serve. */
export function validarArquivo(def: DefTipoAnexo, arquivo: File): string | null {
  if (arquivo.size === 0) return "Esse arquivo está vazio.";
  if (arquivo.size > LIMITE_ARQUIVO_BYTES) return ERROS.arquivoGrande;

  const mime = mimeDe(arquivo);
  if (!mime || !def.aceita.includes(mime)) {
    const soImagem = !def.aceita.includes("application/pdf");
    return soImagem
      ? "Aqui vai uma foto (JPG, PNG, WEBP ou HEIC)."
      : "Formato não aceito. Envie PDF ou foto (JPG, PNG, WEBP, HEIC).";
  }
  return null;
}

/** Tamanho em texto curto, para a linha de cada anexo. */
export function tamanhoLegivel(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

export async function listarAnexos(dossieId: string): Promise<ContratoAnexoRow[]> {
  const { data, error } = await db
    .from("contrato_anexos")
    .select("*")
    .eq("dossie_id", dossieId)
    .order("criado_em", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export interface EnvioDeAnexo {
  dossieId: string;
  tipo: TipoAnexo;
  arquivo: File;
  contratoId?: string | null;
  /** Anexo único: o anterior é substituído em vez de acumular. */
  substituir?: ContratoAnexoRow | undefined;
}

/**
 * Sobe o arquivo e registra a linha. O arquivo vai com o nome sorteado — o
 * nome original fica no banco, porque nome de arquivo de celular costuma vir
 * com acento e espaço.
 */
export async function enviarAnexo(envio: EnvioDeAnexo): Promise<ContratoAnexoRow> {
  const def = defDoTipo(envio.tipo);
  const recusa = validarArquivo(def, envio.arquivo);
  if (recusa) throw new Error(recusa);

  const nome = `${crypto.randomUUID()}.${extensaoDe(envio.arquivo)}`;
  const caminho = `dossies/${envio.dossieId}/anexos/${envio.tipo}/${nome}`;

  const mime = mimeDe(envio.arquivo);
  const { error: erroUpload } = await db.storage
    .from(BUCKET_CONTRATOS)
    .upload(caminho, envio.arquivo, {
      contentType: mime || "application/octet-stream",
      upsert: false,
    });
  if (erroUpload) throw erroUpload;

  const { data: usuario } = await db.auth.getUser();
  const { data, error } = await db
    .from("contrato_anexos")
    .insert({
      dossie_id: envio.dossieId,
      contrato_id: envio.contratoId ?? null,
      tipo: envio.tipo,
      path: caminho,
      nome_original: envio.arquivo.name.slice(0, 200),
      mime: mime || null,
      tamanho: envio.arquivo.size,
      visivel_publico: def.publicoPorPadrao && PODE_SER_PUBLICO(envio.tipo),
      criado_por: usuario.user?.id ?? null,
    })
    .select("*")
    .single();

  if (error) {
    // A linha não entrou: não deixa o arquivo órfão no bucket.
    await db.storage.from(BUCKET_CONTRATOS).remove([caminho]);
    throw error;
  }

  if (envio.substituir) await removerAnexo(envio.substituir);
  return data;
}

/** Apaga o registro e o arquivo. O registro primeiro: é o que a tela lê. */
export async function removerAnexo(anexo: ContratoAnexoRow): Promise<void> {
  const { error } = await db.from("contrato_anexos").delete().eq("id", anexo.id);
  if (error) throw error;
  await db.storage.from(BUCKET_CONTRATOS).remove([anexo.path]);
}

export async function definirVisibilidade(
  anexo: ContratoAnexoRow,
  visivel: boolean,
): Promise<void> {
  if (visivel && !PODE_SER_PUBLICO(anexo.tipo)) {
    throw new Error("Documento pessoal não pode aparecer na página do QR Code.");
  }
  const { error } = await db
    .from("contrato_anexos")
    .update({ visivel_publico: visivel })
    .eq("id", anexo.id);
  if (error) throw error;
}

/** URL temporária para mostrar a miniatura sem baixar o arquivo inteiro. */
export async function urlAssinada(caminho: string, segundos = 600): Promise<string> {
  const { data, error } = await db.storage
    .from(BUCKET_CONTRATOS)
    .createSignedUrl(caminho, segundos);
  if (error) throw error;
  return data.signedUrl;
}

export async function baixarAnexo(anexo: ContratoAnexoRow): Promise<Blob> {
  const { data, error } = await db.storage.from(BUCKET_CONTRATOS).download(anexo.path);
  if (error) throw error;
  return data;
}

/** Tipos exigidos que ainda não têm arquivo. */
export function pendenciasDeAnexo(anexos: Pick<ContratoAnexoRow, "tipo">[]): DefTipoAnexo[] {
  return TIPOS_ANEXO.filter((def) => def.exigido && !anexos.some((a) => a.tipo === def.tipo));
}

export const anexosCompletos = (anexos: Pick<ContratoAnexoRow, "tipo">[]): boolean =>
  pendenciasDeAnexo(anexos).length === 0;

export const anexosDoTipo = (anexos: ContratoAnexoRow[], tipo: TipoAnexo): ContratoAnexoRow[] =>
  anexos.filter((a) => a.tipo === tipo);
