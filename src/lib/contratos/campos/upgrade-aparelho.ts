import { NAO_POSSUI, NAO_SE_APLICA, numeroDe, textoDe, type DefPasso } from "./tipos";
import type { DefModelo } from "../modelos/tipos";
import { DOCUMENTO, TITULO, VERSAO } from "../modelos/upgrade-aparelho";
import { dataOuTexto, erroSoma, mesmoValor } from "../validadores";

/**
 * Passos do Modelo D — Contrato de Upgrade de Aparelho Apple.
 *
 * O dossiê deste modelo é o do aparelho de ENTRADA: é o que a loja adquire e
 * precisa rastrear em caso de fiscalização.
 */

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
    id: "entrada",
    titulo: "Aparelho de entrada",
    ajuda: "O aparelho que o cliente entrega. É este que vira o dossiê da loja.",
    campos: [
      { nome: "entrada_modelo", rotulo: "Modelo", tipo: "texto", largura: "meia" },
      { nome: "entrada_capacidade", rotulo: "Capacidade", tipo: "texto", largura: "terco" },
      { nome: "entrada_cor", rotulo: "Cor", tipo: "texto", largura: "terco" },
      { nome: "entrada_condicao", rotulo: "Condição", tipo: "texto", largura: "meia" },
      { nome: "entrada_estado_aparente", rotulo: "Estado aparente", tipo: "textoLongo" },
      { nome: "entrada_imei1", rotulo: "IMEI 1", tipo: "imei", largura: "meia" },
      {
        nome: "entrada_imei2",
        rotulo: "IMEI 2",
        tipo: "imei",
        largura: "meia",
        naoSeAplica: { texto: NAO_POSSUI, rotuloBotao: "Não possui" },
      },
      { nome: "entrada_serie", rotulo: "Número de série", tipo: "texto", largura: "meia" },
      { nome: "entrada_acessorios", rotulo: "Acessórios entregues", tipo: "texto" },
      {
        nome: "entrada_valor_avaliacao",
        rotulo: "Valor de avaliação",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "entrada_defeitos_conhecidos",
        rotulo: "Defeitos ou reparos conhecidos (cláusula 2.4)",
        tipo: "textoLongo",
        naoSeAplica: { texto: "nenhum informado", rotuloBotao: "Nenhum informado" },
      },
    ],
  },

  {
    id: "procedencia",
    titulo: "Procedência do aparelho de entrada",
    ajuda: "O documento apresentado para comprovar a origem do bem (cláusula 4.5).",
    campos: [
      {
        nome: "procedencia_documento",
        rotulo: "Documento apresentado",
        tipo: "texto",
        ajuda: "Ex.: nota fiscal de compra original, termo de upgrade anterior.",
        naoSeAplica: { texto: "nenhum documento apresentado", rotuloBotao: "Nenhum" },
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
    id: "preco",
    titulo: "Preço do upgrade",
    ajuda: "O valor abatido somado ao complemento tem de fechar com o valor de venda.",
    campos: [
      {
        nome: "adquirido_valor_venda",
        rotulo: "Valor de venda do aparelho adquirido",
        tipo: "leitura",
      },
      {
        nome: "valor_abatido",
        rotulo: "Valor abatido pelo aparelho de entrada",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "valor_complemento",
        rotulo: "Complemento a pagar",
        tipo: "dinheiro",
        largura: "meia",
      },
    ],
    validar: (dados) => {
      const venda = numeroDe(dados, "adquirido_valor_venda");
      const soma = numeroDe(dados, "valor_abatido") + numeroDe(dados, "valor_complemento");
      if (venda <= 0 || mesmoValor(soma, venda)) return {};
      return { valor_complemento: erroSoma(venda - soma) };
    },
  },

  {
    id: "pagamento",
    titulo: "Pagamento do complemento",
    campos: [
      {
        nome: "complemento_meio",
        rotulo: "Meio de pagamento",
        tipo: "texto",
        ajuda: "Ex.: cartão de crédito, Pix, dinheiro, financiamento.",
        largura: "meia",
      },
      { nome: "complemento_forma", rotulo: "Forma combinada", tipo: "texto", largura: "meia" },
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
    ajuda: "Cláusula 3.2: todas as condições financeiras entram antes da assinatura.",
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
    id: "entrega",
    titulo: "Entrega do aparelho adquirido",
    campos: [
      { nome: "entrega_local", rotulo: "Local da entrega", tipo: "texto", largura: "meia" },
      {
        nome: "entrega_prazo",
        rotulo: "Prazo de entrega",
        tipo: "texto",
        ajuda: "Ex.: até 10/11/2026, ou “no ato”.",
        largura: "meia",
      },
      {
        nome: "entrega_condicao",
        rotulo: "Condição para a entrega (cláusula 3.5)",
        tipo: "texto",
        ajuda: "Ex.: a aprovação da avaliação do aparelho de entrada.",
      },
    ],
  },

  {
    id: "verificacao",
    titulo: "Verificação técnica",
    ajuda: "Cláusula 5.3: o resultado da avaliação do aparelho de entrada.",
    campos: [
      { nome: "avaliacao_data", rotulo: "Avaliação concluída em", tipo: "data", largura: "meia" },
      { nome: "avaliacao_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
      { nome: "avaliacao_resultado", rotulo: "Resultado", tipo: "texto" },
      { nome: "avaliacao_ressalvas", rotulo: "Ressalvas e testes", tipo: "textoLongo" },
      {
        nome: "avaliacao_valor_definitivo",
        rotulo: "Valor definitivo aceito",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "entrada_entregue_data",
        rotulo: "Aparelho de entrada entregue em",
        tipo: "data",
        largura: "meia",
      },
      { nome: "entrada_entregue_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
    ],
  },

  {
    id: "garantias",
    titulo: "Garantias e prazos",
    campos: [
      {
        nome: "garantia_verificacao",
        rotulo: "Como a garantia Apple será verificada (cláusula 6.2)",
        tipo: "texto",
        ajuda: "Ex.: consulta ao site checkcoverage.apple.com pelo número de série.",
      },
      {
        nome: "canal_reclamacoes",
        rotulo: "Canal oficial de reclamações (cláusula 6.4)",
        tipo: "texto",
      },
      {
        nome: "transferencia_data",
        rotulo: "Data da transferência da propriedade",
        tipo: "data",
        largura: "meia",
      },
      { nome: "transferencia_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
      { nome: "transferencia_local", rotulo: "Local", tipo: "texto", largura: "meia" },
      {
        nome: "prazo_esclarecimentos",
        rotulo: "Prazo para esclarecimentos sobre bloqueio/furto (cláusula 8.4)",
        tipo: "numero",
        ajuda: "Em dias úteis.",
        largura: "terco",
      },
    ],
  },

  {
    id: "anexo_recebido",
    titulo: "Anexo 1 — Aparelho recebido: estado e testes",
    ajuda: "Item não testado deve sair como “não verificado”, sem presunção de funcionamento.",
    campos: [
      { nome: "anexo_estado_tela", rotulo: "Tela", tipo: "texto", largura: "meia" },
      { nome: "anexo_estado_carcaca", rotulo: "Carcaça", tipo: "texto", largura: "meia" },
      { nome: "anexo_estado_lentes", rotulo: "Lentes", tipo: "texto", largura: "meia" },
      { nome: "anexo_sinais_uso", rotulo: "Sinais de uso ou dano", tipo: "texto", largura: "meia" },
      {
        nome: "anexo_fotos",
        rotulo: "Fotos anexas",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      { nome: "anexo_teste_tela", rotulo: "Tela e toque", tipo: "texto", largura: "meia" },
      { nome: "anexo_teste_cameras", rotulo: "Câmeras", tipo: "texto", largura: "meia" },
      { nome: "anexo_teste_audio", rotulo: "Áudio", tipo: "texto", largura: "meia" },
      { nome: "anexo_teste_botoes", rotulo: "Botões", tipo: "texto", largura: "meia" },
      { nome: "anexo_teste_rede", rotulo: "Wi-Fi/rede", tipo: "texto", largura: "meia" },
      { nome: "anexo_teste_carregamento", rotulo: "Carregamento", tipo: "texto", largura: "meia" },
      {
        nome: "anexo_teste_biometria",
        rotulo: "Face ID/Touch ID",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "anexo_teste_outros",
        rotulo: "Outros testes",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      { nome: "anexo_bateria", rotulo: "Saúde da bateria (%)", tipo: "numero", largura: "terco" },
      {
        nome: "anexo_mensagens_pecas",
        rotulo: "Mensagens do sistema sobre peças",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "anexo_reparos_informados",
        rotulo: "Reparos informados",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "anexo_nao_verificados",
        rotulo: "Itens não verificados",
        tipo: "texto",
        naoSeAplica: { texto: "nenhum", rotuloBotao: "Nenhum" },
      },
    ],
  },

  {
    id: "anexo_bloqueios",
    titulo: "Anexo 1 — Bloqueios, contas e resultado",
    campos: [
      {
        nome: "anexo_imei_consultado_onde",
        rotulo: "IMEI consultado em",
        tipo: "texto",
        ajuda: "Ex.: base da GSMA, site da operadora.",
      },
      {
        nome: "anexo_imei_consultado_data",
        rotulo: "Data da consulta",
        tipo: "data",
        largura: "meia",
      },
      { nome: "anexo_imei_consultado_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
      { nome: "anexo_imei_resultado", rotulo: "Resultado da consulta", tipo: "texto" },
      { nome: "anexo_find_my", rotulo: "Buscar/Find My", tipo: "texto", largura: "meia" },
      { nome: "anexo_conta_apple", rotulo: "Conta Apple", tipo: "texto", largura: "meia" },
      { nome: "anexo_reset", rotulo: "Reset", tipo: "texto", largura: "meia" },
      {
        nome: "anexo_resultado",
        rotulo: "Resultado da avaliação",
        tipo: "opcoes",
        opcoes: [
          { valor: "APROVADO", texto: "Aprovado" },
          { valor: "RECUSADO", texto: "Recusado" },
        ],
      },
      {
        nome: "anexo_valor_preliminar",
        rotulo: "Valor preliminar",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "anexo_resultado_ressalvas",
        rotulo: "Ressalvas",
        tipo: "texto",
        naoSeAplica: { texto: "nenhuma", rotuloBotao: "Nenhuma" },
      },
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
        nome: "anexo_garantia_ate",
        rotulo: "Garantia Apple verificada até",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "anexo_termo_adicional",
        rotulo: "Termo adicional da loja",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      {
        nome: "anexo_complemento_pago",
        rotulo: "Complemento pago",
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

export const MODELO_UPGRADE: DefModelo = {
  slug: "upgrade-aparelho",
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
    canal_reclamacoes: loja.canal_atendimento,
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

  // Upgrade: o dossiê é do aparelho de ENTRADA, que é o que a loja adquire e
  // precisa rastrear.
  dossie: (dados) => ({
    origem: "upgrade_entrada",
    marca: "Apple",
    modelo: textoDe(dados, "entrada_modelo"),
    cor: textoDe(dados, "entrada_cor"),
    capacidade: textoDe(dados, "entrada_capacidade"),
    imei1: textoDe(dados, "entrada_imei1"),
    imei2: textoDe(dados, "entrada_imei2"),
    serie: textoDe(dados, "entrada_serie"),
    adquiridoEm: textoDe(dados, "entrada_entregue_data"),
  }),

  derivados: (dados) => ({
    data_fechamento: dataOuTexto(textoDe(dados, "data_fechamento_iso")),
    avaliacao_data: dataOuTexto(textoDe(dados, "avaliacao_data")),
    entrada_entregue_data: dataOuTexto(textoDe(dados, "entrada_entregue_data")),
    transferencia_data: dataOuTexto(textoDe(dados, "transferencia_data")),
    anexo_imei_consultado_data: dataOuTexto(textoDe(dados, "anexo_imei_consultado_data")),
    anexo_nf_emissao: dataOuTexto(textoDe(dados, "anexo_nf_emissao")),
  }),
};
