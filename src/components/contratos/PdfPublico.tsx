import { useEffect, useRef, useState } from "react";

export function PdfPublico({ url }: { url: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [erro, setErro] = useState(false);
  useEffect(() => {
    let cancelado = false;
    let destruir: (() => void) | undefined;
    async function desenhar() {
      try {
        const pdfjs = await import("pdfjs-dist");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        const tarefa = pdfjs.getDocument({ url });
        destruir = () => { void tarefa.destroy(); };
        const pdf = await tarefa.promise;
        const alvo = container.current;
        if (!alvo || cancelado) return;
        alvo.replaceChildren();
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelado) return;
          const pagina = await pdf.getPage(i);
          const viewport = pagina.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "h-auto w-full";
          canvas.setAttribute("role", "img");
          canvas.setAttribute("aria-label", `Página ${i} do PDF`);
          alvo.appendChild(canvas);
          const canvasContext = canvas.getContext("2d");
          if (!canvasContext) throw new Error("Leitor indisponível");
          await pagina.render({ canvasContext, viewport }).promise;
        }
      } catch (error) {
        console.error("Falha ao exibir PDF", error);
        if (!cancelado) setErro(true);
      }
    }
    void desenhar();
    return () => { cancelado = true; destruir?.(); };
  }, [url]);
  return erro ? <p role="alert" className="p-4 text-center">Não foi possível exibir o PDF. Você ainda pode baixá-lo.</p> :
    <div ref={container} className="flex h-full w-full flex-col gap-3 overflow-auto" />;
}