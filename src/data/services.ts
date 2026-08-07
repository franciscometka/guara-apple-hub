import {
  Smartphone,
  BatteryCharging,
  Cable,
  Camera,
  CircuitBoard,
  Droplets,
  Volume2,
  ScanFace,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  // TODO: [CONFIRMAR: PRAZOS REAIS de cada serviço]
  prazo: string;
  icon: LucideIcon;
  destaque?: boolean;
}

export const servicos: Servico[] = [
  {
    id: "tela",
    nome: "Troca de tela",
    descricao:
      "Display trincado, com manchas ou sem toque. Trocamos com peça testada antes de fechar o aparelho.",
    prazo: "Prazo informado no orçamento",
    icon: Smartphone,
    destaque: true,
  },
  {
    id: "bateria",
    nome: "Troca de bateria",
    descricao:
      "Bateria viciada, desligando sozinho ou com saúde baixa. Você vê o diagnóstico antes.",
    prazo: "Prazo informado no orçamento",
    icon: BatteryCharging,
    destaque: true,
  },
  {
    id: "conector",
    nome: "Conector de carga",
    descricao:
      "Não carrega, carrega só em certa posição ou não é reconhecido no computador.",
    prazo: "Prazo informado no orçamento",
    icon: Cable,
    destaque: true,
  },
  {
    id: "camera",
    nome: "Câmera",
    descricao:
      "Foto embaçada, lente trincada, câmera frontal ou traseira sem funcionar.",
    prazo: "Prazo informado no orçamento",
    icon: Camera,
    destaque: true,
  },
  {
    id: "placa",
    nome: "Reparo de placa",
    descricao:
      "Aparelho que não liga, sem sinal, sem imagem. Microssoldagem feita na nossa bancada.",
    prazo: "Depende do diagnóstico",
    icon: CircuitBoard,
    destaque: true,
  },
  {
    id: "molhado",
    nome: "Aparelho molhado",
    descricao:
      "Caiu na água ou tomou chuva. Quanto mais rápido chegar aqui, maior a chance de recuperar.",
    prazo: "Atendimento prioritário",
    icon: Droplets,
    destaque: true,
  },
  {
    id: "botoes",
    nome: "Botões e vibra",
    descricao:
      "Botão de volume, power ou silencioso travado, afundado ou sem resposta.",
    prazo: "Prazo informado no orçamento",
    icon: ToggleLeft,
  },
  {
    id: "alto-falante",
    nome: "Alto-falante e microfone",
    descricao:
      "Som baixo, chiado na ligação ou quem está do outro lado não te escuta.",
    prazo: "Prazo informado no orçamento",
    icon: Volume2,
  },
  {
    id: "face-id",
    nome: "Face ID",
    descricao:
      "Reconhecimento facial indisponível depois de queda ou de reparo feito em outro lugar.",
    prazo: "Depende do diagnóstico",
    icon: ScanFace,
  },
];

export const PASSOS = [
  {
    numero: "1",
    titulo: "Diagnóstico",
    texto: "Abrimos e testamos o aparelho pra saber o que realmente aconteceu.",
  },
  {
    numero: "2",
    titulo: "Orçamento no WhatsApp",
    texto: "Você recebe o valor, a peça e o prazo por escrito, sem enrolação.",
  },
  {
    numero: "3",
    titulo: "Você aprova",
    texto: "Nada é feito antes do seu ok. Se não aprovar, devolvemos como estava.",
  },
  {
    numero: "4",
    titulo: "Conserto e retirada",
    texto: "Serviço executado na bancada e aparelho testado com você na loja.",
  },
];

export const GARANTIA = [
  {
    titulo: "Garantia no serviço",
    // TODO: [CONFIRMAR: prazo de garantia dos reparos]
    texto:
      "Todo reparo sai com garantia registrada. O prazo depende do serviço e da peça — informamos junto com o orçamento.",
  },
  {
    titulo: "Orçamento antes",
    // TODO: [CONFIRMAR: o diagnóstico é realmente gratuito?]
    texto:
      "Diagnóstico e orçamento vêm antes do serviço. Você só paga depois de aprovar.",
  },
  {
    titulo: "Quem vende é quem conserta",
    texto:
      "Se o aparelho foi comprado aqui, o pós-venda é aqui mesmo. Sem jogo de empurra.",
  },
];
