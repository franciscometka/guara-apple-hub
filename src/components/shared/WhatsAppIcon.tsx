import icon from "@/assets/images/produtos/whatsapp-icon.png.asset.json";

/**
 * Ícone oficial do WhatsApp (PNG circular verde).
 * Sempre decorativo: o texto acessível vem do rótulo do botão/link.
 */
export function WhatsAppIcon({
  size = 20,
  className,
}: {
  size?: number;
  className?: string | undefined;
}) {
  return (
    <img
      src={icon.url}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      style={{ width: size, height: size }}
      className={className}
    />
  );
}
