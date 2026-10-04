import type { BlocoDoc, LinhaChecklist } from "./tipos";

/**
 * Checklist de Entrada de Aparelho para Assistência Técnica.
 *
 * Texto transcrito integralmente do PDF original, sem resumo nem reescrita.
 * As lacunas do documento viraram marcadores {{campo}}.
 *
 * São três documentos, um por etapa: entrada (seções 1 a 12), diagnóstico e
 * orçamento (seção 13) e conclusão e retirada (seção 14).
 */

export const VERSAO = "2026-01";

export const TITULO = "Checklist de Entrada de Aparelho para Assistência Técnica";
export const TITULO_DIAGNOSTICO = "Diagnóstico e Orçamento";
export const TITULO_CONCLUSAO = "Conclusão e Retirada do Equipamento";

/** Linhas das três tabelas de inspeção, compartilhadas com os passos. */
export const INSPECAO_FISICA: LinhaChecklist[] = [
  { id: "tela", rotulo: "Tela/vidro frontal: riscos, trincas ou manchas" },
  { id: "carcaca", rotulo: "Carcaça/traseira: amassados, riscos ou trincas" },
  { id: "lentes", rotulo: "Lentes e vidro das câmeras" },
  { id: "botoes", rotulo: "Botões físicos e chave de ação/silencioso" },
  { id: "conector", rotulo: "Conector de carga e bandeja SIM" },
  { id: "altofalantes", rotulo: "Alto-falantes, microfones e grades" },
  { id: "liquido", rotulo: "Sinais externos de líquido/oxidação" },
  { id: "integridade", rotulo: "Integridade geral e eventuais peças soltas" },
];

export const FUNCOES: LinhaChecklist[] = [
  { id: "inicializacao", rotulo: "Inicialização e estabilidade do sistema" },
  { id: "imagem", rotulo: "Imagem, brilho e cores da tela" },
  { id: "toque", rotulo: "Toque em toda a superfície da tela" },
  { id: "cameras", rotulo: "Câmeras traseira e frontal, foco e vídeo" },
  { id: "flash", rotulo: "Flash/lanterna" },
  { id: "audio", rotulo: "Áudio de chamadas e viva-voz" },
  { id: "microfone", rotulo: "Microfone e gravação de voz" },
  { id: "biometria", rotulo: "Face ID/Touch ID, quando aplicável" },
  { id: "wifi", rotulo: "Wi-Fi, Bluetooth e rede móvel" },
  { id: "ligacao", rotulo: "Ligação, chip/eSIM e dados móveis" },
  { id: "carregamento", rotulo: "Carregamento por cabo e bateria" },
  { id: "semfio", rotulo: "Carregamento sem fio, quando aplicável" },
  { id: "sensores", rotulo: "Sensores de proximidade e rotação" },
  { id: "vibracao", rotulo: "Vibração e botões de volume" },
];

export const TESTES_COMPLEMENTARES: LinhaChecklist[] = [
  { id: "imei", rotulo: "IMEI/número de série acessível no sistema" },
  { id: "bateria", rotulo: "Estado e saúde da bateria acessíveis" },
  { id: "armazenamento", rotulo: "Armazenamento e alertas do sistema" },
  { id: "gps", rotulo: "Localização/GPS, se testável" },
  { id: "fone", rotulo: "Áudio por fone ou porta disponível" },
  { id: "historico", rotulo: "Histórico de peças/serviço, se exibido" },
];

export const DOCUMENTO: BlocoDoc[] = [
  { t: "titulo", texto: TITULO },
  {
    t: "p",
    texto:
      "Registro de recebimento, estado do equipamento, testes iniciais, autorizações e devolução. " +
      "Preencher no ato, com uma via para o cliente e outra para a loja.",
  },
  {
    t: "grade",
    linhas: [
      ["Ordem de serviço nº {{ordem_servico}}", "Entrada em {{entrada_data}} às {{entrada_hora}}"],
      ["Loja/razão social: {{loja_razao_social}}", "CNPJ: {{loja_cnpj}}"],
      ["Endereço: {{loja_endereco_simples}}", ""],
      ["Cidade/UF: {{loja_cidade_uf}}", "CEP: {{loja_cep}}"],
      ["Telefone da loja: {{loja_telefone}}", ""],
    ],
  },

  { t: "secao", numero: "1", titulo: "Cliente e Contato" },
  {
    t: "grade",
    linhas: [
      ["Nome completo: {{cliente_nome}}", ""],
      ["CPF: {{cliente_cpf}}", "Telefone/WhatsApp: {{cliente_telefone}}"],
      ["E-mail: {{cliente_email}}", ""],
      ["Endereço: {{cliente_endereco}}", ""],
    ],
  },
  {
    t: "p",
    texto: "Pessoa autorizada a receber informações e/ou retirar o aparelho, se houver:",
  },
  {
    t: "grade",
    linhas: [
      ["Nome completo: {{autorizada_nome}}", "CPF: {{autorizada_cpf}}"],
      ["Telefone/WhatsApp: {{autorizada_telefone}}", ""],
    ],
  },

  { t: "secao", numero: "2", titulo: "Identificação do Equipamento e Itens Recebidos" },
  {
    t: "grade",
    linhas: [
      ["Marca/modelo/cor: {{equipamento_marca_modelo_cor}}", ""],
      ["Número de série: {{equipamento_serie}}", "IMEI 1: {{equipamento_imei1}}"],
      ["IMEI 2 (se houver): {{equipamento_imei2}}", "Capacidade: {{equipamento_capacidade}}"],
      ["iOS/versão: {{equipamento_ios}}", ""],
      ["Aparelho: {{equipamento_estado}}", "Carga aparente: {{equipamento_carga}}%"],
      ["Saúde da bateria, se acessível: {{equipamento_bateria}}", ""],
      ["Acessórios recebidos: {{acessorios_recebidos}}", ""],
      ["Identificar acessórios (marca, cor, quantidade, estado): {{acessorios_descricao}}", ""],
    ],
  },

  { t: "secao", numero: "3", titulo: "Relato do Cliente e Histórico" },
  { t: "p", texto: "Defeito ou reclamação informada, quando começou e em que situação ocorre:" },
  { t: "p", texto: "{{relato_defeito}}" },
  { t: "p", texto: "Histórico declarado:" },
  {
    t: "grade",
    linhas: [
      ["Queda/impacto: {{historico_queda}}", "líquido/umidade: {{historico_liquido}}"],
      ["Reparo anterior ou peça trocada: {{historico_reparo}}", ""],
      ["qual/quando: {{historico_reparo_qual}}", ""],
      ["Pretensão inicial: {{pretensao}}", ""],
      [
        "Comprovante de compra/garantia apresentado: {{comprovante_apresentado}}",
        "Data: {{comprovante_data}}",
      ],
      ["Anexo: {{comprovante_anexo}}", ""],
    ],
  },

  { t: "secao", numero: "4", titulo: "Evidências na Entrada" },
  {
    t: "grade",
    linhas: [
      [
        "Fotos/vídeos do estado externo: {{evidencias_realizadas}}",
        "Arquivo/protocolo: {{evidencias_protocolo}}",
      ],
    ],
  },
  {
    t: "p",
    texto:
      "Condição não visível ou teste impossibilitado: indicar no checklist e explicar nas " +
      "observações; “N/T” significa não testado.",
  },

  { t: "secao", numero: "5", titulo: "Inspeção Física na Entrada" },
  {
    t: "p",
    texto:
      "Marcar uma única situação por item. “Regular” descreve o resultado observado no teste; “N/A” " +
      "significa que o modelo não possui o recurso. Falhas e limitações precisam de detalhe.",
  },
  { t: "checklist", campo: "inspecao_fisica", linhas: INSPECAO_FISICA },
  {
    t: "p",
    texto:
      "Detalhar danos preexistentes, localização, dimensão e fotos correspondentes: " +
      "{{danos_preexistentes}}",
  },

  { t: "secao", numero: "6", titulo: "Funções e Componentes na Entrada" },
  { t: "checklist", campo: "funcoes", linhas: FUNCOES },
  {
    t: "p",
    texto:
      "Testes dependentes de rede, credenciais, chip ou acessórios devem ser marcados N/T se não " +
      "houver condições de execução; não presumir funcionamento por ausência de queixa.",
  },

  { t: "secao", numero: "7", titulo: "Testes Complementares e Limitações" },
  { t: "checklist", campo: "testes_complementares", linhas: TESTES_COMPLEMENTARES },
  {
    t: "p",
    texto:
      "Motivo específico dos itens não testados e limitações técnicas da triagem: " +
      "{{motivo_nao_testados}}",
  },
  {
    t: "p",
    texto:
      "Observações adicionais sobre os itens, divergências no relato e indícios encontrados: " +
      "{{observacoes_adicionais}}",
  },

  { t: "secao", numero: "8", titulo: "Dados Pessoais e Preparo do Aparelho" },
  {
    t: "grade",
    linhas: [
      ["Backup informado pelo cliente: {{backup}}", ""],
      ["Chip/SIM e cartão de memória: {{chip_sim}}", ""],
      ["Buscar iPhone/conta vinculada: {{buscar_iphone}}", ""],
    ],
  },
  {
    t: "p",
    texto:
      "O cliente deve realizar o backup quando possível e retirar chip e acessórios dispensáveis. O " +
      "diagnóstico ou reparo pode exigir atualização, restauração ou substituição de componente, " +
      "procedimentos que podem apagar dados. Qualquer apagamento ou restauração voluntária " +
      "dependerá de aviso e autorização específica; se não for possível obtê-la, a loja informará a " +
      "limitação técnica antes de prosseguir.",
  },
  {
    t: "p",
    texto:
      "A loja tratará dados pessoais estritamente para registrar, executar e comunicar o " +
      "atendimento, com acesso restrito à equipe necessária. O cliente não deve informar senha da " +
      "Conta Apple; quando uma autenticação for indispensável, ela deve ser feita pelo próprio " +
      "cliente. Eventual código de desbloqueio para teste deverá ser solicitado apenas quando " +
      "necessário, por meio seguro, com registro e descarte após o atendimento.",
  },

  { t: "secao", numero: "9", titulo: "Diagnóstico e Cobrança de Análise" },
  {
    t: "p",
    texto:
      "Autorizo a triagem e os testes diagnósticos não destrutivos necessários à identificação da " +
      "falha: {{autoriza_triagem}}.",
  },
  {
    t: "grade",
    linhas: [
      [
        "Valor da análise, se aplicável e informado antes do serviço: R$ {{valor_analise}}",
        "Hipótese de cobrança: {{hipotese_cobranca}}",
      ],
      ["Prazo estimado para diagnóstico: {{prazo_diagnostico}} dias úteis", ""],
    ],
  },
  {
    t: "p",
    texto:
      "Prazo estimado para diagnóstico sujeito a aviso fundamentado se houver necessidade de peça " +
      "ou de novos testes.",
  },
  {
    t: "p",
    texto:
      "A abertura do aparelho ou procedimento invasivo dependerá de justificativa técnica e de " +
      "ciência específica do cliente antes de ser executado. A análise não equivale à autorização " +
      "de reparo nem à aprovação de peças e valores.",
  },
  {
    t: "p",
    texto:
      "A constatação posterior de defeito interno não visível será documentada e comunicada. Esta " +
      "ficha não presume que toda falha posterior já existia na entrada e não afasta " +
      "responsabilidade da loja por danos relacionados a seus procedimentos.",
  },

  { t: "secao", numero: "10", titulo: "Garantia, Orçamento e Execução" },
  {
    t: "p",
    texto:
      "A análise de eventual cobertura de garantia observará a origem da compra, o comprovante, os " +
      "termos aplicáveis e a legislação. Indício de queda, umidade, reparo anterior ou modificação " +
      "será avaliado em relação ao defeito reclamado e comunicado com fundamento técnico; a mera " +
      "marcação nesta ficha não decide, por si, a cobertura.",
  },
  {
    t: "p",
    texto:
      "Antes de reparo particular, a loja fornecerá orçamento discriminado de mão de obra, " +
      "materiais/peças, condições de pagamento, datas previstas de início e término e eventual " +
      "custo da análise. O reparo, a troca de peças ou serviço adicional somente ocorrerão após " +
      "aprovação expressa e registrada. Alterações no valor ou no escopo exigem novo consentimento.",
  },
  {
    t: "p",
    texto:
      "Na prestação do serviço, peças e componentes devem observar as regras legais e as " +
      "características informadas no orçamento. A devolução das peças retiradas será ajustada no " +
      "orçamento, ressalvadas exigências técnicas, de fabricante ou da garantia, comunicadas " +
      "previamente. A garantia legal do serviço e os direitos relativos ao produto são preservados.",
  },

  { t: "secao", numero: "11", titulo: "Guarda, Comunicação e Retirada" },
  {
    t: "p",
    texto:
      "Contato preferencial para orçamento e conclusão: {{contato_preferencial}}, pelos contatos " +
      "informados na primeira página. A loja registrará a data da comunicação e a resposta do " +
      "cliente.",
  },
  {
    t: "p",
    texto:
      "Após a conclusão ou desistência, a loja avisará o cliente para retirada, mediante " +
      "conferência do aparelho e dos acessórios registrados. Se não houver retirada, a loja fará " +
      "nova comunicação antes de qualquer medida relativa a guarda ou cobrança. Eventual valor de " +
      "armazenagem deverá ser previamente informado, razoável e proporcional; a falta de retirada " +
      "não transfere automaticamente a propriedade do aparelho à loja.",
  },
  {
    t: "p",
    texto:
      "A entrega a terceiro depende de identificação e autorização do titular. O cliente poderá " +
      "solicitar cópia desta ficha e do orçamento aprovado.",
  },

  { t: "secao", numero: "12", titulo: "Ciência da Entrada e Assinaturas" },
  {
    t: "p",
    texto:
      "Declaro que o relato, os itens entregues e as condições observáveis acima foram registrados " +
      "de forma fiel, com as ressalvas indicadas. Recebi ou tive disponibilizada uma via deste " +
      "documento. As autorizações de diagnóstico e de eventual procedimento específico decorrem " +
      "apenas das opções assinaladas e dos registros posteriores.",
  },
  {
    t: "grade",
    linhas: [
      ["Cidade/UF: {{cidade_uf}}", "Data: {{ciencia_data}}"],
      ["Horário: {{ciencia_hora}}", ""],
    ],
  },
  { t: "espaco", altura: 8 },
  {
    t: "assinaturas",
    colunas: [
      { titulo: "Cliente: {{cliente_nome}}", linhas: [] },
      { titulo: "Responsável pela loja: {{responsavel_loja}}", linhas: [] },
    ],
  },
  {
    t: "p",
    texto:
      "Nome e documento de quem entregou, se diferente do titular: {{entregou_nome_documento}}",
  },
];

export const DOCUMENTO_DIAGNOSTICO: BlocoDoc[] = [
  { t: "titulo", texto: TITULO_DIAGNOSTICO },
  {
    t: "grade",
    linhas: [
      ["Ordem de serviço nº {{ordem_servico}}", "Cliente: {{cliente_nome}}"],
      ["Equipamento: {{equipamento_marca_modelo_cor}}", "IMEI 1: {{equipamento_imei1}}"],
    ],
  },

  { t: "secao", numero: "13", titulo: "Diagnóstico e Orçamento Para Registro Posterior" },
  { t: "p", texto: "Diagnóstico, causa provável e evidências: {{diagnostico}}" },
  { t: "p", texto: "Serviços e peças propostos: {{servicos_propostos}}" },
  {
    t: "grade",
    linhas: [
      ["Mão de obra R$ {{valor_mao_obra}}", "Peças R$ {{valor_pecas}}"],
      ["Análise R$ {{valor_analise_orcamento}}", "Total R$ {{valor_total}}"],
      ["Pagamento: {{forma_pagamento}}", ""],
      ["Início: {{inicio_previsto}}", "Término previsto: {{termino_previsto}}"],
      [
        "Comunicação do orçamento: {{comunicacao_data}} às {{comunicacao_hora}}",
        "por {{comunicacao_canal}}",
      ],
      ["Validade: {{validade_orcamento}} dias", ""],
      ["Decisão do cliente: {{decisao_cliente}}", "Data/hora: {{decisao_data}} {{decisao_hora}}"],
      [
        "Autorização expressa para abertura/procedimento invasivo: {{autoriza_abertura}}",
        "Procedimento: {{abertura_procedimento}}",
      ],
      [
        "Autorização expressa para apagar/restaurar dados: {{autoriza_dados}}",
        "Motivo: {{dados_motivo}}",
      ],
    ],
  },
  {
    t: "p",
    texto:
      "Assinatura ou registro verificável da manifestação do cliente: {{registro_manifestacao}}",
  },
  { t: "espaco", altura: 10 },
  {
    t: "assinaturas",
    colunas: [
      { titulo: "Cliente: {{cliente_nome}}", linhas: [] },
      { titulo: "Responsável pela loja", linhas: [] },
    ],
  },
];

export const DOCUMENTO_CONCLUSAO: BlocoDoc[] = [
  { t: "titulo", texto: TITULO_CONCLUSAO },
  {
    t: "grade",
    linhas: [
      ["Ordem de serviço nº {{ordem_servico}}", "Cliente: {{cliente_nome}}"],
      ["Equipamento: {{equipamento_marca_modelo_cor}}", "IMEI 1: {{equipamento_imei1}}"],
    ],
  },

  { t: "secao", numero: "14", titulo: "Conclusão e Retirada do Equipamento" },
  {
    t: "p",
    texto:
      "Serviços efetivamente executados, peças instaladas e divergências do orçamento: " +
      "{{servicos_executados}}",
  },
  { t: "p", texto: "Peças retiradas: {{pecas_retiradas}}" },
  {
    t: "p",
    texto:
      "Resultado dos testes de saída e funções não testadas (explicar motivo): {{testes_saida}}",
  },
  {
    t: "grade",
    linhas: [
      ["Dados: {{situacao_dados}}", "Restauração autorizada em: {{restauracao_data}}"],
      ["Finalização em {{finalizacao_data}}", ""],
      ["Aviso para retirada em {{aviso_data}} às {{aviso_hora}}", "por {{aviso_por}}"],
      ["Itens devolvidos: {{itens_devolvidos}}", ""],
    ],
  },
  {
    t: "p",
    texto:
      "Conferência pelo cliente, ressalvas e orientações de uso/garantia entregues: " +
      "{{conferencia_cliente}}",
  },
  {
    t: "grade",
    linhas: [
      ["Valor total pago: R$ {{valor_pago}}", "Forma: {{forma_pagamento_final}}"],
      ["Comprovante nº {{comprovante_numero}}", ""],
      ["Retirado em {{retirada_data}} às {{retirada_hora}}", "Por: {{retirada_por}}"],
      [
        "Documento do recebedor: {{retirada_documento}}",
        "Relação com titular: {{retirada_relacao}}",
      ],
    ],
  },
  { t: "espaco", altura: 10 },
  {
    t: "assinaturas",
    colunas: [
      { titulo: "Assinatura do recebedor", linhas: [] },
      { titulo: "Responsável pela entrega", linhas: [] },
    ],
  },
  {
    t: "p",
    texto:
      "Se houver reparo, anexar orçamento aprovado, comprovantes de comunicação, fotografias e " +
      "documento fiscal à ordem de serviço. Registrar ressalvas sem alterar o relato original do " +
      "cliente.",
  },
];
