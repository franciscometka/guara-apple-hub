export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Vocês vendem iPhone lacrado ou só seminovo?",
    a: "Os dois. Trabalhamos com aparelhos lacrados e com seminovos revisados. Em todo seminovo a gente informa antes o estado real, a saúde da bateria e o que acompanha.",
  },
  {
    // TODO: [CONFIRMAR: prazos de garantia]
    q: "Tem garantia?",
    a: "Sim. Todo produto sai com nota fiscal e garantia. O prazo varia conforme o modelo e a condição do aparelho — a gente te informa antes da compra.",
  },
  {
    // TODO: [CONFIRMAR: prazos médios de reparo]
    q: "Quanto tempo demora um conserto?",
    a: "Depende do serviço. Reparos comuns como tela e bateria costumam ser rápidos; casos de placa ou aparelho molhado exigem diagnóstico primeiro. Você recebe o prazo junto com o orçamento.",
  },
  {
    // TODO: [CONFIRMAR: o diagnóstico é gratuito?]
    q: "Preciso pagar pra saber o orçamento?",
    a: "Não. O diagnóstico e o orçamento vêm antes, no WhatsApp. Só depois que você aprova é que o serviço começa.",
  },
  {
    q: "Vocês parcelam?",
    a: "Sim, parcelamos em até 21x no cartão. Fala com a gente no WhatsApp que te passamos as condições atualizadas.",
  },
  {
    // TODO: [CONFIRMAR: a loja faz trade-in? Substituir a resposta abaixo]
    q: "Aceitam meu aparelho usado na troca?",
    a: "Fala com a gente no WhatsApp com o modelo e o estado do seu aparelho que confirmamos essa possibilidade na hora.",
  },
  {
    q: "Vocês entregam ou é só retirada na loja?",
    a: "Entregamos em até 100 km a partir do centro de Guarapuava. Confirme com a gente no WhatsApp se sua cidade está dentro dessa área.",
  },
  {
    q: "Onde vocês ficam?",
    a: "Av. Manoel Ribas, 1945 — Sala 7, em Guarapuava. Segunda a sexta das 09h às 19h e sábado até às 15h.",
  },
];

const byQuestion = (q: string): FaqItem => faq.find((item) => item.q === q) ?? { q, a: "" };

export const faqAssistencia: FaqItem[] = [
  byQuestion("Quanto tempo demora um conserto?"),
  byQuestion("Preciso pagar pra saber o orçamento?"),
  {
    // TODO: [CONFIRMAR: origem/qualidade das peças usadas]
    q: "Que tipo de peça vocês usam?",
    a: "Trabalhamos com peças testadas antes da instalação e te informamos exatamente qual peça entra no seu aparelho antes de aprovar o serviço.",
  },
  {
    q: "Meu iPhone já foi aberto em outro lugar. Vocês pegam?",
    a: "Pegamos. Fazemos o diagnóstico do que foi feito antes e te contamos a real sobre o que dá e o que não dá pra recuperar.",
  },
  {
    q: "Preciso agendar?",
    a: "Não precisa. Você pode passar na loja no horário de atendimento ou mandar mensagem antes pra já adiantar o diagnóstico.",
  },
  byQuestion("Onde vocês ficam?"),
];

export const faqVenda: FaqItem[] = [
  byQuestion("Aceitam meu aparelho usado na troca?"),
  {
    // TODO: [CONFIRMAR: quais modelos a loja aceita comprar/receber na troca]
    q: "Que modelos vocês aceitam?",
    a: "Manda o modelo do seu iPhone no WhatsApp que a gente confirma na hora se aceitamos esse aparelho.",
  },
  {
    // TODO: [CONFIRMAR: critérios reais de avaliação do aparelho usado]
    q: "Como vocês avaliam o estado do meu aparelho?",
    a: "A gente pergunta sobre a tela, a bateria, se funciona tudo certo e o que acompanha (caixa, carregador, acessórios). Com essas informações já dá pra te passar uma ideia do valor.",
  },
  {
    q: "Preciso levar o aparelho na loja pra saber o valor?",
    a: "Não pra uma primeira ideia — você pode mandar as informações pelo WhatsApp. Mas a confirmação final do valor acontece com o aparelho em mãos, na loja.",
  },
  byQuestion("Onde vocês ficam?"),
];
