REVOKE ALL ON FUNCTION public.criar_perfil_novo_usuario() FROM anon, authenticated, PUBLIC;
REVOKE ALL ON FUNCTION public.set_atualizado_em() FROM anon, authenticated, PUBLIC;
REVOKE ALL ON FUNCTION public.eh_admin(uuid) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.eh_admin(uuid) TO authenticated;