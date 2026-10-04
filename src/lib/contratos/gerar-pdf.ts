import type { DadosContrato } from "./campos/tipos";
import type { BlocoDoc, DefModelo } from "./modelos/tipos";
import { CREDITO_MODELO } from "./modelos/tipos";
import { textoDe } from "./campos/tipos";
import { sha256 } from "./hash";

/**
 * Geração do PDF no navegador.
 *
 * A biblioteca entra por import dinâmico: só é baixada quando alguém aperta
 * "Gerar PDF", e não pesa no bundle das outras telas do painel.
 *
 * O layout repete o do PDF original (A4, mesma ordem de cláusulas, mesmas
 * lacunas preenchidas), com duas trocas combinadas: o cabeçalho usa o nome da
 * Guara iPhones no lugar do cabeçalho do escritório, e a marca d'água não é
 * reproduzida. A linha de crédito do modelo continua no rodapé de toda página.
 */

const MARGEM_X = 18;
const MARGEM_TOPO = 22;
const MARGEM_RODAPE = 22;
const LARGURA_A4 = 210;
const ALTURA_A4 = 297;
const LARGURA_TEXTO = LARGURA_A4 - MARGEM_X * 2;

const TAM_CORPO = 9.5;
const TAM_TITULO = 13;
const TAM_SECAO = 11;
const TAM_RODAPE = 6.2;
const ENTRELINHA = 1.35;

/**
 * As fontes padrão do PDF usam WinAnsiEncoding, mas o jsPDF descarta todo
 * caractere acima de U+00FF — era assim que o travessão de "Lei nº 8.078/1990 –
 * Código de Defesa do Consumidor" sumia do documento.
 *
 * Aqui cada tipográfico é remapeado para a posição que ele ocupa no
 * WinAnsiEncoding, de 0x80 a 0x9F. O glifo impresso é o mesmo: isto é correção
 * de codificação, não alteração do texto do contrato.
 */
const WIN_ANSI: Record<string, string> = {
  "€": "\u0080", // €
  "‚": "\u0082", // ‚
  ƒ: "\u0083", // ƒ
  "„": "\u0084", // „
  "…": "\u0085", // …
  "†": "\u0086", // †
  "‡": "\u0087", // ‡
  ˆ: "\u0088", // ˆ
  "‰": "\u0089", // ‰
  Š: "\u008A", // Š
  "‹": "\u008B", // ‹
  Œ: "\u008C", // Œ
  Ž: "\u008E", // Ž
  "‘": "\u0091", // '
  "’": "\u0092", // '
  "“": "\u0093", // "
  "”": "\u0094", // "
  "•": "\u0095", // •
  "–": "\u0096", // –
  "—": "\u0097", // —
  "˜": "\u0098", // ˜
  "™": "\u0099", // ™
  š: "\u009A", // š
  "›": "\u009B", // ›
  œ: "\u009C", // œ
  ž: "\u009E", // ž
  Ÿ: "\u009F", // Ÿ
};

const RE_TIPOGRAFICOS = new RegExp(`[${Object.keys(WIN_ANSI).join("")}]`, "g");

/** Prepara o texto para as fontes padrão do PDF. Aplicar duas vezes é inócuo. */
export const paraWinAnsi = (texto: string): string =>
  texto.replace(RE_TIPOGRAFICOS, (c) => WIN_ANSI[c] ?? c);

/** Troca {{campo}} pelo valor preenchido. Lacuna sem valor nunca fica vazia. */
export function preencher(texto: string, dados: DadosContrato): string {
  const substituido = texto.replace(/\{\{(\w+)\}\}/g, (_, nome: string) => {
    const valor = textoDe(dados, nome).trim();
    return valor === "" ? "—" : valor;
  });
  return paraWinAnsi(substituido);
}

/** Junta o que foi digitado com o que é calculado na hora de imprimir. */
export const dadosParaImpressao = (modelo: DefModelo, dados: DadosContrato): DadosContrato => ({
  ...dados,
  ...(modelo.derivados?.(dados) ?? {}),
});

export interface PdfGerado {
  blob: Blob;
  bytes: Uint8Array;
  sha256: string;
}

export async function gerarPdf(
  modelo: DefModelo,
  dadosBrutos: DadosContrato,
  nomeLoja: string,
): Promise<PdfGerado> {
  const { jsPDF } = await import("jspdf");
  const dados = dadosParaImpressao(modelo, dadosBrutos);

  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  let y = MARGEM_TOPO;

  const alturaLinha = (tamanho: number) => (tamanho * ENTRELINHA) / 2.83465;

  /** Começa uma página nova quando o bloco não cabe no que sobrou. */
  function garantirEspaco(altura: number) {
    if (y + altura <= ALTURA_A4 - MARGEM_RODAPE) return;
    doc.addPage();
    y = MARGEM_TOPO;
  }

  function escrever(
    texto: string,
    opcoes: {
      tamanho?: number;
      estilo?: "normal" | "bold";
      alinhamento?: "left" | "center" | "justify";
      recuo?: number;
      espacoDepois?: number;
    } = {},
  ) {
    const tamanho = opcoes.tamanho ?? TAM_CORPO;
    const recuo = opcoes.recuo ?? 0;
    doc.setFont("helvetica", opcoes.estilo ?? "normal");
    doc.setFontSize(tamanho);

    const largura = LARGURA_TEXTO - recuo;
    const linhas = doc.splitTextToSize(paraWinAnsi(texto), largura) as string[];
    const passo = alturaLinha(tamanho);

    for (const linha of linhas) {
      garantirEspaco(passo);
      if (opcoes.alinhamento === "center") {
        doc.text(linha, LARGURA_A4 / 2, y, { align: "center" });
      } else {
        doc.text(linha, MARGEM_X + recuo, y);
      }
      y += passo;
    }
    y += opcoes.espacoDepois ?? 0;
  }

  function bloco(b: BlocoDoc) {
    switch (b.t) {
      case "titulo":
        garantirEspaco(14);
        escrever(preencher(b.texto, dados), {
          tamanho: TAM_TITULO,
          estilo: "bold",
          alinhamento: "center",
          espacoDepois: 5,
        });
        break;

      case "secao": {
        garantirEspaco(12);
        y += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(TAM_SECAO);
        doc.text(paraWinAnsi(`${b.numero} | ${b.titulo}`), MARGEM_X, y);
        y += alturaLinha(TAM_SECAO) + 1.5;
        break;
      }

      case "rotulo":
        garantirEspaco(8);
        y += 1.5;
        escrever(preencher(b.texto, dados), { estilo: "bold", espacoDepois: 1.5 });
        break;

      case "p": {
        // O prefixo ("1.1.", "EMPRESA RESPONSÁVEL:") sai em negrito na mesma
        // linha do texto, como no documento original.
        const corpo = preencher(b.texto, dados);
        if (!b.prefixo) {
          escrever(corpo, { alinhamento: "justify", espacoDepois: 2 });
          break;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(TAM_CORPO);
        const larguraPrefixo = doc.getTextWidth(paraWinAnsi(`${b.prefixo} `));

        const passo = alturaLinha(TAM_CORPO);
        doc.setFont("helvetica", "normal");
        const primeira = doc.splitTextToSize(corpo, LARGURA_TEXTO - larguraPrefixo) as string[];
        const resto = primeira.slice(1).join(" ");

        garantirEspaco(passo);
        doc.setFont("helvetica", "bold");
        doc.text(paraWinAnsi(b.prefixo), MARGEM_X, y);
        doc.setFont("helvetica", "normal");
        doc.text(primeira[0] ?? "", MARGEM_X + larguraPrefixo, y);
        y += passo;

        if (resto) escrever(resto, { alinhamento: "justify" });
        y += 2;
        break;
      }

      case "itens":
        for (const item of b.itens) {
          escrever(`•  ${preencher(item, dados)}`, { recuo: 4 });
        }
        y += 2;
        break;

      case "grade": {
        const passo = alturaLinha(TAM_CORPO);
        const meia = LARGURA_TEXTO / 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(TAM_CORPO);

        for (const [esquerda, direita] of b.linhas) {
          garantirEspaco(passo + 1);
          doc.text(preencher(esquerda, dados), MARGEM_X, y);
          if (direita) doc.text(preencher(direita, dados), MARGEM_X + meia, y);
          y += passo + 1;
        }
        y += 1;
        break;
      }

      case "assinaturas": {
        const passo = alturaLinha(TAM_CORPO);
        const maior = Math.max(...b.colunas.map((c) => c.linhas.length));
        garantirEspaco(14 + maior * passo);
        y += 8;

        const largura = LARGURA_TEXTO / b.colunas.length;
        const topo = y;
        b.colunas.forEach((coluna, i) => {
          const x = MARGEM_X + largura * i;
          doc.setLineWidth(0.2);
          doc.line(x, topo, x + largura - 8, topo);

          let linhaY = topo + 4;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(TAM_CORPO);
          doc.text(preencher(coluna.titulo, dados), x, linhaY);
          linhaY += passo;

          doc.setFont("helvetica", "normal");
          for (const linha of coluna.linhas) {
            doc.text(preencher(linha, dados), x, linhaY);
            linhaY += passo;
          }
        });

        y = topo + 4 + (maior + 1) * passo + 3;
        break;
      }

      case "espaco":
        y += b.altura ?? 3;
        break;

      case "quebraPagina":
        doc.addPage();
        y = MARGEM_TOPO;
        break;

      default:
        break;
    }
  }

  for (const b of modelo.documento) bloco(b);

  // Cabeçalho da loja e rodapé com a linha de crédito, em todas as páginas.
  const paginas = doc.getNumberOfPages();
  for (let p = 1; p <= paginas; p += 1) {
    doc.setPage(p);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(paraWinAnsi(nomeLoja), MARGEM_X, 12);
    doc.setLineWidth(0.3);
    doc.line(MARGEM_X, 14.5, LARGURA_A4 - MARGEM_X, 14.5);

    doc.setLineWidth(0.2);
    doc.line(MARGEM_X, ALTURA_A4 - 19, LARGURA_A4 - MARGEM_X, ALTURA_A4 - 19);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(TAM_RODAPE);
    const credito = doc.splitTextToSize(
      paraWinAnsi(CREDITO_MODELO),
      LARGURA_TEXTO - 12,
    ) as string[];
    let rodapeY = ALTURA_A4 - 15;
    for (const linha of credito) {
      doc.text(linha, LARGURA_A4 / 2, rodapeY, { align: "center" });
      rodapeY += 2.4;
    }

    doc.setFontSize(8);
    doc.text(String(p), LARGURA_A4 - MARGEM_X, ALTURA_A4 - 15, { align: "right" });
  }

  const bytes = new Uint8Array(doc.output("arraybuffer"));
  const blob = new Blob([bytes], { type: "application/pdf" });
  return { blob, bytes, sha256: await sha256(bytes) };
}

/** Dispara o download do PDF já gerado. */
export function baixarPdf(blob: Blob, nomeArquivo: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
