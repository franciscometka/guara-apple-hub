import { NAO_POSSUI, NAO_SE_APLICA, textoDe, type DefPasso } from "./tipos";
import type { DefModelo } from "../modelos/tipos";
import { DOCUMENTO, TITULO, VERSAO } from "../modelos/termo-garantia-novo";
import { dataOuTexto } from "../validadores";

/**
 * Passos do Modelo A — Termo de Garantia de Aparelho Novo.
 *
 * Quatro blocos de perguntas, mais a conferência dos dados da loja na entrada
 * e a revisão final. Todos os campos são obrigatórios; onde o documento prevê
 * dispensa, o campo ganha o botão explícito de "não se aplica".
 */

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const PASSOS: DefPasso[] = [
  {
    id: "loja",
    titulo: "Confira os dados da loja",
    ajuda: "Vem de “Dados da loja”. Se algo estiver errado, corrija lá antes de continuar.",
    tipo: "conferencia",
    campos: [
      { nome: "loja_razao_social", rotulo: "Razão social", tipo: "leitura" },
      { nome: "loja_cnpj", rotulo: "CNPJ", tipo: "leitura" },
      { nome: "loja_endereco", rotulo: "Sede", tipo: "leitura" },
      { nome: "loja_representante", rotulo: "Representante legal", tipo: "leitura" },
      { nome: "loja_representante_cpf", rotulo: "CPF do representante", tipo: "leitura" },
    ],
  },

  {
    id: "cliente",
    titulo: "Quem é o cliente?",
    ajuda: "Os dados que identificam o CLIENTE/CONSUMIDOR no termo.",
    campos: [
      { nome: "cliente_nome", rotulo: "Nome completo", tipo: "texto" },
      {
        nome: "cliente_nacionalidade",
        rotulo: "Nacionalidade",
        tipo: "texto",
        largura: "terco",
      },
      { nome: "cliente_estado_civil", rotulo: "Estado civil", tipo: "texto", largura: "terco" },
      { nome: "cliente_profissao", rotulo: "Profissão", tipo: "texto", largura: "terco" },
      { nome: "cliente_cpf", rotulo: "CPF", tipo: "cpf", largura: "meia" },
      {
        nome: "cliente_endereco",
        rotulo: "Endereço completo",
        tipo: "texto",
        ajuda: "Rua, número, complemento, bairro, cidade e UF.",
      },
    ],
  },

  {
    id: "aparelho",
    titulo: "Qual é o aparelho?",
    ajuda: "O termo fica vinculado a este IMEI e a este número de série.",
    campos: [
      { nome: "aparelho_marca", rotulo: "Marca", tipo: "texto", largura: "meia" },
      { nome: "aparelho_modelo", rotulo: "Modelo", tipo: "texto", largura: "meia" },
      { nome: "imei1", rotulo: "IMEI 1", tipo: "imei", largura: "meia" },
      {
        nome: "imei2",
        rotulo: "IMEI 2",
        tipo: "imei",
        largura: "meia",
        naoSeAplica: { texto: NAO_POSSUI, rotuloBotao: "Não possui" },
      },
      { nome: "serie", rotulo: "Número de série", tipo: "texto", largura: "meia" },
      {
        nome: "ordem_servico",
        rotulo: "Número da ordem de serviço",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      { nome: "data_compra", rotulo: "Data da compra", tipo: "data", largura: "meia" },
      { nome: "nota_fiscal", rotulo: "Nota fiscal nº", tipo: "texto", largura: "meia" },
    ],
  },

  {
    id: "canais",
    titulo: "Canais de atendimento do termo",
    ajuda:
      "Já vêm dos dados da loja (cláusula 13.4). Edite só se este termo precisar de um canal diferente.",
    campos: [
      { nome: "canal_telefone", rotulo: "Telefone/WhatsApp", tipo: "telefone", largura: "meia" },
      { nome: "canal_email", rotulo: "E-mail", tipo: "email", largura: "meia" },
      { nome: "canal_endereco", rotulo: "Endereço para atendimento", tipo: "texto" },
    ],
  },

  {
    id: "fechamento",
    titulo: "Fechamento e entrega",
    ajuda: "Local e data que vão na linha de assinatura.",
    campos: [
      { nome: "cidade", rotulo: "Cidade", tipo: "texto", largura: "meia" },
      { nome: "uf", rotulo: "UF", tipo: "uf", largura: "terco" },
      { nome: "data_fechamento", rotulo: "Data do termo", tipo: "data", largura: "meia" },
      {
        nome: "data_entrega_termo",
        rotulo: "Data da entrega do termo",
        tipo: "data",
        largura: "meia",
        ajuda: "Vai na Declaração de Recebimento.",
      },
    ],
  },

  {
    id: "revisao",
    titulo: "Revisão",
    ajuda: "Confira tudo antes de gerar o PDF. Depois de gerado, os dados ficam travados.",
    tipo: "revisao",
    campos: [],
  },
];

export const MODELO_TERMO_GARANTIA: DefModelo = {
  slug: "termo-garantia-novo",
  versao: VERSAO,
  titulo: TITULO,

  etapas: [
    {
      etapa: "principal",
      titulo: TITULO,
      passos: PASSOS,
      documento: DOCUMENTO,
    },
  ],

  daLoja: (loja) => ({
    loja_razao_social: loja.razao_social,
    loja_cnpj: loja.cnpj,
    loja_endereco: `${loja.endereco}, ${loja.cidade}/${loja.uf}, CEP ${loja.cep}`,
    loja_representante: loja.representante,
    loja_representante_cpf: loja.representante_cpf,
    // Pré-preenche os canais da cláusula 13.4, que seguem editáveis no passo.
    canal_telefone: loja.telefone,
    canal_email: loja.email,
    canal_endereco: loja.endereco_atendimento,
    cidade: loja.cidade,
    uf: loja.uf,
  }),

  doProduto: (produto) => ({
    aparelho_marca: "Apple",
    aparelho_modelo: produto.nome,
  }),

  identificacao: (dados) => ({
    nome: textoDe(dados, "cliente_nome"),
    cpf: textoDe(dados, "cliente_cpf"),
  }),

  // Termo de Garantia: o dossiê é do aparelho vendido.
  dossie: (dados) => ({
    origem: "venda",
    marca: textoDe(dados, "aparelho_marca"),
    modelo: textoDe(dados, "aparelho_modelo"),
    cor: "",
    capacidade: "",
    imei1: textoDe(dados, "imei1"),
    imei2: textoDe(dados, "imei2"),
    serie: textoDe(dados, "serie"),
    adquiridoEm: textoDe(dados, "data_compra"),
  }),

  derivados: (dados) => {
    const iso = textoDe(dados, "data_fechamento");
    const mes = Number(iso.slice(5, 7));
    return {
      data_compra: dataOuTexto(textoDe(dados, "data_compra")),
      data_entrega_termo: dataOuTexto(textoDe(dados, "data_entrega_termo")),
      dia: iso.slice(8, 10),
      mes_extenso: MESES[mes - 1] ?? "",
      ano: iso.slice(0, 4),
    };
  },
};
