-- 1. Lista de administradores
CREATE TABLE public.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admins TO authenticated;
GRANT ALL ON public.admins TO service_role;

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Função de checagem (security definer, evita recursão nas policies)
CREATE OR REPLACE FUNCTION public.eh_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = _user_id);
$$;

CREATE POLICY "Admins leem a lista de admins"
ON public.admins FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

-- Popula com as contas existentes hoje
INSERT INTO public.admins (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- 2. Produtos: escrita só para admins
DROP POLICY IF EXISTS "Autenticados criam produtos" ON public.produtos;
DROP POLICY IF EXISTS "Autenticados atualizam produtos" ON public.produtos;
DROP POLICY IF EXISTS "Autenticados excluem produtos" ON public.produtos;

CREATE POLICY "Admins criam produtos"
ON public.produtos FOR INSERT TO authenticated
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam produtos"
ON public.produtos FOR UPDATE TO authenticated
USING (public.eh_admin(auth.uid()))
WITH CHECK (public.eh_admin(auth.uid()));

CREATE POLICY "Admins excluem produtos"
ON public.produtos FOR DELETE TO authenticated
USING (public.eh_admin(auth.uid()));

-- 3. Fotos de produto no storage: escrita só para admins
DROP POLICY IF EXISTS "Autenticados enviam fotos de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Autenticados atualizam fotos de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Autenticados excluem fotos de produtos" ON storage.objects;

CREATE POLICY "Admins enviam fotos de produtos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'produtos-fotos' AND public.eh_admin(auth.uid()));

CREATE POLICY "Admins atualizam fotos de produtos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'produtos-fotos' AND public.eh_admin(auth.uid()))
WITH CHECK (bucket_id = 'produtos-fotos' AND public.eh_admin(auth.uid()));

CREATE POLICY "Admins excluem fotos de produtos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'produtos-fotos' AND public.eh_admin(auth.uid()));

-- 4. Perfis de cliente
CREATE TABLE public.perfis (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text,
  telefone text,
  email text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.perfis TO authenticated;
GRANT DELETE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada um le o proprio perfil"
ON public.perfis FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins leem todos os perfis"
ON public.perfis FOR SELECT TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE POLICY "Cada um cria o proprio perfil"
ON public.perfis FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Cada um edita o proprio perfil"
ON public.perfis FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins excluem cadastros"
ON public.perfis FOR DELETE TO authenticated
USING (public.eh_admin(auth.uid()));

CREATE TRIGGER perfis_set_atualizado_em
BEFORE UPDATE ON public.perfis
FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

-- 5. Cria o perfil automaticamente no cadastro
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, telefone, email)
  VALUES (
    NEW.id,
    NULLIF(COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'), ''),
    NULLIF(COALESCE(NEW.raw_user_meta_data ->> 'telefone', ''), ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.criar_perfil_novo_usuario();