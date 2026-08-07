import { useEffect, useRef, useState } from "react";
import { CONTATO } from "@/lib/whatsapp";

/** Mapa carregado só quando entra na viewport, pra não bloquear o LCP. */
export function MapEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    CONTATO.enderecoMaps,
  )}&output=embed`;

  return (
    <div
      ref={ref}
      className="relative aspect-4/3 w-full overflow-hidden rounded-lg border border-border bg-muted"
    >
      {show ? (
        <iframe
          title="Mapa com a localização da Guara iPhones na Av. Manoel Ribas, 1945, Sala 7, Guarapuava"
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="shimmer absolute inset-0" aria-hidden="true" />
      )}
    </div>
  );
}
