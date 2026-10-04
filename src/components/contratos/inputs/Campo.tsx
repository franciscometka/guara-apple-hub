import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { classesInput } from "./estilos";

/**
 * Casca comum de todos os campos do módulo de contratos: rótulo associado,
 * texto de ajuda, estado de erro e a mensagem anunciada por leitor de tela.
 *
 * O visual segue o que o painel já usa nos formulários de produto.
 */

export interface CampoProps {
  rotulo: string;
  ajuda?: string | undefined;
  erro?: string | undefined;
  obrigatorio?: boolean | undefined;
  /** Recebe os ids/atributos ARIA já montados. */
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean;
    className: string;
  }) => ReactNode;
  className?: string | undefined;
}

export function Campo({
  rotulo,
  ajuda,
  erro,
  obrigatorio = true,
  children,
  className,
}: CampoProps) {
  const id = useId();
  const idAjuda = `${id}-ajuda`;
  const idErro = `${id}-erro`;

  const descrito = [ajuda ? idAjuda : null, erro ? idErro : null].filter(Boolean).join(" ");

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {rotulo}
        {!obrigatorio && <span className="ml-1 text-muted-foreground">(opcional)</span>}
      </label>

      {children({
        id,
        "aria-describedby": descrito || undefined,
        "aria-invalid": Boolean(erro),
        className: classesInput(Boolean(erro)),
      })}

      {ajuda && (
        <p id={idAjuda} className="text-xs text-muted-foreground">
          {ajuda}
        </p>
      )}

      <p id={idErro} aria-live="polite" className="text-xs font-medium text-destructive">
        {erro ?? ""}
      </p>
    </div>
  );
}

/** Campo de texto simples, com máscara opcional aplicada a cada tecla. */
export function CampoTexto({
  rotulo,
  ajuda,
  erro,
  obrigatorio,
  valor,
  aoMudar,
  aoSair,
  mascara,
  inputMode,
  placeholder,
  autoFocus,
  desabilitado,
  className,
}: {
  rotulo: string;
  ajuda?: string | undefined;
  erro?: string | undefined;
  obrigatorio?: boolean | undefined;
  valor: string;
  aoMudar: (valor: string) => void;
  aoSair?: (() => void) | undefined;
  mascara?: ((valor: string) => string) | undefined;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal" | undefined;
  placeholder?: string | undefined;
  autoFocus?: boolean | undefined;
  desabilitado?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <Campo
      rotulo={rotulo}
      ajuda={ajuda}
      erro={erro}
      obrigatorio={obrigatorio}
      className={className}
    >
      {(props) => (
        <input
          {...props}
          type="text"
          value={valor}
          inputMode={inputMode}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={desabilitado}
          onChange={(e) => aoMudar(mascara ? mascara(e.target.value) : e.target.value)}
          onBlur={aoSair}
        />
      )}
    </Campo>
  );
}

/** Área de texto para relatos e observações longas. */
export function CampoTextoLongo({
  rotulo,
  ajuda,
  erro,
  obrigatorio,
  valor,
  aoMudar,
  aoSair,
  linhas = 4,
  autoFocus,
  className,
}: {
  rotulo: string;
  ajuda?: string | undefined;
  erro?: string | undefined;
  obrigatorio?: boolean | undefined;
  valor: string;
  aoMudar: (valor: string) => void;
  aoSair?: (() => void) | undefined;
  linhas?: number | undefined;
  autoFocus?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <Campo
      rotulo={rotulo}
      ajuda={ajuda}
      erro={erro}
      obrigatorio={obrigatorio}
      className={className}
    >
      {(props) => (
        <textarea
          {...props}
          className={classesInput(Boolean(erro), "min-h-24 py-2 leading-relaxed")}
          rows={linhas}
          value={valor}
          autoFocus={autoFocus}
          onChange={(e) => aoMudar(e.target.value)}
          onBlur={aoSair}
        />
      )}
    </Campo>
  );
}
