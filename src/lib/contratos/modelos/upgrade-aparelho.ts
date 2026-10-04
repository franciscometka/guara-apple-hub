import type { BlocoDoc } from "./tipos";

/**
 * Contrato de Upgrade de Aparelho Celular Apple.
 *
 * Texto transcrito integralmente do PDF original, sem resumo nem reescrita.
 * As lacunas do documento viraram marcadores {{campo}}.
 */

export const VERSAO = "2026-01";

export const TITULO = "Contrato de Upgrade de Aparelho Celular Apple";

export const DOCUMENTO: BlocoDoc[] = [
  { t: "titulo", texto: TITULO },

  {
    t: "p",
    texto:
      "Pelo presente instrumento particular, as partes abaixo identificadas ajustam a entrega de " +
      "aparelho usado como parte do preço de aquisição de aparelho Apple novo ou seminovo, nas " +
      "condições seguintes.",
  },

  { t: "secao", numero: "1", titulo: "Das Partes" },
  { t: "p", prefixo: "1.1.", texto: "VENDEDORA:" },
  {
    t: "grade",
    linhas: [
      ["Loja/razão social: {{loja_razao_social}}", ""],
      ["CNPJ: {{loja_cnpj}}", "Endereço: {{loja_endereco_simples}}"],
      ["Cidade/UF: {{loja_cidade_uf}}", "CEP: {{loja_cep}}"],
      ["neste ato representada por {{loja_representante}}, doravante denominada VENDEDORA.", ""],
    ],
  },
  { t: "p", prefixo: "1.2.", texto: "CONSUMIDOR:" },
  {
    t: "grade",
    linhas: [
      ["Nome Completo: {{consumidor_nome}}", ""],
      ["CPF nº {{consumidor_cpf}}", "documento de identidade nº {{consumidor_documento}}"],
      ["residente à {{consumidor_endereco}}", ""],
      ["telefone/WhatsApp {{consumidor_telefone}}, doravante denominado CONSUMIDOR.", ""],
    ],
  },
  {
    t: "p",
    prefixo: "1.3.",
    texto:
      "As comunicações sobre avaliação, entrega, cobrança e atendimento poderão ocorrer pelos " +
      "contatos acima indicados, mediante registro que permita identificar remetente, destinatário, " +
      "conteúdo e data. Cada parte informará a outra sobre alteração de seus dados de contato, sem " +
      "que a falta de atualização suprima direitos assegurados em lei.",
  },

  { t: "secao", numero: "2", titulo: "Do Objeto e da Identificação dos Aparelhos" },
  {
    t: "p",
    prefixo: "2.1.",
    texto:
      "O CONSUMIDOR entrega à VENDEDORA, como parte do pagamento, o aparelho identificado abaixo, " +
      "com os acessórios expressamente relacionados, pelo valor de avaliação pactuado após a " +
      "verificação prevista na Cláusula 5:",
  },
  { t: "rotulo", texto: "Aparelho de entrada" },
  {
    t: "grade",
    linhas: [
      ["Modelo: {{entrada_modelo}}", "Capacidade: {{entrada_capacidade}}"],
      ["cor: {{entrada_cor}}", "condição: {{entrada_condicao}}"],
      ["estado aparente: {{entrada_estado_aparente}}", ""],
      ["IMEI 1: {{entrada_imei1}}", "IMEI 2: {{entrada_imei2}}"],
      ["número de série: {{entrada_serie}}", ""],
      ["Acessórios: {{entrada_acessorios}}", ""],
      ["Valor de avaliação: R$ {{entrada_valor_avaliacao}}", ""],
    ],
  },
  {
    t: "p",
    prefixo: "2.2.",
    texto:
      "A VENDEDORA vende ao CONSUMIDOR o aparelho descrito abaixo, com informação prévia e clara " +
      "sobre sua condição, características e eventuais sinais de uso ou reparos informados ao " +
      "consumidor:",
  },
  { t: "rotulo", texto: "Aparelho adquirido" },
  {
    t: "grade",
    linhas: [
      ["Modelo: {{adquirido_modelo}}", "Capacidade: {{adquirido_capacidade}}"],
      ["cor: {{adquirido_cor}}", "condição: {{adquirido_condicao}}"],
      ["estado aparente: {{adquirido_estado_aparente}}", ""],
      ["IMEI 1: {{adquirido_imei1}}", "IMEI 2: {{adquirido_imei2}}"],
      ["número de série: {{adquirido_serie}}", ""],
      ["Estado de Conservação e acessórios: {{adquirido_conservacao}}", ""],
      ["Valor de venda: R$ {{adquirido_valor_venda}}", "Nota fiscal nº {{adquirido_nota_fiscal}}"],
    ],
  },
  {
    t: "p",
    prefixo: "2.3.",
    texto:
      "Havendo preenchimento da identificação ou da nota fiscal somente na entrega, esses dados " +
      "constarão de comprovante entregue ao CONSUMIDOR, que integrará este contrato.",
  },
  {
    t: "p",
    prefixo: "2.4.",
    texto:
      "O valor de avaliação do aparelho de entrada pressupõe as características e o estado " +
      "descritos neste instrumento e no registro de vistoria, inclusive tela, carcaça, câmeras, " +
      "conectores, bateria, peças substituídas e acessórios. Defeitos ou reparos conhecidos deverão " +
      "ser anotados de modo específico: {{entrada_defeitos_conhecidos}}. A avaliação inicial de " +
      "R$ {{entrada_valor_avaliacao}} somente se tornará definitiva após a aprovação prevista na " +
      "Cláusula 5.",
  },
  {
    t: "p",
    prefixo: "2.5.",
    texto:
      "O estado do aparelho adquirido, especialmente se seminovo, deverá ser descrito em " +
      "comprovante de entrega, com indicação do estado externo, funcionamento, capacidade da " +
      "bateria informada na avaliação, acessórios incluídos e eventuais reparos ou limitações " +
      "conhecidos. A ausência de registro específico não equivale a ciência ou aceitação de " +
      "defeitos pelo CONSUMIDOR.",
  },

  { t: "secao", numero: "3", titulo: "Do Preço e das Condições do Upgrade" },
  {
    t: "p",
    prefixo: "3.1.",
    texto:
      "Do preço de venda de R$ {{adquirido_valor_venda}}, será abatido R$ {{valor_abatido}}, pelo " +
      "aparelho de entrada, restando complemento de R$ {{valor_complemento}}. A soma do valor " +
      "abatido e do complemento deverá corresponder ao preço total de venda, ressalvados encargos " +
      "de crédito previamente informados na forma da lei.",
  },
  {
    t: "p",
    prefixo: "3.2.",
    texto:
      "O complemento será pago por {{complemento_meio}}, da seguinte forma: {{complemento_forma}} " +
      "e, se aplicável, {{parcelas_quantidade}} parcelas de R$ {{parcelas_valor}}, com vencimentos " +
      "em {{parcelas_vencimento}}, total a prazo de R$ {{parcelas_total}}, juros de " +
      "{{parcelas_juros}} ao {{parcelas_periodicidade}}, demais encargos de {{parcelas_encargos}}, " +
      "custo efetivo total de {{parcelas_cet}} e agente financiador {{parcelas_financiador}}. Se " +
      "não houver parcelamento, preencher “não se aplica”.",
  },
  {
    t: "p",
    prefixo: "3.3.",
    texto:
      "O aparelho adquirido será entregue em {{entrega_local}}, até {{entrega_prazo}}, acompanhado " +
      "de nota fiscal, comprovante de entrega e informações sobre garantia. Qualquer alteração de " +
      "prazo dependerá de comunicação ao CONSUMIDOR e observará os direitos legais diante de " +
      "eventual descumprimento da oferta.",
  },
  {
    t: "p",
    prefixo: "3.4.",
    texto:
      "Se o complemento for parcelado, as partes preencherão antes da assinatura todas as condições " +
      "financeiras da Cláusula 3.2, inclusive preço à vista, preço total a prazo, número e " +
      "vencimento das parcelas, taxas e encargos aplicáveis. Se houver crédito contratado com " +
      "terceiro, serão identificados o financiador, o instrumento próprio e a relação entre o " +
      "financiamento e esta compra, sem afastar os direitos assegurados ao CONSUMIDOR pela " +
      "legislação de consumo.",
  },
  {
    t: "p",
    prefixo: "3.5.",
    texto:
      "A entrega do aparelho adquirido ocorrerá após {{entrega_condicao}}, desde que essa condição " +
      "tenha sido informada antes da contratação. O pagamento do valor de entrada mediante " +
      "transferência do aparelho usado será lançado expressamente no comprovante da operação, " +
      "vedada cobrança em duplicidade.",
  },
  {
    t: "p",
    prefixo: "3.6.",
    texto:
      "Até a entrega efetiva do aparelho adquirido, a guarda e os riscos de perda ou dano do bem " +
      "permanecem com a VENDEDORA, ressalvadas as hipóteses legais. Se o prazo de entrega não for " +
      "cumprido, o CONSUMIDOR poderá exercer as alternativas previstas no Código de Defesa do " +
      "Consumidor, sem imposição unilateral de substituição por modelo diverso.",
  },
  {
    t: "p",
    prefixo: "3.7.",
    texto:
      "O inadimplemento de parcela será tratado conforme as condições financeiras expressamente " +
      "contratadas e a legislação aplicável, mediante informação clara dos valores cobrados. Não " +
      "haverá perda automática do valor atribuído ao aparelho de entrada nem afastamento de " +
      "restituições legalmente devidas em caso de resolução do negócio.",
  },

  { t: "secao", numero: "4", titulo: "Das Declarações do Consumidor" },
  {
    t: "p",
    prefixo: "4.1.",
    texto:
      "O CONSUMIDOR declara ser legítimo proprietário do aparelho entregue como entrada, com " +
      "poderes para aliená-lo, e que, na data da entrega, o bem está livre de ônus, financiamento " +
      "pendente, alienação fiduciária, reserva de domínio, penhora, disputa de titularidade, " +
      "bloqueio administrativo ou contratual, registro de furto/roubo e restrição de IMEI perante " +
      "operadoras, bases nacionais e internacionais consultáveis, inclusive GSMA, conforme o caso.",
  },
  {
    t: "p",
    prefixo: "4.2.",
    texto:
      "O CONSUMIDOR declara que realizou cópia dos dados que deseja preservar; apagou o conteúdo e " +
      "os ajustes de fábrica; desativou o Buscar iPhone/Find My e o Bloqueio de Ativação; " +
      "desvinculou a Conta Apple (Apple ID/iCloud), outras contas, eSIM e dispositivos associados; " +
      "e removeu chip físico, cartões e itens pessoais. Se algum procedimento ainda estiver " +
      "pendente, sua conclusão e a aprovação da verificação ocorrerão antes da assinatura e entrega " +
      "definitiva.",
  },
  {
    t: "p",
    prefixo: "4.3.",
    texto:
      "O CONSUMIDOR informará à VENDEDORA qualquer fato anterior à transferência que contrarie as " +
      "declarações desta cláusula, sem prejuízo de sua defesa e da apuração da origem e extensão de " +
      "eventual impedimento.",
  },
  {
    t: "p",
    prefixo: "4.4.",
    texto:
      "O CONSUMIDOR declara ter informado os defeitos, reparos, substituições de componentes, " +
      "quedas, contato com líquidos e ocorrências de bloqueio de que efetivamente tenha " +
      "conhecimento, conforme registro da Cláusula 2.4. A declaração refere-se a fatos conhecidos e " +
      "à situação do aparelho no momento da entrega, não abrangendo fatos supervenientes sem " +
      "vínculo demonstrado com sua conduta anterior.",
  },
  {
    t: "p",
    prefixo: "4.5.",
    texto:
      "Para documentar a procedência do bem, o CONSUMIDOR apresenta {{procedencia_documento}}. A " +
      "falta de comprovante, por si só, não altera as regras de prova nem autoriza a conclusão " +
      "automática de origem ilícita; caberá à VENDEDORA definir, antes da aceitação, se dispõe dos " +
      "elementos necessários para concluir a operação.",
  },

  { t: "secao", numero: "5", titulo: "Da Verificação Técnica e da Aceitação" },
  {
    t: "p",
    prefixo: "5.1.",
    texto:
      "Antes da assinatura e do abatimento definitivo, a VENDEDORA poderá verificar autenticidade, " +
      "identificação e procedência, funcionamento e integridade dos componentes, condições físicas, " +
      "capacidade, saúde da bateria, ativação, bloqueios de contas e restrições de IMEI, " +
      "preferencialmente com registro de testes e ressalvas no comprovante de avaliação.",
  },
  {
    t: "p",
    prefixo: "5.2.",
    texto:
      "Constatada, antes da aceitação definitiva, divergência objetiva e relevante entre o estado " +
      "verificado e as informações fornecidas, a VENDEDORA comunicará o resultado ao CONSUMIDOR e " +
      "poderá recusar o aparelho ou propor, por escrito, novo valor de avaliação. O CONSUMIDOR " +
      "poderá aceitar a proposta ou desistir da operação, com restituição do bem e dos valores " +
      "eventualmente pagos, respeitados os direitos assegurados pelo CDC.",
  },
  {
    t: "p",
    prefixo: "5.3.",
    texto:
      "Avaliação concluída em {{avaliacao_data}} as {{avaliacao_hora}}hrs. Resultado: " +
      "{{avaliacao_resultado}}. Ressalvas e testes: {{avaliacao_ressalvas}}. Valor definitivo " +
      "aceito: R$ {{avaliacao_valor_definitivo}}. Aparelho de entrada efetivamente entregue à " +
      "VENDEDORA em {{entrada_entregue_data}} as {{entrada_entregue_hora}}hrs.",
  },
  {
    t: "p",
    prefixo: "5.4.",
    texto:
      "O registro de avaliação deverá apontar, na medida em que os testes forem realizados, " +
      "identificação conferida, resultado da consulta de IMEI, funcionamento de tela e toque, " +
      "câmeras, áudio, botões, rede, conectividade, carregamento, integridade física, saúde da " +
      "bateria, componentes e desativação do Bloqueio de Ativação. Serão anexados, se disponíveis e " +
      "pertinentes, fotografias e comprovantes de consulta datados. Um campo não testado deverá ser " +
      "assinalado como “não verificado”, sem presunção de funcionamento.",
  },
  {
    t: "p",
    prefixo: "5.5.",
    texto:
      "Depois da aprovação definitiva e da transferência previstas neste contrato, a VENDEDORA não " +
      "poderá reduzir unilateralmente o valor aceito com fundamento em condição aparente ou " +
      "identificável na vistoria ordinária. Ocorrências posteriores serão tratadas segundo as " +
      "declarações prestadas, as provas disponíveis e as regras legais relativas a vícios e " +
      "direitos de terceiros, sem cobrança automática ao CONSUMIDOR.",
  },

  { t: "secao", numero: "6", titulo: "Das Garantias" },
  {
    t: "p",
    prefixo: "6.1.",
    texto:
      "O aparelho adquirido, novo ou seminovo, está sujeito à garantia legal aplicável a produto " +
      "durável, inclusive o prazo de 90 (noventa) dias para reclamar de vícios aparentes ou de " +
      "fácil constatação, contado da entrega, e às regras legais próprias para vícios ocultos. A " +
      "condição de seminovo, seu desgaste informado e o valor negociado não afastam os direitos " +
      "legais do CONSUMIDOR.",
  },
  {
    t: "p",
    prefixo: "6.2.",
    texto:
      "A garantia limitada Apple de 1 (um) ano, quando existente e vigente para o aparelho " +
      "adquirido, é prestada pela Apple conforme seus termos e contada da data da compra original " +
      "pelo usuário final, a ser verificada por {{garantia_verificacao}}. A VENDEDORA informará a " +
      "cobertura efetivamente confirmada na entrega e continuará responsável pelas obrigações que " +
      "lhe cabem como fornecedora perante o CONSUMIDOR, sem prejuízo dos direitos previstos no CDC. " +
      "Não se presume novo prazo de um ano da Apple na revenda de aparelho seminovo.",
  },
  {
    t: "p",
    prefixo: "6.3.",
    texto:
      "Eventual garantia contratual adicional oferecida pela VENDEDORA deverá constar de termo " +
      "escrito próprio, com prazo, cobertura e modo de acionamento, sem reduzir a garantia legal. " +
      "Quanto ao aparelho entregue como entrada, o CONSUMIDOR, na qualidade de alienante ocasional, " +
      "não concede garantia contratual adicional; permanecem aplicáveis as declarações de " +
      "titularidade e procedência e as responsabilidades previstas em lei.",
  },
  {
    t: "p",
    prefixo: "6.4.",
    texto:
      "Reclamações relativas ao aparelho adquirido poderão ser apresentadas à VENDEDORA pelo canal " +
      "{{canal_reclamacoes}}, com registro de protocolo, descrição do problema e comprovante de " +
      "recebimento do aparelho, quando necessária a análise técnica. A indicação de assistência " +
      "técnica ou da Apple não impede que o CONSUMIDOR procure a VENDEDORA para exercer os direitos " +
      "previstos no CDC.",
  },
  {
    t: "p",
    prefixo: "6.5.",
    texto:
      "Os sinais de uso e o desgaste compatíveis com a condição seminova, desde que previamente " +
      "informados e individualizados no comprovante de entrega, integram a descrição do bem " +
      "negociado. Essa ciência não representa renúncia a direitos por vícios não informados ou que " +
      "tornem o aparelho inadequado ao uso legitimamente esperado.",
  },

  { t: "secao", numero: "7", titulo: "Da Transferência da Propriedade e da Quitação" },
  {
    t: "p",
    prefixo: "7.1.",
    texto:
      "Concluída a verificação, aprovado o aparelho de entrada e ocorridas a assinatura deste " +
      "contrato e sua entrega física à VENDEDORA, a propriedade do bem de entrada transfere-se à " +
      "VENDEDORA, pelo valor de avaliação indicado na Cláusula 5. Na mesma ocasião, a VENDEDORA " +
      "reconhecerá por escrito o crédito de entrada aplicado ao preço do aparelho adquirido.",
  },
  {
    t: "p",
    prefixo: "7.2.",
    texto:
      "A VENDEDORA dará quitação do preço total somente após a confirmação do pagamento integral do " +
      "complemento. O CONSUMIDOR dará quitação da obrigação de entrega do aparelho adquirido quando " +
      "receber o bem conforme contratado. A quitação alcança apenas prestações efetivamente " +
      "cumpridas e não importa renúncia a garantia legal, vícios ocultos, direitos de terceiros ou " +
      "obrigações ainda pendentes.",
  },
  {
    t: "p",
    prefixo: "7.3.",
    texto:
      "A propriedade do aparelho adquirido será transferida ao CONSUMIDOR com sua efetiva entrega, " +
      "comprovada por {{transferencia_data}} as {{transferencia_hora}} hrs em " +
      "{{transferencia_local}}. O parcelamento do complemento, por si só, não configura reserva de " +
      "domínio ou autorização para recolhimento extrajudicial do aparelho; qualquer garantia real " +
      "ou mecanismo de retomada depende de pactuação específica válida e da observância da " +
      "legislação aplicável.",
  },
  {
    t: "p",
    prefixo: "7.4.",
    texto:
      "Se houver resolução desta operação, a restituição das prestações já cumpridas, inclusive o " +
      "valor econômico atribuído ao aparelho de entrada, observará o fundamento da resolução, o " +
      "estado dos bens e os direitos legais de ambas as partes. Se a restituição física do aparelho " +
      "usado se tornar impossível por ato da VENDEDORA, as partes apurarão a restituição pelo valor " +
      "de avaliação definitivo, sem prejuízo das consequências previstas em lei.",
  },

  { t: "secao", numero: "8", titulo: "Das Responsabilidade e dos Dados Pessoais" },
  {
    t: "p",
    prefixo: "8.1.",
    texto:
      "Cabe ao CONSUMIDOR providenciar cópia, exclusão e desvinculação dos dados e contas pessoais " +
      "antes da entrega. A VENDEDORA não responderá pela perda de dados que o CONSUMIDOR deixou de " +
      "copiar nem por acesso decorrente exclusivamente de sua omissão em apagar e desvincular o " +
      "aparelho, desde que a VENDEDORA não tenha contribuído para o dano. A VENDEDORA deverá adotar " +
      "medidas adequadas de segurança, sigilo e tratamento dos dados a que eventualmente tiver " +
      "acesso, nos termos da legislação aplicável.",
  },
  {
    t: "p",
    prefixo: "8.2.",
    texto:
      "A avaliação aprovada não gera responsabilidade automática do CONSUMIDOR por vícios ocultos " +
      "que ele não conhecia e que não eram identificáveis em exame técnico ordinário, observada a " +
      "legislação civil aplicável. Permanecem sua responsabilidade por dolo, informação sabidamente " +
      "falsa e vícios ou restrições de que tinha conhecimento e omitiu, bem como os direitos legais " +
      "da VENDEDORA diante de evicção ou defeito juridicamente relevante, mediante comprovação e " +
      "oportunidade de manifestação do CONSUMIDOR.",
  },
  {
    t: "p",
    prefixo: "8.3.",
    texto:
      "Nenhuma disposição deste instrumento exclui ou restringe a responsabilidade legal da " +
      "VENDEDORA perante o CONSUMIDOR pelo aparelho adquirido ou pelos serviços que prestar.",
  },
  {
    t: "p",
    prefixo: "8.4.",
    texto:
      "Se, após a transferência, surgir registro de furto, roubo, bloqueio ou reivindicação de " +
      "terceiro referente ao aparelho de entrada, a VENDEDORA comunicará ao CONSUMIDOR, por " +
      "escrito, o identificador afetado, a data, a fonte da informação e os documentos disponíveis, " +
      "concedendo-lhe {{prazo_esclarecimentos}} dias úteis, para apresentar esclarecimentos e " +
      "comprovantes. A eventual responsabilização dependerá da verificação do fato, de sua relação " +
      "com situação anterior à transferência e dos pressupostos legais; esta cláusula não autoriza " +
      "desconto, multa ou cobrança automática.",
  },
  {
    t: "p",
    prefixo: "8.5.",
    texto:
      "A VENDEDORA utilizará os dados pessoais recebidos para formalizar a operação, emitir " +
      "documentos fiscais, cumprir obrigações legais, prestar atendimento e exercer direitos " +
      "relacionados ao contrato, com acesso limitado ao necessário e medidas adequadas de proteção. " +
      "Se encontrar dados residuais no aparelho de entrada, deverá evitar acesso desnecessário, " +
      "impedir compartilhamento indevido e adotar providências seguras para sua eliminação, " +
      "conforme a legislação aplicável.",
  },

  { t: "secao", numero: "9", titulo: "Das Disposições Gerais e do Foro" },
  {
    t: "p",
    prefixo: "9.1.",
    texto:
      "Integram este contrato a nota fiscal, o comprovante de avaliação e entrega, o registro das " +
      "condições do aparelho adquirido e eventual termo escrito de garantia adicional. Alterações " +
      "dependem de ajuste expresso entre as partes, sem prejuízo dos direitos legais do CONSUMIDOR.",
  },
  {
    t: "p",
    prefixo: "9.2.",
    texto:
      "Para dirimir controvérsias, fica eleito o foro do domicílio do CONSUMIDOR, ressalvada a " +
      "possibilidade de este optar por outro foro legalmente competente que lhe seja mais " +
      "favorável.",
  },
  {
    t: "p",
    prefixo: "9.3.",
    texto:
      "O presente instrumento é firmado em 2 vias de igual teor, físicas ou eletrônicas, recebendo " +
      "cada parte uma cópia integral, com seus anexos.",
  },
  {
    t: "p",
    prefixo: "9.4.",
    texto:
      "Nas contratações realizadas fora do estabelecimento comercial, inclusive quando aplicável " +
      "por meio eletrônico, ficam preservadas as regras legais de arrependimento e de restituição " +
      "dos valores pagos, inclusive a forma de recomposição do crédito atribuído ao aparelho de " +
      "entrada. Nas operações presenciais, eventuais políticas comerciais de troca ou desistência " +
      "deverão ser informadas por escrito e não afastam garantias legais.",
  },
  {
    t: "p",
    prefixo: "9.5.",
    texto:
      "A eventual invalidade de uma disposição específica não prejudicará as demais cláusulas que " +
      "possam produzir efeitos de forma autônoma, observada a interpretação mais favorável ao " +
      "CONSUMIDOR nos termos da legislação de consumo. As partes reconhecem que receberam acesso ao " +
      "inteiro teor deste instrumento antes da assinatura.",
  },

  { t: "espaco", altura: 4 },
  { t: "p", texto: "Cidade: {{cidade}} UF: {{uf}}, {{data_fechamento}}." },
  { t: "espaco", altura: 8 },

  {
    t: "assinaturas",
    colunas: [
      {
        titulo: "Vendedor(a)/Razão Social: {{loja_razao_social}}",
        linhas: ["Representante: {{loja_representante}}"],
      },
      {
        titulo: "Consumidor: {{consumidor_nome}}",
        linhas: ["CPF: {{consumidor_cpf}}"],
      },
    ],
  },
  { t: "espaco", altura: 10 },
  {
    t: "assinaturas",
    colunas: [
      { titulo: "Testemunha 1: {{testemunha1_nome}}", linhas: ["CPF: {{testemunha1_cpf}}"] },
      { titulo: "Testemunha 2: {{testemunha2_nome}}", linhas: ["CPF: {{testemunha2_cpf}}"] },
    ],
  },

  { t: "quebraPagina" },
  { t: "secao", numero: "Anexo 1", titulo: "Registro de Avaliação e Entrega" },
  {
    t: "p",
    texto:
      "Este registro integra o contrato de upgrade firmado em {{data_fechamento}} entre VENDEDORA e " +
      "CONSUMIDOR. Os campos devem refletir a verificação efetivamente realizada, sem presumir " +
      "aprovação dos itens não testados.",
  },

  { t: "rotulo", texto: "Aparelho recebido como entrada" },
  {
    t: "grade",
    linhas: [
      ["Modelo: {{entrada_modelo}}", "Capacidade: {{entrada_capacidade}}"],
      ["cor: {{entrada_cor}}", "condição: {{entrada_condicao}}"],
      ["estado aparente: {{entrada_estado_aparente}}", ""],
      ["IMEI 1: {{entrada_imei1}}", "IMEI 2: {{entrada_imei2}}"],
      ["número de série: {{entrada_serie}}", ""],
    ],
  },
  {
    t: "grade",
    linhas: [
      ["Estado externo — Tela: {{anexo_estado_tela}}", "carcaça: {{anexo_estado_carcaca}}"],
      ["lentes: {{anexo_estado_lentes}}", "sinais de uso ou dano: {{anexo_sinais_uso}}"],
      ["fotos anexas: {{anexo_fotos}}", ""],
    ],
  },
  {
    t: "grade",
    linhas: [
      [
        "Testes executados — Tela e toque: {{anexo_teste_tela}}",
        "câmeras: {{anexo_teste_cameras}}",
      ],
      ["áudio: {{anexo_teste_audio}}", "botões: {{anexo_teste_botoes}}"],
      ["Wi-Fi/rede: {{anexo_teste_rede}}", "carregamento: {{anexo_teste_carregamento}}"],
      ["Face ID/Touch ID: {{anexo_teste_biometria}}", "outros: {{anexo_teste_outros}}"],
    ],
  },
  {
    t: "grade",
    linhas: [
      [
        "Bateria e peças — Saúde da bateria: {{anexo_bateria}}%",
        "mensagens sobre peças: {{anexo_mensagens_pecas}}",
      ],
      [
        "reparos informados: {{anexo_reparos_informados}}",
        "itens não verificados: {{anexo_nao_verificados}}",
      ],
    ],
  },
  {
    t: "grade",
    linhas: [
      ["Bloqueios e contas — IMEI consultado em: {{anexo_imei_consultado_onde}}", ""],
      ["em {{anexo_imei_consultado_data}} as {{anexo_imei_consultado_hora}}hrs", ""],
      ["Resultado: {{anexo_imei_resultado}}", "Buscar/Find My: {{anexo_find_my}}"],
      ["Conta Apple: {{anexo_conta_apple}}", "reset: {{anexo_reset}}"],
    ],
  },
  {
    t: "grade",
    linhas: [
      ["Resultado: {{anexo_resultado}}", "valor preliminar R$ {{anexo_valor_preliminar}}"],
      [
        "valor definitivo R$ {{avaliacao_valor_definitivo}}",
        "ressalvas: {{anexo_resultado_ressalvas}}",
      ],
      ["data/hora do recebimento {{entrada_entregue_data}} as {{entrada_entregue_hora}}hrs", ""],
    ],
  },

  { t: "rotulo", texto: "Aparelho entregue ao consumidor" },
  {
    t: "grade",
    linhas: [
      ["Modelo: {{adquirido_modelo}}", "Capacidade: {{adquirido_capacidade}}"],
      ["cor: {{adquirido_cor}}", "condição: {{adquirido_condicao}}"],
      ["estado aparente: {{adquirido_estado_aparente}}", ""],
      ["IMEI 1: {{adquirido_imei1}}", "IMEI 2: {{adquirido_imei2}}"],
      ["número de série: {{adquirido_serie}}", ""],
    ],
  },
  {
    t: "grade",
    linhas: [
      [
        "Estado e itens — Estado físico: {{anexo_saida_estado}}",
        "saúde da bateria, se informada: {{anexo_saida_bateria}}",
      ],
      ["acessórios: {{anexo_saida_acessorios}}", ""],
      ["reparos e limitações informados: {{anexo_saida_limitacoes}}", ""],
    ],
  },
  {
    t: "grade",
    linhas: [
      ["Documentos — Nota fiscal nº {{adquirido_nota_fiscal}}", "emissão: {{anexo_nf_emissao}}"],
      ["garantia Apple verificada até: {{anexo_garantia_ate}}", ""],
      ["termo adicional da loja: {{anexo_termo_adicional}}", ""],
    ],
  },
  {
    t: "grade",
    linhas: [
      ["Entrega — Data {{transferencia_data}}", "hora {{transferencia_hora}}"],
      ["local: {{transferencia_local}}", ""],
      ["valor de entrada creditado R$ {{valor_abatido}}", ""],
      ["complemento pago R$ {{anexo_complemento_pago}}", "saldo a pagar R$ {{anexo_saldo_pagar}}"],
    ],
  },
  { t: "espaco" },
  {
    t: "p",
    texto:
      "As partes confirmam que receberam cópia deste registro e que as informações preenchidas " +
      "correspondem aos testes efetivamente realizados e aos bens entregues nesta operação.",
  },
  { t: "espaco", altura: 10 },
  {
    t: "assinaturas",
    colunas: [
      { titulo: "VENDEDOR(A)", linhas: [] },
      { titulo: "CONSUMIDOR: {{consumidor_nome}}", linhas: [] },
    ],
  },
];
