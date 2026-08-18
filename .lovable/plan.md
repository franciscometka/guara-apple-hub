# Painel administrativo de produtos (Lovable Cloud)

Objetivo: tirar o catálogo do arquivo estático + planilha do Google e passar a gerenciar tudo por um painel `/admin`, com fotos no storage do backend.

---

## 1. Migration que vou aplicar (para você confirmar)

Uma única migration, nesta ordem:

**Tabela `produtos`**
- `id` uuid PK default `gen_random_uuid()`
- `slug` text unique not null
- `nome` text not null
- `categoria` text not null — só aceita: iPhone, iPad, Apple Watch, AirPods, Mac, Acessórios
- `condicao` text not null — só aceita: Lacrado, Seminovo, Vitrine
- `detalhe` text (opcional)
- `preco` numeric(10,2) (opcional, não pode ser negativo)
- `em_estoque` boolean not null default true
- `destaque` boolean not null default false
- `ativo` boolean not null default true
- `imagem_url` text (opcional)
- `criado_em` / `atualizado_em` timestamptz default now()
- índices em `categoria` e em `(ativo, destaque)`

**Permissões de acesso à tabela**
- Visitantes (não logados): podem apenas **ler** produtos com `ativo = true`.
- Usuários logados: podem ler tudo e criar, editar e excluir.
- Ninguém pode alterar produtos sem estar logado.

**Automação**
- Função + trigger que atualiza `atualizado_em` a cada alteração.

**Storage**
- Bucket `produtos-fotos` com leitura pública.
- Regras: qualquer pessoa vê as fotos; só usuários logados podem enviar, substituir ou apagar arquivos.

**Auth**
- Login por e-mail e senha, com **cadastro público desativado** (você cria as contas manualmente).
- Confirmação de e-mail automática ativada, para as contas criadas por você já funcionarem no login.

Nada de dados é inserido nessa migration — a carga inicial vem no passo 2.

---

## 2. Migração dos produtos atuais (uma vez)

Script rodado por mim, não código que fica no site:
1. Lê os 40 itens de `src/data/products.ts`.
2. Sobe cada `.webp` de `src/assets/images/produtos/` para o bucket `produtos-fotos` e guarda a URL pública.
3. Busca a planilha atual de preços (mesmo CSV do hook) e casa por `id` → `slug`: quando existe linha, usa `preco` e `em_estoque`; quando não existe, `preco = null` e `em_estoque = true`.
4. Insere tudo com `ativo = true` e o `destaque` atual preservado.
5. No fim eu te informo quantos produtos entraram e qualquer erro por item.

`src/data/products.ts` e as imagens **continuam no projeto** como fallback.

---

## 3. Painel `/admin`

- `/admin/login` — e-mail e senha; se já estiver logado, vai direto pro painel.
- Todas as telas `/admin/*` protegidas; sem sessão, volta pro login. Botão de sair no topo de todas elas.
- `/admin` — lista todos os produtos (inclusive inativos, marcados visualmente), busca por nome, filtro por categoria, e ações: editar, ativar/desativar, excluir (com confirmação) e "+ Novo produto".
- `/admin/produtos/novo` e `/admin/produtos/$id/editar` — formulário com nome, categoria, condição, detalhe, preço opcional, em estoque, destaque e upload de foto com pré-visualização. Nome e categoria obrigatórios; preço não pode ser negativo. O `slug` é gerado do nome automaticamente (editável).
- Visual do painel usa os mesmos componentes e cores do site; nenhuma página pública é redesenhada.

---

## 4. Site público

- Página `/produtos` e os destaques da home passam a ler a tabela `produtos` (só `ativo = true`), via função de servidor pública — mantém o SSR e o SEO das páginas.
- O card usa `preco` e `em_estoque` da própria linha: sem preço → "Consultar valor no WhatsApp"; com preço → valor formatado + "Falar no WhatsApp".
- Design dos cards e o resto do site (Hero, FAQ, Venda seu iPhone, Assistência Técnica) ficam intocados.
- `useProductPricing` e a planilha só saem depois que você confirmar que está tudo certo.

**Um ponto pra você decidir:** hoje o produto fora de estoque **aparece** na lista com selo "Fora de estoque" e opacidade reduzida. Você pediu que `em_estoque = false` não apareça. Vou seguir o seu pedido (esconder da listagem pública) — me diga se prefere manter o selo.

---

## Detalhes técnicos

- Leitura pública via `createServerFn` com chave publishable (respeita as regras de acesso), carregada no loader das rotas com TanStack Query.
- Escrita no painel via cliente autenticado no navegador (as regras da tabela garantem que só logado escreve).
- Rotas do painel sob `src/routes/_authenticated/` (layout gerenciado, `ssr: false`), com o login em rota pública.
