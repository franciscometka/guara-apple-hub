-- Cotação 3.2: lista de preços por categoria (abas).
--
-- A tabela guarda só descrição, categoria, custo em US$ e ordem. O preço de
-- venda NUNCA é gravado: é calculado na hora por cotacao_itens_listar(), com o
-- dólar informado e a margem/taxa da categoria. Assim a lista não fica velha.
--
-- Acesso: eh_admin para a tabela. Margem, taxa e custo em R$ só saem da função
-- para quem é gerente (eh_gerente).

CREATE TABLE public.cotacao_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid NOT NULL REFERENCES public.cotacao_categorias(id) ON DELETE CASCADE,
  descricao text NOT NULL DEFAULT '' CHECK (char_length(descricao) <= 500),
  preco_usd numeric(12,2) NOT NULL DEFAULT 0 CHECK (preco_usd >= 0 AND preco_usd < 10000000),
  ordem integer NOT NULL DEFAULT 0,
  criado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cotacao_itens_categoria_ordem_idx ON public.cotacao_itens (categoria_id, ordem, created_at);

CREATE FUNCTION public.cotacao_itens_touch()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE TRIGGER cotacao_itens_set_updated_at
BEFORE UPDATE ON public.cotacao_itens
FOR EACH ROW EXECUTE FUNCTION public.cotacao_itens_touch();

ALTER TABLE public.cotacao_itens ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cotacao_itens TO authenticated;
GRANT ALL ON public.cotacao_itens TO service_role;
REVOKE ALL ON public.cotacao_itens FROM anon;

CREATE POLICY "Admins leem itens da cotação"
ON public.cotacao_itens FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE POLICY "Admins criam itens da cotação"
ON public.cotacao_itens FOR INSERT TO authenticated
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam itens da cotação"
ON public.cotacao_itens FOR UPDATE TO authenticated
USING (public.eh_admin(auth.uid()))
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins excluem itens da cotação"
ON public.cotacao_itens FOR DELETE TO authenticated
USING (public.eh_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Arredondamento (mesmos modos de cotacao_config.arredondamento)
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.cotacao_arredondar(p_valor numeric, p_modo text)
RETURNS numeric LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE p_modo
    WHEN 'inteiro' THEN ceil(p_valor)
    WHEN '00' THEN ceil(p_valor)
    WHEN '90' THEN CASE WHEN p_valor <= floor(p_valor) + 0.90 THEN floor(p_valor) + 0.90 ELSE floor(p_valor) + 1.90 END
    ELSE round(p_valor, 2)
  END
$$;

-- ---------------------------------------------------------------------------
-- Lista completa já com o preço de venda calculado.
--   preço = US$ × dólar → + taxa% → + margem% → arredonda
-- Funcionário recebe só o preço final; gerente recebe também a conta.
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.cotacao_itens_listar(p_dolar numeric)
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
    'categorias', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object('id', c.id, 'nome', c.nome, 'slug', c.slug, 'ordem', c.ordem)
        || CASE WHEN v_gerente THEN jsonb_build_object('margem_pct', c.margem_pct, 'taxa_pct', c.taxa_pct) ELSE '{}'::jsonb END
        ORDER BY c.ordem, c.nome)
      FROM public.cotacao_categorias c WHERE c.ativo
    ), '[]'::jsonb),
    'itens', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', i.id, 'categoria_id', i.categoria_id, 'descricao', i.descricao,
          'preco_usd', i.preco_usd, 'ordem', i.ordem,
          'preco_venda', public.cotacao_arredondar(i.preco_usd * p_dolar * (1 + c.taxa_pct / 100) * (1 + c.margem_pct / 100), v_modo))
        || CASE WHEN v_gerente THEN jsonb_build_object(
          'preco_sem_taxa', round(i.preco_usd * p_dolar, 2),
          'custo_brl', round(i.preco_usd * p_dolar * (1 + c.taxa_pct / 100), 2),
          'preco_bruto', round(i.preco_usd * p_dolar * (1 + c.taxa_pct / 100) * (1 + c.margem_pct / 100), 2),
          'margem_pct', c.margem_pct, 'taxa_pct', c.taxa_pct) ELSE '{}'::jsonb END
        ORDER BY i.ordem, i.created_at)
      FROM public.cotacao_itens i
      JOIN public.cotacao_categorias c ON c.id = i.categoria_id AND c.ativo
    ), '[]'::jsonb)
  );
END $$;

-- ---------------------------------------------------------------------------
-- Margem da aba: edição de um clique, só gerente.
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.cotacao_categoria_margem(p_categoria uuid, p_margem numeric)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.eh_gerente(auth.uid()) THEN
    RAISE EXCEPTION 'Somente gerente altera a margem.' USING ERRCODE = '42501';
  END IF;
  IF p_margem IS NULL OR p_margem < 0 OR p_margem > 100 THEN
    RAISE EXCEPTION 'Margem deve estar entre 0 e 100%%.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.cotacao_categorias SET margem_pct = p_margem WHERE id = p_categoria;
END $$;

REVOKE ALL ON FUNCTION public.cotacao_itens_listar(numeric) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cotacao_categoria_margem(uuid, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cotacao_itens_listar(numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cotacao_categoria_margem(uuid, numeric) TO authenticated;
