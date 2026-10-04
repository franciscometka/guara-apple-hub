import { NAO_HA, NAO_POSSUI, NAO_SE_APLICA, numeroDe, textoDe, type DefPasso } from "./tipos";
import type { DefModelo } from "../modelos/tipos";
import {
  DOCUMENTO,
  DOCUMENTO_CONCLUSAO,
  DOCUMENTO_DIAGNOSTICO,
  FUNCOES,
  INSPECAO_FISICA,
  TESTES_COMPLEMENTARES,
  TITULO,
  TITULO_CONCLUSAO,
  TITULO_DIAGNOSTICO,
  VERSAO,
} from "../modelos/checklist-assistencia";
import { dataOuTexto, erroSoma, mesmoValor } from "../validadores";

/**
 * Passos do Modelo C — Checklist de Entrada para Assistência Técnica.
 *
 * Três etapas, cada uma com PDF e assinatura próprios: entrada, diagnóstico e
 * orçamento, conclusão e retirada.
 */

const SIM_NAO = [
  { valor: "sim", texto: "Sim" },
  { valor: "não", texto: "Não" },
] as const;

const SIM_NAO_NAOSABE = [
  { valor: "sim", texto: "Sim" },
  { valor: "não", texto: "Não" },
  { valor: "não sabe", texto: "Não sabe" },
] as const;

const PASSOS_ENTRADA: DefPasso[] = [
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
      { nome: "loja_cep", rotulo: "CEP", tipo: "leitura" },
      { nome: "loja_telefone", rotulo: "Telefone da loja", tipo: "leitura" },
    ],
  },

  {
    id: "ordem",
    titulo: "Abertura da ordem de serviço",
    ajuda: "O número é gerado pelo sistema. A data e a hora já vêm com o momento atual.",
    campos: [
      { nome: "ordem_servico", rotulo: "Ordem de serviço nº", tipo: "leitura" },
      { nome: "entrada_data_iso", rotulo: "Data da entrada", tipo: "data", largura: "meia" },
      { nome: "entrada_hora", rotulo: "Horário da entrada", tipo: "hora", largura: "terco" },
    ],
  },

  {
    id: "cliente",
    titulo: "Cliente e contato",
    campos: [
      { nome: "cliente_nome", rotulo: "Nome completo", tipo: "texto" },
      { nome: "cliente_cpf", rotulo: "CPF", tipo: "cpf", largura: "meia" },
      { nome: "cliente_telefone", rotulo: "Telefone/WhatsApp", tipo: "telefone", largura: "meia" },
      { nome: "cliente_email", rotulo: "E-mail", tipo: "email", largura: "meia" },
      { nome: "cliente_endereco", rotulo: "Endereço", tipo: "texto" },
      {
        nome: "autorizada_nome",
        rotulo: "Pessoa autorizada a receber informações/retirar — nome",
        tipo: "texto",
        naoSeAplica: { texto: NAO_HA, rotuloBotao: "Não há" },
      },
      {
        nome: "autorizada_cpf",
        rotulo: "Pessoa autorizada — CPF",
        tipo: "cpf",
        largura: "meia",
        naoSeAplica: { texto: NAO_HA, rotuloBotao: "Não há" },
      },
      {
        nome: "autorizada_telefone",
        rotulo: "Pessoa autorizada — Telefone/WhatsApp",
        tipo: "telefone",
        largura: "meia",
        naoSeAplica: { texto: NAO_HA, rotuloBotao: "Não há" },
      },
    ],
  },

  {
    id: "equipamento",
    titulo: "Identificação do equipamento",
    campos: [
      {
        nome: "equipamento_marca_modelo_cor",
        rotulo: "Marca/modelo/cor",
        tipo: "texto",
      },
      { nome: "equipamento_serie", rotulo: "Número de série", tipo: "texto", largura: "meia" },
      { nome: "equipamento_imei1", rotulo: "IMEI 1", tipo: "imei", largura: "meia" },
      {
        nome: "equipamento_imei2",
        rotulo: "IMEI 2",
        tipo: "imei",
        largura: "meia",
        naoSeAplica: { texto: NAO_POSSUI, rotuloBotao: "Não possui" },
      },
      { nome: "equipamento_capacidade", rotulo: "Capacidade", tipo: "texto", largura: "terco" },
      { nome: "equipamento_ios", rotulo: "iOS/versão", tipo: "texto", largura: "terco" },
      {
        nome: "equipamento_estado",
        rotulo: "Estado do aparelho",
        tipo: "opcoes",
        opcoes: [
          { valor: "ligado", texto: "Ligado" },
          { valor: "desligado", texto: "Desligado" },
          { valor: "não liga", texto: "Não liga" },
          { valor: "reinicia", texto: "Reinicia" },
        ],
      },
      { nome: "equipamento_carga", rotulo: "Carga aparente (%)", tipo: "numero", largura: "terco" },
      {
        nome: "equipamento_bateria",
        rotulo: "Saúde da bateria (%)",
        tipo: "numero",
        largura: "terco",
        naoSeAplica: { texto: "não acessível", rotuloBotao: "Não acessível" },
      },
      {
        nome: "acessorios_recebidos",
        rotulo: "Acessórios recebidos",
        tipo: "texto",
        ajuda: "Ex.: capa, película, cabo, carregador, chip/SIM.",
        naoSeAplica: { texto: "nenhum", rotuloBotao: "Nenhum" },
      },
      {
        nome: "acessorios_descricao",
        rotulo: "Identificar acessórios (marca, cor, quantidade, estado)",
        tipo: "textoLongo",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
    ],
  },

  {
    id: "relato",
    titulo: "Relato do cliente",
    campos: [
      {
        nome: "relato_defeito",
        rotulo: "Defeito ou reclamação informada, quando começou e em que situação ocorre",
        tipo: "textoLongo",
      },
    ],
  },

  {
    id: "historico",
    titulo: "Histórico declarado",
    campos: [
      {
        nome: "historico_queda",
        rotulo: "Queda/impacto",
        tipo: "opcoes",
        opcoes: SIM_NAO_NAOSABE,
      },
      {
        nome: "historico_liquido",
        rotulo: "Líquido/umidade",
        tipo: "opcoes",
        opcoes: SIM_NAO_NAOSABE,
      },
      {
        nome: "historico_reparo",
        rotulo: "Reparo anterior ou peça trocada",
        tipo: "opcoes",
        opcoes: SIM_NAO_NAOSABE,
      },
      {
        nome: "historico_reparo_qual",
        rotulo: "Qual reparo e quando",
        tipo: "texto",
        quando: (dados) => textoDe(dados, "historico_reparo") === "sim",
      },
      {
        nome: "pretensao",
        rotulo: "Pretensão inicial",
        tipo: "opcoes",
        opcoes: [
          { valor: "análise de garantia", texto: "Análise de garantia" },
          { valor: "orçamento particular", texto: "Orçamento particular" },
          { valor: "outro", texto: "Outro" },
        ],
      },
      {
        nome: "pretensao_outro",
        rotulo: "Descreva a pretensão",
        tipo: "texto",
        quando: (dados) => textoDe(dados, "pretensao") === "outro",
      },
      {
        nome: "comprovante_apresentado",
        rotulo: "Comprovante de compra/garantia apresentado",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      {
        nome: "comprovante_data_iso",
        rotulo: "Data do comprovante",
        tipo: "data",
        largura: "meia",
        quando: (dados) => textoDe(dados, "comprovante_apresentado") === "sim",
      },
      {
        nome: "comprovante_anexo",
        rotulo: "Anexo",
        tipo: "texto",
        largura: "meia",
        quando: (dados) => textoDe(dados, "comprovante_apresentado") === "sim",
      },
    ],
  },

  {
    id: "evidencias",
    titulo: "Evidências na entrada",
    ajuda: "As fotos do estado externo são anexadas ao dossiê do aparelho.",
    campos: [
      {
        nome: "evidencias_realizadas",
        rotulo: "Fotos/vídeos do estado externo",
        tipo: "opcoes",
        opcoes: [
          { valor: "realizados", texto: "Realizados" },
          { valor: "não realizados", texto: "Não realizados" },
        ],
      },
      {
        nome: "evidencias_protocolo",
        rotulo: "Arquivo/protocolo",
        tipo: "texto",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
    ],
  },

  {
    id: "inspecao",
    titulo: "Inspeção física na entrada",
    ajuda:
      "Uma situação por item. Falha e N/T precisam de detalhe. “N/A” é quando o modelo não tem o recurso.",
    campos: [
      {
        nome: "inspecao_fisica",
        rotulo: "Inspeção física",
        tipo: "checklist",
        linhas: INSPECAO_FISICA,
      },
      {
        nome: "danos_preexistentes",
        rotulo: "Danos preexistentes: localização, dimensão e fotos correspondentes",
        tipo: "textoLongo",
        naoSeAplica: { texto: "nenhum observado", rotuloBotao: "Nenhum observado" },
      },
    ],
  },

  {
    id: "funcoes",
    titulo: "Funções e componentes na entrada",
    ajuda:
      "Teste que depende de rede, chip ou acessório vai como N/T quando não há condição de executar.",
    campos: [
      { nome: "funcoes", rotulo: "Funções e componentes", tipo: "checklist", linhas: FUNCOES },
    ],
  },

  {
    id: "complementares",
    titulo: "Testes complementares e limitações",
    campos: [
      {
        nome: "testes_complementares",
        rotulo: "Testes complementares",
        tipo: "checklist",
        linhas: TESTES_COMPLEMENTARES,
      },
      {
        nome: "motivo_nao_testados",
        rotulo: "Motivo dos itens não testados e limitações técnicas da triagem",
        tipo: "textoLongo",
        naoSeAplica: { texto: "todos os itens foram testados", rotuloBotao: "Testou todos" },
      },
      {
        nome: "observacoes_adicionais",
        rotulo: "Observações adicionais, divergências no relato e indícios encontrados",
        tipo: "textoLongo",
        naoSeAplica: { texto: "nenhuma", rotuloBotao: "Nenhuma" },
      },
    ],
  },

  {
    id: "dados_pessoais",
    titulo: "Dados pessoais e preparo do aparelho",
    campos: [
      {
        nome: "backup",
        rotulo: "Backup informado pelo cliente",
        tipo: "opcoes",
        opcoes: [
          { valor: "realizado", texto: "Realizado" },
          { valor: "não realizado", texto: "Não realizado" },
          { valor: "impossível devido ao defeito", texto: "Impossível pelo defeito" },
          { valor: "não informado", texto: "Não informado" },
        ],
      },
      {
        nome: "chip_sim",
        rotulo: "Chip/SIM e cartão de memória",
        tipo: "opcoes",
        opcoes: [
          { valor: "retirados pelo cliente", texto: "Retirados pelo cliente" },
          { valor: "entregues e descritos acima", texto: "Entregues" },
          { valor: "não aplicável", texto: "Não aplicável" },
        ],
      },
      {
        nome: "buscar_iphone",
        rotulo: "Buscar iPhone/conta vinculada",
        tipo: "opcoes",
        opcoes: [
          { valor: "procedimento necessário informado", texto: "Procedimento informado" },
          { valor: "não aplicável", texto: "Não aplicável" },
          { valor: "pendente de orientação", texto: "Pendente de orientação" },
        ],
      },
    ],
  },

  {
    id: "diagnostico_cobranca",
    titulo: "Diagnóstico e cobrança de análise",
    campos: [
      {
        nome: "autoriza_triagem",
        rotulo: "Autoriza a triagem e os testes diagnósticos não destrutivos",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      {
        nome: "valor_analise",
        rotulo: "Valor da análise",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Não se aplica" },
      },
      {
        nome: "hipotese_cobranca",
        rotulo: "Hipótese de cobrança",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      {
        nome: "prazo_diagnostico",
        rotulo: "Prazo estimado para diagnóstico (dias úteis)",
        tipo: "numero",
        largura: "terco",
      },
      {
        nome: "contato_preferencial",
        rotulo: "Contato preferencial",
        tipo: "opcoes",
        opcoes: [
          { valor: "WhatsApp", texto: "WhatsApp" },
          { valor: "ligação", texto: "Ligação" },
          { valor: "e-mail", texto: "E-mail" },
        ],
      },
    ],
  },

  {
    id: "ciencia",
    titulo: "Ciência da entrada e assinaturas",
    campos: [
      { nome: "cidade_uf", rotulo: "Cidade/UF", tipo: "texto", largura: "meia" },
      { nome: "ciencia_data_iso", rotulo: "Data", tipo: "data", largura: "meia" },
      { nome: "ciencia_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
      {
        nome: "entregou_nome_documento",
        rotulo: "Nome e documento de quem entregou, se diferente do titular",
        tipo: "texto",
        naoSeAplica: { texto: "o próprio titular", rotuloBotao: "É o próprio titular" },
      },
      { nome: "responsavel_loja", rotulo: "Responsável pela loja", tipo: "texto", largura: "meia" },
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

const PASSOS_DIAGNOSTICO: DefPasso[] = [
  {
    id: "diagnostico",
    titulo: "Diagnóstico",
    campos: [
      {
        nome: "diagnostico",
        rotulo: "Diagnóstico, causa provável e evidências",
        tipo: "textoLongo",
      },
      { nome: "servicos_propostos", rotulo: "Serviços e peças propostos", tipo: "textoLongo" },
    ],
  },

  {
    id: "orcamento",
    titulo: "Orçamento",
    ajuda: "O total tem de fechar com a soma de mão de obra, peças e análise.",
    campos: [
      { nome: "valor_mao_obra", rotulo: "Mão de obra", tipo: "dinheiro", largura: "meia" },
      { nome: "valor_pecas", rotulo: "Peças", tipo: "dinheiro", largura: "meia" },
      {
        nome: "valor_analise_orcamento",
        rotulo: "Análise",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem cobrança de análise" },
      },
      { nome: "valor_total", rotulo: "Total", tipo: "dinheiro", largura: "meia" },
      { nome: "forma_pagamento", rotulo: "Forma de pagamento", tipo: "texto", largura: "meia" },
      { nome: "inicio_previsto_iso", rotulo: "Início previsto", tipo: "data", largura: "meia" },
      { nome: "termino_previsto_iso", rotulo: "Término previsto", tipo: "data", largura: "meia" },
    ],
    validar: (dados) => {
      const total = numeroDe(dados, "valor_total");
      const soma =
        numeroDe(dados, "valor_mao_obra") +
        numeroDe(dados, "valor_pecas") +
        numeroDe(dados, "valor_analise_orcamento");
      if (total <= 0 || mesmoValor(soma, total)) return {};
      return { valor_total: erroSoma(total - soma) };
    },
  },

  {
    id: "comunicacao",
    titulo: "Comunicação e decisão do cliente",
    campos: [
      {
        nome: "comunicacao_data_iso",
        rotulo: "Data da comunicação do orçamento",
        tipo: "data",
        largura: "meia",
      },
      { nome: "comunicacao_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
      {
        nome: "comunicacao_canal",
        rotulo: "Canal usado",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "validade_orcamento",
        rotulo: "Validade do orçamento (dias)",
        tipo: "numero",
        largura: "terco",
      },
      {
        nome: "decisao_cliente",
        rotulo: "Decisão do cliente",
        tipo: "opcoes",
        opcoes: [
          { valor: "aprovo integralmente", texto: "Aprovo integralmente" },
          { valor: "recuso", texto: "Recuso" },
          { valor: "solicito novo orçamento", texto: "Solicito novo orçamento" },
        ],
      },
      { nome: "decisao_data_iso", rotulo: "Data da decisão", tipo: "data", largura: "meia" },
      { nome: "decisao_hora", rotulo: "Horário da decisão", tipo: "hora", largura: "terco" },
    ],
  },

  {
    id: "autorizacoes",
    titulo: "Autorizações expressas",
    campos: [
      {
        nome: "autoriza_abertura",
        rotulo: "Autorização para abertura/procedimento invasivo",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      {
        nome: "abertura_procedimento",
        rotulo: "Qual procedimento",
        tipo: "texto",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      {
        nome: "autoriza_dados",
        rotulo: "Autorização para apagar/restaurar dados",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      {
        nome: "dados_motivo",
        rotulo: "Motivo",
        tipo: "texto",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      {
        nome: "registro_manifestacao",
        rotulo: "Registro verificável da manifestação do cliente",
        tipo: "texto",
        ajuda: "Assinatura no documento, ou o protocolo do print/mensagem anexado ao dossiê.",
      },
    ],
  },

  {
    id: "revisao",
    titulo: "Revisão",
    ajuda: "Confira tudo antes de gerar o PDF do diagnóstico.",
    tipo: "revisao",
    campos: [],
  },
];

const PASSOS_CONCLUSAO: DefPasso[] = [
  {
    id: "execucao",
    titulo: "Serviços executados",
    campos: [
      {
        nome: "servicos_executados",
        rotulo: "Serviços executados, peças instaladas e divergências do orçamento",
        tipo: "textoLongo",
      },
      {
        nome: "pecas_retiradas",
        rotulo: "Destino das peças retiradas",
        tipo: "opcoes",
        opcoes: [
          { valor: "devolvidas", texto: "Devolvidas" },
          { valor: "não houve troca", texto: "Não houve troca" },
          { valor: "destinação previamente ajustada", texto: "Destinação ajustada" },
        ],
      },
      {
        nome: "pecas_destinacao",
        rotulo: "Qual destinação",
        tipo: "texto",
        quando: (dados) => textoDe(dados, "pecas_retiradas") === "destinação previamente ajustada",
      },
      {
        nome: "testes_saida",
        rotulo: "Resultado dos testes de saída e funções não testadas (com motivo)",
        tipo: "textoLongo",
      },
    ],
  },

  {
    id: "dados_saida",
    titulo: "Situação dos dados",
    campos: [
      {
        nome: "situacao_dados",
        rotulo: "Dados",
        tipo: "opcoes",
        opcoes: [
          { valor: "sem restauração", texto: "Sem restauração" },
          { valor: "restauração autorizada", texto: "Restauração autorizada" },
          { valor: "impossibilidade técnica comunicada", texto: "Impossibilidade comunicada" },
        ],
      },
      {
        nome: "restauracao_data_iso",
        rotulo: "Data da restauração autorizada",
        tipo: "data",
        largura: "meia",
        quando: (dados) => textoDe(dados, "situacao_dados") === "restauração autorizada",
      },
    ],
  },

  {
    id: "finalizacao",
    titulo: "Finalização e aviso de retirada",
    campos: [
      { nome: "finalizacao_data_iso", rotulo: "Finalização em", tipo: "data", largura: "meia" },
      { nome: "aviso_data_iso", rotulo: "Aviso para retirada em", tipo: "data", largura: "meia" },
      { nome: "aviso_hora", rotulo: "Horário do aviso", tipo: "hora", largura: "terco" },
      { nome: "aviso_por", rotulo: "Quem avisou", tipo: "texto", largura: "meia" },
      {
        nome: "itens_devolvidos",
        rotulo: "Itens devolvidos",
        tipo: "texto",
        ajuda: "Ex.: aparelho, capa, película, cabo, carregador, chip/SIM.",
      },
      {
        nome: "conferencia_cliente",
        rotulo: "Conferência pelo cliente, ressalvas e orientações entregues",
        tipo: "textoLongo",
      },
    ],
  },

  {
    id: "retirada",
    titulo: "Pagamento e retirada",
    campos: [
      {
        nome: "valor_pago",
        rotulo: "Valor total pago",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem cobrança" },
      },
      {
        nome: "forma_pagamento_final",
        rotulo: "Forma de pagamento",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      {
        nome: "comprovante_numero",
        rotulo: "Comprovante nº",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      { nome: "retirada_data_iso", rotulo: "Retirado em", tipo: "data", largura: "meia" },
      { nome: "retirada_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
      { nome: "retirada_por", rotulo: "Retirado por", tipo: "texto", largura: "meia" },
      {
        nome: "retirada_documento",
        rotulo: "Documento do recebedor",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "retirada_relacao",
        rotulo: "Relação com o titular",
        tipo: "texto",
        largura: "meia",
        ajuda: "Ex.: o próprio titular, cônjuge, pessoa autorizada.",
      },
    ],
  },

  {
    id: "revisao",
    titulo: "Revisão",
    ajuda: "Confira tudo antes de gerar o PDF da conclusão.",
    tipo: "revisao",
    campos: [],
  },
];

export const MODELO_CHECKLIST: DefModelo = {
  slug: "checklist-assistencia",
  versao: VERSAO,
  titulo: TITULO,

  etapas: [
    {
      etapa: "principal",
      titulo: TITULO,
      quando: "No ato da entrada do aparelho na loja.",
      passos: PASSOS_ENTRADA,
      documento: DOCUMENTO,
    },
    {
      etapa: "diagnostico",
      titulo: TITULO_DIAGNOSTICO,
      quando: "Depois da triagem, quando o orçamento é apresentado ao cliente.",
      dependeDe: "principal",
      passos: PASSOS_DIAGNOSTICO,
      documento: DOCUMENTO_DIAGNOSTICO,
    },
    {
      etapa: "conclusao",
      titulo: TITULO_CONCLUSAO,
      quando: "Quando o cliente retira o aparelho.",
      dependeDe: "diagnostico",
      passos: PASSOS_CONCLUSAO,
      documento: DOCUMENTO_CONCLUSAO,
    },
  ],

  // A ordem de serviço recebe número sequencial do banco (2026-0001).
  semente: { campo: "ordem_servico", escopo: "os" },

  padroes: () => {
    const agora = new Date();
    const doisDigitos = (n: number) => String(n).padStart(2, "0");
    return {
      entrada_data_iso: `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())}`,
      entrada_hora: `${doisDigitos(agora.getHours())}:${doisDigitos(agora.getMinutes())}`,
    };
  },

  daLoja: (loja) => ({
    loja_razao_social: loja.razao_social,
    loja_cnpj: loja.cnpj,
    loja_endereco_simples: loja.endereco,
    loja_cidade_uf: `${loja.cidade}/${loja.uf}`,
    loja_cep: loja.cep,
    loja_telefone: loja.telefone,
    cidade_uf: `${loja.cidade}/${loja.uf}`,
  }),

  doProduto: (produto) => ({
    equipamento_marca_modelo_cor: [produto.nome, produto.cor].filter(Boolean).join(" "),
  }),

  identificacao: (dados) => ({
    nome: textoDe(dados, "cliente_nome"),
    cpf: textoDe(dados, "cliente_cpf"),
  }),

  // Assistência: o dossiê é do aparelho do cliente.
  dossie: (dados) => ({
    origem: "assistencia",
    marca: "Apple",
    modelo: textoDe(dados, "equipamento_marca_modelo_cor"),
    cor: "",
    capacidade: textoDe(dados, "equipamento_capacidade"),
    imei1: textoDe(dados, "equipamento_imei1"),
    imei2: textoDe(dados, "equipamento_imei2"),
    serie: textoDe(dados, "equipamento_serie"),
    adquiridoEm: textoDe(dados, "entrada_data_iso"),
  }),

  derivados: (dados) => ({
    entrada_data: dataOuTexto(textoDe(dados, "entrada_data_iso")),
    ciencia_data: dataOuTexto(textoDe(dados, "ciencia_data_iso")),
    comprovante_data: dataOuTexto(textoDe(dados, "comprovante_data_iso")),
    pretensao:
      textoDe(dados, "pretensao") === "outro"
        ? `outro: ${textoDe(dados, "pretensao_outro")}`
        : textoDe(dados, "pretensao"),
    pecas_retiradas:
      textoDe(dados, "pecas_retiradas") === "destinação previamente ajustada"
        ? `destinação previamente ajustada: ${textoDe(dados, "pecas_destinacao")}`
        : textoDe(dados, "pecas_retiradas"),
    inicio_previsto: dataOuTexto(textoDe(dados, "inicio_previsto_iso")),
    termino_previsto: dataOuTexto(textoDe(dados, "termino_previsto_iso")),
    comunicacao_data: dataOuTexto(textoDe(dados, "comunicacao_data_iso")),
    decisao_data: dataOuTexto(textoDe(dados, "decisao_data_iso")),
    restauracao_data: dataOuTexto(textoDe(dados, "restauracao_data_iso")),
    finalizacao_data: dataOuTexto(textoDe(dados, "finalizacao_data_iso")),
    aviso_data: dataOuTexto(textoDe(dados, "aviso_data_iso")),
    retirada_data: dataOuTexto(textoDe(dados, "retirada_data_iso")),
  }),
};
