const ALFABETO = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Token do QR Code: 32 caracteres base62 sorteados com crypto.getRandomValues
 * (~190 bits), impossível de adivinhar. É o que vai na URL /d/<token>.
 *
 * O sorteio descarta os bytes que cairiam fora de um múltiplo de 62, para não
 * enviesar as primeiras letras do alfabeto.
 */
export function gerarToken(tamanho = 32): string {
  const limite = Math.floor(256 / ALFABETO.length) * ALFABETO.length;
  let saida = "";

  while (saida.length < tamanho) {
    const bytes = new Uint8Array(tamanho);
    crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      if (byte >= limite) continue;
      saida += ALFABETO[byte % ALFABETO.length];
      if (saida.length === tamanho) break;
    }
  }

  return saida;
}

/** URL pública impressa na etiqueta do aparelho. */
export const urlDoDossie = (token: string): string => `https://guaraiphones.com.br/d/${token}`;
