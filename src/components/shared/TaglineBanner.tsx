import { Reveal } from "@/components/ui/Reveal";
import letreiro from "@/assets/images/letreiro-apaixonados.webp.asset.json";

/**
 * Faixa full-bleed com o letreiro da loja.
 * A foto é de celular e tem resolução baixa: leve blur + overlay escuro
 * disfarçam a pixelação em telas grandes.
 * TODO: [CONFIRMAR: pedir fotos em resolução alta pro Adriano]
 */
export function TaglineBanner() {
  return (
    <section
      aria-labelledby="tagline-banner"
      className="relative isolate overflow-hidden bg-plum-dark"
    >
      <img
        src={letreiro.url}
        alt="Letreiro na parede da loja com a frase Somos apaixonados pela Apple"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-[0.5px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,9,12,0.85),rgba(10,9,12,0.6))]"
      />
      <Reveal className="relative mx-auto max-w-[900px] px-6 py-24 text-center md:py-32">
        <h2
          id="tagline-banner"
          className="type-h2 text-white uppercase"
        >
          Somos apaixonados pela Apple
        </h2>
        <p className="type-body-lg mx-auto mt-5 max-w-[560px] text-white/70">
          Está escrito na parede da loja porque é o que a gente faz o dia inteiro:
          vender, cuidar e consertar produto Apple em Guarapuava.
        </p>
      </Reveal>
    </section>
  );
}
