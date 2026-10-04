-- Módulo de Contratos e Dossiê de Aparelhos.
--
-- Seis tabelas novas (loja_config, dossies, contratos, contrato_etapas,
-- contrato_anexos, dossie_acessos), mais a tabela auxiliar de numeração e um
-- bucket privado `contratos`. Nenhuma delas conflita com as tabelas já
-- existentes no projeto (produtos, produto_fotos, admins, perfis).
--
-- Regra geral de acesso: tudo exige public.eh_admin(auth.uid()).
-- Nada é legível por `anon` — a página pública do QR passa por server function
-- com a service role key.

-- ---------------------------------------------------------------------------
-- 1. Dados da loja (linha única)
-- ---------------------------------------------------------------------------

CREATE TABLE public.loja_config (
  -- `id` booleano com CHECK garante que só existe uma linha na tabela.
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  razao_social text,
  cnpj text,
  endereco text,
  cidade text,
  uf text,
  cep text,
  telefone text,
  email text,
  representante text,
  representante_cpf text,
  canal_atendimento text,
  endereco_atendimento text,
  logo_path text,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.loja_config TO authenticated;
GRANT ALL ON public.loja_config TO service_role;

ALTER TABLE public.loja_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins leem os dados da loja"
ON public.loja_config FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE POLICY "Admins criam os dados da loja"
ON public.loja_config FOR INSERT TO authenticated
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam os dados da loja"
ON public.loja_config FOR UPDATE TO authenticated
USING (public.eh_admin(auth.uid()))
WITH CHECK (public.eh_admin(auth.uid()));

CREATE TRIGGER loja_config_set_atualizado_em
BEFORE UPDATE ON public.loja_config
FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

-- ---------------------------------------------------------------------------
-- 2. Numeração sequencial legível (contratos e ordens de serviço)
-- ---------------------------------------------------------------------------

CREATE TABLE public.contrato_numeracao (
  escopo text NOT NULL,
  ano smallint NOT NULL,
  ultimo integer NOT NULL DEFAULT 0,
  PRIMARY KEY (escopo, ano)
);

GRANT SELECT ON public.contrato_numeracao TO authenticated;
GRANT ALL ON public.contrato_numeracao TO service_role;

ALTER TABLE public.contrato_numeracao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins leem a numeracao"
ON public.contrato_numeracao FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

-- Devolve "2026-0001". A escrita acontece dentro da função (security definer),
-- por isso a tabela não precisa de policy de INSERT/UPDATE.
CREATE OR REPLACE FUNCTION public.proximo_numero(_escopo text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_ano smallint := EXTRACT(YEAR FROM (now() AT TIME ZONE 'America/Belem'))::smallint;
  v_seq integer;
BEGIN
  IF _escopo IS NULL OR _escopo NOT IN ('contrato', 'os') THEN
    RAISE EXCEPTION 'Escopo de numeração inválido.';
  END IF;

  INSERT INTO public.contrato_numeracao (escopo, ano, ultimo)
  VALUES (_escopo, v_ano, 1)
  ON CONFLICT (escopo, ano)
    DO UPDATE SET ultimo = public.contrato_numeracao.ultimo + 1
  RETURNING ultimo INTO v_seq;

  RETURN v_ano::text || '-' || lpad(v_seq::text, 4, '0');
END;
$fn$;

REVOKE ALL ON FUNCTION public.proximo_numero(text) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.proximo_numero(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- 3. Dossiês de aparelho
-- ---------------------------------------------------------------------------

CREATE TABLE public.dossies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Token base62 de 32+ caracteres gerado com crypto.getRandomValues.
  token text NOT NULL UNIQUE,
  token_ativo boolean NOT NULL DEFAULT true,
  produto_id uuid REFERENCES public.produtos(id) ON DELETE SET NULL,
  marca text,
  modelo text,
  cor text,
  capacidade text,
  imei1 text,
  imei2 text,
  serie text,
  -- De onde veio o aparelho.
  origem text NOT NULL CHECK (origem IN ('venda', 'assistencia', 'upgrade_entrada', 'upgrade_venda')),
  adquirido_em date,
  criado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

-- O UNIQUE de `token` já cria o índice usado pela página pública.
CREATE INDEX dossies_imei1_idx ON public.dossies (imei1);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dossies TO authenticated;
GRANT ALL ON public.dossies TO service_role;

ALTER TABLE public.dossies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins leem dossies"
ON public.dossies FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE POLICY "Admins criam dossies"
ON public.dossies FOR INSERT TO authenticated
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam dossies"
ON public.dossies FOR UPDATE TO authenticated
USING (public.eh_admin(auth.uid()))
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins excluem dossies"
ON public.dossies FOR DELETE TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE TRIGGER dossies_set_atualizado_em
BEFORE UPDATE ON public.dossies
FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

-- ---------------------------------------------------------------------------
-- 4. Contratos
-- ---------------------------------------------------------------------------

CREATE TABLE public.contratos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Preenchido pelo trigger abaixo no formato 2026-0001.
  numero text NOT NULL DEFAULT '' UNIQUE,
  -- Nulo enquanto o assistente não terminou: o IMEI que define o dossiê só é
  -- conhecido no fim do preenchimento.
  dossie_id uuid REFERENCES public.dossies(id) ON DELETE RESTRICT,
  modelo_slug text NOT NULL,
  modelo_versao text NOT NULL,
  status text NOT NULL DEFAULT 'rascunho'
    CHECK (status IN ('rascunho', 'pdf_gerado', 'assinado', 'arquivado', 'cancelado')),
  cliente_nome text,
  cliente_cpf text,
  -- Quando este contrato substitui um cancelado, guarda o anterior.
  substitui_contrato_id uuid REFERENCES public.contratos(id) ON DELETE SET NULL,
  criado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  assinado_em timestamptz,
  cancelado_em timestamptz
);

CREATE INDEX contratos_dossie_idx ON public.contratos (dossie_id);
CREATE INDEX contratos_criado_em_idx ON public.contratos (criado_em DESC);
CREATE INDEX contratos_cliente_cpf_idx ON public.contratos (cliente_cpf);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contratos TO authenticated;
GRANT ALL ON public.contratos TO service_role;

ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins leem contratos"
ON public.contratos FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE POLICY "Admins criam contratos"
ON public.contratos FOR INSERT TO authenticated
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam contratos"
ON public.contratos FOR UPDATE TO authenticated
USING (public.eh_admin(auth.uid()))
WITH CHECK (public.eh_admin(auth.uid()));

-- Só rascunho pode ser apagado. Contrato emitido se cancela, não se exclui.
CREATE POLICY "Admins excluem apenas rascunhos"
ON public.contratos FOR DELETE TO authenticated
USING (public.eh_admin(auth.uid()) AND status = 'rascunho');

-- Trava os dados de contrato assinado/arquivado/cancelado: a partir daí só o
-- status e as datas de status podem mudar.
CREATE OR REPLACE FUNCTION public.contratos_bloqueia_alteracao()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $fn$
BEGIN
  IF OLD.status = 'cancelado' AND NEW.status <> 'cancelado' THEN
    RAISE EXCEPTION 'Contrato cancelado não pode ser reaberto.';
  END IF;

  IF OLD.status IN ('assinado', 'arquivado', 'cancelado') THEN
    IF NEW.numero IS DISTINCT FROM OLD.numero
      OR NEW.dossie_id IS DISTINCT FROM OLD.dossie_id
      OR NEW.modelo_slug IS DISTINCT FROM OLD.modelo_slug
      OR NEW.modelo_versao IS DISTINCT FROM OLD.modelo_versao
      OR NEW.cliente_nome IS DISTINCT FROM OLD.cliente_nome
      OR NEW.cliente_cpf IS DISTINCT FROM OLD.cliente_cpf
    THEN
      RAISE EXCEPTION 'Contrato assinado ou arquivado não pode ser editado. Cancele e crie uma nova versão.';
    END IF;
  END IF;

  NEW.atualizado_em := now();
  RETURN NEW;
END;
$fn$;

REVOKE ALL ON FUNCTION public.contratos_bloqueia_alteracao() FROM anon, authenticated, PUBLIC;

CREATE TRIGGER contratos_bloqueia_alteracao
BEFORE UPDATE ON public.contratos
FOR EACH ROW EXECUTE FUNCTION public.contratos_bloqueia_alteracao();

-- Preenche o número sequencial legível quando não vier do cliente.
CREATE OR REPLACE FUNCTION public.contratos_define_numero()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $fn$
BEGIN
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := public.proximo_numero('contrato');
  END IF;
  RETURN NEW;
END;
$fn$;

REVOKE ALL ON FUNCTION public.contratos_define_numero() FROM anon, authenticated, PUBLIC;

CREATE TRIGGER contratos_define_numero
BEFORE INSERT ON public.contratos
FOR EACH ROW EXECUTE FUNCTION public.contratos_define_numero();

-- ---------------------------------------------------------------------------
-- 5. Etapas do contrato (cada uma com PDF e assinatura próprios)
-- ---------------------------------------------------------------------------

CREATE TABLE public.contrato_etapas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contrato_id uuid NOT NULL REFERENCES public.contratos(id) ON DELETE CASCADE,
  etapa text NOT NULL
    CHECK (etapa IN ('principal', 'entrega', 'diagnostico', 'conclusao')),
  status text NOT NULL DEFAULT 'rascunho'
    CHECK (status IN ('rascunho', 'pdf_gerado', 'assinado', 'arquivado', 'cancelado')),
  dados jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- Permite reabrir o assistente no passo em que parou.
  passo_atual smallint NOT NULL DEFAULT 0,
  pdf_path text,
  pdf_sha256 text,
  assinado_path text,
  gerado_em timestamptz,
  assinado_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contrato_id, etapa)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contrato_etapas TO authenticated;
GRANT ALL ON public.contrato_etapas TO service_role;

ALTER TABLE public.contrato_etapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins leem etapas"
ON public.contrato_etapas FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE POLICY "Admins criam etapas"
ON public.contrato_etapas FOR INSERT TO authenticated
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam etapas"
ON public.contrato_etapas FOR UPDATE TO authenticated
USING (public.eh_admin(auth.uid()))
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins excluem apenas etapas em rascunho"
ON public.contrato_etapas FOR DELETE TO authenticated
USING (public.eh_admin(auth.uid()) AND status = 'rascunho');

-- Depois que o PDF é gerado os dados ficam travados e o hash não muda mais.
CREATE OR REPLACE FUNCTION public.contrato_etapas_bloqueia_alteracao()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $fn$
BEGIN
  IF OLD.status <> 'rascunho' THEN
    IF NEW.dados IS DISTINCT FROM OLD.dados THEN
      RAISE EXCEPTION 'Os dados desta etapa foram travados na geração do PDF.';
    END IF;
    IF OLD.pdf_sha256 IS NOT NULL AND NEW.pdf_sha256 IS DISTINCT FROM OLD.pdf_sha256 THEN
      RAISE EXCEPTION 'O hash do PDF já emitido não pode ser alterado.';
    END IF;
  END IF;

  NEW.atualizado_em := now();
  RETURN NEW;
END;
$fn$;

REVOKE ALL ON FUNCTION public.contrato_etapas_bloqueia_alteracao() FROM anon, authenticated, PUBLIC;

CREATE TRIGGER contrato_etapas_bloqueia_alteracao
BEFORE UPDATE ON public.contrato_etapas
FOR EACH ROW EXECUTE FUNCTION public.contrato_etapas_bloqueia_alteracao();

-- ---------------------------------------------------------------------------
-- 6. Anexos do dossiê
-- ---------------------------------------------------------------------------

CREATE TABLE public.contrato_anexos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dossie_id uuid NOT NULL REFERENCES public.dossies(id) ON DELETE CASCADE,
  contrato_id uuid REFERENCES public.contratos(id) ON DELETE SET NULL,
  tipo text NOT NULL CHECK (tipo IN (
    'nota_fiscal_entrada', 'foto_frente', 'foto_traseira', 'foto_imei',
    'contrato_assinado', 'documento_pessoal', 'outro'
  )),
  path text NOT NULL,
  nome_original text NOT NULL,
  mime text,
  tamanho integer,
  visivel_publico boolean NOT NULL DEFAULT false,
  criado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX contrato_anexos_dossie_idx ON public.contrato_anexos (dossie_id, tipo);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contrato_anexos TO authenticated;
GRANT ALL ON public.contrato_anexos TO service_role;

ALTER TABLE public.contrato_anexos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins leem anexos"
ON public.contrato_anexos FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE POLICY "Admins criam anexos"
ON public.contrato_anexos FOR INSERT TO authenticated
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam anexos"
ON public.contrato_anexos FOR UPDATE TO authenticated
USING (public.eh_admin(auth.uid()))
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins excluem anexos"
ON public.contrato_anexos FOR DELETE TO authenticated
USING (public.eh_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 7. Registro de acesso à página pública do QR
-- ---------------------------------------------------------------------------

CREATE TABLE public.dossie_acessos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dossie_id uuid REFERENCES public.dossies(id) ON DELETE SET NULL,
  acessado_em timestamptz NOT NULL DEFAULT now(),
  ip_hash text,
  user_agent text,
  resultado text NOT NULL
    CHECK (resultado IN ('ok', 'token_invalido', 'token_desativado', 'limite'))
);

CREATE INDEX dossie_acessos_dossie_idx ON public.dossie_acessos (dossie_id, acessado_em DESC);
CREATE INDEX dossie_acessos_em_idx ON public.dossie_acessos (acessado_em DESC);

-- Só a server function (service role) escreve aqui; o admin apenas lê.
GRANT SELECT ON public.dossie_acessos TO authenticated;
GRANT ALL ON public.dossie_acessos TO service_role;

ALTER TABLE public.dossie_acessos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins leem acessos"
ON public.dossie_acessos FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 8. Bucket privado `contratos`
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('contratos', 'contratos', false, 20971520)
ON CONFLICT (id) DO UPDATE
  SET public = false, file_size_limit = 20971520;

-- Nenhuma policy de leitura pública: a página do QR recebe apenas URLs
-- assinadas, geradas pela server function com a service role key.
CREATE POLICY "Admins leem arquivos de contratos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'contratos' AND public.eh_admin(auth.uid()));

CREATE POLICY "Admins enviam arquivos de contratos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'contratos' AND public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam arquivos de contratos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'contratos' AND public.eh_admin(auth.uid()))
WITH CHECK (bucket_id = 'contratos' AND public.eh_admin(auth.uid()));

CREATE POLICY "Admins excluem arquivos de contratos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'contratos' AND public.eh_admin(auth.uid()));
