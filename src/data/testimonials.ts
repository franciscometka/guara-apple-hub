export interface Depoimento {
  nome: string;
  fonte: "Google";
  texto: string;
}

/** Avaliações reais publicadas no Google. Texto exatamente como o cliente escreveu. */
export const depoimentos: Depoimento[] = [
  {
    nome: "Melissa Dellê Marcondes",
    fonte: "Google",
    texto: "Atendimento fantástico, produtos originais, preço justo. Super recomendo!!!",
  },
  {
    nome: "Lucas Maciel",
    fonte: "Google",
    texto:
      "Ótimo atendimento, produto de qualidade. Recomendo a todos. Nenhum problema com todo o processo, desde atendimento até com a entrega.",
  },
  {
    nome: "Maria Aparecida do Nascimento Oliveira",
    fonte: "Google",
    texto:
      "Atendimento incrível! Comprei meu iPhone aqui e fui super bem atendido. Equipe atenciosa e muito prestativa. Recomendo!",
  },
  {
    nome: "Larissa Almeida",
    fonte: "Google",
    texto: "Melhor atendimento! Melhores preços! Segunda vez que compro e recomendo muito!",
  },
  {
    nome: "Dayane Techy",
    fonte: "Google",
    texto: "Ótimo atendimento e ótimo preço! Mais em conta da cidade.",
  },
];

// TODO: [CONFIRMAR: link do perfil no Google Maps]
export const GOOGLE_REVIEWS_URL = "https://www.google.com/maps";
// TODO: [CONFIRMAR: nota e total de avaliações no Google] — não exibir até confirmar.
