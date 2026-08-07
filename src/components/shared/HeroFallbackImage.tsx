import heroFallback from "@/assets/images/iphone-hero.png";

/**
 * Altura do palco do aparelho no Hero — compartilhada entre o fallback 2D
 * (aqui) e o Canvas 3D (Hero3DDevice.tsx), pra não haver salto de layout
 * na troca de um pelo outro.
 */
export const HERO_DEVICE_HEIGHT = "h-[440px] sm:h-[560px] md:h-[680px]";

/**
 * Imagem estática do iPhone — usada em três momentos: enquanto o chunk do
 * Hero3DDevice ainda está baixando (Suspense externo no Hero.tsx), enquanto
 * o modelo .glb ainda não terminou de carregar (Hero3DDevice.tsx), e como
 * substituto permanente quando prefers-reduced-motion está ativo.
 */
export function HeroFallbackImage() {
  return (
    <div className={`relative flex w-full items-center justify-center ${HERO_DEVICE_HEIGHT}`}>
      <img
        src={heroFallback}
        alt="iPhone em destaque na Guara iPhones"
        width={521}
        height={651}
        fetchPriority="high"
        decoding="async"
        className="block h-full w-auto max-w-full object-contain select-none"
      />
    </div>
  );
}
