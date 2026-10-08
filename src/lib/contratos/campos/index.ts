import type { DefEtapaModelo, DefModelo } from "../modelos/tipos";
import type { ModeloSlug } from "../modelos/catalogo";
import type { EtapaContrato } from "../database";
import { MODELO_TERMO_GARANTIA } from "./termo-garantia-novo";
import { MODELO_PRE_RESERVA } from "./pre-reserva-iphone-18";
import { MODELO_CHECKLIST } from "./checklist-assistencia";
import { MODELO_UPGRADE } from "./upgrade-aparelho";
import { MODELO_COMPRA } from "./compra-iphone";

/**
 * Registro dos modelos disponíveis no motor do assistente.
 *
 * Para acrescentar um modelo basta criar o arquivo de texto em
 * `modelos/` e o arquivo de passos aqui em `campos/`, e registrá-lo nesta
 * lista — nenhuma tela precisa mudar.
 */
const REGISTRO: Partial<Record<ModeloSlug, DefModelo>> = {
  "termo-garantia-novo": MODELO_TERMO_GARANTIA,
  "pre-reserva-iphone-18": MODELO_PRE_RESERVA,
  "checklist-assistencia": MODELO_CHECKLIST,
  "upgrade-aparelho": MODELO_UPGRADE,
  "compra-iphone": MODELO_COMPRA,
};

export const modeloImplementado = (slug: string): boolean => slug in REGISTRO;

export function obterModelo(slug: string): DefModelo {
  const modelo = REGISTRO[slug as ModeloSlug];
  if (!modelo) throw new Error(`Modelo de contrato não implementado: ${slug}`);
  return modelo;
}

export function obterEtapaModelo(modelo: DefModelo, etapa: EtapaContrato): DefEtapaModelo {
  const encontrada = modelo.etapas.find((e) => e.etapa === etapa);
  if (!encontrada) throw new Error(`Etapa ${etapa} não existe no modelo ${modelo.slug}.`);
  return encontrada;
}

/** A primeira etapa é a que nasce junto com o contrato. */
export function etapaPrincipal(modelo: DefModelo): DefEtapaModelo {
  const primeira = modelo.etapas[0];
  if (!primeira) throw new Error(`Modelo ${modelo.slug} não tem etapas.`);
  return primeira;
}
