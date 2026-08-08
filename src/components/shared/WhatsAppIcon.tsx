import iconColor from "@/assets/images/produtos/whatsapp-icon.png";
import iconWhite from "@/assets/images/produtos/whatsapp-icon-white.png";

const icons = {
  color: iconColor,
  white: iconWhite,
};

/**
 * Ícone do WhatsApp. "color" é o selo circular verde oficial, pra usar sobre
 * fundos neutros. "white" é só o glifo em branco, sem badge — pra usar
 * dentro de botões que já têm fundo colorido (verde/roxo), onde o selo verde
 * competiria com o fundo em vez de se integrar.
 * Sempre decorativo: o texto acessível vem do rótulo do botão/link.
 */
export function WhatsAppIcon({
  size = 20,
  variant = "color",
  eager,
  className,
}: {
  size?: number;
  variant?: "color" | "white";
  /** Para os botões que já aparecem na primeira tela — lazy ali só atrasa. */
  eager?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <img
      src={icons[variant]}
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
