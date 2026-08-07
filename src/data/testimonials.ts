export interface Depoimento {
  nome: string;
  cidade: string;
  texto: string;
  foto: string;
  placeholder?: boolean;
}

// TODO: substituir por depoimento real — [CONFIRMAR: 3 DEPOIMENTOS REAIS +
// primeiro nome + cidade. Pegar prints de avaliação do Google/Instagram.]
// Nada aqui deve ir ao ar como se fosse avaliação verdadeira.
export const depoimentos: Depoimento[] = [
  {
    nome: "Depoimento a confirmar",
    cidade: "Guarapuava/PR",
    texto:
      "Espaço reservado para uma avaliação real de cliente. Assim que os prints do Google/Instagram chegarem, este texto será substituído.",
    foto: "",
    placeholder: true,
  },
  {
    nome: "Depoimento a confirmar",
    cidade: "Guarapuava/PR",
    texto:
      "Espaço reservado para uma avaliação real de cliente sobre a experiência de compra na loja.",
    foto: "",
    placeholder: true,
  },
  {
    nome: "Depoimento a confirmar",
    cidade: "Região de Guarapuava",
    texto:
      "Espaço reservado para uma avaliação real de cliente sobre a assistência técnica.",
    foto: "",
    placeholder: true,
  },
];
