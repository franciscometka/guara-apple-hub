import heroFallback from "@/assets/images/iphone-hero.png";

/**
 * Altura do palco do aparelho no Hero — compartilhada entre o fallback 2D
 * (aqui) e o Canvas 3D (Hero3DDevice.tsx), pra não haver salto de layout
 * na troca de um pelo outro.
 */
export const HERO_DEVICE_HEIGHT = "h-[460px] sm:h-[620px] md:h-[820px]";

/**
 * Imagem estática do iPhone — usada só quando prefers-reduced-motion está
 * ativo (substituto permanente do 3D, nunca chega a tentar montar o Canvas)
 * ou antes da hidratação confirmar se esse é o caso.
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

/**
 * Halo violeta atrás do aparelho. Puro CSS, sem dependência de Three.js —
 * fica neste módulo (carregado de cara) em vez do chunk lazy do
 * Hero3DDevice, pra poder aparecer antes mesmo desse chunk ter baixado.
 */
export function DeviceGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 h-[72%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-violet)_75%,transparent)_0%,transparent_70%)] opacity-55 blur-2xl"
    />
  );
}

/**
 * Espaço reservado pro aparelho 3D enquanto ele ainda não está pronto —
 * chunk baixando ou modelo .glb carregando. Só o glow, sem imagem estática:
 * o pop-in do 3D já girando na posição final É a transição, não precisa de
 * uma foto pra "disfarçar" a espera antes dele.
 */
export function HeroDevicePlaceholder() {
  return (
    <div className={`relative w-full ${HERO_DEVICE_HEIGHT}`}>
      <DeviceGlow />
    </div>
  );
}
