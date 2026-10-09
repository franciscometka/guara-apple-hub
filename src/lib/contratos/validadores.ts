/**
 * Validações e máscaras usadas pelos assistentes de contrato.
 *
 * Tudo aqui é função pura sobre string/número: os componentes de input e o
 * motor do assistente consomem estas funções, e as mensagens de erro saem
 * prontas em português para aparecerem abaixo do campo.
 */

/** Mantém só os dígitos. */
export const soDigitos = (valor: string): string => valor.replace(/\D+/g, "");

// ---------------------------------------------------------------------------
// CPF e CNPJ
// ---------------------------------------------------------------------------

/** CPF com dígito verificador. Aceita com ou sem pontuação. */
export function cpfValido(valor: string): boolean {
  const d = soDigitos(valor);
  if (d.length !== 11) return false;
  // 00000000000, 11111111111… são formalmente válidos no cálculo, mas não existem.
  if (/^(\d)\1{10}$/.test(d)) return false;

  for (const [tamanho, posicaoDigito] of [
    [9, 9],
    [10, 10],
  ] as const) {
    let soma = 0;
    for (let i = 0; i < tamanho; i += 1) {
      soma += Number(d[i]) * (tamanho + 1 - i);
    }
    const resto = (soma * 10) % 11;
    const digito = resto === 10 || resto === 11 ? 0 : resto;
    if (digito !== Number(d[posicaoDigito])) return false;
  }
  return true;
}

/** CNPJ com dígito verificador. Aceita com ou sem pontuação. */
export function cnpjValido(valor: string): boolean {
  const d = soDigitos(valor);
  if (d.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(d)) return false;

  const calcular = (tamanho: number): number => {
    let peso = tamanho - 7;
    let soma = 0;
    for (let i = 0; i < tamanho; i += 1) {
      soma += Number(d[i]) * peso;
      peso -= 1;
      if (peso < 2) peso = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return calcular(12) === Number(d[12]) && calcular(13) === Number(d[13]);
}

export const formatarCpf = (valor: string): string => {
  const d = soDigitos(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
};

export const formatarCnpj = (valor: string): string => {
  const d = soDigitos(valor).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

/** Escolhe a máscara pelo tamanho: até 11 dígitos é CPF, acima disso CNPJ. */
export const formatarCpfCnpj = (valor: string): string =>
  soDigitos(valor).length > 11 ? formatarCnpj(valor) : formatarCpf(valor);

// ---------------------------------------------------------------------------
// CEP, telefone, e-mail, UF
// ---------------------------------------------------------------------------

export const cepValido = (valor: string): boolean => soDigitos(valor).length === 8;

export const formatarCep = (valor: string): string =>
  soDigitos(valor)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");

/** Telefone brasileiro: 10 dígitos (fixo) ou 11 (celular, começando com 9). */
export function telefoneValido(valor: string): boolean {
  const d = soDigitos(valor);
  if (d.length !== 10 && d.length !== 11) return false;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (d.length === 11 && d[2] !== "9") return false;
  return true;
}

export const formatarTelefone = (valor: string): string => {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.replace(/^(\d{0,2})/, "($1");
  if (d.length <= 6) return d.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

export const emailValido = (valor: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());

export const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

export type UF = (typeof UFS)[number];

export const ufValida = (valor: string): boolean =>
  (UFS as readonly string[]).includes(valor.trim().toUpperCase());

// ---------------------------------------------------------------------------
// IMEI
// ---------------------------------------------------------------------------

/** Dígito verificador de Luhn, usado no último dígito do IMEI. */
function luhnOk(digitos: string): boolean {
  let soma = 0;
  let dobra = false;
  for (let i = digitos.length - 1; i >= 0; i -= 1) {
    let n = Number(digitos[i]);
    if (dobra) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    soma += n;
    dobra = !dobra;
  }
  return soma % 10 === 0;
}

/** IMEI: exatamente 15 dígitos com checagem de Luhn. */
export function imeiValido(valor: string): boolean {
  const d = soDigitos(valor);
  if (d.length !== 15) return false;
  if (/^(\d)\1{14}$/.test(d)) return false;
  return luhnOk(d);
}

export const formatarImei = (valor: string): string => soDigitos(valor).slice(0, 15);

// ---------------------------------------------------------------------------
// Cartão: só os 4 últimos dígitos entram no sistema
// ---------------------------------------------------------------------------

/**
 * Detecta um número de cartão completo colado em qualquer campo de texto.
 * Qualquer sequência de 13 a 19 dígitos (ignorando espaços e hífens que
 * separam grupos) é tratada como número de cartão e bloqueada.
 */
export function pareceNumeroDeCartao(valor: string): boolean {
  const limpo = valor.replace(/[\s.-]+/g, "");
  return /(?:^|\D)\d{13,19}(?:\D|$)/.test(limpo);
}

export const ultimos4Validos = (valor: string): boolean => /^\d{4}$/.test(soDigitos(valor));

// ---------------------------------------------------------------------------
// Dinheiro (BRL)
// ---------------------------------------------------------------------------

const formatadorBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatadorNumero = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1234.5 → "R$ 1.234,50" */
export const formatarDinheiro = (valor: number): string => formatadorBRL.format(valor);

/** 1234.5 → "1.234,50" (sem o símbolo, para dentro do input). */
export const formatarValor = (valor: number): string => formatadorNumero.format(valor);

/**
 * Lê o que foi digitado no MoneyInput. Trata os dígitos como centavos, que é
 * como a máscara de moeda se comporta: digitar "1234" vira 12,34.
 */
export function lerCentavos(texto: string): number {
  const d = soDigitos(texto);
  if (d === "") return 0;
  return Number(d) / 100;
}

/** Compara valores monetários tolerando o arredondamento de centavos. */
export const mesmoValor = (a: number, b: number): boolean => Math.abs(a - b) < 0.005;

// ---------------------------------------------------------------------------
// Datas
// ---------------------------------------------------------------------------

/** Aceita o formato ISO curto usado pelos inputs date (YYYY-MM-DD). */
export function dataValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const ano = Number(valor.slice(0, 4));
  const mes = Number(valor.slice(5, 7));
  const dia = Number(valor.slice(8, 10));
  if (mes < 1 || mes > 12) return false;
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return (
    data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia
  );
}

export const horaValida = (valor: string): boolean => /^([01]\d|2[0-3]):[0-5]\d$/.test(valor);

/** "2026-03-09" → "09/03/2026". Devolve "" para entrada vazia ou inválida. */
export function dataParaBR(valor: string | null | undefined): string {
  if (!valor || !dataValida(valor.slice(0, 10))) return "";
  const iso = valor.slice(0, 10);
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
}

/**
 * Formata como data quando é uma data; caso contrário devolve o próprio texto.
 * É o que deixa um campo dispensado ("não se aplica") chegar inteiro ao PDF.
 */
export const dataOuTexto = (valor: string): string => dataParaBR(valor) || valor;

// ---------------------------------------------------------------------------
// Mensagens padrão
// ---------------------------------------------------------------------------

export const ERROS = {
  obrigatorio: "Preencha este campo para continuar.",
  cpf: "CPF inválido.",
  cnpj: "CNPJ inválido.",
  cep: "CEP inválido: confira os 8 dígitos.",
  telefone: "Telefone inválido: informe DDD e número.",
  email: "E-mail inválido.",
  uf: "UF inválida.",
  imei: "IMEI inválido: confira os 15 dígitos.",
  data: "Data inválida.",
  hora: "Horário inválido.",
  valorPositivo: "Informe um valor maior que zero.",
  ultimos4: "Informe exatamente os 4 últimos dígitos.",
  cartaoCompleto: "Nunca digite o número completo do cartão. Informe somente os 4 últimos dígitos.",
  arquivoGrande: "Esse arquivo é muito grande (máximo 80 MB).",
} as const;

/** "A soma dos valores não fecha com o preço total (faltam R$ 150,00)." */
export const erroSoma = (diferenca: number): string =>
  diferenca > 0
    ? `A soma dos valores não fecha com o preço total (faltam ${formatarDinheiro(diferenca)}).`
    : `A soma dos valores não fecha com o preço total (sobram ${formatarDinheiro(-diferenca)}).`;
