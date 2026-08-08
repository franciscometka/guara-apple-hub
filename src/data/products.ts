import watchSE from "@/assets/images/produtos/apple-watch-se-40mm-midnight-norm.webp";
import imgWatch from "@/assets/images/cat-watch.jpg";
import imgAirpods from "@/assets/images/cat-airpods.jpg";
import iphone15 from "@/assets/images/produtos/iphone-15-256gb-azul-norm.webp";
import iphone14pro from "@/assets/images/produtos/iphone-14-pro-256gb-preto-espacial-seminovo-norm.webp";
import iphone13pro from "@/assets/images/produtos/iphone-13-pro-azul-sierra-norm.webp";
import iphone13 from "@/assets/images/produtos/iphone-13-128gb-preto-norm.webp";
import ipad10 from "@/assets/images/produtos/ipad-10-wifi-cellular-64gb-silver.webp";
import macbookAir13 from "@/assets/images/produtos/macbook-air-13-norm.webp";
import carregador20w from "@/assets/images/produtos/carregador-usb-c-20w-norm.webp";
import capinhaMagsafe from "@/assets/images/produtos/capinha-magsafe-transparente-norm.webp";

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

export const produtos: Produto[] = [
  {
    id: "iphone-15-256gb-azul",
    nome: "iPhone 15 256GB Azul",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: iphone15,
    destaque: true,
  },
  {
    id: "iphone-14-pro-256gb-preto-espacial",
    nome: "iPhone 14 Pro 256GB Preto Espacial",
    categoria: "iPhone",
    condicao: "Seminovo",
    detalhe: "Revisado peça por peça · saúde de bateria informada",
    imagem: iphone14pro,
    destaque: true,
  },
  {
    id: "iphone-13-pro-azul-sierra",
    nome: "iPhone 13 Pro Azul Sierra",
    categoria: "iPhone",
    condicao: "Seminovo",
    detalhe: "Checagem completa de tela, bateria e câmeras",
    imagem: iphone13pro,
    destaque: true,
  },
  {
    id: "iphone-13-128gb-preto",
    nome: "iPhone 13 128GB Preto",
    categoria: "iPhone",
    condicao: "Seminovo",
    detalhe: "128GB · condição real informada antes da compra",
    imagem: iphone13,
    destaque: true,
  },
  {
    id: "ipad-10-wifi-cellular-64gb-silver",
    nome: "iPad (10ª geração) Wi-Fi + Cellular 64GB Prateado",
    categoria: "iPad",
    condicao: "Lacrado",
    detalhe: "64GB Wi-Fi + Cellular · lacrado",
    imagem: ipad10,
    destaque: true,
  },
  {
    id: "watch-se",
    nome: "Apple Watch SE",
    categoria: "Apple Watch",
    condicao: "Lacrado",
    detalhe: "40mm GPS · lacrado com garantia",
    imagem: watchSE,
    destaque: true,
  },
  {
    id: "watch-series-9",
    nome: "Apple Watch Series 9",
    categoria: "Apple Watch",
    condicao: "Seminovo",
    detalhe: "Pulseira original · bateria checada",
    imagem: imgWatch, // TODO: foto real do produto
  },
  {
    id: "airpods-pro",
    nome: "AirPods Pro 2",
    categoria: "AirPods",
    condicao: "Lacrado",
    detalhe: "Cancelamento de ruído · estojo MagSafe",
    imagem: imgAirpods, // TODO: foto real do produto
    destaque: true,
  },
  {
    id: "airpods-3",
    nome: "AirPods 3ª geração",
    categoria: "AirPods",
    condicao: "Seminovo",
    detalhe: "Testado par a par antes de entregar",
    imagem: imgAirpods, // TODO: foto real do produto
  },
  {
    id: "macbook-air-13",
    nome: "MacBook Air 13”",
    categoria: "Mac",
    condicao: "Lacrado",
    detalhe: "Lacrado com nota fiscal",
    imagem: macbookAir13,
  },
  {
    id: "carregador-usb-c-20w",
    nome: "Carregador USB-C 20W",
    categoria: "Acessórios",
    condicao: "Lacrado",
    detalhe: "20W · Compatível com iPhone e iPad",
    imagem: carregador20w,
  },
  {
    id: "capinha-magsafe-transparente",
    nome: "Capinha MagSafe Transparente",
    categoria: "Acessórios",
    condicao: "Lacrado",
    detalhe: "Transparente · Compatível com MagSafe",
    imagem: capinhaMagsafe,
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
