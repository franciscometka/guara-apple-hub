import { NAO_POSSUI, NAO_SE_APLICA, numeroDe, textoDe, type DefPasso } from "./tipos";
import type { DefModelo } from "../modelos/tipos";
import {
  DOCUMENTO,
  DOCUMENTO_ENTREGA,
  TITULO,
  TITULO_ENTREGA,
  VERSAO,
} from "../modelos/pre-reserva-iphone-18";
import { dataOuTexto, erroSoma, mesmoValor } from "../validadores";

/**
 * Passos do Modelo B — Contrato de Pré-Reserva de iPhone 18.
 *
 * Duas etapas: a principal (contrato e Anexos I a III) e a de entrega
 * (Anexo IV), que só é preenchida no dia em que o aparelho é entregue.
 */

const SIM_NAO = [
  { valor: "sim", texto: "Sim" },
  { valor: "não", texto: "Não" },
] as const;

const temCartaoTerceiro = (dados: Record<string, string | number>) =>
  textoDe(dados, "cartao_de_terceiro") === "sim";

const temUsado = (dados: Record<string, string | number>) =>
  textoDe(dados, "tem_aparelho_usado") === "sim";

const temCartao = (dados: Record<string, string | number>) =>
  textoDe(dados, "tem_pagamento_cartao") === "sim";

const PASSOS_PRINCIPAL: DefPasso[] = [
  {
    id: "loja",
    titulo: "Confira os dados da loja",
    ajuda: "Vem de “Dados da loja”. Se algo estiver errado, corrija lá antes de continuar.",
    tipo: "conferencia",
    campos: [
      { nome: "loja_razao_social", rotulo: "Razão social", tipo: "leitura" },
      { nome: "loja_cnpj", rotulo: "CNPJ", tipo: "leitura" },
      { nome: "loja_endereco_simples", rotulo: "Endereço", tipo: "leitura" },
      { nome: "loja_cep", rotulo: "CEP", tipo: "leitura" },
      { nome: "loja_telefone", rotulo: "Telefone/WhatsApp", tipo: "leitura" },
      { nome: "loja_email", rotulo: "E-mail", tipo: "leitura" },
      { nome: "loja_representante", rotulo: "Representante legal", tipo: "leitura" },
      { nome: "loja_representante_cpf", rotulo: "CPF do representante", tipo: "leitura" },
    ],
  },

  {
    id: "comprador",
    titulo: "Quem é o comprador?",
    campos: [
      { nome: "comprador_nome", rotulo: "Nome completo", tipo: "texto" },
      { nome: "comprador_cpf", rotulo: "CPF", tipo: "cpf", largura: "meia" },
      {
        nome: "comprador_documento",
        rotulo: "Documento de identificação nº",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "comprador_telefone",
        rotulo: "Telefone/WhatsApp",
        tipo: "telefone",
        largura: "meia",
      },
      { nome: "comprador_email", rotulo: "E-mail", tipo: "email", largura: "meia" },
      { nome: "comprador_endereco", rotulo: "Endereço completo", tipo: "texto" },
      { nome: "comprador_cep", rotulo: "CEP", tipo: "cep", largura: "terco" },
    ],
  },

  {
    id: "titular_pergunta",
    titulo: "O cartão será de outra pessoa?",
    ajuda: "Se for, o Anexo III (autorização do titular) entra no contrato.",
    campos: [
      {
        nome: "cartao_de_terceiro",
        rotulo: "Cartão de terceiro",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      {
        nome: "titular_nome",
        rotulo: "Nome do titular do cartão",
        tipo: "texto",
        quando: temCartaoTerceiro,
        largura: "meia",
      },
      {
        nome: "titular_cpf",
        rotulo: "CPF do titular",
        tipo: "cpf",
        quando: temCartaoTerceiro,
        largura: "meia",
      },
    ],
  },

  {
    id: "modalidade",
    titulo: "Como foi a contratação?",
    campos: [
      {
        nome: "modalidade_tipo",
        rotulo: "Modalidade da contratação",
        tipo: "opcoes",
        opcoes: [
          { valor: "presencial na loja", texto: "Presencial na loja" },
          { valor: "WhatsApp/telefone", texto: "WhatsApp/telefone" },
          { valor: "site/rede social", texto: "Site/rede social" },
          { valor: "outra", texto: "Outra" },
        ],
      },
      {
        nome: "modalidade_outra",
        rotulo: "Descreva a modalidade",
        tipo: "texto",
        quando: (dados) => textoDe(dados, "modalidade_tipo") === "outra",
      },
    ],
  },

  {
    id: "produto",
    titulo: "Qual produto foi reservado?",
    ajuda: "A condição do produto é fixa: novo.",
    campos: [
      { nome: "produto_versao", rotulo: "Versão/modelo", tipo: "texto", largura: "meia" },
      { nome: "produto_capacidade", rotulo: "Capacidade", tipo: "texto", largura: "terco" },
      { nome: "produto_cor", rotulo: "Cor", tipo: "texto", largura: "terco" },
    ],
  },

  {
    id: "preco",
    titulo: "Preço e sinal",
    campos: [
      {
        nome: "preco_total",
        rotulo: "Preço total anunciado e contratado",
        tipo: "dinheiro",
        largura: "meia",
      },
      { nome: "sinal_valor", rotulo: "Sinal/adiantamento", tipo: "dinheiro", largura: "meia" },
      { nome: "sinal_data_iso", rotulo: "Data do sinal", tipo: "data", largura: "meia" },
      {
        nome: "sinal_forma",
        rotulo: "Forma do sinal",
        tipo: "opcoes",
        opcoes: [
          { valor: "Pix", texto: "Pix" },
          { valor: "dinheiro", texto: "Dinheiro" },
          { valor: "transferência bancária", texto: "Transferência" },
          { valor: "cartão de débito", texto: "Cartão de débito" },
          { valor: "cartão de crédito", texto: "Cartão de crédito" },
        ],
      },
    ],
  },

  {
    id: "prazos",
    titulo: "Prazos",
    campos: [
      {
        nome: "previsao_chegada_iso",
        rotulo: "Previsão informada de chegada",
        tipo: "data",
        largura: "meia",
      },
      {
        nome: "prazo_entrega_iso",
        rotulo: "Prazo máximo de entrega pactuado",
        tipo: "data",
        largura: "meia",
      },
      {
        nome: "data_confirmacao_iso",
        rotulo: "Data limite da confirmação de disponibilidade",
        tipo: "data",
        largura: "meia",
        ajuda: "Cláusula 1.3.",
      },
      {
        nome: "prazo_recusa_cartao",
        rotulo: "Prazo para escolher outra forma de pagamento se o cartão for recusado",
        tipo: "numero",
        ajuda: "Em dias corridos (cláusula 4.2).",
        largura: "terco",
      },
    ],
  },

  {
    id: "anexo1",
    titulo: "Anexo I — Composição do pagamento",
    ajuda: "A soma das linhas abaixo tem de fechar com o preço total contratado.",
    campos: [
      { nome: "preco_total", rotulo: "Preço total contratado", tipo: "leitura" },
      {
        nome: "comp_sinal",
        rotulo: "Sinal/adiantamento pago à loja",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem sinal" },
      },
      {
        nome: "comp_sinal_detalhe",
        rotulo: "Forma/data do sinal",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "comp_usado",
        rotulo: "Crédito de aparelho usado (Anexo II)",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem aparelho usado" },
      },
      {
        nome: "comp_usado_tipo",
        rotulo: "Tipo do crédito do usado",
        tipo: "opcoes",
        opcoes: [
          { valor: "definitivo", texto: "Definitivo" },
          { valor: "provisório", texto: "Provisório" },
          { valor: NAO_SE_APLICA, texto: "Não se aplica" },
        ],
      },
      {
        nome: "comp_vista",
        rotulo: "Pagamento à vista por Pix/dinheiro/transferência",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem pagamento à vista" },
      },
      {
        nome: "comp_vista_detalhe",
        rotulo: "Forma/data do pagamento à vista",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "comp_debito",
        rotulo: "Pagamento em cartão de débito",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem débito" },
      },
      {
        nome: "comp_debito_detalhe",
        rotulo: "Titular/data do débito",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "comp_credito",
        rotulo: "Pagamento em cartão de crédito",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem crédito" },
      },
      {
        nome: "comp_credito_detalhe",
        rotulo: "Titular/parcelas do crédito",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "comp_saldo",
        rotulo: "Saldo a pagar",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem saldo" },
      },
      {
        nome: "comp_saldo_detalhe",
        rotulo: "Forma/data combinadas do saldo",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "despesas_descricao",
        rotulo: "Despesas específicas para desistência imotivada presencial (cláusula 9.4)",
        tipo: "texto",
        naoSeAplica: { texto: "nenhuma", rotuloBotao: "Nenhuma" },
      },
      {
        nome: "despesas_valor",
        rotulo: "Valor estimado das despesas",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Nenhuma" },
      },
      {
        nome: "responsavel_pagamento",
        rotulo: "Responsável pelo pagamento",
        tipo: "opcoes",
        opcoes: [
          { valor: "Apenas COMPRADOR(A)", texto: "Apenas o comprador" },
          {
            valor: "Também TITULAR DO CARTÃO identificado no contrato e Anexo III",
            texto: "Também o titular do cartão",
          },
        ],
      },
    ],
    validar: (dados) => {
      const total = numeroDe(dados, "preco_total");
      const soma =
        numeroDe(dados, "comp_sinal") +
        numeroDe(dados, "comp_usado") +
        numeroDe(dados, "comp_vista") +
        numeroDe(dados, "comp_debito") +
        numeroDe(dados, "comp_credito") +
        numeroDe(dados, "comp_saldo");
      if (total <= 0 || mesmoValor(soma, total)) return {};
      return { comp_saldo: erroSoma(total - soma) };
    },
  },

  {
    id: "cartao_pergunta",
    titulo: "Houve pagamento em cartão?",
    campos: [
      {
        nome: "tem_pagamento_cartao",
        rotulo: "Pagamento em cartão",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
    ],
  },

  {
    id: "cartao",
    titulo: "Anexo I — Pagamento por cartão",
    ajuda: "Informe somente os 4 últimos dígitos. Nunca digite o número completo.",
    quando: temCartao,
    campos: [
      {
        nome: "cartao_tipo",
        rotulo: "Tipo",
        tipo: "opcoes",
        opcoes: [
          { valor: "débito", texto: "Débito" },
          { valor: "crédito à vista", texto: "Crédito à vista" },
          { valor: "crédito parcelado", texto: "Crédito parcelado" },
        ],
      },
      { nome: "cartao_valor", rotulo: "Valor da transação", tipo: "dinheiro", largura: "meia" },
      { nome: "cartao_data_iso", rotulo: "Data da transação", tipo: "data", largura: "meia" },
      {
        nome: "cartao_parcelas",
        rotulo: "Quantidade de parcelas",
        tipo: "numero",
        largura: "terco",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não parcelado" },
      },
      {
        nome: "cartao_parcela_valor",
        rotulo: "Valor de cada parcela",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Não parcelado" },
      },
      { nome: "cartao_total", rotulo: "Total no cartão", tipo: "dinheiro", largura: "meia" },
      {
        nome: "cartao_diferenca",
        rotulo: "Diferença em relação ao preço à vista",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem diferença" },
      },
      { nome: "cartao_titular", rotulo: "Titular do cartão", tipo: "texto", largura: "meia" },
      {
        nome: "cartao_ultimos4",
        rotulo: "Últimos 4 dígitos do cartão",
        tipo: "ultimos4",
        largura: "terco",
      },
      {
        nome: "cartao_comprovante",
        rotulo: "Comprovante/código da transação",
        tipo: "texto",
        largura: "meia",
      },
    ],
  },

  {
    id: "usado_pergunta",
    titulo: "Aparelho usado entra como parte do pagamento?",
    ajuda: "Se entrar, o Anexo II é preenchido a seguir.",
    campos: [
      {
        nome: "tem_aparelho_usado",
        rotulo: "Aparelho usado como pagamento",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
    ],
  },

  {
    id: "usado_identificacao",
    titulo: "Anexo II — Identificação do aparelho usado",
    quando: temUsado,
    campos: [
      { nome: "usado_marca_modelo", rotulo: "Marca/modelo", tipo: "texto", largura: "meia" },
      { nome: "usado_cor_capacidade", rotulo: "Cor/capacidade", tipo: "texto", largura: "meia" },
      { nome: "usado_imei1", rotulo: "IMEI 1", tipo: "imei", largura: "meia" },
      {
        nome: "usado_imei2",
        rotulo: "IMEI 2",
        tipo: "imei",
        largura: "meia",
        naoSeAplica: { texto: NAO_POSSUI, rotuloBotao: "Não possui" },
      },
      { nome: "usado_serie", rotulo: "Número de série", tipo: "texto", largura: "meia" },
      {
        nome: "usado_bateria",
        rotulo: "Saúde da bateria (%)",
        tipo: "numero",
        largura: "terco",
        naoSeAplica: { texto: "não acessível", rotuloBotao: "Não acessível" },
      },
      {
        nome: "usado_acessorios",
        rotulo: "Acessórios/documentos recebidos",
        tipo: "texto",
        naoSeAplica: { texto: "nenhum", rotuloBotao: "Nenhum" },
      },
      {
        nome: "usado_entregante_nome",
        rotulo: "Entregante, se não for o titular — nome",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: "o próprio titular", rotuloBotao: "É o próprio titular" },
      },
      {
        nome: "usado_entregante_cpf",
        rotulo: "Entregante — CPF",
        tipo: "cpf",
        largura: "meia",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      {
        nome: "usado_entregante_autorizacao",
        rotulo: "Autorização/documento do entregante",
        tipo: "texto",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
    ],
  },

  {
    id: "usado_condicao",
    titulo: "Anexo II — Condição e histórico informados",
    quando: temUsado,
    campos: [
      {
        nome: "usado_tela",
        rotulo: "Tela",
        tipo: "opcoes",
        opcoes: [
          { valor: "original", texto: "Original" },
          { valor: "substituída", texto: "Substituída" },
          { valor: "com danos", texto: "Com danos" },
        ],
      },
      {
        nome: "usado_carcaca",
        rotulo: "Carcaça",
        tipo: "texto",
        ajuda: "Escreva “sem avarias” ou descreva as avarias.",
      },
      { nome: "usado_cameras", rotulo: "Câmeras", tipo: "texto", largura: "meia" },
      {
        nome: "usado_biometria",
        rotulo: "Biometria",
        tipo: "opcoes",
        opcoes: [
          { valor: "funciona", texto: "Funciona" },
          { valor: "falha", texto: "Falha" },
          { valor: "não aplicável", texto: "Não aplicável" },
        ],
      },
      {
        nome: "usado_carregamento",
        rotulo: "Carregamento",
        tipo: "opcoes",
        opcoes: [
          { valor: "funciona", texto: "Funciona" },
          { valor: "falha", texto: "Falha" },
        ],
      },
      {
        nome: "usado_pecas",
        rotulo: "Peças trocadas/reparos anteriores",
        tipo: "texto",
        naoSeAplica: { texto: "nenhum informado", rotuloBotao: "Nenhum" },
      },
      {
        nome: "usado_bloqueio",
        rotulo: "Bloqueio de ativação, Apple ID/Buscar, MDM ou conta vinculada",
        tipo: "texto",
        naoSeAplica: { texto: "não", rotuloBotao: "Não há" },
      },
      {
        nome: "usado_restricao",
        rotulo: "Restrição de IMEI, furto/roubo, alienação, gravame ou impedimento",
        tipo: "texto",
        naoSeAplica: { texto: "não", rotuloBotao: "Não há" },
      },
      {
        nome: "usado_danos",
        rotulo: "Danos e ressalvas, inclusive fotos anexadas/protocolo",
        tipo: "textoLongo",
        naoSeAplica: { texto: "nenhum", rotuloBotao: "Nenhum" },
      },
    ],
  },

  {
    id: "usado_avaliacao",
    titulo: "Anexo II — Avaliação e guarda",
    quando: temUsado,
    campos: [
      {
        nome: "usado_valor",
        rotulo: "Valor atribuído ao aparelho",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "usado_valor_tipo",
        rotulo: "Tipo do valor",
        tipo: "opcoes",
        opcoes: [
          { valor: "definitivo, após inspeção concluída", texto: "Definitivo" },
          { valor: "provisório, sujeito a conferência", texto: "Provisório" },
        ],
      },
      {
        nome: "usado_prazo_inspecao",
        rotulo: "Prazo de inspeção (dias úteis)",
        tipo: "numero",
        largura: "terco",
        ajuda: "Cláusula 7.3.",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      {
        nome: "usado_guarda",
        rotulo: "Onde o aparelho fica",
        tipo: "opcoes",
        opcoes: [
          { valor: "Aparelho permanece com o(a) COMPRADOR(A)", texto: "Fica com o comprador" },
          {
            valor: "Aparelho entregue à VENDEDORA para guarda temporária",
            texto: "Entregue à loja",
          },
        ],
      },
      {
        nome: "usado_guarda_data_iso",
        rotulo: "Data da entrega à loja",
        tipo: "data",
        largura: "meia",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      {
        nome: "usado_guarda_hora",
        rotulo: "Horário",
        tipo: "hora",
        largura: "terco",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
    ],
  },

  {
    id: "anexo3",
    titulo: "Anexo III — Autorização do titular do cartão",
    quando: temCartaoTerceiro,
    campos: [
      { nome: "titular_nome", rotulo: "Nome do titular", tipo: "texto" },
      { nome: "titular_cpf", rotulo: "CPF do titular", tipo: "cpf", largura: "meia" },
      { nome: "titular_documento", rotulo: "Documento nº", tipo: "texto", largura: "meia" },
      { nome: "titular_contato", rotulo: "Contato do titular", tipo: "texto", largura: "meia" },
      {
        nome: "titular_tipo_cartao",
        rotulo: "Tipo de cartão",
        tipo: "opcoes",
        opcoes: [
          { valor: "débito", texto: "Débito" },
          { valor: "crédito", texto: "Crédito" },
        ],
      },
      {
        nome: "titular_valor_autorizado",
        rotulo: "Valor autorizado",
        tipo: "dinheiro",
        largura: "meia",
      },
      {
        nome: "titular_administradora",
        rotulo: "Administradora/emissor",
        tipo: "texto",
        largura: "meia",
      },
      {
        nome: "titular_ultimos4",
        rotulo: "Últimos 4 dígitos do cartão",
        tipo: "ultimos4",
        largura: "terco",
      },
      {
        nome: "titular_parcelas",
        rotulo: "Quantidade de parcelas",
        tipo: "numero",
        largura: "terco",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não parcelado" },
      },
      {
        nome: "titular_parcela_valor",
        rotulo: "Valor de cada parcela",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Não parcelado" },
      },
      { nome: "titular_total", rotulo: "Preço total no cartão", tipo: "dinheiro", largura: "meia" },
      {
        nome: "titular_comprovante",
        rotulo: "Código/comprovante da transação",
        tipo: "texto",
        largura: "meia",
      },
    ],
  },

  {
    id: "fechamento",
    titulo: "Fechamento e testemunhas",
    campos: [
      { nome: "local", rotulo: "Local", tipo: "texto", largura: "meia" },
      { nome: "data_fechamento_iso", rotulo: "Data", tipo: "data", largura: "meia" },
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

const PASSOS_ENTREGA: DefPasso[] = [
  {
    id: "entrega_produto",
    titulo: "Identificação do produto entregue",
    ajuda: "O número de série e os IMEIs só existem agora, na entrega (cláusula 1.5).",
    campos: [
      { nome: "entrega_serie", rotulo: "Número de série", tipo: "texto", largura: "meia" },
      { nome: "entrega_imei1", rotulo: "IMEI 1", tipo: "imei", largura: "meia" },
      {
        nome: "entrega_imei2",
        rotulo: "IMEI 2",
        tipo: "imei",
        largura: "meia",
        naoSeAplica: { texto: NAO_POSSUI, rotuloBotao: "Não possui" },
      },
      { nome: "entrega_nota_fiscal", rotulo: "Nota fiscal nº", tipo: "texto", largura: "meia" },
      { nome: "entrega_nf_data_iso", rotulo: "Data de emissão", tipo: "data", largura: "meia" },
      {
        nome: "entrega_nf_valor",
        rotulo: "Valor da nota fiscal",
        tipo: "dinheiro",
        largura: "meia",
      },
    ],
  },

  {
    id: "entrega_condicoes",
    titulo: "Condições da entrega",
    campos: [
      {
        nome: "entrega_caixa",
        rotulo: "Caixa original entregue",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      {
        nome: "entrega_lacre",
        rotulo: "Lacre conferido íntegro",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      {
        nome: "entrega_aberto",
        rotulo: "Produto aberto na presença do comprador, a seu pedido",
        tipo: "opcoes",
        opcoes: SIM_NAO,
      },
      { nome: "entrega_acessorios", rotulo: "Acessórios conferidos", tipo: "texto" },
      {
        nome: "entrega_migracao",
        rotulo: "Migração de dados",
        tipo: "opcoes",
        opcoes: [
          { valor: "solicitada", texto: "Solicitada" },
          { valor: "não solicitada", texto: "Não solicitada" },
        ],
      },
      {
        nome: "entrega_forma",
        rotulo: "Forma da entrega",
        tipo: "opcoes",
        opcoes: [
          { valor: "retirada na loja", texto: "Retirada na loja" },
          { valor: "entrega em endereço", texto: "Entrega em endereço" },
        ],
      },
      {
        nome: "entrega_endereco",
        rotulo: "Endereço da entrega",
        tipo: "texto",
        quando: (dados) => textoDe(dados, "entrega_forma") === "entrega em endereço",
      },
      {
        nome: "entrega_frete",
        rotulo: "Custo de frete previamente informado",
        tipo: "dinheiro",
        largura: "meia",
        naoSeAplica: { texto: "0", rotuloBotao: "Sem frete" },
      },
      {
        nome: "entrega_observacoes",
        rotulo: "Observações sobre embalagem, funcionamento, acessórios ou ressalvas",
        tipo: "textoLongo",
        naoSeAplica: { texto: "nenhuma", rotuloBotao: "Nenhuma" },
      },
    ],
  },

  {
    id: "entrega_recebimento",
    titulo: "Recebimento",
    campos: [
      { nome: "entrega_local", rotulo: "Local", tipo: "texto", largura: "meia" },
      { nome: "entrega_data_iso", rotulo: "Data", tipo: "data", largura: "meia" },
      { nome: "entrega_hora", rotulo: "Horário", tipo: "hora", largura: "terco" },
      {
        nome: "recebedor_nome",
        rotulo: "Recebedor terceiro — nome",
        tipo: "texto",
        largura: "meia",
        naoSeAplica: { texto: "o próprio comprador", rotuloBotao: "É o próprio comprador" },
      },
      {
        nome: "recebedor_cpf",
        rotulo: "Recebedor terceiro — CPF",
        tipo: "cpf",
        largura: "meia",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
      {
        nome: "recebedor_autorizacao",
        rotulo: "Autorização do comprador",
        tipo: "texto",
        naoSeAplica: { texto: NAO_SE_APLICA, rotuloBotao: "Não se aplica" },
      },
    ],
  },

  {
    id: "revisao",
    titulo: "Revisão",
    ajuda: "Confira tudo antes de gerar o PDF do Anexo IV.",
    tipo: "revisao",
    campos: [],
  },
];

export const MODELO_PRE_RESERVA: DefModelo = {
  slug: "pre-reserva-iphone-18",
  versao: VERSAO,
  titulo: TITULO,

  etapas: [
    {
      etapa: "principal",
      titulo: TITULO,
      quando: "Na contratação, quando o cliente paga o sinal.",
      passos: PASSOS_PRINCIPAL,
      documento: DOCUMENTO,
    },
    {
      etapa: "entrega",
      titulo: TITULO_ENTREGA,
      quando: "No dia da entrega do aparelho.",
      dependeDe: "principal",
      passos: PASSOS_ENTREGA,
      documento: DOCUMENTO_ENTREGA,
    },
  ],

  daLoja: (loja) => ({
    loja_razao_social: loja.razao_social,
    loja_cnpj: loja.cnpj,
    loja_endereco_simples: loja.endereco,
    loja_cep: loja.cep,
    loja_telefone: loja.telefone,
    loja_email: loja.email,
    loja_representante: loja.representante,
    loja_representante_cpf: loja.representante_cpf,
    local: `${loja.cidade}/${loja.uf}`,
  }),

  doProduto: (produto) => ({
    produto_versao: produto.nome,
    produto_cor: produto.cor,
    preco_total: produto.preco,
  }),

  identificacao: (dados) => ({
    nome: textoDe(dados, "comprador_nome"),
    cpf: textoDe(dados, "comprador_cpf"),
  }),

  // Pré-reserva: o dossiê é do aparelho vendido. Os identificadores só chegam
  // na etapa de entrega, então até lá o dossiê fica sem IMEI.
  dossie: (dados) => ({
    origem: "venda",
    marca: "Apple",
    modelo: `iPhone 18 ${textoDe(dados, "produto_versao")}`.trim(),
    cor: textoDe(dados, "produto_cor"),
    capacidade: textoDe(dados, "produto_capacidade"),
    imei1: textoDe(dados, "entrega_imei1"),
    imei2: textoDe(dados, "entrega_imei2"),
    serie: textoDe(dados, "entrega_serie"),
    adquiridoEm: textoDe(dados, "entrega_data_iso") || textoDe(dados, "data_fechamento_iso"),
  }),

  derivados: (dados) => {
    const modalidade = textoDe(dados, "modalidade_tipo");
    return {
      modalidade:
        modalidade === "outra" ? `outra: ${textoDe(dados, "modalidade_outra")}` : modalidade,
      data_fechamento: dataOuTexto(textoDe(dados, "data_fechamento_iso")),
      sinal_data: dataOuTexto(textoDe(dados, "sinal_data_iso")),
      previsao_chegada: dataOuTexto(textoDe(dados, "previsao_chegada_iso")),
      prazo_entrega: dataOuTexto(textoDe(dados, "prazo_entrega_iso")),
      data_confirmacao: dataOuTexto(textoDe(dados, "data_confirmacao_iso")),
      cartao_data: dataOuTexto(textoDe(dados, "cartao_data_iso")),
      usado_guarda_data: dataOuTexto(textoDe(dados, "usado_guarda_data_iso")),
      entrega_nf_data: dataOuTexto(textoDe(dados, "entrega_nf_data_iso")),
      entrega_data: dataOuTexto(textoDe(dados, "entrega_data_iso")),
      entrega_forma:
        textoDe(dados, "entrega_forma") === "entrega em endereço"
          ? `entrega em ${textoDe(dados, "entrega_endereco")}`
          : textoDe(dados, "entrega_forma"),
    };
  },
};
