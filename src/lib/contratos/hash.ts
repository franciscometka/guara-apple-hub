/** SHA-256 do PDF gerado, guardado junto com o contrato para conferência. */
export async function sha256(dados: ArrayBuffer | Uint8Array): Promise<string> {
  const buffer =
    dados instanceof Uint8Array
      ? (dados.buffer.slice(dados.byteOffset, dados.byteOffset + dados.byteLength) as ArrayBuffer)
      : dados;

  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
