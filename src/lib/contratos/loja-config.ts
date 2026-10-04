import { db, type LojaConfigRow } from "./database";
import {
  cepValido,
  cnpjValido,
  cpfValido,
  emailValido,
  ERROS,
  telefoneValido,
  ufValida,
} from "./validadores";

/**
 * "Dados da loja": preenchidos uma vez em /admin/contratos/configuracao e
 * reaproveitados como parte VENDEDORA/EMPRESA em todos os contratos.
 *
 * É uma linha única na tabela (`id` booleano com CHECK), então o save sempre
 * faz upsert sobre id = true.
 */

export interface DadosLoja {
  razao_social: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  representante: string;
  representante_cpf: string;
  canal_atendimento: string;
  endereco_atendimento: string;
}

export const LOJA_VAZIA: DadosLoja = {
  razao_social: "",
  cnpj: "",
  endereco: "",
  cidade: "",
  uf: "",
  cep: "",
  telefone: "",
  email: "",
  representante: "",
  representante_cpf: "",
  canal_atendimento: "",
  endereco_atendimento: "",
};

/** Rótulo de cada campo, usado nos erros e na lista do que falta preencher. */
export const ROTULOS_LOJA: Record<keyof DadosLoja, string> = {
  razao_social: "Razão social",
  cnpj: "CNPJ",
  endereco: "Endereço completo",
  cidade: "Cidade",
  uf: "UF",
  cep: "CEP",
  telefone: "Telefone/WhatsApp",
  email: "E-mail",
  representante: "Representante legal",
  representante_cpf: "CPF do representante",
  canal_atendimento: "Canal oficial de atendimento e reclamações",
  endereco_atendimento: "Endereço para atendimento",
};

const CAMPOS: (keyof DadosLoja)[] = Object.keys(ROTULOS_LOJA) as (keyof DadosLoja)[];

export async function carregarDadosLoja(): Promise<DadosLoja> {
  const { data, error } = await db.from("loja_config").select("*").eq("id", true).maybeSingle();
  if (error) throw error;
  if (!data) return { ...LOJA_VAZIA };

  const linha = data as LojaConfigRow;
  const preenchido = { ...LOJA_VAZIA };
  for (const campo of CAMPOS) {
    preenchido[campo] = linha[campo] ?? "";
  }
  return preenchido;
}

export async function salvarDadosLoja(dados: DadosLoja): Promise<void> {
  const { error } = await db
    .from("loja_config")
    .upsert({ id: true, ...dados }, { onConflict: "id" });
  if (error) throw error;
}

/** Erro por campo, ou objeto vazio quando está tudo certo. */
export function validarDadosLoja(dados: DadosLoja): Partial<Record<keyof DadosLoja, string>> {
  const erros: Partial<Record<keyof DadosLoja, string>> = {};

  for (const campo of CAMPOS) {
    if (dados[campo].trim() === "") erros[campo] = ERROS.obrigatorio;
  }

  if (!erros.cnpj && !cnpjValido(dados.cnpj)) erros.cnpj = ERROS.cnpj;
  if (!erros.cep && !cepValido(dados.cep)) erros.cep = ERROS.cep;
  if (!erros.uf && !ufValida(dados.uf)) erros.uf = ERROS.uf;
  if (!erros.telefone && !telefoneValido(dados.telefone)) erros.telefone = ERROS.telefone;
  if (!erros.email && !emailValido(dados.email)) erros.email = ERROS.email;
  if (!erros.representante_cpf && !cpfValido(dados.representante_cpf)) {
    erros.representante_cpf = ERROS.cpf;
  }

  return erros;
}

/**
 * Lista de rótulos que ainda faltam. Vazia significa que a loja já pode emitir
 * contratos; qualquer item bloqueia a criação de contrato novo.
 */
export function faltaNaConfiguracao(dados: DadosLoja): string[] {
  const erros = validarDadosLoja(dados);
  return CAMPOS.filter((campo) => erros[campo]).map((campo) => ROTULOS_LOJA[campo]);
}

export const configuracaoCompleta = (dados: DadosLoja): boolean =>
  faltaNaConfiguracao(dados).length === 0;
