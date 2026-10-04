import { useId } from "react";
import {
  EXIGE_DETALHE,
  SITUACOES,
  type LinhaChecklist,
  type SituacaoChecklist,
  type ValoresChecklist,
} from "@/lib/contratos/campos/tipos";
import { classesInput } from "./inputs/estilos";
import { cn } from "@/lib/utils";

/**
 * Tabela de inspeção: uma situação por linha entre Regular, Falha, N/T e N/A,
 * mais a coluna de detalhes. Falha e N/T exigem detalhe.
 *
 * Cada linha é um radiogroup próprio, com os cabeçalhos ligados às células
 * pelo `headers`, para o leitor de tela anunciar "Tela/vidro frontal — Falha".
 */
export function ChecklistTable({
  rotulo,
  ajuda,
  erro,
  linhas,
  valores,
  aoMudar,
}: {
  rotulo: string;
  ajuda?: string | undefined;
  erro?: string | undefined;
  linhas: readonly LinhaChecklist[];
  valores: ValoresChecklist;
  aoMudar: (valores: ValoresChecklist) => void;
}) {
  const base = useId();
  const idErro = `${base}-erro`;

  const marcar = (id: string, situacao: SituacaoChecklist) =>
    aoMudar({ ...valores, [id]: { ...valores[id], s: situacao } });

  const detalhar = (id: string, texto: string) =>
    aoMudar({ ...valores, [id]: { ...valores[id], d: texto } });

  return (
    <div className="col-span-6 space-y-2">
      <p className="text-sm font-medium text-foreground">{rotulo}</p>
      {ajuda && <p className="text-xs text-muted-foreground">{ajuda}</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{rotulo}</caption>
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th scope="col" id={`${base}-item`} className="px-3 py-2 font-semibold">
                Componente ou teste
              </th>
              {SITUACOES.map((s) => (
                <th
                  key={s.valor}
                  scope="col"
                  id={`${base}-${s.valor}`}
                  className="px-2 py-2 text-center font-semibold"
                >
                  {s.texto}
                </th>
              ))}
              <th scope="col" id={`${base}-det`} className="px-3 py-2 font-semibold">
                Detalhes
              </th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => {
              const item = valores[linha.id];
              const precisaDetalhe = item?.s ? EXIGE_DETALHE.includes(item.s) : false;
              const detalheFaltando = precisaDetalhe && !item?.d?.trim();

              return (
                <tr key={linha.id} className="border-b border-border last:border-0">
                  <th
                    scope="row"
                    id={`${base}-${linha.id}`}
                    headers={`${base}-item`}
                    className="max-w-56 px-3 py-2 text-left font-normal text-foreground"
                  >
                    {linha.rotulo}
                  </th>

                  {SITUACOES.map((situacao) => (
                    <td
                      key={situacao.valor}
                      headers={`${base}-${linha.id} ${base}-${situacao.valor}`}
                      className="px-2 py-2 text-center"
                    >
                      <label className="inline-flex cursor-pointer items-center justify-center p-1.5">
                        <span className="sr-only">
                          {linha.rotulo} — {situacao.texto}
                        </span>
                        <input
                          type="radio"
                          name={`${base}-${linha.id}`}
                          value={situacao.valor}
                          checked={item?.s === situacao.valor}
                          onChange={() => marcar(linha.id, situacao.valor)}
                          className="size-4 accent-violet"
                        />
                      </label>
                    </td>
                  ))}

                  <td headers={`${base}-${linha.id} ${base}-det`} className="px-3 py-2">
                    <input
                      type="text"
                      aria-label={`${linha.rotulo} — detalhes`}
                      aria-invalid={detalheFaltando}
                      value={item?.d ?? ""}
                      onChange={(e) => detalhar(linha.id, e.target.value)}
                      placeholder={precisaDetalhe ? "Obrigatório" : "Opcional"}
                      className={cn(
                        classesInput(detalheFaltando, "min-h-9 min-w-40 text-sm"),
                        !precisaDetalhe && "border-dashed",
                      )}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p id={idErro} aria-live="polite" className="text-xs font-medium text-destructive">
        {erro ?? ""}
      </p>
    </div>
  );
}
