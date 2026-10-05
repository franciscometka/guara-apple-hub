-- Etapa (e): QR Code, etiqueta e página pública /d/<token>.
--
-- O trabalho desta etapa é quase todo de aplicação (server function com
-- service role). No banco ficam só duas garantias que a aplicação não pode
-- dar sozinha.
--
-- Rode depois de 20261004130000_contratos_revoga_anon.sql.

-- ---------------------------------------------------------------------------
-- 1. Documento do cliente nunca aparece na página pública
-- ---------------------------------------------------------------------------
--
-- A tela do dossiê já não deixa marcar RG/CNH como visível, e a server
-- function filtra o tipo antes de montar a página. Esta constraint é a
-- terceira camada: nem um UPDATE manual no painel do Supabase consegue
-- publicar um documento pessoal.

UPDATE public.contrato_anexos
   SET visivel_publico = false
 WHERE visivel_publico AND tipo = 'documento_pessoal';

ALTER TABLE public.contrato_anexos
  ADD CONSTRAINT contrato_anexos_documento_pessoal_privado
  CHECK (NOT (visivel_publico AND tipo = 'documento_pessoal'));

-- ---------------------------------------------------------------------------
-- 2. Índice do rate limit por IP
-- ---------------------------------------------------------------------------
--
-- A cada acesso à página pública a server function conta quantas vezes aquele
-- hash de IP apareceu na última hora. Sem este índice a consulta varreria a
-- tabela inteira.

CREATE INDEX dossie_acessos_ip_idx
  ON public.dossie_acessos (ip_hash, acessado_em DESC);
