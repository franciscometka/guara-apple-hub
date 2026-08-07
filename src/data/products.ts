import imgIphone from "@/assets/images/cat-iphone.jpg";
import imgIpad from "@/assets/images/cat-ipad.jpg";
import imgWatch from "@/assets/images/cat-watch.jpg";
import imgAirpods from "@/assets/images/cat-airpods.jpg";
import imgLoja from "@/assets/images/loja-vitrine.jpg";

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

// TODO: substituir por fotos reais do cliente
export const produtos: Produto[] = [
  {
    id: "iphone-15",
    nome: "iPhone 15",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone,
    destaque: true,
  },
  {
    id: "iphone-14-pro",
    nome: "iPhone 14 Pro",
    categoria: "iPhone",
    condicao: "Seminovo",
    detalhe: "Revisado peça por peça · saúde de bateria informada",
    imagem: imgIphone,
    destaque: true,
  },
  {
    id: "iphone-13",
    nome: "iPhone 13",
    categoria: "iPhone",
    condicao: "Seminovo",
    detalhe: "Checagem completa de tela, bateria e câmeras",
    imagem: imgIphone,
    destaque: true,
  },
  {
    id: "iphone-12",
    nome: "iPhone 12",
    categoria: "iPhone",
    condicao: "Vitrine",
    detalhe: "Aparelho de mostruário, sem uso pessoal",
    imagem: imgIphone,
  },
  {
    id: "ipad-10",
    nome: "iPad 10ª geração",
    categoria: "iPad",
    condicao: "Lacrado",
    detalhe: "64GB Wi-Fi · lacrado",
    imagem: imgIpad,
    destaque: true,
  },
  {
    id: "ipad-air",
    nome: "iPad Air",
    categoria: "iPad",
    condicao: "Seminovo",
    detalhe: "Tela revisada · acompanha carregador",
    imagem: imgIpad,
  },
  {
    id: "watch-se",
    nome: "Apple Watch SE",
    categoria: "Apple Watch",
    condicao: "Lacrado",
    detalhe: "40mm GPS · lacrado com garantia",
    imagem: imgWatch,
    destaque: true,
  },
  {
    id: "watch-series-9",
    nome: "Apple Watch Series 9",
    categoria: "Apple Watch",
    condicao: "Seminovo",
    detalhe: "Pulseira original · bateria checada",
    imagem: imgWatch,
  },
  {
    id: "airpods-pro",
    nome: "AirPods Pro 2",
    categoria: "AirPods",
    condicao: "Lacrado",
    detalhe: "Cancelamento de ruído · estojo MagSafe",
    imagem: imgAirpods,
    destaque: true,
  },
  {
    id: "airpods-3",
    nome: "AirPods 3ª geração",
    categoria: "AirPods",
    condicao: "Seminovo",
    detalhe: "Testado par a par antes de entregar",
    imagem: imgAirpods,
  },
  {
    id: "macbook-air",
    nome: "MacBook Air M2",
    categoria: "Mac",
    condicao: "Seminovo",
    detalhe: "Ciclos de bateria informados na hora",
    imagem: imgLoja,
  },
  {
    id: "carregador-20w",
    nome: "Carregador USB-C 20W",
    categoria: "Acessórios",
    condicao: "Lacrado",
    detalhe: "Original Apple · com nota fiscal",
    imagem: imgLoja,
  },
  {
    id: "capa-magsafe",
    nome: "Capa MagSafe",
    categoria: "Acessórios",
    condicao: "Lacrado",
    detalhe: "Modelos para iPhone 12 ao 16",
    imagem: imgLoja,
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
