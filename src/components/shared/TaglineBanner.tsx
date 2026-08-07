import { Reveal } from "@/components/ui/Reveal";

/** Seção puramente tipográfica: a frase é a protagonista. */
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
      <Reveal className="relative mx-auto max-w-[1000px] px-6 py-20 text-center md:py-28 lg:py-36">
        <p className="type-caption text-violet-glow">Guara iPhones</p>
        <h2
          id="tagline-banner"
          className="type-display mt-5 text-white uppercase"
        >
          Somos apaixonados pela Apple
        </h2>
        <p className="type-body-lg mx-auto mt-6 max-w-[620px] text-white/65">
          Não é slogan de marketing. É o que a gente faz o dia inteiro, há anos,
          em Guarapuava: vender, cuidar e consertar Apple — e só Apple.
        </p>
      </Reveal>
    </section>
  );
}

