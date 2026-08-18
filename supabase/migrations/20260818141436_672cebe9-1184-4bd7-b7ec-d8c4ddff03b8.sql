CREATE TABLE public.produtos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  categoria text NOT NULL CHECK (categoria IN ('iPhone','iPad','Apple Watch','AirPods','Mac','Acessórios')),
  condicao text NOT NULL CHECK (condicao IN ('Lacrado','Seminovo','Vitrine')),
  detalhe text,
  preco numeric(10,2) CHECK (preco IS NULL OR preco >= 0),
  em_estoque boolean NOT NULL DEFAULT true,
  destaque boolean NOT NULL DEFAULT false,
  ativo boolean NOT NULL DEFAULT true,
  imagem_url text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX produtos_categoria_idx ON public.produtos (categoria);
CREATE INDEX produtos_ativo_destaque_idx ON public.produtos (ativo, destaque);

GRANT SELECT ON public.produtos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos TO authenticated;
GRANT ALL ON public.produtos TO service_role;

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produtos ativos sao publicos"
  ON public.produtos FOR SELECT TO anon
  USING (ativo = true);

CREATE POLICY "Autenticados leem todos os produtos"
  ON public.produtos FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Autenticados criam produtos"
  ON public.produtos FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Autenticados atualizam produtos"
  ON public.produtos FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Autenticados excluem produtos"
  ON public.produtos FOR DELETE TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.set_atualizado_em()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER produtos_set_atualizado_em
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();