-- Cotação: o percentual da aba é FRETE (taxa_pct), não margem; novo lucro em R$.
--
-- Fórmula (única, em cotacao_calcular_preco):
--   custo_brl  = preco_usd × dólar
--   frete_brl  = custo_brl × taxa_pct / 100
--   antes      = custo_brl + frete_brl + lucro_brl + custo_brl × margem_pct / 100
--   preço      = arredondamento(antes)
-- margem_pct passa a ser "margem extra" opcional (padrão 0).
--
-- Seguro para rodar mais de uma vez: a migração dos valores só acontece na
-- primeira execução (quando a coluna lucro_brl ainda não existe).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cotacao_categorias' AND column_name = 'lucro_brl'
  ) THEN
    ALTER TABLE public.cotacao_categorias
      ADD COLUMN lucro_brl numeric(12,2) NOT NULL DEFAULT 0 CHECK (lucro_brl >= 0 AND lucro_brl < 10000000);

    -- iPhones e MacBooks: o valor que estava em "margem" (10 e 12) era o frete.
    UPDATE public.cotacao_categorias
    SET taxa_pct = margem_pct, margem_pct = 0
    WHERE nome ILIKE 'iphone%' OR nome ILIKE 'macbook%';

    -- Demais categorias: zera a margem. O frete delas fica como está (o cliente
    -- precisa preencher); ver a consulta final desta migration.
    UPDATE public.cotacao_categorias
    SET margem_pct = 0
    WHERE NOT (nome ILIKE 'iphone%' OR nome ILIKE 'macbook%');

    -- Lucro padrão de R$ 1.000,00 para iPhones.
    UPDATE public.cotacao_categorias SET lucro_brl = 1000 WHERE nome ILIKE 'iphone%';
  END IF;
END $$;

ALTER TABLE public.cotacao_itens
  ADD COLUMN IF NOT EXISTS lucro_brl numeric(12,2) NULL CHECK (lucro_brl IS NULL OR (lucro_brl >= 0 AND lucro_brl < 10000000));

ALTER TABLE public.cotacao_categorias ALTER COLUMN margem_pct SET DEFAULT 0;

-- O lucro por linha é dado de gerente: nenhum admin lê ou grava essa coluna
-- direto na tabela (permissão por coluna). Só passa por cotacao_item_lucro()
-- e por cotacao_itens_listar(), que checam eh_gerente.
REVOKE SELECT, INSERT, UPDATE ON public.cotacao_itens FROM authenticated;
GRANT SELECT (id, categoria_id, descricao, preco_usd, ordem, criado_por, created_at, updated_at)
  ON public.cotacao_itens TO authenticated;
GRANT INSERT (categoria_id, descricao, preco_usd, ordem) ON public.cotacao_itens TO authenticated;
GRANT UPDATE (categoria_id, descricao, preco_usd, ordem) ON public.cotacao_itens TO authenticated;

CREATE OR REPLACE FUNCTION public.cotacao_item_lucro(p_item uuid, p_lucro numeric DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.eh_gerente(auth.uid()) THEN
    RAISE EXCEPTION 'Somente gerente altera o lucro.' USING ERRCODE = '42501';
  END IF;
  IF p_lucro IS NOT NULL AND (p_lucro < 0 OR p_lucro >= 10000000) THEN
    RAISE EXCEPTION 'Lucro inválido.' USING ERRCODE = '22023';
  END IF;
  -- NULL = volta a usar o lucro padrão da aba.
  UPDATE public.cotacao_itens SET lucro_brl = p_lucro WHERE id = p_item;
END $$;

REVOKE ALL ON FUNCTION public.cotacao_item_lucro(uuid, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cotacao_item_lucro(uuid, numeric) TO authenticated;

-- ---------------------------------------------------------------------------
-- Fórmula de preço (única). Valores intermediários saem arredondados a 2 casas
-- só para exibição; o preço final usa o valor exato.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.cotacao_calcular_preco(
  p_usd numeric, p_dolar numeric, p_frete_pct numeric, p_lucro_brl numeric, p_margem_pct numeric, p_modo text
) RETURNS jsonb
LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT jsonb_build_object(
    'custo_brl', round(c.custo, 2),
    'frete_brl', round(c.custo * p_frete_pct / 100, 2),
    'lucro_brl', p_lucro_brl,
    'margem_extra_brl', round(c.custo * p_margem_pct / 100, 2),
    'antes_arredondar', round(c.antes, 2),
    'preco_venda', public.cotacao_arredondar(c.antes, p_modo)
  )
  FROM (
    SELECT p_usd * p_dolar AS custo,
           p_usd * p_dolar + p_usd * p_dolar * p_frete_pct / 100 + p_lucro_brl + p_usd * p_dolar * p_margem_pct / 100 AS antes
  ) c
$$;

REVOKE ALL ON FUNCTION public.cotacao_calcular_preco(numeric, numeric, numeric, numeric, numeric, text) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Lista completa com preço de venda calculado no servidor.
-- Funcionário: só o preço final. Gerente: também frete, lucro, margem extra.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.cotacao_itens_listar(p_dolar numeric)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_gerente boolean := public.eh_gerente(auth.uid());
  v_modo text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.eh_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso restrito à equipe.' USING ERRCODE = '42501';
  END IF;
  IF p_dolar IS NULL OR p_dolar <= 0 OR p_dolar > 1000 THEN
    RAISE EXCEPTION 'Dólar inválido.' USING ERRCODE = '22023';
  END IF;

  SELECT arredondamento INTO v_modo FROM public.cotacao_config LIMIT 1;

  RETURN jsonb_build_object(
    'gerente', v_gerente,
    'dolar', p_dolar,
    'categorias', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object('id', c.id, 'nome', c.nome, 'slug', c.slug, 'ordem', c.ordem)
        || CASE WHEN v_gerente THEN jsonb_build_object('taxa_pct', c.taxa_pct, 'lucro_brl', c.lucro_brl, 'margem_pct', c.margem_pct) ELSE '{}'::jsonb END
        ORDER BY c.ordem, c.nome)
      FROM public.cotacao_categorias c WHERE c.ativo
    ), '[]'::jsonb),
    'itens', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', i.id, 'categoria_id', i.categoria_id, 'descricao', i.descricao,
          'preco_usd', i.preco_usd, 'ordem', i.ordem,
          'preco_venda', calc.r -> 'preco_venda')
        || CASE WHEN v_gerente THEN (calc.r - 'preco_venda') || jsonb_build_object(
          'lucro_item', i.lucro_brl, 'taxa_pct', c.taxa_pct, 'margem_pct', c.margem_pct) ELSE '{}'::jsonb END
        ORDER BY i.ordem, i.created_at)
      FROM public.cotacao_itens i
      JOIN public.cotacao_categorias c ON c.id = i.categoria_id AND c.ativo
      CROSS JOIN LATERAL (
        SELECT public.cotacao_calcular_preco(i.preco_usd, p_dolar, c.taxa_pct, COALESCE(i.lucro_brl, c.lucro_brl), c.margem_pct, v_modo) AS r
      ) calc
    ), '[]'::jsonb)
  );
END $$;

-- ---------------------------------------------------------------------------
-- Frete e lucro padrão da aba: edição de um clique, só gerente.
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.cotacao_categoria_margem(uuid, numeric);

CREATE OR REPLACE FUNCTION public.cotacao_categoria_ajustar(
  p_categoria uuid, p_frete numeric DEFAULT NULL, p_lucro numeric DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.eh_gerente(auth.uid()) THEN
    RAISE EXCEPTION 'Somente gerente altera frete e lucro.' USING ERRCODE = '42501';
  END IF;
  IF p_frete IS NOT NULL AND (p_frete < 0 OR p_frete > 100) THEN
    RAISE EXCEPTION 'Frete deve estar entre 0 e 100%%.' USING ERRCODE = '22023';
  END IF;
  IF p_lucro IS NOT NULL AND (p_lucro < 0 OR p_lucro >= 10000000) THEN
    RAISE EXCEPTION 'Lucro inválido.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.cotacao_categorias
  SET taxa_pct = COALESCE(p_frete, taxa_pct), lucro_brl = COALESCE(p_lucro, lucro_brl)
  WHERE id = p_categoria;
END $$;

REVOKE ALL ON FUNCTION public.cotacao_itens_listar(numeric) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cotacao_categoria_ajustar(uuid, numeric, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cotacao_itens_listar(numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cotacao_categoria_ajustar(uuid, numeric, numeric) TO authenticated;

-- Conferência: como ficaram frete, margem extra e lucro por categoria.
SELECT nome, ativo, taxa_pct AS frete_pct, margem_pct AS margem_extra_pct, lucro_brl
FROM public.cotacao_categorias
ORDER BY ordem, nome;
