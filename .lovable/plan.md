# Vitrine dinâmica de lançamento na home

## Resultado

Adicionar uma seção premium logo após o Hero e antes do restante do conteúdo da home. Ela usa automaticamente o produto ativo, disponível e marcado como **Destaque na home** no painel, sem conteúdo fixo de “iPhone 18” no código.

## Fonte dos dados

- Reutilizar a consulta de produtos que a home já carrega; nenhuma chamada adicional ao banco.
- O banco atual não possui uma coluna chamada `destaque_home`: o controle “Destaque na home” já grava na coluna existente `destaque`.
- Manter essa coluna e esse controle, sem migration e sem criar campo novo.
- Considerar somente produtos com `destaque = true`, `ativo = true` e `em_estoque = true`.
- Como a consulta pública já exclui os inativos, o novo componente filtra destaque e estoque no resultado existente.
- Quando houver vários destaques, escolher o primeiro mais recente por data de criação. Para permitir isso, incluir a data de criação no modelo público e ordenar os resultados mais recentes primeiro dentro da seleção da seção.
- Sem produto elegível, não renderizar a seção nem reservar espaço.

## Seção visual

- Criar `DestaqueLancamentoSection` dentro das seções da home e inseri-la imediatamente depois do Hero.
- Fundo escuro igual ao Hero, com iluminação violeta sutil usando os tokens atuais.
- Desktop: imagem ampla de um lado e conteúdo do outro. Mobile: imagem acima, conteúdo abaixo, sem rolagem horizontal.
- Conteúdo em HTML: “LANÇAMENTO”, “Chegou o mais novo da Apple”, nome, condição, preço ou “Consulte o valor”, texto curto e ações.
- “Ver detalhes” abre a página do produto; “Consultar no WhatsApp” usa o contato e rastreamento já existentes.
- Imagem principal com carregamento prioritário, tamanho estável e texto alternativo completo.

## Cores e interação

- Extrair o seletor de cores já usado na página de produto para um componente compartilhado, preservando aparência, foco e comportamento.
- Na home, trocar a cor selecionada dentro da própria vitrine, atualizando foto, nome, preço e links sem sair da página.
- Agrupar somente variações irmãs já reconhecidas pelo catálogo; se houver uma única cor, ocultar o seletor.
- Manter a página de produto usando o mesmo seletor compartilhado, sem alteração visual.

## Movimento e acessibilidade

- Foto: fade com escala de 0,95 para 1 em 600 ms.
- Conteúdo: fade e subida de 16 px com intervalo de 80 ms.
- Respeitar redução de movimento.
- Preservar foco visível, áreas de toque adequadas e contraste WCAG AA.

## Validação

- Conferir a seção com um destaque, múltiplas cores e nenhum destaque.
- Verificar links de detalhes e WhatsApp.
- Testar visualmente em mobile e desktop, incluindo ausência de cortes, sobreposição e rolagem lateral.
- Confirmar que o catálogo e a página de produto continuam funcionando normalmente.
