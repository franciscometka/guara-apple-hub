export function anexoPodeSerPublicado(anexo: { visivel_publico: boolean; tipo: string }): boolean {
  return anexo.visivel_publico && anexo.tipo !== "documento_pessoal";
}

export function urlDoAnexoPublico(token: string, id: string): string {
  return `/api/public/dossie/${encodeURIComponent(token)}/arquivo/${encodeURIComponent(id)}`;
}

export function imagemHeic(mime: string): boolean {
  return ["image/heic", "image/heif"].includes(mime.toLowerCase().split(";")[0]?.trim() ?? "");
}