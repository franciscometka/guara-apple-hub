import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/GuaraButton";
import { RevealItem } from "@/components/ui/Reveal";

export function PathCard({
  titulo,
  texto,
  cta,
  href,
  imagem,
  alt,
  external,
  onClick,
  imagemClara,
}: {
  titulo: string;
  texto: string;
  cta: string;
  href: string;
  imagem: string;
  alt: string;
  external?: boolean | undefined;
  onClick?: (() => void) | undefined;
  /** Render em fundo claro com padding, para imagens de produto sem sangria. */
  imagemClara?: boolean | undefined;
}) {
  const reduce = useReducedMotion();

  return (
    <RevealItem>
      <motion.article
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-violet-glow hover:shadow-card"
        {...(reduce ? {} : { whileHover: { y: -6 } })}
      >
        {imagemClara ? (
          <div className="flex aspect-16/10 items-center justify-center bg-background p-8 md:p-10">
            <img
              src={imagem}
              alt={alt}
              loading="lazy"
              width={800}
              height={500}
              className="h-full w-full object-contain transition-transform duration-400 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-16/10 overflow-hidden bg-muted">
            <img
              src={imagem}
              alt={alt}
              loading="lazy"
              width={800}
              height={500}
              className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col border-t border-border p-6 md:p-8">
          <h3 className="type-h3 text-foreground">{titulo}</h3>
          <p className="mt-3 flex-1 text-muted-foreground">{texto}</p>
          <div className="mt-7">
            <Button
              variant="secondary"
              href={href}
              external={external}
              onClick={onClick}
            >
              {cta}
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </motion.article>
    </RevealItem>
  );
}
