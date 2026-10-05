import type { BlocoDoc } from "./tipos";

/**
 * Termo de Garantia de Aparelho Celular Novo.
 *
 * Texto transcrito integralmente do PDF original, sem resumo nem reescrita.
 * As lacunas do documento viraram marcadores {{campo}}.
 *
 * Qualquer alteração neste texto exige subir VERSAO — contratos já emitidos
 * continuam guardando a versão com que foram gerados.
 */

export const VERSAO = "2026-01";

export const TITULO = "Termo de Garantia de Aparelho Celular Novo";

export const DOCUMENTO: BlocoDoc[] = [
  { t: "titulo", texto: TITULO },

  {
    t: "p",
    prefixo: "EMPRESA RESPONSÁVEL:",
    texto:
      "{{loja_razao_social}}, pessoa jurídica de direito privado, inscrita no " +
      "CNPJ sob nº {{loja_cnpj}}, com sede na {{loja_endereco}}, neste ato representada na forma " +
      "de seus atos constitutivos, doravante denominada simplesmente EMPRESA.",
  },
  {
    t: "p",
    prefixo: "CLIENTE/CONSUMIDOR:",
    texto:
      "{{cliente_nome}}, {{cliente_nacionalidade}}, {{cliente_estado_civil}}, " +
      "{{cliente_profissao}}, inscrito(a) no CPF sob nº " +
      "{{cliente_cpf}}, residente e domiciliado(a) na {{cliente_endereco}}, " +
      "doravante denominado(a) simplesmente CLIENTE.",
  },

  { t: "rotulo", texto: "DADOS DO APARELHO" },
  {
    t: "grade",
    linhas: [
      ["Marca: {{aparelho_marca}}", "Modelo: {{aparelho_modelo}}"],
      ["IMEI 1: {{imei1}}", "IMEI 2: {{imei2}}"],
      ["Número de série: {{serie}}", "Número da ordem de serviço: {{ordem_servico}}"],
      ["Data da compra: {{data_compra}}", "Nota fiscal nº: {{nota_fiscal}}"],
    ],
  },
  { t: "espaco" },

  {
    t: "p",
    texto:
      "O presente Termo de Garantia estabelece as condições aplicáveis à garantia legal e, quando " +
      "expressamente indicada, à garantia contratual concedida pela EMPRESA em relação ao aparelho " +
      "celular acima identificado, adquirido pelo CLIENTE, sem prejuízo dos direitos assegurados " +
      "pela legislação consumerista, especialmente pela Lei nº 8.078/1990 – Código de Defesa do " +
      "Consumidor.",
  },

  { t: "secao", numero: "1", titulo: "Da Garantia" },
  {
    t: "p",
    prefixo: "1.1.",
    texto:
      "O aparelho celular objeto deste Termo possui garantia pelo prazo e nas condições previstas " +
      "na legislação aplicável, observadas, ainda, as condições específicas eventualmente " +
      "estabelecidas pelo fabricante do produto.",
  },
  {
    t: "p",
    prefixo: "1.2.",
    texto:
      "O aparelho novo poderá contar com a Garantia Limitada de Um Ano oferecida pela Apple, quando " +
      "aplicável, conforme os termos da fabricante, contada da data da compra pelo usuário final. " +
      "Essa garantia é oferecida pela Apple e não constitui garantia contratual de 12 (doze) meses " +
      "concedida pela EMPRESA. Eventual garantia contratual adicional da EMPRESA dependerá de " +
      "concessão expressa em documento próprio, com indicação de seu prazo e condições, " +
      "permanecendo íntegra a responsabilidade legal dos fornecedores.",
  },
  {
    t: "p",
    prefixo: "1.3.",
    texto:
      "A garantia tem por finalidade assegurar a reparação de vícios ou defeitos de fabricação que " +
      "comprometam o funcionamento regular do aparelho e que não sejam decorrentes de utilização " +
      "inadequada, acidentes, alterações, intervenções de terceiros ou outras situações não " +
      "abrangidas pela garantia.",
  },
  {
    t: "p",
    prefixo: "1.4.",
    texto:
      "A garantia legal prevista no Código de Defesa do Consumidor permanece integralmente " +
      "preservada, não podendo o presente Termo restringir, afastar ou reduzir direitos " +
      "assegurados ao consumidor pela legislação vigente.",
  },

  { t: "secao", numero: "2", titulo: "Da Cobertura" },
  {
    t: "p",
    prefixo: "2.1.",
    texto:
      "A garantia abrangerá os vícios ou defeitos de fabricação existentes no aparelho e que se " +
      "manifestem durante o respectivo prazo de garantia, desde que constatado, mediante avaliação " +
      "técnica adequada, que o problema apresentado não decorre de causa externa, mau uso ou " +
      "qualquer das situações não abrangidas pela garantia.",
  },
  {
    t: "p",
    prefixo: "2.2.",
    texto:
      "Poderão ser abrangidos pela garantia, conforme a natureza do defeito constatado, componentes " +
      "internos do aparelho, placa principal, componentes eletrônicos, sistema de carregamento, " +
      "tela e demais componentes que apresentem defeito decorrente de falha de fabricação, " +
      "observadas as condições técnicas do produto e a cobertura efetivamente aplicável.",
  },
  {
    t: "p",
    prefixo: "2.3.",
    texto:
      "Também poderão ser abrangidos problemas relacionados ao funcionamento do software original " +
      "instalado no aparelho quando constatado que a falha decorre de defeito de fabricação ou de " +
      "funcionamento do próprio produto, não sendo abrangidos problemas decorrentes de aplicativos " +
      "de terceiros, modificações do sistema operacional, instalações inadequadas, desbloqueios, " +
      "alterações de software ou procedimentos realizados fora das especificações do fabricante.",
  },
  {
    t: "p",
    prefixo: "2.4.",
    texto:
      "Problemas de conectividade, incluindo falhas relacionadas a Wi-Fi, Bluetooth, rede móvel ou " +
      "demais funcionalidades de comunicação, poderão ser abrangidos quando comprovadamente " +
      "decorrentes de defeito de fabricação do aparelho.",
  },
  {
    t: "p",
    prefixo: "2.5.",
    texto:
      "A cobertura da garantia estará sempre condicionada à constatação técnica da origem do " +
      "problema apresentado, não sendo suficiente, por si só, a mera manifestação de falha pelo " +
      "aparelho para caracterizar a existência de defeito coberto.",
  },

  { t: "secao", numero: "3", titulo: "Das Situações Não Abrangidas Pela Garantia" },
  {
    t: "p",
    prefixo: "3.1.",
    texto:
      "Não serão abrangidos pela garantia os danos ou defeitos decorrentes de utilização inadequada " +
      "do aparelho, acidentes, quedas, impactos, pressão excessiva, contato com líquidos ou " +
      "umidade, exposição a temperaturas extremas, infiltração de água, oxidação, corrosão, " +
      "descarga elétrica, surtos de energia ou outras causas externas que não decorram de defeito " +
      "de fabricação.",
  },
  {
    t: "p",
    prefixo: "3.2.",
    texto:
      "Também não serão abrangidos danos provocados pela utilização do aparelho em desacordo com as " +
      "orientações do fabricante, inclusive quando houver utilização de carregadores, cabos, fontes " +
      "de alimentação, baterias, acessórios ou componentes incompatíveis ou inadequados, desde que " +
      "comprovada a relação entre sua utilização e o defeito apresentado.",
  },
  {
    t: "p",
    prefixo: "3.3.",
    texto:
      "Não serão abrangidos pela garantia os aparelhos que tenham sido submetidos a abertura, " +
      "desmontagem, reparo, manutenção, modificação ou intervenção técnica realizada por pessoa ou " +
      "estabelecimento não autorizado, quando tal intervenção estiver relacionada ao defeito " +
      "reclamado ou tiver contribuído para sua ocorrência.",
  },
  {
    t: "p",
    prefixo: "3.4.",
    texto:
      "Da mesma forma, não serão abrangidos defeitos decorrentes de alterações físicas ou " +
      "eletrônicas realizadas no aparelho, instalação de softwares não autorizados, modificações do " +
      "sistema operacional, procedimentos de desbloqueio, alteração de componentes, remoção ou " +
      "adulteração de elementos de identificação ou qualquer intervenção que comprometa a " +
      "configuração ou integridade original do produto, quando houver nexo entre a intervenção " +
      "realizada e o problema apresentado.",
  },
  {
    t: "p",
    prefixo: "3.5.",
    texto:
      "Não estão abrangidos pela garantia os danos meramente estéticos decorrentes do uso cotidiano, " +
      "tais como riscos, marcas, amassados, manchas, desgastes externos ou alterações de aparência " +
      "que não comprometam o funcionamento regular do aparelho.",
  },
  {
    t: "p",
    prefixo: "3.6.",
    texto:
      "O desgaste natural decorrente do uso regular do aparelho também não será considerado, por si " +
      "só, vício ou defeito de fabricação, especialmente quando relacionado à redução natural da " +
      "capacidade de componentes sujeitos a desgaste, observadas as características técnicas do " +
      "produto e os direitos previstos na legislação aplicável.",
  },
  {
    t: "p",
    prefixo: "3.7.",
    texto:
      "A perda, exclusão ou corrupção de dados, arquivos, fotografias, vídeos, contatos, aplicativos " +
      "ou demais informações armazenadas no aparelho não será de responsabilidade da EMPRESA quando " +
      "decorrente de procedimento de reparo, restauração ou substituição legitimamente realizado. " +
      "Compete ao CLIENTE manter cópia de segurança de seus dados antes do encaminhamento do " +
      "aparelho para avaliação ou reparo, sempre que isso for tecnicamente possível.",
  },
  {
    t: "p",
    prefixo: "3.8.",
    texto:
      "As exclusões previstas neste Termo não serão aplicadas quando a avaliação técnica demonstrar " +
      "que o problema apresentado decorre de vício ou defeito abrangido pela garantia, ainda que o " +
      "aparelho apresente simultaneamente sinais externos de utilização, desde que tais sinais não " +
      "tenham relação causal com o defeito reclamado.",
  },

  { t: "secao", numero: "4", titulo: "Do Procedimento Para Acionamento da Garantia" },
  {
    t: "p",
    prefixo: "4.1.",
    texto:
      "Para solicitar o atendimento em garantia, o CLIENTE deverá entrar em contato com a EMPRESA " +
      "pelos canais oficiais disponibilizados e apresentar as informações necessárias à " +
      "identificação da compra e do aparelho, incluindo, quando solicitado, nota fiscal, " +
      "comprovante de aquisição, número de série, IMEI e este Termo de Garantia.",
  },
  {
    t: "p",
    prefixo: "4.2.",
    texto:
      "O aparelho poderá ser encaminhado para avaliação técnica, diretamente pela EMPRESA ou por " +
      "assistência técnica por ela indicada ou autorizada, a fim de que seja identificada a origem " +
      "do problema apresentado e determinada a existência ou não de cobertura pela garantia.",
  },
  {
    t: "p",
    prefixo: "4.3.",
    texto:
      "O CLIENTE deverá disponibilizar o aparelho para avaliação em condições adequadas, permitindo " +
      "a realização dos testes técnicos necessários à identificação do defeito.",
  },
  {
    t: "p",
    prefixo: "4.4.",
    texto:
      "Durante a avaliação, poderão ser realizados procedimentos técnicos destinados à identificação " +
      "da causa do problema, inclusive testes de funcionamento, diagnóstico de componentes, " +
      "restauração do sistema e demais procedimentos tecnicamente necessários, observadas as " +
      "limitações e orientações do fabricante.",
  },
  {
    t: "p",
    prefixo: "4.5.",
    texto:
      "Constatado que o problema apresentado está abrangido pela garantia, serão adotadas as " +
      "providências necessárias para sanar o vício ou defeito, observados os prazos e as " +
      "alternativas estabelecidos pela legislação aplicável.",
  },
  {
    t: "p",
    prefixo: "4.6.",
    texto:
      "Caso seja constatado que o problema não está abrangido pela garantia, a EMPRESA comunicará o " +
      "CLIENTE acerca da conclusão da avaliação e, quando aplicável, poderá apresentar orçamento " +
      "para realização do reparo mediante prévia autorização.",
  },
  {
    t: "p",
    prefixo: "4.7.",
    texto:
      "A realização de reparo não coberto pela garantia dependerá de autorização prévia do CLIENTE, " +
      "não podendo ser realizado serviço oneroso sem sua anuência.",
  },

  { t: "secao", numero: "5", titulo: "Da Avaliação Técnica" },
  {
    t: "p",
    prefixo: "5.1.",
    texto:
      "A avaliação técnica será realizada por profissional ou estabelecimento tecnicamente " +
      "habilitado, podendo a EMPRESA solicitar informações, fotografias, vídeos ou outros elementos " +
      "necessários à análise preliminar do problema relatado.",
  },
  {
    t: "p",
    prefixo: "5.2.",
    texto:
      "A existência de marcas de queda, contato com líquido, oxidação, quebra, trincas ou outras " +
      "avarias externas não determinará automaticamente a perda da garantia, devendo ser analisada " +
      "a relação entre a avaria identificada e o defeito reclamado, sempre que tecnicamente " +
      "possível.",
  },
  {
    t: "p",
    prefixo: "5.3.",
    texto:
      "Da mesma forma, a ausência de sinais externos de dano não implica, por si só, que determinado " +
      "defeito esteja necessariamente abrangido pela garantia, sendo necessária a análise da origem " +
      "e natureza do problema apresentado.",
  },
  {
    t: "p",
    prefixo: "5.4.",
    texto:
      "Quando houver divergência técnica acerca da origem do defeito, a EMPRESA deverá fornecer ao " +
      "CLIENTE as informações disponíveis sobre a avaliação realizada, observados os limites " +
      "técnicos e legais aplicáveis.",
  },

  { t: "secao", numero: "6", titulo: "Do Reparo, Substituição ou Demais Providências" },
  {
    t: "p",
    prefixo: "6.1.",
    texto:
      "Constatado vício ou defeito abrangido pela garantia, a EMPRESA adotará as providências " +
      "cabíveis para sua solução, observando os procedimentos e prazos estabelecidos pelo Código de " +
      "Defesa do Consumidor e demais normas aplicáveis.",
  },
  {
    t: "p",
    prefixo: "6.2.",
    texto:
      "A solução poderá envolver o reparo do aparelho, a substituição de componente defeituoso, a " +
      "substituição do aparelho ou outra medida legalmente cabível, conforme a natureza do vício, a " +
      "possibilidade técnica de reparação e as circunstâncias do caso concreto.",
  },
  {
    t: "p",
    prefixo: "6.3.",
    texto:
      "A eventual substituição do aparelho dependerá da disponibilidade do produto e deverá observar " +
      "as condições previstas na legislação consumerista.",
  },
  {
    t: "p",
    prefixo: "6.4.",
    texto:
      "Quando houver substituição do aparelho por outro produto, o equipamento fornecido deverá " +
      "observar as condições legalmente aplicáveis quanto à equivalência e adequação da solução.",
  },
  {
    t: "p",
    prefixo: "6.5.",
    texto:
      "O prazo de garantia será observado de acordo com a legislação aplicável e com as condições da " +
      "garantia contratual eventualmente concedida, não podendo o presente Termo ser interpretado " +
      "de modo a reduzir os direitos assegurados ao consumidor.",
  },

  { t: "secao", numero: "7", titulo: "Dos Acessórios" },
  {
    t: "p",
    prefixo: "7.1.",
    texto:
      "A garantia prevista neste Termo refere-se especificamente ao aparelho celular identificado " +
      "neste documento, salvo quando determinado acessório estiver expressamente incluído na " +
      "garantia pelo fabricante ou pela EMPRESA.",
  },
  {
    t: "p",
    prefixo: "7.2.",
    texto:
      "Eventuais acessórios fornecidos juntamente com o aparelho, tais como carregador, cabo, fonte, " +
      "fones de ouvido, adaptadores ou outros itens, estarão sujeitos às condições de garantia " +
      "próprias aplicáveis a cada produto.",
  },
  {
    t: "p",
    prefixo: "7.3.",
    texto:
      "A utilização de acessórios incompatíveis ou inadequados não acarretará, por si só, a perda " +
      "integral da garantia, devendo ser analisado eventual nexo entre o acessório utilizado e o " +
      "defeito apresentado.",
  },

  { t: "secao", numero: "8", titulo: "Da Responsabilidade Pela Conservação do Aparelho" },
  {
    t: "p",
    prefixo: "8.1.",
    texto:
      "O CLIENTE declara estar ciente de que deverá utilizar, conservar e manusear o aparelho de " +
      "acordo com as orientações fornecidas pelo fabricante, mantendo-o protegido contra situações " +
      "que possam causar danos físicos, elétricos ou eletrônicos.",
  },
  {
    t: "p",
    prefixo: "8.2.",
    texto:
      "O CLIENTE deverá observar as especificações de carregamento, armazenamento, temperatura, " +
      "umidade, utilização de acessórios e demais recomendações constantes dos manuais e materiais " +
      "disponibilizados pelo fabricante.",
  },
  {
    t: "p",
    prefixo: "8.3.",
    texto:
      "A responsabilidade da EMPRESA pela garantia limita-se aos vícios ou defeitos abrangidos por " +
      "este Termo e pela legislação aplicável, não abrangendo danos decorrentes de fatos alheios ao " +
      "produto ou de utilização inadequada, desde que devidamente constatados.",
  },

  { t: "secao", numero: "9", titulo: "Da Nota Fiscal e da Comprovação da Aquisição" },
  {
    t: "p",
    prefixo: "9.1.",
    texto:
      "A nota fiscal, comprovante de compra ou outro documento idôneo de aquisição poderá ser " +
      "solicitado para fins de identificação do produto, da data da aquisição e das condições " +
      "aplicáveis à garantia.",
  },
  {
    t: "p",
    prefixo: "9.2.",
    texto:
      "A ausência momentânea deste Termo não implicará, por si só, perda dos direitos decorrentes da " +
      "garantia legal, desde que seja possível comprovar a aquisição do produto e demais " +
      "informações necessárias ao atendimento.",
  },
  {
    t: "p",
    prefixo: "9.3.",
    texto:
      "Da mesma forma, a apresentação deste Termo não afastará a necessidade de comprovação da " +
      "origem do produto ou de realização de avaliação técnica quando necessária à identificação da " +
      "causa do defeito.",
  },

  { t: "secao", numero: "10", titulo: "Da Garantia Legal e dos Direitos do Consumidor" },
  {
    t: "p",
    prefixo: "10.1.",
    texto:
      "Este Termo não exclui, limita ou substitui a garantia legal prevista no Código de Defesa do " +
      "Consumidor, especialmente aquela relativa aos vícios de produtos duráveis.",
  },
  {
    t: "p",
    prefixo: "10.2.",
    texto:
      "As disposições aqui estabelecidas deverão ser interpretadas em conjunto com a legislação " +
      "vigente e de forma compatível com os direitos assegurados ao consumidor.",
  },
  {
    t: "p",
    prefixo: "10.3.",
    texto:
      "Na hipótese de eventual conflito entre disposição deste Termo e norma legal de caráter " +
      "obrigatório, prevalecerá a disposição legal aplicável, sem que isso implique a invalidade " +
      "das demais disposições deste documento.",
  },

  { t: "secao", numero: "11", titulo: "Da Identificação do Produto" },
  {
    t: "p",
    prefixo: "11.1.",
    texto:
      "O presente Termo está vinculado exclusivamente ao aparelho identificado no campo “Dados do " +
      "Aparelho”, especialmente por meio de seu IMEI, número de série, modelo e demais elementos de " +
      "identificação.",
  },
  {
    t: "p",
    prefixo: "11.2.",
    texto:
      "A substituição de componentes ou do aparelho durante o atendimento em garantia deverá ser " +
      "registrada nos documentos correspondentes, sempre que aplicável, para fins de " +
      "rastreabilidade e controle.",
  },

  { t: "secao", numero: "12", titulo: "Da Declaração do Cliente" },
  {
    t: "p",
    prefixo: "12.1.",
    texto:
      "O CLIENTE declara que recebeu o aparelho identificado neste Termo e que foi informado acerca " +
      "das condições de utilização, conservação e acionamento da garantia.",
  },
  {
    t: "p",
    prefixo: "12.2.",
    texto:
      "Declara, ainda, estar ciente de que deverá comunicar à EMPRESA qualquer problema apresentado " +
      "no aparelho e disponibilizá-lo para avaliação técnica quando necessário à análise da " +
      "reclamação.",
  },
  {
    t: "p",
    prefixo: "12.3.",
    texto:
      "O CLIENTE declara ter recebido este Termo de Garantia e ter ciência de seu conteúdo, sem " +
      "prejuízo dos direitos que lhe são assegurados pela legislação consumerista.",
  },

  { t: "secao", numero: "13", titulo: "Das Disposições Finais" },
  {
    t: "p",
    prefixo: "13.1.",
    texto:
      "O presente Termo constitui documento complementar às condições de aquisição do aparelho, à " +
      "respectiva nota fiscal e às demais informações fornecidas ao CLIENTE no momento da compra.",
  },
  {
    t: "p",
    prefixo: "13.2.",
    texto:
      "A eventual tolerância da EMPRESA quanto ao descumprimento de qualquer condição aqui " +
      "estabelecida não constituirá renúncia de direito nem alteração definitiva das condições de " +
      "garantia.",
  },
  {
    t: "p",
    prefixo: "13.3.",
    texto:
      "A eventual nulidade ou inaplicabilidade de determinada disposição deste Termo não prejudicará " +
      "a validade das demais disposições, que permanecerão aplicáveis naquilo que não forem " +
      "afetadas.",
  },
  {
    t: "p",
    prefixo: "13.4.",
    texto:
      "Para esclarecimentos, solicitações de atendimento ou acionamento da garantia, o CLIENTE " +
      "poderá utilizar os seguintes canais oficiais:",
  },
  {
    t: "grade",
    linhas: [
      ["Telefone/WhatsApp: {{canal_telefone}}", ""],
      ["E-mail: {{canal_email}}", ""],
      ["Endereço para atendimento: {{canal_endereco}}", ""],
    ],
  },
  { t: "espaco" },
  {
    t: "p",
    texto:
      "E, por estarem cientes das condições acima, as partes firmam o presente Termo de Garantia, " +
      "para que produza seus efeitos legais.",
  },
  {
    t: "p",
    texto: "{{cidade}}/{{uf}}, {{dia}} de {{mes_extenso}} de {{ano}}.",
  },
  { t: "espaco", altura: 10 },

  {
    t: "assinaturas",
    colunas: [
      {
        titulo: "EMPRESA RESPONSÁVEL",
        linhas: [
          "Razão Social: {{loja_razao_social}}",
          "CNPJ: {{loja_cnpj}}",
          "Representante: {{loja_representante}}",
          "CPF: {{loja_representante_cpf}}",
        ],
      },
      {
        titulo: "CLIENTE/CONSUMIDOR",
        linhas: ["Nome: {{cliente_nome}}", "CPF: {{cliente_cpf}}"],
      },
    ],
  },

  { t: "espaco", altura: 6 },
  { t: "rotulo", texto: "DECLARAÇÃO DE RECEBIMENTO" },
  { t: "p", texto: "Data da entrega do termo: {{data_entrega_termo}}" },
  {
    t: "p",
    texto:
      "Declaro que recebi uma via do presente Termo de Garantia, contendo as condições aplicáveis à " +
      "garantia do aparelho celular acima identificado.",
  },
  { t: "espaco", altura: 12 },
  {
    t: "assinaturas",
    colunas: [{ titulo: "Assinatura do cliente/consumidor", linhas: [] }],
  },
];
