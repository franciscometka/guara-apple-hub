import type { Database } from "@/integrations/supabase/types";

type ProdutoFotosTable = {
  Row: {
    id: string;
    produto_id: string;
    caminho: string;
    ordem: number;
    criado_em: string;
  };
  Insert: {
    id?: string;
    produto_id: string;
    caminho: string;
    ordem?: number;
    criado_em?: string;
  };
  Update: {
    id?: string;
    produto_id?: string;
    caminho?: string;
    ordem?: number;
    criado_em?: string;
  };
  Relationships: [];
};

/** Complementa temporariamente os tipos gerados até a próxima sincronização do schema. */
export type DatabaseComProdutoFotos = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables"> & {
    Tables: Database["public"]["Tables"] & {
      produto_fotos: ProdutoFotosTable;
    };
  };
};