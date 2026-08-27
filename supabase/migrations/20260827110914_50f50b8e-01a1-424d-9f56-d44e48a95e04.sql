-- Novos campos no cadastro de produtos: SKU, bateria (para seminovos), cor e
-- promoção. Sem mudança de RLS: seguem a mesma GRANT/policy já existente na
-- tabela (leitura pública para ativo=true, escrita só para admin).
ALTER TABLE public.produtos
  ADD COLUMN sku text,
  ADD COLUMN bateria smallint CHECK (bateria IS NULL OR (bateria BETWEEN 0 AND 100)),
  ADD COLUMN cor text,
  ADD COLUMN em_promocao boolean NOT NULL DEFAULT false,
  ADD COLUMN preco_promocional numeric(10,2) CHECK (preco_promocional IS NULL OR preco_promocional >= 0);
