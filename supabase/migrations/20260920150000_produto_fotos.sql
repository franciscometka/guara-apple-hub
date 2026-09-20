-- Galeria de fotos extras do produto.
--
-- O código já consultava e gravava nesta tabela (admin-produtos.ts e
-- produtos.functions.ts), mas ela nunca chegou a ser criada — o campo
-- "Fotos adicionais da galeria" do painel falhava ao salvar.
--
-- Idempotente de propósito: pode ser aplicada mais de uma vez sem erro.

CREATE TABLE IF NOT EXISTS public.produto_fotos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  caminho text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS produto_fotos_produto_ordem_idx
  ON public.produto_fotos (produto_id, ordem);

GRANT SELECT ON public.produto_fotos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produto_fotos TO authenticated;
GRANT ALL ON public.produto_fotos TO service_role;

ALTER TABLE public.produto_fotos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Fotos de produtos ativos sao publicas" ON public.produto_fotos;
DROP POLICY IF EXISTS "Autenticados leem todas as fotos" ON public.produto_fotos;
DROP POLICY IF EXISTS "Admins criam fotos" ON public.produto_fotos;
DROP POLICY IF EXISTS "Admins atualizam fotos" ON public.produto_fotos;
DROP POLICY IF EXISTS "Admins excluem fotos" ON public.produto_fotos;

-- Espelha a regra de `produtos`: o público só enxerga foto de produto ativo.
CREATE POLICY "Fotos de produtos ativos sao publicas"
ON public.produto_fotos FOR SELECT TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.produtos p
    WHERE p.id = produto_id AND p.ativo = true
  )
);

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
