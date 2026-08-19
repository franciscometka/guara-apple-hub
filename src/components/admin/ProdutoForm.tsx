import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORIAS_DB, CONDICOES_DB } from "@/lib/produtos-shared";
import type { DadosProduto } from "@/lib/admin-produtos";

export interface ValoresIniciais extends DadosProduto {
  fotoUrl?: string;
}

const vazio: ValoresIniciais = {
  nome: "",
  categoria: "",
  condicao: "Lacrado",
  detalhe: "",
  preco: null,
  em_estoque: true,
  destaque: false,
  ativo: true,
};

export function ProdutoForm({
  iniciais = vazio,
  salvando,
  erro,
  onSubmit,
}: {
  iniciais?: ValoresIniciais;
  salvando: boolean;
  erro?: string | null;
  onSubmit: (dados: DadosProduto, foto: File | null) => void;
}) {
  const [nome, setNome] = useState(iniciais.nome);
  const [categoria, setCategoria] = useState(iniciais.categoria);
  const [condicao, setCondicao] = useState(iniciais.condicao);
  const [detalhe, setDetalhe] = useState(iniciais.detalhe);
  const [preco, setPreco] = useState(iniciais.preco === null ? "" : String(iniciais.preco));
  const [emEstoque, setEmEstoque] = useState(iniciais.em_estoque);
  const [destaque, setDestaque] = useState(iniciais.destaque);
  const [ativo, setAtivo] = useState(iniciais.ativo);
  const [foto, setFoto] = useState<File | null>(null);
  const [previa, setPrevia] = useState(iniciais.fotoUrl ?? "");
  const [validacao, setValidacao] = useState<string | null>(null);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return setValidacao("Informe o nome do produto.");
    if (!categoria) return setValidacao("Selecione uma categoria.");
    const valor = preco.trim() === "" ? null : Number(preco.replace(",", "."));
    if (valor !== null && (isNaN(valor) || valor < 0))
      return setValidacao("O preço precisa ser um número maior ou igual a zero.");
    setValidacao(null);
    onSubmit(
      {
        nome: nome.trim(),
        categoria,
        condicao,
        detalhe: detalhe.trim(),
        preco: valor,
        em_estoque: emEstoque,
        destaque,
        ativo,
      },
      foto,
    );
  }

  const campo =
    "mt-2 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

  return (
    <form onSubmit={enviar} className="max-w-2xl rounded-lg border border-border bg-background p-6">
      <label className="block text-sm font-medium text-foreground">
        Nome *
        <input value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-foreground">
          Categoria *
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={campo}
          >
            <option value="">Selecione…</option>
            {CATEGORIAS_DB.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-foreground">
          Condição
          <select value={condicao} onChange={(e) => setCondicao(e.target.value)} className={campo}>
            {CONDICOES_DB.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-foreground">
        Detalhe
        <textarea
          value={detalhe}
          onChange={(e) => setDetalhe(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm text-foreground"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-foreground">
        Preço (R$) — opcional
        <input
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          inputMode="decimal"
          placeholder="Deixe vazio para “Consultar valor no WhatsApp”"
          className={campo}
        />
      </label>

      <div className="mt-5 space-y-3">
        {[
          { label: "Em estoque", valor: emEstoque, set: setEmEstoque },
          { label: "Destaque na home", valor: destaque, set: setDestaque },
          { label: "Ativo (visível no site)", valor: ativo, set: setAtivo },
        ].map((t) => (
          <label
            key={t.label}
            className="flex items-center gap-3 text-sm font-medium text-foreground"
          >
            <input
              type="checkbox"
              checked={t.valor}
              onChange={(e) => t.set(e.target.checked)}
              className="h-5 w-5 rounded border-input"
            />
            {t.label}
          </label>
        ))}
      </div>

      <label className="mt-5 block text-sm font-medium text-foreground">
        Foto
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const arquivo = e.target.files?.[0] ?? null;
            setFoto(arquivo);
            if (arquivo) setPrevia(URL.createObjectURL(arquivo));
          }}
          className="mt-2 block w-full text-sm text-muted-foreground"
        />
      </label>
      {previa && (
        <img
          src={previa}
          alt="Prévia da foto do produto"
          className="mt-3 h-32 w-32 rounded-md border border-border object-contain p-1"
        />
      )}

      {(validacao || erro) && <p className="mt-5 text-sm text-destructive">{validacao ?? erro}</p>}

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {salvando ? "Salvando…" : "Salvar produto"}
        </button>
        <Link
          to="/admin"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-foreground"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
