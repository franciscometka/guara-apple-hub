import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { AnexoPublico } from "@/lib/contratos/dossie-publico";
import { imagemHeic } from "@/lib/contratos/acesso-anexo-publico";
import { PdfPublico } from "./PdfPublico";

export function DocumentoPublico({ anexo }: { anexo: AnexoPublico }) {
  const [aberto, setAberto] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [arquivo, setArquivo] = useState<{ url: string; mime: string } | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const controller = new AbortController();
    let url: string | undefined;
    setArquivo(null);
    setErro(false);
    async function carregar() {
      try {
        const resposta = await fetch(anexo.url, { signal: controller.signal, cache: "no-store" });
        if (!resposta.ok) throw new Error("Arquivo indisponível");
        let blob = await resposta.blob();
        if (imagemHeic(blob.type)) {
          const { heicTo } = await import("heic-to/csp");
          blob = await heicTo({ blob, type: "image/jpeg", quality: 0.92 });
        }
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setArquivo({ url, mime: blob.type });
      } catch {
        if (!controller.signal.aborted) setErro(true);
      }
    }
    void carregar();
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [aberto, tentativa, anexo.url]);

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <Button variant="outline" onClick={() => setAberto(true)}
        className="h-auto w-full justify-start gap-3 whitespace-normal p-3 text-left">
        {anexo.imagem ? <img src={anexo.url} alt="" loading="lazy"
          className="h-14 w-14 shrink-0 rounded-md border border-border object-cover" /> :
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
            <FileText size={20} aria-hidden="true" />
          </span>}
        <span className="min-w-0 flex-1 text-sm font-medium">{anexo.rotulo}</span>
        <ExternalLink size={16} aria-hidden="true" className="shrink-0 text-muted-foreground" />
      </Button>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-2rem)] max-w-4xl gap-3 p-4 sm:p-6">
        <DialogTitle className="pr-8">{anexo.rotulo}</DialogTitle>
        <DialogDescription className="sr-only">Documento publicado pela loja</DialogDescription>
        <div className="flex h-[min(65dvh,800px)] min-h-0 items-center justify-center overflow-auto bg-muted/30">
          {erro ? <div role="alert" className="space-y-4 p-4 text-center">
            <p>Não foi possível abrir este arquivo.</p>
            <Button variant="outline" onClick={() => setTentativa((n) => n + 1)}>Tentar novamente</Button>
          </div> : !arquivo ? <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" /> Abrindo arquivo…
          </p> : arquivo.mime.startsWith("image/") ?
            <img src={arquivo.url} alt={anexo.rotulo} className="h-full w-full object-contain" /> :
            <PdfPublico url={arquivo.url} />}
        </div>
        {arquivo && <div className="flex flex-wrap justify-end gap-2">
          <Button asChild variant="outline"><a href={arquivo.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink /> Abrir arquivo
          </a></Button>
          <Button asChild><a href={arquivo.url} download={`${anexo.rotulo}.${arquivo.mime.startsWith("image/") ? "jpg" : "pdf"}`}>
            <Download /> Baixar
          </a></Button>
        </div>}
      </DialogContent>
    </Dialog>
  );
}