import { useEffect, useState } from "react";
import { gerarQrDataUrl } from "@/lib/contratos/qr-codigo";
import { cn } from "@/lib/utils";

/**
 * QR Code desenhado no navegador. Enquanto a biblioteca é baixada fica um
 * quadrado cinza do mesmo tamanho, para a tela não pular.
 */
export function QrCode({
  valor,
  alt,
  pixels = 512,
  className,
}: {
  valor: string;
  alt: string;
  /** Resolução do PNG gerado. O tamanho na tela vem do `className`. */
  pixels?: number;
  className?: string | undefined;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let vivo = true;
    setSrc(null);
    setFalhou(false);

    gerarQrDataUrl(valor, { tamanho: pixels })
      .then((url) => {
        if (vivo) setSrc(url);
      })
      .catch(() => {
        if (vivo) setFalhou(true);
      });

    return () => {
      vivo = false;
    };
  }, [valor, pixels]);

  if (falhou) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-md border border-dashed border-border p-2 text-center text-xs text-muted-foreground",
          className,
        )}
      >
        Não foi possível desenhar o QR Code.
      </div>
    );
  }

  if (!src) {
    return (
      <div className={cn("aspect-square rounded-md bg-muted", className)} aria-hidden="true" />
    );
  }

  return <img src={src} alt={alt} className={cn("aspect-square", className)} />;
}
