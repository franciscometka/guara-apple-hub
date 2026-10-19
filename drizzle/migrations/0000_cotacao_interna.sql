ALTER TABLE public.admins ADD COLUMN papel text NOT NULL DEFAULT 'gerente';
ALTER TABLE public.admins ADD CONSTRAINT admins_papel_valido CHECK (papel IN ('gerente','funcionario'));
CREATE FUNCTION public.eh_gerente(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = _user_id AND papel = 'gerente') $$;
REVOKE ALL ON FUNCTION public.eh_gerente(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.eh_gerente(uuid) TO authenticated, service_role;
CREATE TABLE public.cotacao_config (id boolean PRIMARY KEY DEFAULT true CHECK (id), dolar numeric NOT NULL DEFAULT 5.50 CHECK (dolar > 0), dolar_atualizado_em timestamptz NOT NULL DEFAULT now(), arredondamento text NOT NULL DEFAULT 'inteiro' CHECK (arredondamento IN ('nenhum','inteiro','90','00')));
GRANT SELECT ON public.cotacao_config TO authenticated;
GRANT ALL ON public.cotacao_config TO service_role;
ALTER TABLE public.cotacao_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY cotacao_config_leitura ON public.cotacao_config FOR SELECT TO authenticated USING (public.eh_admin(auth.uid()));
CREATE TABLE public.cotacao_categorias (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nome text NOT NULL, slug text NOT NULL UNIQUE, margem_pct numeric NOT NULL DEFAULT 8 CHECK (margem_pct BETWEEN 0 AND 100), taxa_pct numeric NOT NULL DEFAULT 0 CHECK (taxa_pct BETWEEN 0 AND 100), ativo boolean NOT NULL DEFAULT true, ordem integer NOT NULL DEFAULT 0);
GRANT SELECT, INSERT, UPDATE ON public.cotacao_categorias TO authenticated;
GRANT ALL ON public.cotacao_categorias TO service_role;
ALTER TABLE public.cotacao_categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY cotacao_categorias_gerente ON public.cotacao_categorias FOR ALL TO authenticated USING (public.eh_gerente(auth.uid())) WITH CHECK (public.eh_gerente(auth.uid()));
CREATE TABLE public.cotacoes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), categoria_id uuid NOT NULL REFERENCES public.cotacao_categorias(id), categoria_nome text NOT NULL, descricao text NOT NULL DEFAULT '', preco_usd numeric NOT NULL CHECK (preco_usd > 0), dolar numeric NOT NULL CHECK (dolar > 0), taxa_pct numeric NOT NULL CHECK (taxa_pct BETWEEN 0 AND 100), margem_pct numeric NOT NULL CHECK (margem_pct BETWEEN 0 AND 100), custo_brl numeric NOT NULL, preco_venda numeric NOT NULL, arredondamento text NOT NULL, criado_por uuid NOT NULL, criado_por_nome text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.cotacoes TO authenticated;
GRANT ALL ON public.cotacoes TO service_role;
ALTER TABLE public.cotacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY cotacoes_gerente_leitura ON public.cotacoes FOR SELECT TO authenticated USING (public.eh_gerente(auth.uid()));
CREATE INDEX cotacoes_created_at_idx ON public.cotacoes(created_at DESC);
CREATE FUNCTION public.cotacao_operar(acao text, entrada jsonb DEFAULT '{}'::jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE gerente boolean; cfg public.cotacao_config%ROWTYPE; cat public.cotacao_categorias%ROWTYPE; item jsonb; categorias jsonb; historico jsonb; usd numeric; cambio numeric; margem numeric; custo numeric; bruto numeric; venda numeric; nome_autor text; resultado jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT public.eh_admin(auth.uid()) THEN RAISE EXCEPTION 'Acesso restrito.'; END IF;
 gerente := public.eh_gerente(auth.uid());
 SELECT * INTO cfg FROM public.cotacao_config WHERE id = true;
 IF acao = 'inicial' THEN
  SELECT COALESCE(jsonb_agg(CASE WHEN gerente THEN to_jsonb(c) ELSE jsonb_build_object('id',c.id,'nome',c.nome,'ativo',c.ativo,'ordem',c.ordem) END ORDER BY c.ordem,c.nome),'[]'::jsonb) INTO categorias FROM public.cotacao_categorias c WHERE gerente OR c.ativo;
  SELECT COALESCE(jsonb_agg(CASE WHEN gerente THEN to_jsonb(h) ELSE to_jsonb(h) - ARRAY['taxa_pct','margem_pct','custo_brl','arredondamento'] END),'[]'::jsonb) INTO historico FROM (SELECT * FROM public.cotacoes WHERE (COALESCE(entrada->>'busca','')='' OR descricao ILIKE '%' || (entrada->>'busca') || '%') AND (COALESCE(entrada->>'categoria','')='' OR categoria_id::text=entrada->>'categoria') ORDER BY created_at DESC LIMIT 100) h;
  RETURN jsonb_build_object('gerente',gerente,'config',to_jsonb(cfg),'categorias',categorias,'historico',historico);
 ELSIF acao = 'dolar' THEN
  cambio := (entrada->>'dolar')::numeric;
  IF cambio IS NULL OR cambio <= 0 OR cambio > 1000000 THEN RAISE EXCEPTION 'Dólar deve ser maior que zero.'; END IF;
  UPDATE public.cotacao_config SET dolar=cambio,dolar_atualizado_em=now() WHERE id=true;
  RETURN jsonb_build_object('ok',true);
 ELSIF acao = 'configurar' THEN
  IF NOT gerente THEN RAISE EXCEPTION 'Acesso exclusivo de gerente.'; END IF;
  cambio := (entrada->>'dolar')::numeric;
  IF cambio IS NULL OR cambio<=0 OR cambio>1000000 THEN RAISE EXCEPTION 'Dólar inválido.'; END IF;
  UPDATE public.cotacao_config SET dolar=cambio,dolar_atualizado_em=CASE WHEN dolar IS DISTINCT FROM cambio THEN now() ELSE dolar_atualizado_em END, arredondamento=entrada->>'arredondamento' WHERE id=true;
  FOR item IN SELECT * FROM jsonb_array_elements(entrada->'categorias') LOOP
   IF length(trim(item->>'nome'))=0 THEN RAISE EXCEPTION 'Informe o nome da categoria.'; END IF;
   INSERT INTO public.cotacao_categorias (id,nome,slug,margem_pct,taxa_pct,ativo,ordem) VALUES (COALESCE(NULLIF(item->>'id','')::uuid,gen_random_uuid()),trim(item->>'nome'),COALESCE(NULLIF(item->>'slug',''),gen_random_uuid()::text),(item->>'margem_pct')::numeric,(item->>'taxa_pct')::numeric,(item->>'ativo')::boolean,(item->>'ordem')::integer) ON CONFLICT (id) DO UPDATE SET nome=excluded.nome,margem_pct=excluded.margem_pct,taxa_pct=excluded.taxa_pct,ativo=excluded.ativo,ordem=excluded.ordem;
  END LOOP;
  RETURN jsonb_build_object('ok',true);
 ELSIF acao IN ('calcular','salvar') THEN
  SELECT * INTO cat FROM public.cotacao_categorias WHERE id=(entrada->>'categoria_id')::uuid AND ativo;
  IF NOT FOUND THEN RAISE EXCEPTION 'Categoria indisponível.'; END IF;
  usd := (entrada->>'preco_usd')::numeric; cambio := (entrada->>'dolar')::numeric;
  IF usd IS NULL OR cambio IS NULL OR usd<=0 OR cambio<=0 OR usd>1000000000 OR cambio>1000000 THEN RAISE EXCEPTION 'Informe dólar e preço positivos.'; END IF;
  IF entrada->>'margem_pct' IS NOT NULL AND NOT gerente THEN RAISE EXCEPTION 'Margem exclusiva de gerente.'; END IF;
  margem := COALESCE((entrada->>'margem_pct')::numeric,cat.margem_pct);
  IF margem<0 OR margem>100 THEN RAISE EXCEPTION 'Margem deve estar entre 0 e 100.'; END IF;
  custo := usd*cambio*(1+cat.taxa_pct/100); bruto := custo*(1+margem/100);
  venda := CASE cfg.arredondamento WHEN 'inteiro' THEN ceil(bruto) WHEN '00' THEN ceil(bruto) WHEN '90' THEN ceil(bruto-0.90)+0.90 ELSE round(bruto,2) END;
  resultado := jsonb_build_object('preco_venda',venda);
  IF gerente THEN resultado := resultado || jsonb_build_object('custo_brl',custo,'margem_pct',margem,'taxa_pct',cat.taxa_pct,'preco_sem_taxa',usd*cambio,'preco_bruto',bruto,'arredondamento',cfg.arredondamento); END IF;
  IF acao='salvar' THEN
   SELECT COALESCE(NULLIF(nome,''),email,'Equipe') INTO nome_autor FROM public.perfis WHERE id=auth.uid();
   INSERT INTO public.cotacoes(categoria_id,categoria_nome,descricao,preco_usd,dolar,taxa_pct,margem_pct,custo_brl,preco_venda,arredondamento,criado_por,criado_por_nome) VALUES(cat.id,cat.nome,left(COALESCE(entrada->>'descricao',''),500),usd,cambio,cat.taxa_pct,margem,custo,venda,cfg.arredondamento,auth.uid(),COALESCE(nome_autor,'Equipe'));
  END IF;
  RETURN resultado;
 END IF;
 RAISE EXCEPTION 'Operação inválida.';
END $$;
REVOKE ALL ON FUNCTION public.cotacao_operar(text,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cotacao_operar(text,jsonb) TO authenticated;
