import instagramAsset from "@/assets/instagram-icon.png.asset.json";

/**
 * Ícone oficial do Instagram (glifo colorido com gradiente).
 * Sempre decorativo: o texto acessível vem do rótulo do botão/link.
 */
export function InstagramIcon({
  size = 20,
  eager,
  className,
}: {
  size?: number;
  /** Para os botões que já aparecem na primeira tela — lazy ali só atrasa. */
  eager?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <img
      src={instagramAsset.url}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={{ width: size, height: size }}
      className={className}
    />
  );
}
