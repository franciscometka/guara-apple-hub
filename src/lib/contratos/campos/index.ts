import type { DefModelo } from "../modelos/tipos";
import type { ModeloSlug } from "../modelos/catalogo";
import { MODELO_TERMO_GARANTIA } from "./termo-garantia-novo";

/**
 * Registro dos modelos disponíveis no motor do assistente.
 *
 * Para acrescentar um quinto modelo basta criar o arquivo de texto em
 * `modelos/` e o arquivo de passos aqui em `campos/`, e registrá-lo nesta
 * lista — nenhuma tela precisa mudar.
 */
const REGISTRO: Partial<Record<ModeloSlug, DefModelo>> = {
  "termo-garantia-novo": MODELO_TERMO_GARANTIA,
};

export const modeloImplementado = (slug: string): boolean => slug in REGISTRO;

export function obterModelo(slug: string): DefModelo {
  const modelo = REGISTRO[slug as ModeloSlug];
  if (!modelo) throw new Error(`Modelo de contrato não implementado: ${slug}`);
  return modelo;
}
