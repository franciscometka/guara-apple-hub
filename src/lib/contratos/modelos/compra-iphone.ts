import type { BlocoDoc } from "./tipos";

/** Cópia independente do Upgrade: somente compra, sem aparelho de entrada. */
export const VERSAO = "2026-10-08";
export const TITULO = "Contrato de Compra de iPhone";
export const DOCUMENTO: BlocoDoc[] = [
  {
    "t": "titulo",
    "texto": "Contrato de Compra de iPhone"
  },
  {
    "t": "p",
    "texto": "Pelo presente instrumento particular, as partes abaixo identificadas ajustam a aquisição de aparelho Apple novo ou seminovo, nas condições seguintes."
  },
  {
    "t": "secao",
    "numero": "1",
    "titulo": "Das Partes"
  },
  {
    "t": "p",
    "prefixo": "1.1.",
    "texto": "VENDEDORA:"
  },
  {
    "t": "grade",
    "linhas": [
      [
        "Loja/razão social: {{loja_razao_social}}",
        ""
      ],
      [
        "CNPJ: {{loja_cnpj}}",
        "Endereço: {{loja_endereco_simples}}"
      ],
      [
        "Cidade/UF: {{loja_cidade_uf}}",
        "CEP: {{loja_cep}}"
      ],
      [
        "neste ato representada por {{loja_representante}}, doravante denominada VENDEDORA.",
        ""
      ]
    ]
  },
  {
    "t": "p",
    "prefixo": "1.2.",
    "texto": "CONSUMIDOR:"
  },
  {
    "t": "grade",
    "linhas": [
      [
        "Nome Completo: {{consumidor_nome}}",
        ""
      ],
      [
        "CPF nº {{consumidor_cpf}}",
        "documento de identidade nº {{consumidor_documento}}"
      ],
      [
        "residente à {{consumidor_endereco}}",
        ""
      ],
      [
        "telefone/WhatsApp {{consumidor_telefone}}, doravante denominado CONSUMIDOR.",
        ""
      ]
    ]
  },
  {
    "t": "p",
    "prefixo": "1.3.",
    "texto": "As comunicações sobre entrega, cobrança e atendimento poderão ocorrer pelos contatos acima indicados, mediante registro que permita identificar remetente, destinatário, conteúdo e data. Cada parte informará a outra sobre alteração de seus dados de contato, sem que a falta de atualização suprima direitos assegurados em lei."
  },
  {
    "t": "secao",
    "numero": "2",
    "titulo": "Do Objeto e da Identificação do Aparelho"
  },
  {
    "t": "p",
    "prefixo": "2.1.",
    "texto": "A VENDEDORA vende ao CONSUMIDOR o aparelho descrito abaixo, com informação prévia e clara sobre sua condição, características e eventuais sinais de uso ou reparos informados ao consumidor:"
  },
  {
    "t": "rotulo",
    "texto": "Aparelho adquirido"
  },
  {
    "t": "grade",
    "linhas": [
      [
        "Modelo: {{adquirido_modelo}}",
        "Capacidade: {{adquirido_capacidade}}"
      ],
      [
        "cor: {{adquirido_cor}}",
        "condição: {{adquirido_condicao}}"
      ],
      [
        "estado aparente: {{adquirido_estado_aparente}}",
        ""
      ],
      [
        "IMEI 1: {{adquirido_imei1}}",
        "IMEI 2: {{adquirido_imei2}}"
      ],
      [
        "número de série: {{adquirido_serie}}",
        ""
      ],
      [
        "Estado de Conservação e acessórios: {{adquirido_conservacao}}",
        ""
      ],
      [
        "Valor de venda: R$ {{adquirido_valor_venda}}",
        "Nota fiscal nº {{adquirido_nota_fiscal}}"
      ]
    ]
  },
  {
    "t": "p",
    "prefixo": "2.2.",
    "texto": "Havendo preenchimento da identificação ou da nota fiscal somente na entrega, esses dados constarão de comprovante entregue ao CONSUMIDOR, que integrará este contrato."
  },
  {
    "t": "p",
    "prefixo": "2.3.",
    "texto": "O estado do aparelho adquirido, especialmente se seminovo, deverá ser descrito em comprovante de entrega, com indicação do estado externo, funcionamento, capacidade da bateria informada na avaliação, acessórios incluídos e eventuais reparos ou limitações conhecidos. A ausência de registro específico não equivale a ciência ou aceitação de defeitos pelo CONSUMIDOR."
  },
  {
    "t": "secao",
    "numero": "3",
    "titulo": "Da Transferência da Propriedade e da Quitação"
  },
  {
    "t": "p",
    "prefixo": "3.1.",
    "texto": "A VENDEDORA dará quitação do preço total somente após a confirmação do pagamento integral do preço. O CONSUMIDOR dará quitação da obrigação de entrega do aparelho adquirido quando receber o bem conforme contratado. A quitação alcança apenas prestações efetivamente cumpridas e não importa renúncia a garantia legal, vícios ocultos, direitos de terceiros ou obrigações ainda pendentes."
  },
  {
    "t": "p",
    "prefixo": "3.2.",
    "texto": "A propriedade do aparelho adquirido será transferida ao CONSUMIDOR com sua efetiva entrega, comprovada por {{transferencia_data}} as {{transferencia_hora}} hrs em {{transferencia_local}}. O parcelamento do preço, por si só, não configura reserva de domínio ou autorização para recolhimento extrajudicial do aparelho; qualquer garantia real ou mecanismo de retomada depende de pactuação específica válida e da observância da legislação aplicável."
  },
  {
    "t": "p",
    "prefixo": "3.3.",
    "texto": "Se houver resolução desta operação, a restituição das prestações já cumpridas observará o fundamento da resolução, o estado dos bens e os direitos legais de ambas as partes."
  },
  {
    "t": "secao",
    "numero": "4",
    "titulo": "Das Responsabilidade e dos Dados Pessoais"
  },
  {
    "t": "p",
    "prefixo": "4.1.",
    "texto": "Nenhuma disposição deste instrumento exclui ou restringe a responsabilidade legal da VENDEDORA perante o CONSUMIDOR pelo aparelho adquirido ou pelos serviços que prestar."
  },
  {
    "t": "p",
    "prefixo": "4.2.",
    "texto": "A VENDEDORA utilizará os dados pessoais recebidos para formalizar a operação, emitir documentos fiscais, cumprir obrigações legais, prestar atendimento e exercer direitos relacionados ao contrato, com acesso limitado ao necessário e medidas adequadas de proteção."
  },
  {
    "t": "secao",
    "numero": "5",
    "titulo": "Das Disposições Gerais e do Foro"
  },
  {
    "t": "p",
    "prefixo": "5.1.",
    "texto": "Integram este contrato a nota fiscal, o comprovante de entrega, o registro das condições do aparelho adquirido e eventual termo escrito de garantia adicional. Alterações dependem de ajuste expresso entre as partes, sem prejuízo dos direitos legais do CONSUMIDOR."
  },
  {
    "t": "p",
    "prefixo": "5.2.",
    "texto": "Para dirimir controvérsias, fica eleito o foro do domicílio do CONSUMIDOR, ressalvada a possibilidade de este optar por outro foro legalmente competente que lhe seja mais favorável."
  },
  {
    "t": "p",
    "prefixo": "5.3.",
    "texto": "O presente instrumento é firmado em 2 vias de igual teor, físicas ou eletrônicas, recebendo cada parte uma cópia integral, com seus anexos."
  },
  {
    "t": "p",
    "prefixo": "5.4.",
    "texto": "Nas contratações realizadas fora do estabelecimento comercial, inclusive quando aplicável por meio eletrônico, ficam preservadas as regras legais de arrependimento e de restituição dos valores pagos. Nas operações presenciais, eventuais políticas comerciais de troca ou desistência deverão ser informadas por escrito e não afastam garantias legais."
  },
  {
    "t": "p",
    "prefixo": "5.5.",
    "texto": "A eventual invalidade de uma disposição específica não prejudicará as demais cláusulas que possam produzir efeitos de forma autônoma, observada a interpretação mais favorável ao CONSUMIDOR nos termos da legislação de consumo. As partes reconhecem que receberam acesso ao inteiro teor deste instrumento antes da assinatura."
  },
  {
    "t": "espaco",
    "altura": 4
  },
  {
    "t": "p",
    "texto": "Cidade: {{cidade}} UF: {{uf}}, {{data_fechamento}}."
  },
  {
    "t": "espaco",
    "altura": 8
  },
  {
    "t": "assinaturas",
    "colunas": [
      {
        "titulo": "Vendedor(a)/Razão Social: {{loja_razao_social}}",
        "linhas": [
          "Representante: {{loja_representante}}"
        ]
      },
      {
        "titulo": "Consumidor: {{consumidor_nome}}",
        "linhas": [
          "CPF: {{consumidor_cpf}}"
        ]
      }
    ]
  },
  {
    "t": "espaco",
    "altura": 10
  },
  {
    "t": "assinaturas",
    "colunas": [
      {
        "titulo": "Testemunha 1: {{testemunha1_nome}}",
        "linhas": [
          "CPF: {{testemunha1_cpf}}"
        ]
      },
      {
        "titulo": "Testemunha 2: {{testemunha2_nome}}",
        "linhas": [
          "CPF: {{testemunha2_cpf}}"
        ]
      }
    ]
  },
  {
    "t": "quebraPagina"
  },
  {
    "t": "secao",
    "numero": "Anexo 1",
    "titulo": "Registro de Entrega e Pagamento"
  },
  {
    "t": "p",
    "texto": "Este registro integra o contrato de compra firmado em {{data_fechamento}} entre VENDEDORA e CONSUMIDOR. Os campos devem refletir a verificação efetivamente realizada, sem presumir aprovação dos itens não testados."
  },
  {
    "t": "rotulo",
    "texto": "Preço e pagamento"
  },
  {
    "t": "grade",
    "linhas": [
      [
        "Valor de venda: R$ {{adquirido_valor_venda}}",
        ""
      ]
    ]
  },
  {
    "t": "p",
    "texto": "O preço será pago por {{pagamento_meio}}, da seguinte forma: {{pagamento_forma}} e, se aplicável, {{parcelas_quantidade}} parcelas de R$ {{parcelas_valor}}, com vencimentos em {{parcelas_vencimento}}, total a prazo de R$ {{parcelas_total}}, juros de {{parcelas_juros}} ao {{parcelas_periodicidade}}, demais encargos de {{parcelas_encargos}}, custo efetivo total de {{parcelas_cet}} e agente financiador {{parcelas_financiador}}. Se não houver parcelamento, preencher “não se aplica”."
  },
  {
    "t": "rotulo",
    "texto": "Aparelho entregue ao consumidor"
  },
  {
    "t": "grade",
    "linhas": [
      [
        "Modelo: {{adquirido_modelo}}",
        "Capacidade: {{adquirido_capacidade}}"
      ],
      [
        "cor: {{adquirido_cor}}",
        "condição: {{adquirido_condicao}}"
      ],
      [
        "estado aparente: {{adquirido_estado_aparente}}",
        ""
      ],
      [
        "IMEI 1: {{adquirido_imei1}}",
        "IMEI 2: {{adquirido_imei2}}"
      ],
      [
        "número de série: {{adquirido_serie}}",
        ""
      ]
    ]
  },
  {
    "t": "grade",
    "linhas": [
      [
        "Estado e itens — Estado físico: {{anexo_saida_estado}}",
        "saúde da bateria, se informada: {{anexo_saida_bateria}}"
      ],
      [
        "acessórios: {{anexo_saida_acessorios}}",
        ""
      ],
      [
        "reparos e limitações informados: {{anexo_saida_limitacoes}}",
        ""
      ]
    ]
  },
  {
    "t": "grade",
    "linhas": [
      [
        "Documentos — Nota fiscal nº {{adquirido_nota_fiscal}}",
        "emissão: {{anexo_nf_emissao}}"
      ]
    ]
  },
  {
    "t": "grade",
    "linhas": [
      [
        "Entrega — Data {{transferencia_data}}",
        "hora {{transferencia_hora}}"
      ],
      [
        "local: {{transferencia_local}}",
        ""
      ],
      [
        "valor pago R$ {{pagamento_valor_pago}}",
        "saldo a pagar R$ {{anexo_saldo_pagar}}"
      ]
    ]
  },
  {
    "t": "espaco"
  },
  {
    "t": "p",
    "texto": "As partes confirmam que receberam cópia deste registro e que as informações preenchidas correspondem aos testes efetivamente realizados e aos bens entregues nesta operação."
  },
  {
    "t": "espaco",
    "altura": 10
  },
  {
    "t": "assinaturas",
    "colunas": [
      {
        "titulo": "VENDEDOR(A)",
        "linhas": []
      },
      {
        "titulo": "CONSUMIDOR: {{consumidor_nome}}",
        "linhas": []
      }
    ]
  }
];
