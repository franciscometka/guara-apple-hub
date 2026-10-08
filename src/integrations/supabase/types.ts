export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          criado_em: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          user_id: string
        }
        Update: {
          criado_em?: string
          user_id?: string
        }
        Relationships: []
      }
      contrato_anexos: {
        Row: {
          contrato_id: string | null
          criado_em: string
          criado_por: string | null
          dossie_id: string
          id: string
          mime: string | null
          nome_original: string
          path: string
          tamanho: number | null
          tipo: string
          visivel_publico: boolean
        }
        Insert: {
          contrato_id?: string | null
          criado_em?: string
          criado_por?: string | null
          dossie_id: string
          id?: string
          mime?: string | null
          nome_original: string
          path: string
          tamanho?: number | null
          tipo: string
          visivel_publico?: boolean
        }
        Update: {
          contrato_id?: string | null
          criado_em?: string
          criado_por?: string | null
          dossie_id?: string
          id?: string
          mime?: string | null
          nome_original?: string
          path?: string
          tamanho?: number | null
          tipo?: string
          visivel_publico?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "contrato_anexos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrato_anexos_dossie_id_fkey"
            columns: ["dossie_id"]
            isOneToOne: false
            referencedRelation: "dossies"
            referencedColumns: ["id"]
          },
        ]
      }
      contrato_etapas: {
        Row: {
          assinado_em: string | null
          assinado_path: string | null
          atualizado_em: string
          contrato_id: string
          criado_em: string
          dados: Json
          etapa: string
          gerado_em: string | null
          id: string
          passo_atual: number
          pdf_path: string | null
          pdf_sha256: string | null
          status: string
        }
        Insert: {
          assinado_em?: string | null
          assinado_path?: string | null
          atualizado_em?: string
          contrato_id: string
          criado_em?: string
          dados?: Json
          etapa: string
          gerado_em?: string | null
          id?: string
          passo_atual?: number
          pdf_path?: string | null
          pdf_sha256?: string | null
          status?: string
        }
        Update: {
          assinado_em?: string | null
          assinado_path?: string | null
          atualizado_em?: string
          contrato_id?: string
          criado_em?: string
          dados?: Json
          etapa?: string
          gerado_em?: string | null
          id?: string
          passo_atual?: number
          pdf_path?: string | null
          pdf_sha256?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrato_etapas_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      contrato_numeracao: {
        Row: {
          ano: number
          escopo: string
          ultimo: number
        }
        Insert: {
          ano: number
          escopo: string
          ultimo?: number
        }
        Update: {
          ano?: number
          escopo?: string
          ultimo?: number
        }
        Relationships: []
      }
      contratos: {
        Row: {
          assinado_em: string | null
          atualizado_em: string
          cancelado_em: string | null
          cliente_cpf: string | null
          cliente_nome: string | null
          criado_em: string
          criado_por: string | null
          dossie_id: string | null
          id: string
          modelo_slug: string
          modelo_versao: string
          numero: string
          status: string
          substitui_contrato_id: string | null
        }
        Insert: {
          assinado_em?: string | null
          atualizado_em?: string
          cancelado_em?: string | null
          cliente_cpf?: string | null
          cliente_nome?: string | null
          criado_em?: string
          criado_por?: string | null
          dossie_id?: string | null
          id?: string
          modelo_slug: string
          modelo_versao: string
          numero?: string
          status?: string
          substitui_contrato_id?: string | null
        }
        Update: {
          assinado_em?: string | null
          atualizado_em?: string
          cancelado_em?: string | null
          cliente_cpf?: string | null
          cliente_nome?: string | null
          criado_em?: string
          criado_por?: string | null
          dossie_id?: string | null
          id?: string
          modelo_slug?: string
          modelo_versao?: string
          numero?: string
          status?: string
          substitui_contrato_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_dossie_id_fkey"
            columns: ["dossie_id"]
            isOneToOne: false
            referencedRelation: "dossies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_substitui_contrato_id_fkey"
            columns: ["substitui_contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      dossie_acessos: {
        Row: {
          acessado_em: string
          dossie_id: string | null
          id: string
          ip_hash: string | null
          resultado: string
          user_agent: string | null
        }
        Insert: {
          acessado_em?: string
          dossie_id?: string | null
          id?: string
          ip_hash?: string | null
          resultado: string
          user_agent?: string | null
        }
        Update: {
          acessado_em?: string
          dossie_id?: string | null
          id?: string
          ip_hash?: string | null
          resultado?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dossie_acessos_dossie_id_fkey"
            columns: ["dossie_id"]
            isOneToOne: false
            referencedRelation: "dossies"
            referencedColumns: ["id"]
          },
        ]
      }
      dossies: {
        Row: {
          adquirido_em: string | null
          atualizado_em: string
          capacidade: string | null
          cor: string | null
          criado_em: string
          criado_por: string | null
          id: string
          imei1: string | null
          imei2: string | null
          marca: string | null
          modelo: string | null
          origem: string
          produto_id: string | null
          serie: string | null
          token: string
          token_ativo: boolean
        }
        Insert: {
          adquirido_em?: string | null
          atualizado_em?: string
          capacidade?: string | null
          cor?: string | null
          criado_em?: string
          criado_por?: string | null
          id?: string
          imei1?: string | null
          imei2?: string | null
          marca?: string | null
          modelo?: string | null
          origem: string
          produto_id?: string | null
          serie?: string | null
          token: string
          token_ativo?: boolean
        }
        Update: {
          adquirido_em?: string | null
          atualizado_em?: string
          capacidade?: string | null
          cor?: string | null
          criado_em?: string
          criado_por?: string | null
          id?: string
          imei1?: string | null
          imei2?: string | null
          marca?: string | null
          modelo?: string | null
          origem?: string
          produto_id?: string | null
          serie?: string | null
          token?: string
          token_ativo?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "dossies_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      loja_config: {
        Row: {
          atualizado_em: string
          canal_atendimento: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          email: string | null
          endereco: string | null
          endereco_atendimento: string | null
          id: boolean
          logo_path: string | null
          razao_social: string | null
          representante: string | null
          representante_cpf: string | null
          telefone: string | null
          uf: string | null
        }
        Insert: {
          atualizado_em?: string
          canal_atendimento?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          email?: string | null
          endereco?: string | null
          endereco_atendimento?: string | null
          id?: boolean
          logo_path?: string | null
          razao_social?: string | null
          representante?: string | null
          representante_cpf?: string | null
          telefone?: string | null
          uf?: string | null
        }
        Update: {
          atualizado_em?: string
          canal_atendimento?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          email?: string | null
          endereco?: string | null
          endereco_atendimento?: string | null
          id?: boolean
          logo_path?: string | null
          razao_social?: string | null
          representante?: string | null
          representante_cpf?: string | null
          telefone?: string | null
          uf?: string | null
        }
        Relationships: []
      }
      perfis: {
        Row: {
          atualizado_em: string
          criado_em: string
          email: string | null
          id: string
          nome: string | null
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          email?: string | null
          id: string
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean
          atualizado_em: string
          bateria: number | null
          categoria: string
          condicao: string
          cor: string | null
          criado_em: string
          destaque: boolean
          detalhe: string | null
          em_estoque: boolean
          em_promocao: boolean
          id: string
          imagem_url: string | null
          nome: string
          preco: number | null
          preco_promocional: number | null
          sku: string | null
          slug: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          bateria?: number | null
          categoria: string
          condicao: string
          cor?: string | null
          criado_em?: string
          destaque?: boolean
          detalhe?: string | null
          em_estoque?: boolean
          em_promocao?: boolean
          id?: string
          imagem_url?: string | null
          nome: string
          preco?: number | null
          preco_promocional?: number | null
          sku?: string | null
          slug: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          bateria?: number | null
          categoria?: string
          condicao?: string
          cor?: string | null
          criado_em?: string
          destaque?: boolean
          detalhe?: string | null
          em_estoque?: boolean
          em_promocao?: boolean
          id?: string
          imagem_url?: string | null
          nome?: string
          preco?: number | null
          preco_promocional?: number | null
          sku?: string | null
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      eh_admin: { Args: { _user_id: string }; Returns: boolean }
      proximo_numero: { Args: { _escopo: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
