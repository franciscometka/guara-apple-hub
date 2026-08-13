import { useEffect, useState } from "react";
import Papa from "papaparse";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgxzP9q6_JMI7v7ryrjv2zV1SsSQF6UQ0eQt-3IeJOp9hCDCHmyneRfu9f5xIRUjQwA7_URIeTWWsp/pub?output=csv";

const CACHE_KEY = "guara:product-pricing";
const CACHE_TTL_MS = 5 * 60 * 1000;

export interface ProdutoPreco {
  preco: number | null;
  emEstoque: boolean;
}

export type ProdutoPrecoMap = Record<string, ProdutoPreco>;

interface SheetRow {
  id?: string;
  preco?: string;
  em_estoque?: string;
}

function parsePrecoRow(row: SheetRow): ProdutoPreco {
  const precoNormalizado = (row.preco ?? "").trim().replace(",", ".");
  const precoNumero = Number(precoNormalizado);
  const preco =
    precoNormalizado !== "" && !isNaN(precoNumero) ? precoNumero : null;

  const estoqueNormalizado = (row.em_estoque ?? "").trim().toUpperCase();
  const emEstoque =
    estoqueNormalizado === "FALSE" ? false : true;

  return { preco, emEstoque };
}

function parseCsvToMap(csvText: string): ProdutoPrecoMap {
  const resultado = Papa.parse<SheetRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const mapa: ProdutoPrecoMap = {};

  for (const row of resultado.data) {
    const id = row.id?.trim();
    if (!id) continue;

    const parsed = parsePrecoRow(row);
    if (parsed.preco === null) {
      console.warn(
        `[useProductPricing] preço inválido na planilha para o id "${id}", ignorando preço.`,
      );
    }
    if (
      row.em_estoque !== undefined &&
      !["TRUE", "FALSE"].includes(row.em_estoque.trim().toUpperCase())
    ) {
      console.warn(
        `[useProductPricing] valor de em_estoque inválido para o id "${id}" ("${row.em_estoque}"), assumindo disponível.`,
      );
    }

    mapa[id] = parsed;
  }

  return mapa;
}

function readCache(): ProdutoPrecoMap | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw) as {
      timestamp: number;
      data: ProdutoPrecoMap;
    };
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: ProdutoPrecoMap) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data }),
    );
  } catch {
    // sessionStorage indisponível (modo privado, quota etc.) — segue sem cache.
  }
}

// Compartilhado entre todos os cards montados na mesma navegação, para que
// N ProductCard na tela disparem uma única requisição à planilha, não N.
let fetchEmAndamento: Promise<ProdutoPrecoMap> | null = null;

function buscarPrecos(): Promise<ProdutoPrecoMap> {
  const cached = readCache();
  if (cached) return Promise.resolve(cached);

  if (!fetchEmAndamento) {
    fetchEmAndamento = fetch(SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((csvText) => {
        const mapa = parseCsvToMap(csvText);
        writeCache(mapa);
        return mapa;
      })
      .catch((err) => {
        console.warn(
          "[useProductPricing] falha ao buscar planilha de preços, seguindo sem preços:",
          err,
        );
        return {};
      })
      .finally(() => {
        fetchEmAndamento = null;
      });
  }

  return fetchEmAndamento;
}

export function useProductPricing(): ProdutoPrecoMap {
  const [precos, setPrecos] = useState<ProdutoPrecoMap>(
    () => readCache() ?? {},
  );

  useEffect(() => {
    let cancelado = false;

    buscarPrecos().then((mapa) => {
      if (!cancelado) setPrecos(mapa);
    });

    return () => {
      cancelado = true;
    };
  }, []);

  return precos;
}
