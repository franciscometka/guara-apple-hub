import imgAirpods4 from "@/assets/images/produtos/airpods-4-norm.webp";
import imgAirpodsPro3 from "@/assets/images/produtos/airpods-pro-3-norm.webp";
import imgApplePencil from "@/assets/images/produtos/apple-pencil-usbc-norm.webp";
import imgWatch40Midnight from "@/assets/images/produtos/watch-se3-40mm-midnight-norm.webp";
// TODO: foto real do 40mm Starlight (ainda não recebida) — usando a do 44mm
import imgWatch40Starlight from "@/assets/images/produtos/watch-se3-44mm-starlight-norm.webp";
import imgWatch44Midnight from "@/assets/images/produtos/watch-se3-44mm-midnight-norm.webp";
import imgWatch44Starlight from "@/assets/images/produtos/watch-se3-44mm-starlight-norm.webp";
import imgIpadBlue from "@/assets/images/produtos/ipad-11-128gb-blue-norm.webp";
import imgIpadPink from "@/assets/images/produtos/ipad-11-128gb-pink-norm.webp";
import imgIpadSilver from "@/assets/images/produtos/ipad-11-128gb-silver-norm.webp";
import imgIphone14Midnight from "@/assets/images/produtos/iphone-14-128gb-midnight-norm.webp";
import imgIphone15Black from "@/assets/images/produtos/iphone-15-128gb-black-norm.webp";
import imgIphone15Blue from "@/assets/images/produtos/iphone-15-128gb-blue-norm.webp";
import imgIphone16Black from "@/assets/images/produtos/iphone-16-128gb-black-norm.webp";
import imgIphone16Pink from "@/assets/images/produtos/iphone-16-128gb-pink-norm.webp";
import imgIphone16Teal from "@/assets/images/produtos/iphone-16-128gb-teal-norm.webp";
import imgIphone16Ultramarine from "@/assets/images/produtos/iphone-16-128gb-ultramarine-norm.webp";
import imgIphone16White from "@/assets/images/produtos/iphone-16-128gb-white-norm.webp";
import imgIphone16eWhite from "@/assets/images/produtos/iphone-16e-128gb-white-norm.webp";
import imgIphone16eBlack from "@/assets/images/produtos/iphone-16e-128gb-black-norm.webp";
import imgIphone16ProMaxDesert from "@/assets/images/produtos/iphone-16-pro-max-desert-norm.webp";
import imgIphone17Black from "@/assets/images/produtos/iphone-17-256gb-black-norm.webp";
import imgIphone17Blue from "@/assets/images/produtos/iphone-17-256gb-blue-norm.webp";
import imgIphone17Lavender from "@/assets/images/produtos/iphone-17-256gb-lavender-norm.webp";
import imgIphone17Sage from "@/assets/images/produtos/iphone-17-256gb-sage-norm.webp";
import imgIphone17White from "@/assets/images/produtos/iphone-17-256gb-white-norm.webp";
import imgIphone17ProCosmicOrange from "@/assets/images/produtos/iphone-17-pro-cosmic-orange-norm.webp";
import imgIphone17ProSilver from "@/assets/images/produtos/iphone-17-pro-silver-norm.webp";
import imgIphone17ProDeepBlue from "@/assets/images/produtos/iphone-17-pro-deep-blue-norm.webp";
import imgIphone17ProMaxSilver from "@/assets/images/produtos/iphone-17-pro-max-silver-norm.webp";
import imgIphone17ProMaxDeepBlue from "@/assets/images/produtos/iphone-17-pro-max-deep-blue-norm.webp";
import imgMacbookNeo from "@/assets/images/produtos/macbook-neo-256gb-silver-norm.webp";
import imgMacbookNeoBlue from "@/assets/images/produtos/macbook-neo-256gb-blue-norm.webp";
import imgMagicMouse from "@/assets/images/produtos/magic-mouse-white-norm.webp";

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
  // ----- iPhone -----
  {
    id: "iphone-17-pro-max-256gb-deep-blue",
    nome: "iPhone 17 Pro Max 256GB Deep Blue",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProMaxDeepBlue,
    destaque: true,
  },
  {
    id: "iphone-17-256gb-white",
    nome: "iPhone 17 256GB White",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17White,
    destaque: true,
  },
  {
    id: "iphone-17-256gb-blue",
    nome: "iPhone 17 256GB Blue",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17Blue,
    destaque: true,
  },
  {
    id: "iphone-17-pro-max-256gb-cosmic-orange",
    nome: "iPhone 17 Pro Max 256GB Cosmic Orange",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProCosmicOrange,
    destaque: true,
  },
  {
    id: "iphone-17-pro-max-512gb-deep-blue",
    nome: "iPhone 17 Pro Max 512GB Deep Blue",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "512GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProMaxDeepBlue,
  },
  {
    id: "iphone-17-pro-max-512gb-cosmic-orange",
    nome: "iPhone 17 Pro Max 512GB Cosmic Orange",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "512GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProCosmicOrange,
  },
  {
    id: "iphone-17-pro-max-512gb-silver",
    nome: "iPhone 17 Pro Max 512GB Silver",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "512GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProMaxSilver,
    destaque: true,
  },
  {
    id: "iphone-17-pro-max-256gb-silver",
    nome: "iPhone 17 Pro Max 256GB Silver",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProMaxSilver,
  },
  {
    id: "iphone-17-pro-256gb-cosmic-orange",
    nome: "iPhone 17 Pro 256GB Cosmic Orange",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProCosmicOrange,
  },
  {
    id: "iphone-17-pro-256gb-silver",
    nome: "iPhone 17 Pro 256GB Silver",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProSilver,
  },
  {
    id: "iphone-17-pro-256gb-deep-blue",
    nome: "iPhone 17 Pro 256GB Deep Blue",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17ProDeepBlue,
  },
  {
    id: "iphone-17-256gb-lavender",
    nome: "iPhone 17 256GB Lavender",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17Lavender,
  },
  {
    id: "iphone-17-256gb-sage",
    nome: "iPhone 17 256GB Sage",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17Sage,
  },
  {
    id: "iphone-17-256gb-black",
    nome: "iPhone 17 256GB Black",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone17Black,
  },
  {
    id: "iphone-16-pro-max-desert",
    nome: "iPhone 16 Pro Max Desert",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "Caixa lacrada com nota fiscal",
    imagem: imgIphone16ProMaxDesert,
    destaque: true,
  },
  {
    id: "iphone-16e-128gb-white",
    nome: "iPhone 16e 128GB White",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone16eWhite,
  },
  {
    id: "iphone-16e-128gb-black",
    nome: "iPhone 16e 128GB Black",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone16eBlack,
  },
  {
    id: "iphone-16-128gb-white",
    nome: "iPhone 16 128GB White",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone16White,
  },
  {
    id: "iphone-16-128gb-ultramarine",
    nome: "iPhone 16 128GB Ultramarine",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone16Ultramarine,
  },
  {
    id: "iphone-16-128gb-teal",
    nome: "iPhone 16 128GB Teal",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone16Teal,
  },
  {
    id: "iphone-16-128gb-pink",
    nome: "iPhone 16 128GB Pink",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone16Pink,
    destaque: true,
  },
  {
    id: "iphone-16-128gb-black",
    nome: "iPhone 16 128GB Black",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone16Black,
  },
  {
    id: "iphone-15-128gb-blue",
    nome: "iPhone 15 128GB Blue",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone15Blue,
  },
  {
    id: "iphone-15-128gb-black",
    nome: "iPhone 15 128GB Black",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone15Black,
  },
  {
    id: "iphone-14-128gb-midnight",
    nome: "iPhone 14 128GB Midnight",
    categoria: "iPhone",
    condicao: "Lacrado",
    detalhe: "128GB · Caixa lacrada com nota fiscal",
    imagem: imgIphone14Midnight,
  },

  // ----- iPad -----
  {
    id: "ipad-11-128gb-blue",
    nome: "iPad 11 128GB Blue",
    categoria: "iPad",
    condicao: "Lacrado",
    detalhe: "128GB Wi-Fi · Caixa lacrada com nota fiscal",
    imagem: imgIpadBlue,
    destaque: true,
  },
  {
    id: "ipad-11-128gb-pink",
    nome: "iPad 11 128GB Pink",
    categoria: "iPad",
    condicao: "Lacrado",
    detalhe: "128GB Wi-Fi · Caixa lacrada com nota fiscal",
    imagem: imgIpadPink,
  },
  {
    id: "ipad-11-128gb-silver",
    nome: "iPad 11 128GB Silver",
    categoria: "iPad",
    condicao: "Lacrado",
    detalhe: "128GB Wi-Fi · Caixa lacrada com nota fiscal",
    imagem: imgIpadSilver,
  },

  // ----- Apple Watch -----
  {
    id: "watch-se3-44mm-starlight",
    nome: "Apple Watch SE 3 44mm Starlight",
    categoria: "Apple Watch",
    condicao: "Lacrado",
    detalhe: "44mm GPS · Caixa lacrada com nota fiscal",
    imagem: imgWatch44Starlight,
    destaque: true,
  },
  {
    id: "watch-se3-44mm-midnight",
    nome: "Apple Watch SE 3 44mm Midnight",
    categoria: "Apple Watch",
    condicao: "Lacrado",
    detalhe: "44mm GPS · Caixa lacrada com nota fiscal",
    imagem: imgWatch44Midnight,
  },
  {
    id: "watch-se3-40mm-starlight",
    nome: "Apple Watch SE 3 40mm Starlight",
    categoria: "Apple Watch",
    condicao: "Lacrado",
    // TODO: [FOTO PENDENTE] usando a imagem do 44mm Starlight como placeholder
    detalhe: "40mm GPS · Caixa lacrada com nota fiscal",
    imagem: imgWatch40Starlight,
  },
  {
    id: "watch-se3-40mm-midnight",
    nome: "Apple Watch SE 3 40mm Midnight",
    categoria: "Apple Watch",
    condicao: "Lacrado",
    detalhe: "40mm GPS · Caixa lacrada com nota fiscal",
    imagem: imgWatch40Midnight,
  },

  // ----- AirPods -----
  {
    id: "airpods-pro-3",
    nome: "AirPods Pro 3",
    categoria: "AirPods",
    condicao: "Lacrado",
    detalhe: "Cancelamento de ruído · Caixa lacrada com nota fiscal",
    imagem: imgAirpodsPro3,
    destaque: true,
  },
  {
    id: "airpods-4",
    nome: "AirPods 4",
    categoria: "AirPods",
    condicao: "Lacrado",
    detalhe: "Caixa lacrada com nota fiscal",
    imagem: imgAirpods4,
  },

  // ----- Mac -----
  {
    id: "macbook-neo-256gb-silver",
    nome: "MacBook Neo 256GB Silver",
    categoria: "Mac",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgMacbookNeo,
    destaque: true,
  },
  {
    id: "macbook-neo-256gb-blue",
    nome: "MacBook Neo 256GB Blue",
    categoria: "Mac",
    condicao: "Lacrado",
    detalhe: "256GB · Caixa lacrada com nota fiscal",
    imagem: imgMacbookNeoBlue,
  },

  // ----- Acessórios -----
  {
    id: "apple-pencil-usbc",
    nome: "Apple Pencil (USB-C)",
    categoria: "Acessórios",
    condicao: "Lacrado",
    detalhe: "Caixa lacrada com nota fiscal",
    imagem: imgApplePencil,
  },
  {
    id: "magic-mouse-white",
    nome: "Magic Mouse White",
    categoria: "Acessórios",
    condicao: "Lacrado",
    detalhe: "Caixa lacrada com nota fiscal",
    imagem: imgMagicMouse,
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
