/**
 * Desenho do QR Code que vai na ficha do dossiê e na etiqueta do aparelho.
 *
 * A biblioteca `qrcode` entra por import dinâmico, igual ao jspdf em
 * gerar-pdf.ts: ela só é baixada quando alguém abre uma tela do painel que
 * mostra o código, e nunca entra no pacote das páginas do site.
 */

export interface OpcoesQr {
  /** Lado da imagem em pixels. 512 px cobre uma etiqueta impressa a 600 dpi. */
  tamanho?: number;
  /** Margem em módulos (os quadradinhos do código). O layout já dá o respiro. */
  margem?: number;
}

type ModuloQrCode = typeof import("qrcode");

/** PNG em data URL, pronto para o `src` de uma `<img>`. */
export async function gerarQrDataUrl(texto: string, opcoes: OpcoesQr = {}): Promise<string> {
  const modulo = (await import("qrcode")) as ModuloQrCode & { default?: ModuloQrCode };
  const QRCode = modulo.default ?? modulo;

  return QRCode.toDataURL(texto, {
    // "M" corrige até 15% do código: aguenta o desgaste normal de uma etiqueta
    // colada na caixa sem engordar demais a matriz.
    errorCorrectionLevel: "M",
    margin: opcoes.margem ?? 0,
    width: opcoes.tamanho ?? 512,
    color: { dark: "#000000ff", light: "#ffffffff" },
  });
}
