import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Complementa os tipos gerados do Supabase com as tabelas do módulo de
 * contratos, até a próxima sincronização do schema — mesmo padrão já usado em
 * `src/lib/database-extensions.ts` para `produto_fotos`.
 */

export type StatusContrato = "rascunho" | "pdf_gerado" | "assinado" | "arquivado" | "cancelado";

export type EtapaContrato = "principal" | "entrega" | "diagnostico" | "conclusao";

export type OrigemDossie = "venda" | "assistencia" | "upgrade_entrada" | "upgrade_venda";

export type TipoAnexo =
  | "nota_fiscal_entrada"
  | "foto_frente"
  | "foto_traseira"
  | "foto_imei"
  | "contrato_assinado"
  | "documento_pessoal"
  | "outro";

export type ResultadoAcesso = "ok" | "token_invalido" | "token_desativado" | "limite";

export type LojaConfigRow = {
  id: boolean;
  razao_social: string | null;
  cnpj: string | null;
  endereco: string | null;
  cidade: string | null;
  uf: string | null;
  cep: string | null;
  telefone: string | null;
  email: string | null;
  representante: string | null;
  representante_cpf: string | null;
  canal_atendimento: string | null;
  endereco_atendimento: string | null;
  logo_path: string | null;
  atualizado_em: string;
};

export type DossieRow = {
  id: string;
  token: string;
  token_ativo: boolean;
  produto_id: string | null;
  marca: string | null;
  modelo: string | null;
  cor: string | null;
  capacidade: string | null;
  imei1: string | null;
  imei2: string | null;
  serie: string | null;
  origem: OrigemDossie;
  adquirido_em: string | null;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
};

export type ContratoRow = {
  id: string;
  numero: string;
  dossie_id: string | null;
  modelo_slug: string;
  modelo_versao: string;
  status: StatusContrato;
  cliente_nome: string | null;
  cliente_cpf: string | null;
  substitui_contrato_id: string | null;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
  assinado_em: string | null;
  cancelado_em: string | null;
};

export type ContratoEtapaRow = {
  id: string;
  contrato_id: string;
  etapa: EtapaContrato;
  status: StatusContrato;
  dados: Json;
  passo_atual: number;
  pdf_path: string | null;
  pdf_sha256: string | null;
  assinado_path: string | null;
  gerado_em: string | null;
  assinado_em: string | null;
  criado_em: string;
  atualizado_em: string;
};

export type ContratoAnexoRow = {
  id: string;
  dossie_id: string;
  contrato_id: string | null;
  tipo: TipoAnexo;
  path: string;
  nome_original: string;
  mime: string | null;
  tamanho: number | null;
  visivel_publico: boolean;
  criado_por: string | null;
  criado_em: string;
};

export type DossieAcessoRow = {
  id: string;
  dossie_id: string | null;
  acessado_em: string;
  ip_hash: string | null;
  user_agent: string | null;
  resultado: ResultadoAcesso;
};

/** Row + Insert/Update derivados, no formato que o supabase-js espera. */
type Tabela<Linha, Obrigatorios extends keyof Linha = never> = {
  Row: Linha;
  Insert: Partial<Linha> & Pick<Linha, Obrigatorios>;
  Update: Partial<Linha>;
  Relationships: [];
};

export type DatabaseContratos = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables" | "Functions"> & {
    Tables: Database["public"]["Tables"] & {
      loja_config: Tabela<LojaConfigRow>;
      dossies: Tabela<DossieRow, "token" | "origem">;
      contratos: Tabela<ContratoRow, "modelo_slug" | "modelo_versao">;
      contrato_etapas: Tabela<ContratoEtapaRow, "contrato_id" | "etapa">;
      contrato_anexos: Tabela<ContratoAnexoRow, "dossie_id" | "tipo" | "path" | "nome_original">;
      dossie_acessos: Tabela<DossieAcessoRow, "resultado">;
    };
    Functions: Database["public"]["Functions"] & {
      proximo_numero: {
        Args: { _escopo: "contrato" | "os" };
        Returns: string;
      };
    };
  };
};

export type ClienteContratos = SupabaseClient<DatabaseContratos>;

/** O mesmo cliente do painel, apenas com os tipos das tabelas de contrato. */
export const db = supabase as unknown as ClienteContratos;

/** Bucket privado onde ficam PDFs, notas fiscais e fotos dos dossiês. */
export const BUCKET_CONTRATOS = "contratos";

/** Limite por arquivo, igual ao configurado no bucket. */
export const LIMITE_ARQUIVO_BYTES = 80 * 1024 * 1024;
