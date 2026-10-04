import type { BlocoDoc } from "./tipos";

/**
 * Contrato de Pré-Reserva de Iphone 18 e Condições para Futura Compra e Venda.
 *
 * Texto transcrito integralmente do PDF original, sem resumo nem reescrita.
 * As lacunas do documento viraram marcadores {{campo}}.
 *
 * São dois documentos: o contrato com os Anexos 1 a 3, gerado na contratação,
 * e o Anexo 4 (Termo de Entrega e Aceite), gerado no dia da entrega.
 */

export const VERSAO = "2026-01";

export const TITULO = "Contrato de Pré-Reserva de Iphone 18 e Condições para Futura Compra e Venda";

export const TITULO_ENTREGA = "Anexo 4 | Termo de Entrega e Aceite do Aparelho";

export const DOCUMENTO: BlocoDoc[] = [
  { t: "titulo", texto: TITULO },

  { t: "rotulo", texto: "VENDEDORA" },
  {
    t: "grade",
    linhas: [
      ["Razão social: {{loja_razao_social}}", "CNPJ nº {{loja_cnpj}}"],
      ["Endereço completo: {{loja_endereco_simples}}", "CEP {{loja_cep}}"],
      ["Telefone/WhatsApp {{loja_telefone}}", "E-mail {{loja_email}}"],
      ["Representante legal {{loja_representante}}", "CPF nº {{loja_representante_cpf}}"],
    ],
  },
  { t: "rotulo", texto: "COMPRADOR(A)" },
  {
    t: "grade",
    linhas: [
      ["Nome completo: {{comprador_nome}}", "CPF nº {{comprador_cpf}}"],
      [
        "Documento de identificação nº {{comprador_documento}}",
        "Telefone/WhatsApp {{comprador_telefone}}",
      ],
      ["E-mail {{comprador_email}}", ""],
      ["Endereço completo {{comprador_endereco}}", "CEP {{comprador_cep}}"],
    ],
  },
  {
    t: "p",
    prefixo: "TITULAR DO CARTÃO, se diferente do(a) COMPRADOR(A):",
    texto:
      "Nome {{titular_nome}} CPF nº {{titular_cpf}}. A autorização e os demais dados serão " +
      "preenchidos no Anexo III.",
  },
  {
    t: "p",
    texto:
      "As partes firmam a pré-reserva do produto descrito abaixo, conforme as condições " +
      "expressamente preenchidas e os anexos aplicáveis. Campos relativos a modalidades não " +
      "escolhidas devem ser riscados ou assinalados como “não aplicável”.",
  },
  {
    t: "grade",
    linhas: [
      ["Modalidade da contratação: {{modalidade}}", ""],
      ["Produto pretendido: iPhone 18; versão/modelo {{produto_versao}}", ""],
      ["capacidade {{produto_capacidade}}", "cor {{produto_cor}}; condição: novo."],
      [
        "Preço total anunciado e contratado: R$ {{preco_total}}",
        "Sinal/adiantamento: R$ {{sinal_valor}}",
      ],
      [
        "Previsão informada de chegada: {{previsao_chegada}}",
        "Prazo máximo de entrega pactuado: {{prazo_entrega}}",
      ],
    ],
  },

  { t: "secao", numero: "1", titulo: "Objeto e Pré-Reserva" },
  {
    t: "p",
    prefixo: "1.1.",
    texto:
      "O objeto é a pré-reserva de 01 (um) iPhone da linha 18, novo e original, na versão, " +
      "capacidade, cor e preço expressamente preenchidos neste instrumento. Antes da entrega, a " +
      "VENDEDORA confirmará por escrito as especificações efetivamente ofertadas; nenhuma " +
      "substituição ou alteração de preço será imposta sem concordância expressa do(a) " +
      "COMPRADOR(A).",
  },
  {
    t: "p",
    prefixo: "1.2.",
    texto:
      "A pré-reserva assegura o atendimento da oferta nas condições registradas e está sujeita à " +
      "disponibilização do produto no prazo pactuado. Informações de lançamento, fornecedores e " +
      "logística não autorizam alteração unilateral do objeto, do preço ou do prazo máximo de " +
      "entrega.",
  },
  {
    t: "p",
    prefixo: "1.3.",
    texto:
      "A versão, a capacidade e a cor pretendidas constam do quadro inicial. A confirmação de " +
      "disponibilidade será comunicada até {{data_confirmacao}} pelo canal indicado pelo(a) " +
      "COMPRADOR(A).",
  },
  {
    t: "p",
    prefixo: "1.4.",
    texto:
      "A data estimada de chegada e o prazo máximo de entrega constam do quadro inicial. Se houver " +
      "impedimento, a VENDEDORA comunicará prontamente sua causa, a nova previsão e as opções do(a) " +
      "COMPRADOR(A), sem considerar aceita a prorrogação pelo silêncio.",
  },
  {
    t: "p",
    prefixo: "1.5.",
    texto:
      "O número de série e os IMEIs do aparelho serão inseridos no Anexo IV – Termo de Entrega e " +
      "Aceite, no momento da efetiva entrega do produto, pois poderão não estar disponíveis no ato " +
      "da pré-reserva.",
  },

  { t: "secao", numero: "2", titulo: "Preço Total e Composição do Pagamento" },
  {
    t: "p",
    prefixo: "2.1.",
    texto:
      "O preço total da compra é o valor preenchido no quadro inicial e no Anexo I. Os preços à " +
      "vista e no cartão, inclusive o total no parcelamento, assim como frete e demais custos " +
      "obrigatórios, serão informados antes da aceitação, com indicação expressa de eventual " +
      "diferença de preço conforme o meio e o prazo de pagamento.",
  },
  {
    t: "p",
    prefixo: "2.2.",
    texto:
      "O pagamento poderá ser composto por valor atribuído a aparelho usado, quando houver, e por " +
      "pagamento à vista (Pix, dinheiro ou transferência bancária) e/ou cartão de débito ou " +
      "crédito. As modalidades, datas e valores escolhidos constarão do Anexo I.",
  },
  {
    t: "p",
    prefixo: "2.3.",
    texto:
      "O sinal, os demais pagamentos à vista, o valor atribuído ao aparelho usado e os pagamentos " +
      "por cartão serão discriminados no Anexo I. A soma desses valores e do saldo a pagar deverá " +
      "corresponder ao preço total efetivamente aceito para a modalidade escolhida, sem cobrança " +
      "não informada.",
  },
  {
    t: "p",
    prefixo: "2.4.",
    texto:
      "O sinal, no valor preenchido no quadro inicial e no Anexo I, será pago em {{sinal_data}} por " +
      "{{sinal_forma}}. A VENDEDORA fornecerá comprovante com data, valor e identificação da " +
      "operação.",
  },
  {
    t: "p",
    prefixo: "2.5.",
    texto:
      "Se a compra for concluída, o sinal será integralmente abatido do preço. Em caso de " +
      "cancelamento, sua restituição ou eventual retenção observará a Cláusula 9, sem perda " +
      "automática ou qualificação tácita como arras.",
  },
  {
    t: "p",
    prefixo: "2.6.",
    texto:
      "No pagamento por cartão, a VENDEDORA informará previamente o valor total da transação e, se " +
      "houver parcelamento no cartão, a quantidade e o valor das parcelas e o preço total nessa " +
      "modalidade. A operação dependerá de autorização do titular e confirmação pela administradora " +
      "ou emissor do cartão.",
  },
  {
    t: "p",
    prefixo: "2.7.",
    texto:
      "A recusa da transação pelo emissor do cartão, sem culpa do(a) COMPRADOR(A), será tratada " +
      "conforme a Cláusula 4. Valores, parcelas ou condições diferentes dos aceitos exigem nova " +
      "concordância expressa antes de qualquer cobrança.",
  },

  { t: "secao", numero: "3", titulo: "Cartão em Nome de Terceiro" },
  {
    t: "p",
    prefixo: "3.1.",
    texto:
      "Se cartão de débito ou de crédito de pessoa diferente do(a) COMPRADOR(A) for utilizado, o " +
      "titular preencherá e assinará o Anexo III, com identificação da transação, valor e, quando " +
      "for o caso, quantidade e valor das parcelas.",
  },
  {
    t: "p",
    prefixo: "3.2.",
    texto:
      "O TITULAR DO CARTÃO declara que autoriza expressamente a transação indicada no Anexo III, " +
      "conhece o preço total e as condições de pagamento aceitas e está ciente de que sua " +
      "autorização não transfere, por si só, a propriedade do aparelho adquirido.",
  },
  {
    t: "p",
    prefixo: "3.3.",
    texto:
      "O(A) COMPRADOR(A) responde perante a VENDEDORA apenas pelo saldo que assumir neste contrato. " +
      "A confirmação do pagamento feito pelo titular do cartão será lançada na composição do preço, " +
      "sem duplicidade de cobrança.",
  },
  {
    t: "p",
    prefixo: "3.4.",
    texto:
      "A VENDEDORA não integra acordos particulares entre o(a) COMPRADOR(A) e o TITULAR DO CARTÃO, " +
      "mas permanece responsável por seus próprios atos, pelo dever de informação e pelas " +
      "providências de estorno que lhe couberem.",
  },
  {
    t: "p",
    prefixo: "3.5.",
    texto:
      "A VENDEDORA poderá suspender ou recusar a transação por inconsistência de dados, falta de " +
      "autorização do titular ou indício objetivo de fraude, informando a razão e preservando os " +
      "direitos do(a) COMPRADOR(A).",
  },

  { t: "secao", numero: "4", titulo: "Pagamento por Cartão e Confirmação da Operação" },
  {
    t: "p",
    prefixo: "4.1.",
    texto:
      "Confirmado o pagamento à vista ou autorizada a transação no cartão nos termos aceitos, as " +
      "partes prosseguirão conforme a composição do preço registrada no Anexo I.",
  },
  {
    t: "p",
    prefixo: "4.2.",
    texto:
      "Se a transação no cartão não for autorizada, a VENDEDORA comunicará o fato ao(à) " +
      "COMPRADOR(A), que poderá, no prazo de {{prazo_recusa_cartao}} dias corridos, optar por outra " +
      "forma de pagamento à vista ou por outro cartão autorizado, ou cancelar a pré-reserva " +
      "conforme a Cláusula 4.5.",
  },
  {
    t: "p",
    prefixo: "4.3.",
    texto:
      "Se a operação em cartão disponível apresentar valor total, quantidade ou valor de parcelas " +
      "diferentes dos registrados no Anexo I, a VENDEDORA informará previamente a divergência ao(à) " +
      "COMPRADOR(A) e ao titular, quando diverso, e solicitará aceitação expressa de ambos.",
  },
  {
    t: "p",
    prefixo: "4.4.",
    texto:
      "A falta de aceitação expressa impede a cobrança nas condições modificadas; nenhuma transação " +
      "será lançada ou repetida sem autorização válida. Comprovante e identificação da autorização " +
      "serão disponibilizados ao pagador.",
  },
  {
    t: "p",
    prefixo: "4.5.",
    texto:
      "Se a transação no cartão não for autorizada ou as novas condições não forem aceitas, sem " +
      "culpa do(a) COMPRADOR(A), e não houver outra forma de pagamento acordada, este poderá " +
      "cancelar a pré-reserva e receber integralmente os valores pagos à VENDEDORA, inclusive o " +
      "sinal, sem multa.",
  },

  {
    t: "secao",
    numero: "5",
    titulo: "Previsão de Chegada, Disponibilidade e Alteração de Prazo",
  },
  {
    t: "p",
    prefixo: "5.1.",
    texto:
      "A previsão de chegada e o prazo máximo de entrega são aqueles preenchidos no quadro inicial. " +
      "Atrasos de fornecedor, transporte, importação ou disponibilidade de estoque serão " +
      "comunicados com justificativa; sua simples ocorrência não altera, por si, o prazo pactuado " +
      "nem afasta os direitos previstos nos arts. 30 e 35 do CDC.",
  },
  {
    t: "p",
    prefixo: "5.2.",
    texto:
      "A VENDEDORA compromete-se a manter o(a) COMPRADOR(A) informado(a), por WhatsApp, e-mail ou " +
      "outro canal registrado, sobre alterações relevantes relativas à previsão de entrega.",
  },
  {
    t: "p",
    prefixo: "5.3.",
    texto:
      "Se a entrega nas condições ofertadas não ocorrer no prazo pactuado, o(a) COMPRADOR(A) " +
      "poderá, à sua livre escolha e conforme o art. 35 do CDC, exigir o cumprimento da oferta, " +
      "aceitar produto equivalente mediante ajuste expresso ou rescindir o contrato com restituição " +
      "dos valores pagos, sem prejuízo de perdas e danos cabíveis.",
  },
  {
    t: "p",
    prefixo: "5.4.",
    texto:
      "Nenhuma disposição deste contrato afasta ou restringe os direitos do consumidor decorrentes " +
      "de atraso injustificado, descumprimento da oferta ou impossibilidade de fornecimento do " +
      "produto, nos termos do CDC.",
  },

  { t: "secao", numero: "6", titulo: "Indisponibilidade da Cor Escolhida" },
  {
    t: "p",
    prefixo: "6.1.",
    texto:
      "Caso a cor inicialmente escolhida não esteja disponível na data de confirmação prevista ou " +
      "na disponibilidade efetiva do lote, a VENDEDORA comunicará o(a) COMPRADOR(A), apresentando, " +
      "quando possível, as cores alternativas disponíveis.",
  },
  { t: "p", prefixo: "6.2.", texto: "O(A) COMPRADOR(A) poderá optar por:" },
  {
    t: "itens",
    itens: [
      "aguardar a disponibilidade da cor originalmente escolhida;",
      "escolher outra cor disponível para pronta entrega ou com previsão informada;",
      "substituir o pedido por outro modelo, capacidade ou produto, mediante ajuste de preço; ou",
      "cancelar a pré-reserva, com restituição integral dos valores pagos à VENDEDORA, sem multa.",
    ],
  },
  {
    t: "p",
    prefixo: "6.3.",
    texto:
      "A substituição de cor, modelo, capacidade ou especificação somente ocorrerá mediante " +
      "concordância expressa do(a) COMPRADOR(A), registrada por escrito, inclusive por meio " +
      "eletrônico.",
  },

  { t: "secao", numero: "7", titulo: "Aparelho Usado Como Parte do Pagamento" },
  {
    t: "p",
    prefixo: "7.1.",
    texto:
      "Caso o(a) COMPRADOR(A) entregue aparelho usado como parte do pagamento, deverão ser " +
      "preenchidos e assinados o Anexo II – Avaliação e Recebimento de Aparelho Usado, contendo, no " +
      "mínimo:",
  },
  {
    t: "itens",
    itens: [
      "marca, modelo, cor e capacidade;",
      "IMEI e número de série;",
      "percentual ou estado da saúde da bateria, quando aplicável;",
      "informação sobre peças substituídas, reparos prévios e histórico de assistência técnica;",
      "avarias estéticas, funcionais ou estruturais;",
      "existência de bloqueios, restrições, alienação fiduciária, gravames, iCloud, MDM, conta Google, bloqueio de operadora ou outras vinculações;",
      "documentos e acessórios entregues;",
      "valor provisório ou definitivo atribuído ao bem.",
    ],
  },
  { t: "p", prefixo: "7.2.", texto: "O valor atribuído ao aparelho usado poderá ser:" },
  {
    t: "p",
    texto:
      "Definitivo, quando a avaliação técnica estiver integralmente concluída no ato do " +
      "recebimento;",
  },
  {
    t: "p",
    texto:
      "Provisório, sujeito à inspeção técnica detalhada, verificação de IMEI, funcionalidade, " +
      "autenticidade, procedência, bloqueios, peças, bateria e demais condições do aparelho.",
  },
  {
    t: "p",
    prefixo: "7.3.",
    texto:
      "Sendo o valor provisório, a VENDEDORA realizará a inspeção em até {{usado_prazo_inspecao}} " +
      "dias úteis contados da entrega física do aparelho, salvo necessidade justificada de análise " +
      "técnica complementar.",
  },
  {
    t: "p",
    prefixo: "7.4.",
    texto:
      "Se a inspeção identificar divergência relevante em relação às informações prestadas ou ao " +
      "estado declarado do aparelho, a VENDEDORA apresentará relatório ou explicação objetiva ao(à) " +
      "COMPRADOR(A), indicando a divergência e, se cabível, o novo valor de avaliação.",
  },
  {
    t: "p",
    prefixo: "7.5.",
    texto: "Havendo redução do valor inicialmente estimado, o(a) COMPRADOR(A) poderá:",
  },
  {
    t: "itens",
    itens: [
      "complementar a diferença em dinheiro, Pix, transferência bancária ou cartão;",
      "aceitar o novo valor do aparelho usado; ou",
      "recusar a nova avaliação e receber de volta o aparelho usado, ressalvada determinação legal ou de autoridade competente; nessa hipótese, poderá ajustar outra forma de pagamento ou cancelar a operação nos termos da Cláusula 9.",
    ],
  },
  {
    t: "p",
    prefixo: "7.6.",
    texto:
      "O(A) COMPRADOR(A) declara, sob as penas da lei, que é legítimo proprietário ou possuidor " +
      "autorizado do aparelho usado e que o bem:",
  },
  {
    t: "itens",
    itens: [
      "não é produto de furto, roubo, extravio, fraude ou outra origem ilícita;",
      "não possui restrição de IMEI, bloqueio de operadora, bloqueio administrativo ou judicial;",
      "não está vinculado a conta iCloud, “Buscar iPhone”, Apple ID, conta Google, MDM, conta Samsung, bloqueio de ativação ou serviço equivalente;",
      "não possui alienação fiduciária, gravame, parcelas em aberto ou obrigação que impeça sua livre transferência, salvo informação expressa no Anexo II;",
      "não contém dados de terceiros que devam ser preservados.",
    ],
  },
  {
    t: "p",
    prefixo: "7.7.",
    texto:
      "Se a avaliação constatar bloqueio, restrição de IMEI, divergência de procedência, gravame, " +
      "defeito omitido ou outra condição relevante, a VENDEDORA apresentará a constatação ao(à) " +
      "COMPRADOR(A) e poderá recusar o bem, propor nova avaliação ou solicitar sua regularização. A " +
      "alteração do valor ou a complementação do pagamento dependerá de concordância expressa; em " +
      "caso de recusa, as partes ajustarão outra forma de pagamento ou o cancelamento conforme este " +
      "contrato.",
  },
  {
    t: "p",
    prefixo: "7.8.",
    texto:
      "Diante de indícios objetivos de ilícito relativos ao aparelho usado, a VENDEDORA poderá " +
      "suspender a avaliação e comunicar os fatos à autoridade competente. A guarda ou entrega do " +
      "bem observará determinação legal ou da autoridade, com registro documental e respeito aos " +
      "direitos de terceiros.",
  },

  { t: "secao", numero: "8", titulo: "Guarda do Aparelho Usado" },
  {
    t: "p",
    prefixo: "8.1.",
    texto:
      "Se o aparelho usado for entregue antes da chegada e entrega do aparelho novo, a VENDEDORA o " +
      "receberá em guarda temporária, conforme registrado no Anexo II.",
  },
  {
    t: "p",
    prefixo: "8.2.",
    texto:
      "Durante a guarda temporária, o aparelho permanecerá sob responsabilidade da VENDEDORA quanto " +
      "à sua custódia, devendo ser armazenado de forma compatível com sua natureza.",
  },
  {
    t: "p",
    prefixo: "8.3.",
    texto:
      "Antes da entrega do aparelho usado, o(a) COMPRADOR(A) deverá, quando tecnicamente possível, " +
      "realizar backup, retirar chip e cartões, remover suas contas, desativar o bloqueio de " +
      "ativação e apagar os dados pessoais. Testes e eventual restauração pela VENDEDORA deverão " +
      "ser informados e registrados no Anexo II.",
  },
  {
    t: "p",
    prefixo: "8.4.",
    texto:
      "A VENDEDORA não garante a recuperação de dados apagados após procedimento de avaliação ou " +
      "restauração informado ao(à) COMPRADOR(A). Enquanto o aparelho estiver sob sua guarda, " +
      "adotará medidas adequadas de segurança e proteção de dados pessoais, observada a Lei nº " +
      "13.709/2018.",
  },
  {
    t: "p",
    prefixo: "8.5.",
    texto:
      "Se a operação for cancelada antes da aceitação definitiva do aparelho usado como pagamento, " +
      "a VENDEDORA o devolverá mediante recibo e conferência do estado registrado na entrada. A " +
      "VENDEDORA responde pelos danos que causar durante a guarda, observadas as avarias e " +
      "restrições preexistentes efetivamente documentadas.",
  },

  {
    t: "secao",
    numero: "9",
    titulo: "Cancelamento, Sinal, Desistência e Direito de Arrependimento",
  },
  {
    t: "p",
    prefixo: "9.1.",
    texto:
      "Nas contratações realizadas fora do estabelecimento comercial, o(a) COMPRADOR(A) poderá " +
      "exercer o direito de arrependimento no prazo de 7 (sete) dias, contado da assinatura ou do " +
      "recebimento do produto, conforme o art. 49 do CDC. O pedido poderá ser feito pelo mesmo " +
      "canal da contratação ou por outro canal oficial da VENDEDORA.",
  },
  {
    t: "p",
    prefixo: "9.2.",
    texto:
      "Exercido tempestivamente o direito de arrependimento, serão restituídos integralmente e sem " +
      "demora os valores pagos a qualquer título, inclusive o sinal, observados os procedimentos da " +
      "forma de pagamento. A VENDEDORA confirmará o recebimento do pedido e adotará as providências " +
      "para cancelamento das operações vinculadas, sem custo ao consumidor.",
  },
  {
    t: "p",
    prefixo: "9.3.",
    texto:
      "Na contratação presencial no estabelecimento, o CDC não assegura arrependimento imotivado " +
      "automático. O cancelamento solicitado antes da entrega observará as condições ajustadas e a " +
      "Cláusula 9.4, sem prejuízo das hipóteses legais de resolução e de descumprimento da oferta.",
  },
  {
    t: "p",
    prefixo: "9.4.",
    texto:
      "Em desistência imotivada de contratação presencial, eventual retenção ficará limitada às " +
      "despesas específicas registradas no Anexo I antes da contratação, efetivamente comprovadas e " +
      "diretamente ligadas à operação, em valor proporcional, com prestação de contas ao(à) " +
      "COMPRADOR(A); o saldo do sinal será restituído. Não haverá retenção automática ou superior " +
      "ao prejuízo comprovado.",
  },
  { t: "p", prefixo: "9.5.", texto: "A retenção de valores não será aplicada quando:" },
  {
    t: "itens",
    itens: [
      "houver exercício tempestivo do direito de arrependimento em contratação remota;",
      "a VENDEDORA não puder fornecer o produto nas condições contratadas;",
      "houver atraso relevante e injustificado não aceito pelo(a) COMPRADOR(A);",
      "a cor escolhida se tornar indisponível e o(a) COMPRADOR(A) não aceitar alternativa;",
      "a transação no cartão não for autorizada, sem culpa do(a) COMPRADOR(A), e não houver outra forma de pagamento aceita;",
      "houver descumprimento contratual pela VENDEDORA.",
    ],
  },
  {
    t: "p",
    prefixo: "9.6.",
    texto:
      "Quando o cancelamento decorrer de inadimplemento da VENDEDORA ou impossibilidade de " +
      "fornecimento nas condições ofertadas, o(a) COMPRADOR(A) terá direito à restituição integral " +
      "dos valores pagos na operação, observados os estornos da forma de pagamento, sem prejuízo " +
      "dos demais direitos legais.",
  },
  {
    t: "p",
    prefixo: "9.7.",
    texto:
      "Em pagamentos por cartão, a VENDEDORA solicitará prontamente os cancelamentos, estornos e " +
      "ajustes que lhe competirem e fornecerá ao(à) COMPRADOR(A) o respectivo protocolo. O tempo de " +
      "processamento do emissor ou da administradora do cartão não afasta as obrigações legais da " +
      "VENDEDORA perante o consumidor.",
  },
  {
    t: "p",
    prefixo: "9.8.",
    texto:
      "A desistência não autoriza a VENDEDORA a reter integralmente e automaticamente o sinal, " +
      "devendo qualquer retenção observar a legislação consumerista, a proporcionalidade, a efetiva " +
      "demonstração de prejuízo e as circunstâncias específicas da contratação.",
  },

  { t: "secao", numero: "10", titulo: "Inadimplemento e Atraso do Comprador" },
  {
    t: "p",
    prefixo: "10.1.",
    texto:
      "O atraso no pagamento de valores devidos diretamente à VENDEDORA poderá acarretar incidência " +
      "de:",
  },
  {
    t: "itens",
    itens: [
      "multa moratória de 2% sobre a parcela em atraso;",
      "juros de mora de 1% ao mês, calculados proporcionalmente;",
      "correção monetária pelo IPCA/IBGE ou índice que o substitua.",
    ],
  },
  {
    t: "p",
    prefixo: "10.2.",
    texto:
      "A cobrança de encargos incidirá exclusivamente sobre valores vencidos e não pagos, " +
      "observados os limites legais.",
  },
  {
    t: "p",
    prefixo: "10.3.",
    texto:
      "A VENDEDORA deverá comunicar o(a) COMPRADOR(A) acerca do atraso e conceder prazo razoável " +
      "para regularização antes de adotar medidas de cancelamento ou cobrança, salvo situações em " +
      "que a urgência decorra da própria natureza da operação ou da proximidade da entrega.",
  },
  {
    t: "p",
    prefixo: "10.4.",
    texto:
      "Em pagamento por cartão, eventuais condições da fatura entre titular e emissor não autorizam " +
      "cobrança adicional pela VENDEDORA além do preço e das condições previamente aceitos. A " +
      "VENDEDORA responderá pelas providências de cancelamento e estorno que lhe couberem.",
  },

  { t: "secao", numero: "11", titulo: "Entrega, Nota Fiscal e Aceite" },
  {
    t: "p",
    prefixo: "11.1.",
    texto:
      "A entrega do aparelho ocorrerá no prazo máximo pactuado, após a disponibilização do produto " +
      "e confirmação da forma de pagamento acordada. A exigência de saldo ainda devido ou entrega " +
      "de aparelho usado dependerá das condições expressamente ajustadas. A ausência de assinatura " +
      "prévia do termo de entrega não impedirá o exercício dos direitos do consumidor.",
  },
  {
    t: "p",
    prefixo: "11.2.",
    texto:
      "A forma e o local da entrega, bem como eventual custo de frete informado antes da " +
      "contratação, serão registrados no Anexo IV.",
  },
  {
    t: "p",
    prefixo: "11.3.",
    texto:
      "No ato da entrega, a VENDEDORA fornecerá a respectiva nota fiscal, contendo os dados da " +
      "operação, conforme aplicável.",
  },
  {
    t: "p",
    prefixo: "11.4.",
    texto: "O Termo de Entrega deverá registrar, entre outros elementos:",
  },
  {
    t: "itens",
    itens: [
      "modelo, cor e capacidade do aparelho;",
      "número de série e IMEI(s);",
      "número e data da nota fiscal;",
      "condição da embalagem e integridade do lacre;",
      "acessórios entregues;",
      "eventual serviço de migração de dados, quando solicitado.",
    ],
  },
  {
    t: "p",
    prefixo: "11.5.",
    texto:
      "Eventual auxílio de migração de dados será realizado como mera cortesia ou serviço " +
      "contratado, conforme informado no Anexo IV, cabendo ao(à) COMPRADOR(A) manter backup " +
      "atualizado de suas informações, senhas e códigos de autenticação.",
  },
  {
    t: "p",
    prefixo: "11.6.",
    texto:
      "A conferência do produto no momento da entrega não afasta a garantia legal para vícios " +
      "ocultos ou defeitos que se manifestem posteriormente.",
  },

  { t: "secao", numero: "12", titulo: "Garantias e Responsabilidades da Vendedora" },
  {
    t: "p",
    prefixo: "12.1.",
    texto:
      "O produto a ser entregue deverá corresponder às características expressamente ofertadas, ser " +
      "novo e original, acompanhado de nota fiscal e das informações de garantia. Eventual mudança " +
      "de condição, embalagem, lacre, versão ou especificação depende de informação prévia e " +
      "concordância expressa do(a) COMPRADOR(A).",
  },
  {
    t: "p",
    prefixo: "12.2.",
    texto:
      "O prazo legal para reclamar de vícios aparentes ou de fácil constatação em produto durável é " +
      "de 90 (noventa) dias, contado da entrega efetiva; tratando-se de vício oculto, inicia-se " +
      "quando o vício se tornar evidente, conforme o art. 26 do CDC. Permanecem as demais medidas " +
      "previstas no art. 18 do CDC.",
  },
  {
    t: "p",
    prefixo: "12.3.",
    texto:
      "Quando aplicável ao aparelho efetivamente entregue, a Garantia Limitada de Um Ano da Apple é " +
      "oferecida pela fabricante, nos termos próprios, em regra contada da compra pelo usuário " +
      "final. Essa garantia não representa promessa de garantia contratual de 12 meses pela " +
      "VENDEDORA e não reduz sua responsabilidade pela garantia legal ou por vícios do produto.",
  },
  {
    t: "p",
    prefixo: "12.4.",
    texto:
      "A garantia contratual do fabricante não exclui, reduz ou substitui a garantia legal e a " +
      "responsabilidade solidária dos fornecedores prevista no CDC.",
  },
  {
    t: "p",
    prefixo: "12.5.",
    texto:
      "Em caso de vício do produto, o(a) COMPRADOR(A) poderá acionar a VENDEDORA, assistência " +
      "técnica autorizada ou demais fornecedores responsáveis, observadas as disposições legais " +
      "aplicáveis.",
  },
  {
    t: "p",
    prefixo: "12.6.",
    texto:
      "Danos decorrentes de mau uso, quedas, contato com líquidos, reparos não autorizados, " +
      "modificações indevidas ou uso contrário às orientações do fabricante poderão não estar " +
      "cobertos pela garantia, desde que devidamente apurados e demonstrados, sem prejuízo do " +
      "direito do consumidor de contestar a conclusão técnica.",
  },

  { t: "secao", numero: "13", titulo: "Proteção de Dados Pessoais" },
  {
    t: "p",
    prefixo: "13.1.",
    texto:
      "A VENDEDORA tratará os dados pessoais do(a) COMPRADOR(A), do TITULAR DO CARTÃO e de " +
      "eventuais representantes para as finalidades necessárias à pré-reserva, compra e venda, " +
      "pagamento, emissão de nota fiscal, prevenção a fraude, cumprimento de obrigações legais e " +
      "exercício regular de direitos, observada a legislação de proteção de dados.",
  },
  {
    t: "p",
    prefixo: "13.2.",
    texto:
      "Poderão ser compartilhados os dados estritamente necessários com prestadores de " +
      "processamento de pagamentos por cartão, empresas de entrega, fornecedores, sistemas de " +
      "emissão fiscal, assessorias jurídicas e contábeis e autoridades públicas, conforme as " +
      "finalidades e bases legais aplicáveis.",
  },
  {
    t: "p",
    prefixo: "13.3.",
    texto:
      "Os dados serão armazenados pelo tempo necessário ao cumprimento das finalidades contratuais, " +
      "legais, regulatórias e de defesa de direitos.",
  },
  {
    t: "p",
    prefixo: "13.4.",
    texto:
      "Os titulares poderão solicitar informações, acesso, correção, atualização ou exercer outros " +
      "direitos previstos na Lei nº 13.709/2018.",
  },

  { t: "secao", numero: "14", titulo: "Comunicações, Documentos e Assinatura Eletrônica" },
  {
    t: "p",
    prefixo: "14.1.",
    texto:
      "As partes reconhecem como válidas as comunicações realizadas por WhatsApp, e-mail, " +
      "mensagens em redes sociais, plataformas de pagamento, assinatura eletrônica e demais canais " +
      "utilizados na negociação, desde que seja possível identificar sua origem, conteúdo e " +
      "vinculação com a presente contratação.",
  },
  {
    t: "p",
    prefixo: "14.2.",
    texto:
      "Propostas, conversas, comprovantes de pagamento, fotografias, vídeos, laudos, documentos, " +
      "registros de IMEI, autorizações e anexos encaminhados pelos canais eletrônicos poderão " +
      "integrar o conjunto probatório da contratação, observada a legislação aplicável.",
  },
  {
    t: "p",
    prefixo: "14.3.",
    texto:
      "Este contrato poderá ser assinado fisicamente ou por meio eletrônico, inclusive por " +
      "plataformas de assinatura digital, aceite eletrônico, confirmação por mensagem ou outro " +
      "mecanismo juridicamente idôneo.",
  },
  {
    t: "p",
    prefixo: "14.4.",
    texto:
      "A assinatura eletrônica, simples ou avançada, será considerada válida entre as partes quando " +
      "permitir a identificação do signatário e demonstrar sua manifestação de vontade, nos termos " +
      "da legislação aplicável.",
  },

  { t: "secao", numero: "15", titulo: "Disposições Finais e Foro" },
  {
    t: "p",
    prefixo: "15.1.",
    texto:
      "Este contrato é regido pelas leis brasileiras, especialmente pelo Código de Defesa do " +
      "Consumidor, Código Civil, Lei Geral de Proteção de Dados e demais normas aplicáveis.",
  },
  {
    t: "p",
    prefixo: "15.2.",
    texto:
      "A nulidade ou inexigibilidade de uma cláusula não prejudicará as demais disposições " +
      "contratuais.",
  },
  {
    t: "p",
    prefixo: "15.3.",
    texto: "Eventual tolerância de uma parte não representará renúncia de direito ou novação.",
  },
  {
    t: "p",
    prefixo: "15.4.",
    texto: "As partes buscarão resolver eventuais divergências de forma amigável e extrajudicial.",
  },
  {
    t: "p",
    prefixo: "15.5.",
    texto:
      "Fica preservado o direito do consumidor de propor ação perante o foro competente de seu " +
      "domicílio, quando aplicável, sem eleição exclusiva de foro que dificulte sua defesa.",
  },

  { t: "espaco", altura: 4 },
  { t: "p", texto: "Local: {{local}} Data: {{data_fechamento}}" },
  { t: "espaco", altura: 8 },
  {
    t: "assinaturas",
    colunas: [
      {
        titulo: "VENDEDOR(A)",
        linhas: [
          "Razão social: {{loja_razao_social}}",
          "CNPJ: {{loja_cnpj}}",
          "Representante: {{loja_representante}}",
        ],
      },
      {
        titulo: "COMPRADOR(A)",
        linhas: ["Nome: {{comprador_nome}}", "CPF: {{comprador_cpf}}"],
      },
    ],
  },
  { t: "espaco", altura: 4 },
  {
    t: "p",
    texto:
      "Titular do cartão, se diferente do(a) COMPRADOR(A): assinatura _______________________ " +
      "Nome {{titular_nome}} CPF {{titular_cpf}}",
  },
  { t: "espaco", altura: 8 },
  {
    t: "assinaturas",
    colunas: [
      {
        titulo: "Testemunha 1",
        linhas: ["Nome {{testemunha1_nome}}", "CPF {{testemunha1_cpf}}"],
      },
      {
        titulo: "Testemunha 2",
        linhas: ["Nome {{testemunha2_nome}}", "CPF {{testemunha2_cpf}}"],
      },
    ],
  },

  { t: "quebraPagina" },
  { t: "secao", numero: "Anexo 1", titulo: "Condições de Pagamento" },
  { t: "rotulo", texto: "Identificação da Operação" },
  {
    t: "grade",
    linhas: [
      ["Produto: iPhone 18", "Versão/modelo: {{produto_versao}}"],
      ["Capacidade: {{produto_capacidade}}", "Cor: {{produto_cor}}"],
      ["Preço total da compra: R$ {{preco_total}}", "Valor do sinal: R$ {{sinal_valor}}"],
      ["Data do pagamento: {{sinal_data}}", ""],
    ],
  },
  {
    t: "p",
    texto:
      "Despesas específicas previamente informadas para eventual desistência imotivada presencial " +
      "(Cláusula 9.4): {{despesas_descricao}} Valor estimado: R$ {{despesas_valor}}. Se não houver, " +
      "escrever “nenhuma”.",
  },
  { t: "rotulo", texto: "Composição do preço" },
  {
    t: "grade",
    linhas: [
      ["Sinal/adiantamento pago à loja: R$ {{comp_sinal}}", "Forma/data: {{comp_sinal_detalhe}}"],
      ["Crédito de aparelho usado (Anexo II): R$ {{comp_usado}}", "{{comp_usado_tipo}}"],
      [
        "Pagamento à vista por Pix/dinheiro/transferência: R$ {{comp_vista}}",
        "Forma/data: {{comp_vista_detalhe}}",
      ],
      [
        "Pagamento em cartão de débito: R$ {{comp_debito}}",
        "Titular/data: {{comp_debito_detalhe}}",
      ],
      [
        "Pagamento em cartão de crédito: R$ {{comp_credito}}",
        "Titular/parcelas: {{comp_credito_detalhe}}",
      ],
      ["Saldo a pagar: R$ {{comp_saldo}}", "Forma/data combinadas: {{comp_saldo_detalhe}}"],
    ],
  },
  { t: "rotulo", texto: "Pagamento Por Cartão, Quando Aplicável" },
  {
    t: "grade",
    linhas: [
      ["Tipo: {{cartao_tipo}}", "Valor da transação: R$ {{cartao_valor}}"],
      ["Data: {{cartao_data}}", ""],
      ["Se parcelado: {{cartao_parcelas}} parcelas de R$ {{cartao_parcela_valor}}", ""],
      [
        "Total no cartão: R$ {{cartao_total}}",
        "Diferença em relação ao preço à vista: R$ {{cartao_diferenca}}",
      ],
      ["Titular: {{cartao_titular}}", "Últimos 4 dígitos do cartão: {{cartao_ultimos4}}"],
      ["Comprovante/código da transação: {{cartao_comprovante}}", ""],
    ],
  },
  {
    t: "p",
    texto:
      "O preço total e, quando houver, a quantidade e o valor das parcelas devem ser informados e " +
      "aceitos antes da transação. Não registrar neste contrato o número completo do cartão, a " +
      "senha ou o código de segurança.",
  },
  { t: "rotulo", texto: "Responsável Pelo Pagamento" },
  { t: "p", texto: "{{responsavel_pagamento}}" },

  { t: "quebraPagina" },
  { t: "secao", numero: "Anexo 2", titulo: "Avaliação e Recebimento de Aparelho Usado" },
  {
    t: "p",
    texto: "Preencher somente quando um aparelho usado for oferecido como parte do pagamento.",
  },
  { t: "rotulo", texto: "Identificação" },
  {
    t: "grade",
    linhas: [
      ["Marca/modelo: {{usado_marca_modelo}}", "Cor/capacidade: {{usado_cor_capacidade}}"],
      ["IMEI 1: {{usado_imei1}}", "IMEI 2: {{usado_imei2}}"],
      ["Série: {{usado_serie}}", "Saúde da bateria (%): {{usado_bateria}}"],
      ["Acessórios/documentos recebidos: {{usado_acessorios}}", ""],
      [
        "Se o entregante não for o titular: nome {{usado_entregante_nome}}",
        "CPF {{usado_entregante_cpf}}",
      ],
      ["autorização/documento {{usado_entregante_autorizacao}}", ""],
    ],
  },
  { t: "rotulo", texto: "Condição e Histórico Informados" },
  {
    t: "grade",
    linhas: [
      ["Tela: {{usado_tela}}", "Carcaça: {{usado_carcaca}}"],
      ["Câmeras: {{usado_cameras}}", "Biometria: {{usado_biometria}}"],
      ["Carregamento: {{usado_carregamento}}", ""],
      ["Peças trocadas/reparos anteriores: {{usado_pecas}}", ""],
      ["Bloqueio de ativação, Apple ID/Buscar, MDM ou conta vinculada: {{usado_bloqueio}}", ""],
      [
        "Restrição IMEI, furto/roubo, alienação fiduciária, gravame, parcelas pendentes ou impedimento à transferência: {{usado_restricao}}",
        "",
      ],
      ["Danos e ressalvas, inclusive fotos anexadas/protocolo: {{usado_danos}}", ""],
    ],
  },
  { t: "rotulo", texto: "Avaliação E Guarda" },
  {
    t: "grade",
    linhas: [
      ["Valor: R$ {{usado_valor}}", "{{usado_valor_tipo}}"],
      ["Prazo de conferência: {{usado_prazo_inspecao}} dias úteis", ""],
      ["{{usado_guarda}}", ""],
      ["Entregue à VENDEDORA em {{usado_guarda_data}} às {{usado_guarda_hora}}", ""],
    ],
  },
  {
    t: "p",
    texto:
      "O(A) COMPRADOR(A) declara ser proprietário(a) ou possuidor(a) autorizado(a), que informou as " +
      "restrições acima, realizou backup quando possível, retirou contas e dados pessoais, e " +
      "autorizou apenas os testes necessários à avaliação. A VENDEDORA registrará qualquer " +
      "divergência, comunicará eventual revisão de valor e protegerá o aparelho e os dados durante " +
      "sua guarda.",
  },
  { t: "p", texto: "Local/data: {{local}} {{data_fechamento}}" },
  { t: "espaco", altura: 8 },
  {
    t: "assinaturas",
    colunas: [
      { titulo: "VENDEDORA", linhas: [] },
      { titulo: "COMPRADOR(A)", linhas: [] },
    ],
  },

  { t: "quebraPagina" },
  { t: "secao", numero: "Anexo 3", titulo: "Autorização do Titular do Cartão" },
  {
    t: "p",
    texto:
      "Preencher somente se o cartão utilizado pertencer a pessoa diferente do(a) COMPRADOR(A).",
  },
  {
    t: "p",
    texto:
      "Eu, {{titular_nome}}, CPF nº {{titular_cpf}}, documento nº {{titular_documento}}, contato " +
      "{{titular_contato}}, autorizo o pagamento por meu cartão de {{titular_tipo_cartao}} " +
      "referente à pré-reserva/compra do produto descrito no contrato entre a VENDEDORA " +
      "{{loja_razao_social}} e o(a) COMPRADOR(A) {{comprador_nome}}.",
  },
  {
    t: "grade",
    linhas: [
      [
        "Valor autorizado: R$ {{titular_valor_autorizado}}",
        "Administradora/emissor: {{titular_administradora}}",
      ],
      ["Últimos 4 dígitos do cartão: {{titular_ultimos4}}", ""],
      [
        "Se parcelado: {{titular_parcelas}} parcelas de R$ {{titular_parcela_valor}}",
        "Preço total no cartão: R$ {{titular_total}}",
      ],
      ["Código/comprovante da transação: {{titular_comprovante}}", ""],
    ],
  },
  {
    t: "p",
    texto:
      "Declaro conhecer e aceitar o preço total e, quando aplicável, as condições do parcelamento " +
      "acima, tendo recebido cópia deste anexo e do resumo de pagamento. A autorização somente " +
      "abrange a transação indicada e não transfere automaticamente a propriedade do aparelho para " +
      "o titular do cartão.",
  },
  {
    t: "p",
    texto:
      "Autorizo o tratamento dos dados estritamente necessários para análise, execução, prevenção a " +
      "fraude e cumprimento de obrigações legais, nos termos da LGPD.",
  },
  { t: "p", texto: "Local/data: {{local}} {{data_fechamento}}" },
  { t: "espaco", altura: 8 },
  {
    t: "assinaturas",
    colunas: [
      { titulo: "TITULAR DO CARTÃO", linhas: [] },
      { titulo: "VENDEDORA", linhas: [] },
    ],
  },
];

/** Anexo 4, gerado como PDF próprio no dia da entrega. */
export const DOCUMENTO_ENTREGA: BlocoDoc[] = [
  { t: "titulo", texto: TITULO_ENTREGA },
  { t: "rotulo", texto: "Identificação do Produto Entregue" },
  {
    t: "grade",
    linhas: [
      ["Produto: iPhone 18", "Versão/modelo: {{produto_versao}}"],
      ["Capacidade: {{produto_capacidade}}", "Cor: {{produto_cor}}"],
      ["Série: {{entrega_serie}}", ""],
      ["IMEI 1: {{entrega_imei1}}", "IMEI 2: {{entrega_imei2}}"],
      ["Nota fiscal nº: {{entrega_nota_fiscal}}", "Data de emissão: {{entrega_nf_data}}"],
      ["Valor: R$ {{entrega_nf_valor}}", ""],
    ],
  },
  { t: "rotulo", texto: "Condições da Entrega" },
  {
    t: "grade",
    linhas: [
      ["Caixa original entregue: {{entrega_caixa}}", "Lacre conferido íntegro: {{entrega_lacre}}"],
      ["Produto aberto na presença do(a) COMPRADOR(A), a seu pedido: {{entrega_aberto}}", ""],
      ["Acessórios conferidos: {{entrega_acessorios}}", ""],
      ["Migração de dados: {{entrega_migracao}}", ""],
      ["Forma: {{entrega_forma}}", "Custo de frete previamente informado: R$ {{entrega_frete}}"],
      [
        "Observações sobre embalagem, funcionamento, acessórios ou ressalvas: {{entrega_observacoes}}",
        "",
      ],
    ],
  },
  { t: "rotulo", texto: "Declaração de Recebimento" },
  {
    t: "p",
    texto:
      "Declaro ter recebido o aparelho acima identificado e a respectiva nota fiscal, conforme as " +
      "observações registradas. A conferência da entrega não afasta a garantia legal, a " +
      "responsabilidade dos fornecedores por vícios ocultos ou a Garantia Limitada Apple, quando " +
      "aplicável.",
  },
  {
    t: "p",
    texto: "Local/data e horário: {{entrega_local}} {{entrega_data}} {{entrega_hora}}",
  },
  { t: "espaco", altura: 10 },
  {
    t: "assinaturas",
    colunas: [
      { titulo: "VENDEDORA/RESPONSÁVEL PELA ENTREGA", linhas: [] },
      { titulo: "COMPRADOR(A)/RECEBEDOR(A)", linhas: [] },
    ],
  },
  { t: "espaco", altura: 4 },
  {
    t: "p",
    texto:
      "Se o recebedor for terceiro: nome {{recebedor_nome}} CPF {{recebedor_cpf}} autorização do(a) " +
      "comprador(a) {{recebedor_autorizacao}}.",
  },
  {
    t: "p",
    texto:
      "Material elaborado por Maués Advogados Associados e disponibilizado no evento Autorizado " +
      "Experience. Vedada a comercialização sem autorização, observada a Lei nº 9.610/1998.",
  },
];
