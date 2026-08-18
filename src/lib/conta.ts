import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export interface Perfil {
  id: string;
  nome: string | null;
  telefone: string | null;
  email: string | null;
  criado_em: string;
}

export async function cadastrarCliente(dados: {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
}): Promise<{ precisaConfirmar: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email: dados.email.trim(),
    password: dados.senha,
    options: {
      emailRedirectTo: `${window.location.origin}/minha-conta`,
      // O trigger no banco cria a linha em `perfis` lendo estes campos.
      data: { nome: dados.nome.trim(), telefone: dados.telefone.trim() },
    },
  });
  if (error) throw error;
  return { precisaConfirmar: data.session === null };
}

export async function entrarCliente(email: string, senha: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  });
  if (error) throw error;
}

/**
 * Login com Google via broker do Lovable Cloud.
 * O provedor Google já está habilitado no backend. Caso ele seja desativado
 * (ou o cliente OAuth próprio da loja seja configurado com credenciais
 * inválidas no painel do backend: Users -> Authentication Settings ->
 * Sign In Methods -> Google), esta chamada devolve erro e a tela mostra uma
 * mensagem amigável em vez de quebrar.
 */
export async function entrarComGoogle(): Promise<void> {
  const resultado = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin,
  });
  if (resultado && "error" in resultado && resultado.error) {
    throw resultado.error;
  }
}

export async function obterMeuPerfil(): Promise<Perfil | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from("perfis")
    .select("id, nome, telefone, email, criado_em")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (error) throw error;
  if (data) return data;
  return {
    id: auth.user.id,
    nome: null,
    telefone: null,
    email: auth.user.email ?? null,
    criado_em: auth.user.created_at,
  };
}

export async function salvarMeuPerfil(dados: {
  nome: string;
  telefone: string;
  email: string;
}): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Sessão expirada.");
  const { error } = await supabase.from("perfis").upsert({
    id: auth.user.id,
    nome: dados.nome.trim() || null,
    telefone: dados.telefone.trim() || null,
    email: dados.email.trim() || null,
  });
  if (error) throw error;
}

export function mensagemErroAuth(erro: unknown): string {
  const msg = erro instanceof Error ? erro.message : String(erro);
  if (/Invalid login credentials/i.test(msg)) return "E-mail ou senha inválidos.";
  if (/User already registered/i.test(msg))
    return "Já existe uma conta com esse e-mail. Tente entrar.";
  if (/Password should be at least/i.test(msg))
    return "A senha precisa ter pelo menos 6 caracteres.";
  if (/Email not confirmed/i.test(msg))
    return "Confirme seu e-mail antes de entrar.";
  if (/provider is not enabled|Unsupported provider|not enabled/i.test(msg))
    return "Entrar com Google ainda não está disponível. Use e-mail e senha.";
  return "Não foi possível concluir. Tente novamente em instantes.";
}
