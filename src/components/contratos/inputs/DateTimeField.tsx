import { Campo } from "./Campo";
import { classesInput } from "./estilos";

/** Data, horário ou os dois lado a lado, em campos nativos do navegador. */
export function DateTimeField({
  rotulo,
  erro,
  data,
  hora,
  aoMudarData,
  aoMudarHora,
  aoSair,
  comHora = false,
  ajuda,
  autoFocus,
}: {
  rotulo: string;
  erro?: string | undefined;
  data: string;
  hora?: string | undefined;
  aoMudarData: (valor: string) => void;
  aoMudarHora?: ((valor: string) => void) | undefined;
  aoSair?: (() => void) | undefined;
  comHora?: boolean | undefined;
  ajuda?: string | undefined;
  autoFocus?: boolean | undefined;
}) {
  return (
    <Campo rotulo={rotulo} ajuda={ajuda} erro={erro}>
      {(props) => (
        <div className="flex gap-2">
          <input
            {...props}
            type="date"
            value={data}
            autoFocus={autoFocus}
            onChange={(e) => aoMudarData(e.target.value)}
            onBlur={aoSair}
          />
          {comHora && (
            <input
              type="time"
              aria-label={`${rotulo} — horário`}
              aria-invalid={Boolean(erro)}
              className={classesInput(Boolean(erro), "max-w-32")}
              value={hora ?? ""}
              onChange={(e) => aoMudarHora?.(e.target.value)}
              onBlur={aoSair}
            />
          )}
        </div>
      )}
    </Campo>
  );
}
