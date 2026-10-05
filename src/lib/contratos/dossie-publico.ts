/**
 * Contrato de dados entre a server function que valida o token do QR Code e a
 * página pública /d/<token>.
 *
 * Só tipos e constantes puras: este arquivo é importado pela página pública,
 * que não pode arrastar nada do painel nem do Supabase para o navegador.
 */

/** Um anexo liberado para a página pública, já com link assinado. */
export interface AnexoPublico {
  id: string;
  /** "Nota fiscal de entrada", "Foto do IMEI"… */
  rotulo: string;
  /** Link assinado, válido por MINUTOS_DO_LINK minutos. */
  url: string;
  /** Dá para mostrar como miniatura? (PDF e HEIC não dão.) */
  imagem: boolean;
}

export interface LojaPublica {
  nome: string;
  cnpj: string;
  cidade: string;
  telefone: string;
  canal: string;
}

export interface AparelhoPublico {
  /** "iPhone 15 Pro 256 GB Titânio Natural" */
  nome: string;
  modelo: string;
  cor: string;
  capacidade: string;
  imei: string;
  serie: string;
}

export interface DossiePublico {
  loja: LojaPublica;
  aparelho: AparelhoPublico;
  /** ISO curto (YYYY-MM-DD) ou vazio. */
  adquiridoEm: string;
  /** Selo verde: nota fiscal, as três fotos, IMEI e contrato assinado. */
  completo: boolean;
  anexos: AnexoPublico[];
}

/**
 * Token inexistente, desativado, malformado ou acima do limite de acessos
 * devolvem exatamente o mesmo `{ ok: false }`: de fora não dá para distinguir
 * um token que nunca existiu de um que a loja desativou.
 */
export type RespostaDossiePublico = { ok: true; dossie: DossiePublico } | { ok: false };

/** Validade dos links assinados dos anexos. */
export const MINUTOS_DO_LINK = 10;

/** A única mensagem que a página pública dá quando não entrega o dossiê. */
export const INDISPONIVEL = "Documentação indisponível";

export const DETALHE_INDISPONIVEL =
  "Esse código não abre nenhuma documentação. Confira se o QR Code foi lido por inteiro e, " +
  "se a dúvida continuar, fale direto com a loja.";
