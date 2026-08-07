export type Categoria =
  | "iPhone"
  | "iPad"
  | "Apple Watch"
  | "AirPods"
  | "Mac"
  | "Acessórios";

export type Condicao = "Lacrado" | "Seminovo" | "Vitrine";

export interface Produto {
  id: string;
  nome: string;
  categoria: Categoria;
  condicao: Condicao;
  detalhe: string;
  imagem: string;
  destaque?: boolean;
}

export const CATEGORIAS: Categoria[] = [
  "iPhone",
  "iPad",
  "Apple Watch",
  "AirPods",
  "Mac",
  "Acessórios",
];

// TODO: substituir por fotos reais do cliente (imagens Unsplash provisórias)
export const produtos: Produto[] = [
  {
    id: "iphone-15",
    nome: "iPhone 15",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    destaque: true,
  },
  {
    id: "iphone-14-pro",
    nome: "iPhone 14 Pro",
    categoria: "iPhone",
    condicao: "Seminovo",
    detalhe: "Revisado peça por peça · saúde de bateria informada",
    imagem:
      "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80",
    destaque: true,
  },
  {
    id: "iphone-13",
    nome: "iPhone 13",
    categoria: "iPhone",
    condicao: "Seminovo",
    detalhe: "Checagem completa de tela, bateria e câmeras",
    imagem:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80",
    destaque: true,
  },
  {
    id: "iphone-12",
    nome: "iPhone 12",
    categoria: "iPhone",
    condicao: "Vitrine",
    detalhe: "Aparelho de mostruário, sem uso pessoal",
    imagem:
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ipad-10",
    nome: "iPad 10ª geração",
    categoria: "iPad",
    condicao: "Lacrado",
    detalhe: "64GB Wi-Fi · lacrado",
    imagem:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    destaque: true,
  },
  {
    id: "ipad-air",
    nome: "iPad Air",
    categoria: "iPad",
    condicao: "Seminovo",
    detalhe: "Tela revisada · acompanha carregador",
    imagem:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "watch-se",
    nome: "Apple Watch SE",
    categoria: "Apple Watch",
    condicao: "Lacrado",
    detalhe: "40mm GPS · lacrado com garantia",
    imagem:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    destaque: true,
  },
  {
    id: "watch-series-9",
    nome: "Apple Watch Series 9",
    categoria: "Apple Watch",
    condicao: "Seminovo",
    detalhe: "Pulseira original · bateria checada",
    imagem:
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "airpods-pro",
    nome: "AirPods Pro 2",
    categoria: "AirPods",
    condicao: "Lacrado",
    detalhe: "Cancelamento de ruído · estojo MagSafe",
    imagem:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    destaque: true,
  },
  {
    id: "airpods-3",
    nome: "AirPods 3ª geração",
    categoria: "AirPods",
    condicao: "Seminovo",
    detalhe: "Testado par a par antes de entregar",
    imagem:
      "https://images.unsplash.com/photo-1610438235354-a6ae5528385c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "macbook-air",
    nome: "MacBook Air M2",
    categoria: "Mac",
    condicao: "Seminovo",
    detalhe: "Ciclos de bateria informados na hora",
    imagem:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "carregador-20w",
    nome: "Carregador USB-C 20W",
    categoria: "Acessórios",
    condicao: "Lacrado",
    detalhe: "Original Apple · com nota fiscal",
    imagem:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "capa-magsafe",
    nome: "Capa MagSafe",
    categoria: "Acessórios",
    condicao: "Lacrado",
    detalhe: "Modelos para iPhone 12 ao 16",
    imagem:
      "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=800&q=80",
  },
];

export const CONDICOES_EXPLICADAS = [
  {
    titulo: "Lacrado",
    texto:
      "Aparelho novo, na caixa selada, direto do distribuidor. Sai com nota fiscal e garantia.",
  },
  {
    titulo: "Seminovo",
    texto:
      "Aparelho usado revisado na nossa bancada. Informamos o estado real, a saúde da bateria e o que acompanha antes de você decidir.",
  },
  {
    titulo: "Vitrine",
    texto:
      "Aparelho de mostruário: sem uso pessoal, apenas exposto na loja. Conferido item por item.",
  },
];

export const ACOMPANHA = [
  "Nota fiscal em nome do cliente",
  "Garantia registrada", // TODO: [CONFIRMAR: prazos de garantia]
  "Checagem de saúde de bateria nos seminovos",
  "Suporte na nossa assistência técnica própria",
];
