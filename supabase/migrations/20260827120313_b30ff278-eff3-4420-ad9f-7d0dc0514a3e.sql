-- Galeria de fotos do produto.
-- `produtos.imagem_url` continua sendo a foto principal; esta tabela guarda as
-- fotos adicionais que aparecem como miniaturas na página do produto.
CREATE TABLE public.produto_fotos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  caminho text NOT NULL,
  ordem smallint NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX produto_fotos_produto_idx ON public.produto_fotos (produto_id, ordem);

GRANT SELECT ON public.produto_fotos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produto_fotos TO authenticated;
GRANT ALL ON public.produto_fotos TO service_role;

ALTER TABLE public.produto_fotos ENABLE ROW LEVEL SECURITY;

-- Espelha a policy de produtos: anônimo só enxerga foto de produto ativo.
CREATE POLICY "Fotos de produtos ativos sao publicas"
  ON public.produto_fotos FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.produtos p WHERE p.id = produto_id AND p.ativo = true));

CREATE POLICY "Autenticados leem todas as fotos"
  ON public.produto_fotos FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins criam fotos"
  ON public.produto_fotos FOR INSERT TO authenticated
  WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam fotos"
  ON public.produto_fotos FOR UPDATE TO authenticated
  USING (public.eh_admin(auth.uid()))
  WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins excluem fotos"
  ON public.produto_fotos FOR DELETE TO authenticated
  USING (public.eh_admin(auth.uid()));
