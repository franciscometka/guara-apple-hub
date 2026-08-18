# Contas de cliente no site + controle de acesso por lista de administradores

Hoje qualquer pessoa logada pode editar produtos. Como o site vai passar a ter clientes logados, isso muda: só quem estiver na lista de administradores mexe no catálogo e vê os cadastros.

---

## 1. Migration que vou aplicar (para você confirmar)

**Tabela `admins**` — a lista da equipe

- `user_id` (a conta de acesso), `criado_em`
- Já entra populada com a única conta existente hoje no sistema: **[franciscometka42@gmail.com](mailto:franciscometka42@gmail.com)** (é a sua). Você continua com acesso ao `/admin` normalmente.
- Só quem já está na lista consegue ver a lista; ninguém consegue se adicionar pelo site — novas pessoas da equipe eu adiciono a pedido seu.

**Regras de acesso da tabela `produtos**`

- Antes: qualquer pessoa logada podia criar, editar e excluir.
- Depois: só quem está na lista de administradores.
- Leitura pública continua idêntica: visitante vê apenas produtos ativos.

**Tabela `perfis**` — dados do cliente

- `id` (a conta), `nome`, `telefone`, `email`, `criado_em`, `atualizado_em`
- Cada pessoa só vê e edita o próprio perfil.
- Administradores podem ver todos os perfis (sem editar).
- Administradores podem excluir um cadastro (pedido de LGPD).
- Criação da linha de perfil acontece automaticamente no cadastro.
- Trigger que mantém `atualizado_em` em dia.

**Regras das fotos de produto (bucket)**

- Antes: qualquer logado podia enviar/apagar foto. Depois: só administradores.

Nenhum produto ou dado existente é alterado ou apagado por essa migration.

---

## 2. Site público — contas de cliente (opcional)

- `/entrar` — página única com abas **Entrar** e **Criar conta**.
  - Criar conta: nome, telefone, e-mail e senha.
  - Entrar: e-mail e senha.
- `/minha-conta` — a pessoa vê e edita nome, telefone e e-mail, e pode sair.
- Link discreto **Entrar** no menu (desktop e mobile) e no rodapé; quando logada, vira **Minha conta**. Navegar no site continua sem exigir login.
- Nada de design novo: uso os mesmos componentes, cores e tipografia já existentes.

**Entrar com Google:** o botão fica visível nas duas abas. Se o provedor ainda não estiver ativo no backend, mostra uma mensagem amigável ("Entrar com Google ainda não está disponível — use e-mail e senha") em vez de quebrar a página, e o código traz um comentário explicando o que falta.

Observação: nesta plataforma o login com Google pode ser ativado por mim, sem você precisar criar credenciais no Google Cloud Console. Se quiser, eu ativo no mesmo passo — me diga e eu ligo; se preferir esperar, o botão fica com a mensagem tratada.

---

## 3. Painel admin — clientes

- Nova rota `/admin/clientes`: lista nome, telefone, e-mail e data de cadastro, com busca por nome, e-mail ou telefone.
- Sem edição. Botão **Excluir cadastro** com confirmação, que remove o perfil e a conta de acesso do cliente (LGPD).
- Link **Clientes** no topo do painel, ao lado de Produtos.
- Todas as telas `/admin/*` passam a checar a lista de administradores: cliente comum logado que tentar entrar é mandado embora com aviso de acesso restrito.

---

## 4. Teste que vou rodar no final

1. Crio um cliente comum pelo cadastro público → tento acessar `/admin` e `/admin/clientes` → deve ser bloqueado.
2. Com esse mesmo cliente, tento editar e excluir um produto direto pela API → deve ser negado pelo banco.
3. Com a conta de administrador → `/admin/clientes` abre e lista o cadastro.
4. Removo o cliente de teste no final.

---

## Detalhes técnicos

- Função `public.eh_admin(uuid)` `security definer stable` para as políticas de RLS, evitando recursão.
- Perfil criado por trigger `on auth.users insert` lendo `raw_user_meta_data` (nome/telefone enviados no `signUp`), então o cadastro não depende de segunda escrita no cliente.
- Exclusão de conta via `createServerFn` com `requireSupabaseAuth`, verificando `eh_admin` do chamador antes de usar o cliente admin (import dinâmico dentro do handler).
- Guard `/admin/*` continua no cliente (`ssr: false`), agora consultando `eh_admin`; a autorização real é garantida por RLS no banco.
- Login com Google via `lovable.auth.signInWithOAuth("google", ...)` com `redirect_uri` na origem pública e erro tratado.  
Plano aprovado! E sim, pode já ativar o login com Google nesse mesmo passo, já que você consegue fazer isso sem eu precisar configurar nada no Google Cloud Console. Pode seguir.