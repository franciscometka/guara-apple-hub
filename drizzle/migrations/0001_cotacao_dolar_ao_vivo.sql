ALTER TABLE public.cotacao_config ADD COLUMN dolar_tipo text NOT NULL DEFAULT 'ask' CHECK (dolar_tipo IN ('ask','bid'));
ALTER TABLE public.cotacao_config ADD COLUMN dolar_acrescimo_pct numeric NOT NULL DEFAULT 0 CHECK (dolar_acrescimo_pct BETWEEN 0 AND 100);
ALTER TABLE public.cotacoes ADD COLUMN dolar_fonte text NOT NULL DEFAULT 'manual' CHECK (dolar_fonte IN ('manual','ao_vivo','salvo'));
ALTER TABLE public.cotacoes ADD COLUMN dolar_provedor text NOT NULL DEFAULT 'Manual';
ALTER TABLE public.cotacoes ADD COLUMN dolar_cotado_em timestamptz;
ALTER TABLE public.cotacoes ADD COLUMN dolar_base numeric;
ALTER TABLE public.cotacoes ADD COLUMN dolar_acrescimo_pct numeric NOT NULL DEFAULT 0;
CREATE TABLE public.cotacao_cambio_cache (id boolean PRIMARY KEY DEFAULT true CHECK (id), bid numeric NOT NULL CHECK (bid>0), ask numeric NOT NULL CHECK (ask>0), provedor text NOT NULL, cotado_em timestamptz NOT NULL, consultado_em timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.cotacao_cambio_cache TO service_role;
ALTER TABLE public.cotacao_cambio_cache ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.cotacao_operar(acao text, entrada jsonb DEFAULT '{}'::jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE gerente boolean; cfg public.cotacao_config%ROWTYPE; cat public.cotacao_categorias%ROWTYPE; item jsonb; categorias jsonb; historico jsonb; usd numeric; cambio numeric; margem numeric; custo numeric; bruto numeric; venda numeric; nome_autor text; resultado jsonb; cambio_base numeric; cambio_fonte text; cambio_provedor text; cambio_horario timestamptz; cache public.cotacao_cambio_cache%ROWTYPE;
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
  UPDATE public.cotacao_config SET dolar=cambio,dolar_atualizado_em=CASE WHEN dolar IS DISTINCT FROM cambio THEN now() ELSE dolar_atualizado_em END, arredondamento=entrada->>'arredondamento', dolar_tipo=COALESCE(entrada->>'dolar_tipo',dolar_tipo), dolar_acrescimo_pct=COALESCE((entrada->>'dolar_acrescimo_pct')::numeric,dolar_acrescimo_pct) WHERE id=true;
  FOR item IN SELECT * FROM jsonb_array_elements(entrada->'categorias') LOOP
   IF length(trim(item->>'nome'))=0 THEN RAISE EXCEPTION 'Informe o nome da categoria.'; END IF;
   INSERT INTO public.cotacao_categorias (id,nome,slug,margem_pct,taxa_pct,ativo,ordem) VALUES (COALESCE(NULLIF(item->>'id','')::uuid,gen_random_uuid()),trim(item->>'nome'),COALESCE(NULLIF(item->>'slug',''),gen_random_uuid()::text),(item->>'margem_pct')::numeric,(item->>'taxa_pct')::numeric,(item->>'ativo')::boolean,(item->>'ordem')::integer) ON CONFLICT (id) DO UPDATE SET nome=excluded.nome,margem_pct=excluded.margem_pct,taxa_pct=excluded.taxa_pct,ativo=excluded.ativo,ordem=excluded.ordem;
  END LOOP;
  RETURN jsonb_build_object('ok',true);
 ELSIF acao IN ('calcular','salvar') THEN
  SELECT * INTO cat FROM public.cotacao_categorias WHERE id=(entrada->>'categoria_id')::uuid AND ativo;
  IF NOT FOUND THEN RAISE EXCEPTION 'Categoria indisponível.'; END IF;
  usd := (entrada->>'preco_usd')::numeric; cambio := (entrada->>'dolar')::numeric;
  cambio_fonte := COALESCE(entrada->>'dolar_fonte','manual'); cambio_provedor := 'Manual'; cambio_horario := now(); cambio_base := cambio;
  IF cambio_fonte='ao_vivo' THEN
   SELECT * INTO cache FROM public.cotacao_cambio_cache WHERE id=true;
   IF NOT FOUND THEN RAISE EXCEPTION 'Atualize o dólar ao vivo.'; END IF;
   cambio_base := CASE cfg.dolar_tipo WHEN 'bid' THEN cache.bid ELSE cache.ask END;
   cambio := cambio_base*(1+cfg.dolar_acrescimo_pct/100);
   cambio_provedor := cache.provedor; cambio_horario := cache.cotado_em;
  ELSIF cambio_fonte='salvo' THEN
   cambio := cfg.dolar; cambio_base := cambio; cambio_provedor := 'Último valor salvo'; cambio_horario := cfg.dolar_atualizado_em;
  ELSIF cambio_fonte<>'manual' THEN RAISE EXCEPTION 'Origem do dólar inválida.';
  END IF;
  IF usd IS NULL OR cambio IS NULL OR usd<=0 OR cambio<=0 OR usd>1000000000 OR cambio>1000000 THEN RAISE EXCEPTION 'Informe dólar e preço positivos.'; END IF;
  IF entrada->>'margem_pct' IS NOT NULL AND NOT gerente THEN RAISE EXCEPTION 'Margem exclusiva de gerente.'; END IF;
  margem := COALESCE((entrada->>'margem_pct')::numeric,cat.margem_pct);
  IF margem<0 OR margem>100 THEN RAISE EXCEPTION 'Margem deve estar entre 0 e 100.'; END IF;
  custo := usd*cambio*(1+cat.taxa_pct/100); bruto := custo*(1+margem/100);
  venda := CASE cfg.arredondamento WHEN 'inteiro' THEN ceil(bruto) WHEN '00' THEN ceil(bruto) WHEN '90' THEN ceil(bruto-0.90)+0.90 ELSE round(bruto,2) END;
  resultado := jsonb_build_object('preco_venda',venda);
  IF entrada ? 'dolar_fonte' THEN resultado := resultado || jsonb_build_object('dolar',cambio,'dolar_base',cambio_base,'dolar_fonte',cambio_fonte,'dolar_provedor',cambio_provedor,'dolar_cotado_em',cambio_horario,'dolar_acrescimo_pct',CASE WHEN cambio_fonte='ao_vivo' THEN cfg.dolar_acrescimo_pct ELSE 0 END); END IF;
  IF gerente THEN resultado := resultado || jsonb_build_object('custo_brl',custo,'margem_pct',margem,'taxa_pct',cat.taxa_pct,'preco_sem_taxa',usd*cambio,'preco_bruto',bruto,'arredondamento',cfg.arredondamento); END IF;
  IF acao='salvar' THEN
   SELECT COALESCE(NULLIF(nome,''),email,'Equipe') INTO nome_autor FROM public.perfis WHERE id=auth.uid();
   INSERT INTO public.cotacoes(categoria_id,categoria_nome,descricao,preco_usd,dolar,taxa_pct,margem_pct,custo_brl,preco_venda,arredondamento,criado_por,criado_por_nome,dolar_fonte,dolar_provedor,dolar_cotado_em,dolar_base,dolar_acrescimo_pct) VALUES(cat.id,cat.nome,left(COALESCE(entrada->>'descricao',''),500),usd,cambio,cat.taxa_pct,margem,custo,venda,cfg.arredondamento,auth.uid(),COALESCE(nome_autor,'Equipe'),cambio_fonte,cambio_provedor,cambio_horario,cambio_base,CASE WHEN cambio_fonte='ao_vivo' THEN cfg.dolar_acrescimo_pct ELSE 0 END);
  END IF;
  RETURN resultado;
 END IF;
 RAISE EXCEPTION 'Operação inválida.';
END $$;
REVOKE ALL ON FUNCTION public.cotacao_operar(text,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cotacao_operar(text,jsonb) TO authenticated;