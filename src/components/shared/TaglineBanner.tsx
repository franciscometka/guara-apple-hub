import { Reveal } from "@/components/ui/Reveal";
import letreiro from "@/assets/images/letreiro-apaixonados.webp.asset.json";

/**
 * Seção tipográfica: a frase é a protagonista.
 * A foto do letreiro entra pequena, como selo (só desktop), porque a
 * resolução original é baixa e não aguenta full-bleed.
 * TODO: [CONFIRMAR: pedir o letreiro em resolução alta pro Adriano]
 */
export function TaglineBanner() {
  return (
    <section
      aria-labelledby="tagline-banner"
      className="relative isolate overflow-hidden bg-ink"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-violet)_55%,transparent),transparent_70%)] opacity-25 blur-3xl"
      />
      <Reveal className="relative mx-auto max-w-[1000px] px-6 py-24 text-center md:py-32">
        <p className="type-caption text-violet-glow">Guara iPhones</p>
        <h2
          id="tagline-banner"
          className="type-display mt-5 text-white uppercase"
        >
          Somos apaixonados pela Apple
        </h2>
        <p className="type-body-lg mx-auto mt-6 max-w-[560px] text-white/65">
          Está escrito na parede da loja porque é o que a gente faz o dia
          inteiro: vender, cuidar e consertar produto Apple em Guarapuava.
        </p>
        <figure className="mx-auto mt-12 hidden w-[240px] md:block">
          <img
            src={letreiro.url}
            alt="Letreiro na parede da loja com a frase Somos apaixonados pela Apple"
            loading="lazy"
            decoding="async"
            className="w-full rounded-md border border-white/12 object-cover shadow-card"
          />
        </figure>
      </Reveal>
    </section>
  );
}
