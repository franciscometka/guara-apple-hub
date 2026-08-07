// TODO: [CONFIRMAR: NÚMERO WHATSAPP] — o formulário informou 42 99122-0341,
// a fachada da loja mostra 42 9 9162-1683. Mantido o do formulário até confirmar.
export const WHATSAPP = "5542991220341";

export const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export const WA_MESSAGES = {
  generico: "Olá! Vim pelo site da Guara iPhones e gostaria de mais informações.",
  produto: (produto: string) =>
    `Olá! Vi o ${produto} no site e quero saber a disponibilidade e o valor.`,
  assistencia: (servico: string) =>
    `Olá! Preciso de um orçamento para ${servico} no meu iPhone.`,
  troca:
    "Olá! Quero saber quanto meu iPhone vale de entrada na troca. Modelo: ",
  ctaFinal: "Olá! Vim pelo site e quero falar com um atendente.",
};

export type WaOrigem =
  | "hero"
  | "produto"
  | "servico"
  | "cta_final"
  | "fab"
  | "navbar"
  | "rodape"
  | "localizacao";

/**
 * Dispara os eventos de conversão nas ferramentas de medição.
 * GA4: evento `whatsapp_click` com parâmetro `origem`.
 * Meta Pixel: evento `Contact` (pronto para ativar quando o Pixel ID chegar).
 */
export function trackWhatsApp(origem: WaOrigem) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  w.gtag?.("event", "whatsapp_click", { origem });
  // TODO: [CONFIRMAR: Pixel ID] — ativar após inserir o Meta Pixel
  w.fbq?.("track", "Contact", { origem });
}

export const TAGLINE = "Somos apaixonados pela Apple";

export const CONTATO = {
  // TODO: [CONFIRMAR: NÚMERO WHATSAPP]
  telefoneExibicao: "(42) 99122-0341",
  // TODO: [CONFIRMAR: e-mail comercial no domínio próprio]
  email: "adrianom.dacruz2@gmail.com",
  // TODO: [CONFIRMAR: CEP e bairro]
  endereco: "Av. Manoel Ribas, 1945 — Sala 7 · Guarapuava/PR",
  enderecoMaps: "Av. Manoel Ribas, 1945, Sala 7, Guarapuava, PR",
  horarios: [
    "Segunda a sexta: 09h às 19h",
    "Sábado: 09h às 15h",
    "Domingo: fechado",
  ],
  horarioResumo: "Seg a Sex 09h–19h · Sáb 09h–15h",
  instagram: "https://instagram.com/guaraiphones",
  instagramHandle: "@guaraiphones",
  // TODO: [CONFIRMAR: página exata no Facebook]
  facebook: "https://facebook.com/",
  tiktok: "https://tiktok.com/",
};

export const mapsRoute = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    CONTATO.enderecoMaps,
  )}`;
