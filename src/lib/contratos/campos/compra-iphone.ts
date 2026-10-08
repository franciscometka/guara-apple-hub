import { NAO_POSSUI, textoDe, type DefPasso } from "./tipos";
import type { DefModelo } from "../modelos/tipos";
import { DOCUMENTO, TITULO, VERSAO } from "../modelos/compra-iphone";
import { dataOuTexto } from "../validadores";

const SIM_NAO = [
  { valor: "sim", texto: "Sim" },
  { valor: "não", texto: "Não" },
] as const;

const PASSOS: DefPasso[] = [
  {
    id: "loja",
    titulo: "Confira os dados da loja",
    ajuda: "Vem de “Dados da loja”. Se algo estiver errado, corrija lá antes de continuar.",
    tipo: "conferencia",
    campos: [
      { nome: "loja_razao_social", rotulo: "Razão social", tipo: "leitura" },
      { nome: "loja_cnpj", rotulo: "CNPJ", tipo: "leitura" },
      { nome: "loja_endereco_simples", rotulo: "Endereço", tipo: "leitura" },
      { nome: "loja_cidade_uf", rotulo: "Cidade/UF", tipo: "leitura" },
      { nome: "loja_representante", rotulo: "Representante", tipo: "leitura" },
    ],
  },

  {
    id: "consumidor",
    titulo: "Quem é o consumidor?",
    campos: [
      { nome: "consumidor_nome", rotulo: "Nome completo", tipo: "texto" },
      { nome: "consumidor_cpf", rotulo: "CPF", tipo: "cpf", largura: "meia" },
      {
        nome: "consumidor_documento",
        rotulo: "Documento de identidade nº",
        tipo: "texto",
        largura: "meia",
      },
      { nome: "consumidor_endereco", rotulo: "Endereço completo", tipo: "texto" },
      {
        nome: "consumidor_telefone",
        rotulo: "Telefone/WhatsApp",
        tipo: "telefone",
        largura: "meia",
      },
    ],
  },

  {
    id: "adquirido",
    titulo: "Aparelho adquirido",
    ajuda: "O aparelho que o cliente leva.",
    campos: [
      { nome: "adquirido_modelo", rotulo: "Modelo", tipo: "texto", largura: "meia" },
      { nome: "adquirido_capacidade", rotulo: "Capacidade", tipo: "texto", largura: "terco" },
      { nome: "adquirido_cor", rotulo: "Cor", tipo: "texto", largura: "terco" },
      { nome: "adquirido_condicao", rotulo: "Condição", tipo: "texto", largura: "meia" },
      { nome: "adquirido_estado_aparente", rotulo: "Estado aparente", tipo: "textoLongo" },
      { nome: "adquirido_imei1", rotulo: "IMEI 1", tipo: "imei", largura: "meia" },
      {
        nome: "adquirido_imei2",
        rotulo: "IMEI 2",
        tipo: "imei",
        largura: "meia",
        naoSeAplica: { texto: NAO_POSSUI, rotuloBotao: "Não possui" },
      },
      { nome: "adquirido_serie", rotulo: "Número de série", tipo: "texto", largura: "meia" },
      {
        nome: "adquirido_conservacao",
        rotulo: "Estado de conservação e acessórios",
        tipo: "textoLongo",
      },
      {
        nome: "adquirido_valor_venda",
        rotulo: "Valor de venda",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "adquirido_nota_fiscal",
        rotulo: "Nota fiscal nº",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: "informada na entrega", rotuloBotao: "Informada na entrega" },
      },
    ],
  },

  {
    id: "pagamento",
    titulo: "Pagamento da compra",
    campos: [
      {
        nome: "pagamento_meio",
        rotulo: "Meio de pagamento",
        tipo: "texto",
        ajuda: "Ex.: cartão de crédito, Pix, dinheiro, financiamento.",
        largura: "meia",
      },
      { nome: "pagamento_forma", rotulo: "Forma combinada", tipo: "texto", largura: "meia" },
      {
        nome: "ha_parcelamento",
        rotulo: "Há parcelamento?",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
    ],
  },

  {
    id: "parcelamento",
    titulo: "Condições do parcelamento",
    quando: (dados) => textoDe(dados, "ha_parcelamento") === "sim",
    campos: [
      {
        nome: "parcelas_quantidade",
        rotulo: "Quantidade de parcelas",
        tipo: "numero",
        largura: "terco",
      },
      {
        nome: "parcelas_valor",
        rotulo: "Valor de cada parcela",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "parcelas_vencimento",
        rotulo: "Vencimentos",
        tipo: "texto",
        ajuda: "Ex.: dia 10 de cada mês, a partir de 10/11/2026.",
        largura: "meia",
      },
      { nome: "parcelas_total", rotulo: "Total a prazo", tipo: "dinheiro", largura: "meia" },
      { nome: "parcelas_juros", rotulo: "Juros (taxa)", tipo: "texto", largura: "terco" },
      {
        nome: "parcelas_periodicidade",
        rotulo: "Periodicidade dos juros",
        tipo: "texto",
        ajuda: "Ex.: mês, ano.",
        largura: "terco",
      },
      { nome: "parcelas_encargos", rotulo: "Demais encargos", tipo: "texto", largura: "meia" },
      { nome: "parcelas_cet", rotulo: "Custo efetivo total", tipo: "texto", largura: "meia" },
      {
        nome: "parcelas_financiador",
        rotulo: "Agente financiador",
        tipo: "texto",
        largura: "meia",
      },
    ],
  },

  {
    id: "transferencia",
    titulo: "Transferência da propriedade",
    campos: [
      {
        nome: "transferencia_data",
        rotulo: "Data da transferência da propriedade",
        tipo: "data",
        largura: "meia",
      },
      { nome: "transferencia_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
      { nome: "transferencia_local", rotulo: "Local", tipo: "texto", largura: "meia" },
    ],
  },

  {
    id: "anexo_entregue",
    titulo: "Anexo 1 — Aparelho entregue ao consumidor",
    campos: [
      { nome: "anexo_saida_estado", rotulo: "Estado físico", tipo: "texto", largura: "meia" },
      {
        nome: "anexo_saida_bateria",
        rotulo: "Saúde da bateria, se informada",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: "não informada", rotuloBotao: "Não informada" },
      },
      { nome: "anexo_saida_acessorios", rotulo: "Acessórios", tipo: "texto" },
      {
        nome: "anexo_saida_limitacoes",
        rotulo: "Reparos e limitações informados",
        tipo: "texto",
        naoSeAplica: { texto: "nenhum", rotuloBotao: "Nenhum" },
      },
      { nome: "anexo_nf_emissao", rotulo: "Emissão da nota fiscal", tipo: "data", largura: "meia" },
      {
        nome: "pagamento_valor_pago",
        rotulo: "Valor pago",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "anexo_saldo_pagar",
        rotulo: "Saldo a pagar",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0,00", rotuloBotao: "Sem saldo" },
      },
    ],
  },

  {
    id: "fechamento",
    titulo: "Fechamento e testemunhas",
    campos: [
      { nome: "cidade", rotulo: "Cidade", tipo: "texto", largura: "meia" },
      { nome: "uf", rotulo: "UF", tipo: "uf", largura: "terco" },
      { nome: "data_fechamento_iso", rotulo: "Data do contrato", tipo: "data", largura: "meia" },
      { nome: "testemunha1_nome", rotulo: "Testemunha 1 — nome", tipo: "texto", largura: "meia" },
      { nome: "testemunha1_cpf", rotulo: "Testemunha 1 — CPF", tipo: "cpf", largura: "meia" },
      { nome: "testemunha2_nome", rotulo: "Testemunha 2 — nome", tipo: "texto", largura: "meia" },
      { nome: "testemunha2_cpf", rotulo: "Testemunha 2 — CPF", tipo: "cpf", largura: "meia" },
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

export const MODELO_COMPRA: DefModelo = {
  slug: "compra-iphone",
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
    loja_endereco_simples: loja.endereco,
    loja_cidade_uf: `${loja.cidade}/${loja.uf}`,
    loja_cep: loja.cep,
    loja_representante: loja.representante,
    cidade: loja.cidade,
    uf: loja.uf,
  }),

  doProduto: (produto) => ({
    adquirido_modelo: produto.nome,
    adquirido_cor: produto.cor,
    adquirido_condicao: produto.condicao,
    adquirido_valor_venda: produto.preco,
  }),

  identificacao: (dados) => ({
    nome: textoDe(dados, "consumidor_nome"),
    cpf: textoDe(dados, "consumidor_cpf"),
  }),

  // O dossiê acompanha o iPhone vendido, não um aparelho de entrada.
  dossie: (dados) => ({
    origem: "venda",
    marca: "Apple",
    modelo: textoDe(dados, "adquirido_modelo"),
    cor: textoDe(dados, "adquirido_cor"),
    capacidade: textoDe(dados, "adquirido_capacidade"),
    imei1: textoDe(dados, "adquirido_imei1"),
    imei2: textoDe(dados, "adquirido_imei2"),
    serie: textoDe(dados, "adquirido_serie"),
    adquiridoEm: textoDe(dados, "transferencia_data"),
  }),

  derivados: (dados) => ({
    data_fechamento: dataOuTexto(textoDe(dados, "data_fechamento_iso")),
    transferencia_data: dataOuTexto(textoDe(dados, "transferencia_data")),
    anexo_nf_emissao: dataOuTexto(textoDe(dados, "anexo_nf_emissao")),
  }),
};
