-- Tira o privilégio de SELECT que o papel `anon` recebe por default privilege
-- do projeto nas tabelas novas do módulo de contratos.
--
-- Hoje a RLS já bloqueia (a consulta anônima volta vazia, porque nenhuma
-- policy contempla `anon`). Isto é a segunda camada: sem o GRANT, um erro
-- futuro de policy não tem como expor linha nenhuma.
--
-- Rode depois de 20261004120000_contratos.sql.

REVOKE ALL ON public.loja_config FROM anon;
REVOKE ALL ON public.contrato_numeracao FROM anon;
REVOKE ALL ON public.dossies FROM anon;
REVOKE ALL ON public.contratos FROM anon;
REVOKE ALL ON public.contrato_etapas FROM anon;
REVOKE ALL ON public.contrato_anexos FROM anon;
REVOKE ALL ON public.dossie_acessos FROM anon;
