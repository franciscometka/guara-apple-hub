import type { ProdutoView } from "./produtos-shared";

/**
 * Capacidade não tem coluna própria no banco — vive dentro do `nome`
 * ("IPHONE 13 PINK 128GB SEMINOVO"). Cor tem coluna (`produtos.cor`), mas
 * só os cadastros mais recentes vêm com ela preenchida; para os produtos
 * antigos ainda é preciso adivinhar a cor a partir do nome, contra uma
 * lista fixa — por isso `extrairVariante` aceita a cor do banco como dica
 * e só cai para a lista fixa quando essa dica não vem ou não bate com o
 * nome. Isso evita depender de a lista fixa conhecer toda cor nova (ex.:
 * "BURGUNDY", "GLACIER") que passe a existir só no cadastro.
 *
 * Se um nome fugir do padrão, o produto simplesmente não ganha seletor —
 * nunca quebra a página.
 */

/** Cores observadas no catálogo. As compostas vêm antes para casar primeiro. */
const CORES = [
  "BLACK TITANIUM",
  "BLUE TITANIUM",
  "WHITE TITANIUM",
  "NATURAL TITANIUM",
  "TITANIUM NATURAL",
  "SPACE BLACK",
  "SPACE GRAY",
  "DEEP PURPLE",
  "DEEP BLUE",
  "COSMIC ORANGE",
  "ULTRAMARINE",
  "STARLIGHT",
  "MIDNIGHT",
  "LAVENDER",
  "DESERT",
  "SILVER",
  "BLACK",
  "WHITE",
  "GREEN",
  "BLUE",
  "PINK",
  "TEAL",
  "SAGE",
  "GOLD",
  "RED",
] as const;

/** Hex aproximado de cada cor, para o círculo do seletor. */
const HEX_CORES: Record<string, string> = {
  "BLACK TITANIUM": "#3b3b3d",
  "BLUE TITANIUM": "#3e4a5b",
  "WHITE TITANIUM": "#f2f1ed",
  "NATURAL TITANIUM": "#c2bcb2",
  "TITANIUM NATURAL": "#c2bcb2",
  "SPACE BLACK": "#22232a",
  "SPACE GRAY": "#54555a",
  "DEEP PURPLE": "#5c536a",
  "DEEP BLUE": "#39415c",
  "COSMIC ORANGE": "#d2622f",
  ULTRAMARINE: "#3f4ea8",
  STARLIGHT: "#f2ece4",
  MIDNIGHT: "#1f2430",
  LAVENDER: "#cfc3e3",
  DESERT: "#bda389",
  SILVER: "#e2e3e4",
  BLACK: "#1c1c1e",
  WHITE: "#f5f5f7",
  GREEN: "#4b6b56",
  BLUE: "#3a6ea5",
  PINK: "#e8c3ca",
  TEAL: "#8fb8b5",
  SAGE: "#9aa88f",
  GOLD: "#e0c9a6",
  RED: "#b8302f",
  BURGUNDY: "#6d2332",
  GLACIER: "#dce6ea",
};

export interface VarianteProduto {
  /** Ex.: "IPHONE 16 PRO MAX" — o que identifica o modelo entre irmãos. */
  modelo: string;
  /** Ex.: "BLACK TITANIUM", ou null se o nome não trouxer cor. */
  cor: string | null;
  /** Ex.: "256GB", ou null se o nome não trouxer capacidade. */
  capacidade: string | null;
}

/** Título amigável: "BLACK TITANIUM" -> "Black Titanium". */
export function formatarCor(cor: string): string {
  return cor
    .toLowerCase()
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function hexDaCor(cor: string): string {
  return HEX_CORES[cor] ?? "#9ca3af";
}

/**
 * @param corCadastrada Valor da coluna `produtos.cor`, quando o cadastro já
 * traz cor estruturada. Tem prioridade sobre a lista fixa `CORES` — assim
 * uma cor nova no catálogo (ex.: de um lançamento) agrupa corretamente
 * mesmo antes de alguém lembrar de adicioná-la na lista fixa.
 */
export function extrairVariante(nome: string, corCadastrada?: string | null): VarianteProduto {
  let resto = ` ${nome.toUpperCase().replace(/[()]/g, " ").replace(/\s+/g, " ")} `;

  // A condição já vive na coluna `condicao`; no nome é ruído para o agrupamento.
  resto = resto.replace(/ SEMINOVOS? /g, " ").replace(/ SEMNOVO /g, " ");
  resto = resto.replace(/ LACRADOS? /g, " ");

  const capMatch = resto.match(/ (\d+)\s?GB /);
  const capacidade = capMatch ? `${capMatch[1]}GB` : null;
  if (capMatch) resto = resto.replace(capMatch[0], " ");

  let cor: string | null = null;
  const corNormalizada = corCadastrada?.trim().replace(/\s+/g, " ").toUpperCase() || null;
  if (corNormalizada && resto.includes(` ${corNormalizada} `)) {
    cor = corNormalizada;
    resto = resto.replace(` ${corNormalizada} `, " ");
  } else {
    for (const c of CORES) {
      if (resto.includes(` ${c} `)) {
        cor = c;
        resto = resto.replace(` ${c} `, " ");
        break;
      }
    }
  }

  return { modelo: resto.replace(/\s+/g, " ").trim(), cor, capacidade };
}

/**
 * Entre várias unidades físicas da mesma variante, escolhe para onde o
 * seletor navega: a mais barata que esteja em estoque. Empate (ou nenhuma
 * com preço) resolve pela mais recente da lista recebida.
 */
function melhorUnidade(candidatos: ProdutoView[]): ProdutoView | null {
  if (candidatos.length === 0) return null;
  const emEstoque = candidatos.filter((p) => p.emEstoque);
  const pool = emEstoque.length > 0 ? emEstoque : candidatos;

  return pool.reduce((melhor, atual) => {
    const precoMelhor = precoEfetivo(melhor);
    const precoAtual = precoEfetivo(atual);
    // Sem preço cadastrado não dá para comparar: fica com a mais recente.
    if (precoMelhor === null) return atual;
    if (precoAtual === null) return melhor;
    return precoAtual < precoMelhor ? atual : melhor;
  });
}

/** O preço que o cliente de fato paga — promocional quando houver. */
export function precoEfetivo(p: ProdutoView): number | null {
  if (p.emPromocao && p.precoPromocional !== null) return p.precoPromocional;
  return p.preco;
}

export interface OpcaoVariante {
  valor: string;
  slug: string;
  /** A opção que corresponde ao produto aberto agora. */
  atual: boolean;
  emEstoque: boolean;
}

/**
 * Cores disponíveis para o mesmo modelo + capacidade + condição do produto
 * aberto. Cada opção aponta para o slug da melhor unidade daquela cor.
 */
export function coresIrmas(atual: ProdutoView, todos: ProdutoView[]): OpcaoVariante[] {
  const base = extrairVariante(atual.nome, atual.cor);
  if (!base.cor) return [];

  const porCor = new Map<string, ProdutoView[]>();
  for (const p of todos) {
    const v = extrairVariante(p.nome, p.cor);
    if (!v.cor) continue;
    if (v.modelo !== base.modelo) continue;
    if (v.capacidade !== base.capacidade) continue;
    if (p.condicao !== atual.condicao) continue;
    porCor.set(v.cor, [...(porCor.get(v.cor) ?? []), p]);
  }

  if (porCor.size < 2) return [];

  return [...porCor.entries()]
    .map(([cor, candidatos]) => {
      const escolhido = melhorUnidade(candidatos);
      if (!escolhido) return null;
      return {
        valor: cor,
        slug: escolhido.slug,
        atual: cor === base.cor,
        emEstoque: candidatos.some((p) => p.emEstoque),
      };
    })
    .filter((o): o is OpcaoVariante => o !== null)
    .sort((a, b) => a.valor.localeCompare(b.valor, "pt-BR"));
}

/**
 * Capacidades disponíveis para o mesmo modelo + cor + condição.
 * Ordena numericamente (128GB antes de 256GB), não alfabeticamente.
 */
export function capacidadesIrmas(atual: ProdutoView, todos: ProdutoView[]): OpcaoVariante[] {
  const base = extrairVariante(atual.nome, atual.cor);
  if (!base.capacidade) return [];

  const porCapacidade = new Map<string, ProdutoView[]>();
  for (const p of todos) {
    const v = extrairVariante(p.nome, p.cor);
    if (!v.capacidade) continue;
    if (v.modelo !== base.modelo) continue;
    if (v.cor !== base.cor) continue;
    if (p.condicao !== atual.condicao) continue;
    porCapacidade.set(v.capacidade, [...(porCapacidade.get(v.capacidade) ?? []), p]);
  }

  if (porCapacidade.size < 2) return [];

  return [...porCapacidade.entries()]
    .map(([cap, candidatos]) => {
      const escolhido = melhorUnidade(candidatos);
      if (!escolhido) return null;
      return {
        valor: cap,
        slug: escolhido.slug,
        atual: cap === base.capacidade,
        emEstoque: candidatos.some((p) => p.emEstoque),
      };
    })
    .filter((o): o is OpcaoVariante => o !== null)
    .sort((a, b) => parseInt(a.valor, 10) - parseInt(b.valor, 10));
}

/** Percentual de desconto arredondado, ex.: 10 para "-10%". */
export function percentualDesconto(precoOriginal: number, precoPromocional: number): number {
  if (precoOriginal <= 0) return 0;
  return Math.round(((precoOriginal - precoPromocional) / precoOriginal) * 100);
}
