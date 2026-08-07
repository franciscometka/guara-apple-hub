# Guara Apple Hub

# PROMPT LOVABLE — GUARA IPHONES

> Cole este bloco inteiro no Lovable, de uma vez, na primeira mensagem do projeto.

---

Crie um site institucional premium de alta conversão para a **Guara iPhones**, loja autorizada de produtos Apple e assistência técnica especializada em Guarapuava/PR. Stack: **React + Vite + TypeScript + Tailwind CSS + Framer Motion**, arquitetura modular de componentes, mobile-first. Sem backend — todas as conversões acontecem via WhatsApp.

---

## 1. VISÃO DO PROJETO

**Tipo:** Site institucional / landing page premium multi-seção com páginas de apoio.

**Negócio:** Guara iPhones LTDA — venda de produtos Apple (iPhones novos, seminovos e lacrados, iPad, Apple Watch, AirPods, Mac, acessórios) e assistência técnica especializada em aparelhos Apple.

**Objetivo primário:** transformar visitante em conversa no WhatsApp. Dois fluxos distintos e igualmente importantes:
1. **Comprar** — quem quer um iPhone e está decidindo onde comprar (medo de golpe, de produto recondicionado vendido como novo, de não ter garantia).
2. **Consertar** — quem quebrou a tela, o aparelho não liga, bateria viciada, molhou. Urgência alta, decisão rápida, busca por confiança.

**Público-alvo:** 20 a 45 anos, Guarapuava e região (Campos Gerais / Centro-Sul do Paraná). Classe B/C. Já pesquisou preço em marketplace, mas quer comprar de alguém local, com rosto, endereço físico e garantia real. Compra muito por indicação e por Instagram.

**Resultado esperado:** o visitante entende em 5 segundos que a Guara é loja física, especializada só em Apple, com assistência técnica própria — e clica no WhatsApp.

**Diferencial competitivo (o eixo de toda a comunicação):**
> **Loja física + assistência técnica no mesmo lugar.** O concorrente é o vendedor de Instagram sem endereço e o marketplace sem suporte. A Guara vende E conserta — se der problema, o cliente volta na Sala 7 da Manoel Ribas e fala com uma pessoa. Especialização total em Apple, não é "loja de celular em geral".

Toda a copy deve martelar: **especialista, não generalista. Local, não anônimo. Garantia com endereço.**

---

## 2. DIREÇÃO CRIATIVA

**Referência declarada pelo cliente: site da Apple.** Isso define tudo.

- **Base clara, luxo silencioso.** Fundo predominantemente branco/off-white, muito espaço negativo, respiro generoso entre seções. Nada de gradiente berrante, nada de estética "loja de celular do shopping".
- **Contraste dramático controlado:** seções-chave (Hero, Assistência Técnica, CTA final) usam blocos **escuros quase-pretos** com iluminação volumétrica roxa sutil ao fundo — o produto flutua em fundo escuro como em keynote da Apple. O resto do site é claro.
- **Tipografia é o design.** Títulos gigantes, peso semibold, tracking negativo (-0.02em a -0.04em). O texto carrega a hierarquia; ornamento é mínimo.
- **Produto em destaque absoluto.** Foto de iPhone centralizada, grande, com sombra suave e reflexo. Zero clipart, zero ícone genérico de celular.
- **Roxo como assinatura, não como banho.** O roxo aparece em: CTAs, detalhes de glow, underlines animados, ícones, badges. Nunca como fundo de página inteira em modo claro.
- **Atmosfera:** precisão, cuidado técnico, confiança. Sensação de "essas pessoas sabem exatamente o que estão fazendo com o meu aparelho".

---

## 3. SISTEMA DE DESIGN

### Paleta

```
/* Marca */
--guara-violet:        #7C3AED   /* primária — CTAs, links, destaques */
--guara-violet-deep:   #5B21B6   /* hover de CTA, textos sobre claro */
--guara-violet-dark:   #3B0F70   /* fundos escuros com tint roxo */
--guara-violet-soft:   #A78BFA   /* ícones sobre fundo escuro */
--guara-violet-glow:   #C4B5FD   /* halos, glow volumétrico */
--guara-violet-tint:   #F5F3FF   /* fundo de badge / seção clara alternada */

/* Neutros */
--white:               #FFFFFF
--off-white:           #FAFAFA
--gray-100:            #F4F4F5
--gray-200:            #E4E4E7
--gray-400:            #A1A1AA
--gray-500:            #71717A   /* texto secundário */
--gray-700:            #3F3F46
--gray-900:            #18181B   /* texto principal */
--black-rich:          #0A0A0F   /* fundo das seções escuras */

/* Semânticos */
--success:             #10B981
--warning:             #F59E0B
--error:               #EF4444
--whatsapp:            #25D366
```

Gradientes permitidos (usar com parcimônia):
- `--grad-cta: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)`
- `--grad-glow: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.35), transparent 70%)` — aplicado atrás do produto nas seções escuras.

### Tipografia

- **Display/Headings:** `Inter Tight` (Google Fonts), pesos 600 e 700, `letter-spacing: -0.03em`.
- **Corpo/UI:** `Inter`, pesos 400 / 500 / 600.
- Fallback: `-apple-system, BlinkMacSystemFont, sans-serif`.

Escala (mobile → desktop, clamp):
```
display  clamp(2.75rem, 8vw, 5.5rem)   / line-height 0.95 / weight 700
h1       clamp(2.25rem, 6vw, 4rem)     / 1.05 / 700
h2       clamp(1.875rem, 4.5vw, 3rem)  / 1.1  / 600
h3       clamp(1.375rem, 3vw, 1.875rem)/ 1.2  / 600
body-lg  clamp(1.0625rem, 2vw, 1.25rem)/ 1.6  / 400
body     1rem                          / 1.65 / 400
small    0.875rem                      / 1.5  / 400
caption  0.75rem                       / 1.4  / 500 / tracking 0.06em / uppercase
```

### Espaçamento, grid e forma

- Base 4px. Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Padding vertical de seção: `py-20 md:py-28 lg:py-36`.
- Container: `max-w-[1200px] mx-auto px-5 md:px-8`. Seções de texto puro: `max-w-[720px]`.
- Grid: 12 colunas desktop, 6 tablet, 4 mobile. Gap 24px / 32px.
- **Raios:** sm 8px · md 12px · lg 16px · xl 24px · 2xl 32px · full 9999px. Cards usam `lg`; botões usam `full`.
- **Sombras:**
  - `shadow-soft: 0 1px 3px rgba(24,24,27,.06), 0 8px 24px rgba(24,24,27,.06)`
  - `shadow-card: 0 4px 12px rgba(24,24,27,.05), 0 16px 48px rgba(24,24,27,.08)`
  - `shadow-violet: 0 8px 32px rgba(124,58,237,.28)` (só em CTA primário no hover)
- **Bordas:** 1px `--gray-200` em modo claro; `rgba(255,255,255,.08)` em modo escuro.
- **Ícones:** `lucide-react`, stroke 1.5px, tamanho 20/24px.

### Componentes — estados

**Botão primário:** fundo `--grad-cta`, texto branco, `rounded-full`, `px-7 py-3.5`, weight 600.
- hover: `translateY(-2px)` + `shadow-violet` + brilho 1.05 · 180ms
- active: `translateY(0) scale(0.98)`
- focus-visible: `outline 2px --guara-violet, offset 3px`
- disabled: `--gray-200`, texto `--gray-400`, sem sombra, cursor not-allowed
- loading: spinner 16px + texto some com fade

**Botão WhatsApp (CTA de conversão):** fundo `--whatsapp`, ícone WhatsApp à esquerda, mesma mecânica de hover. Usar nas ações de "Falar agora".

**Botão secundário:** transparente, borda 1px `--gray-200`, texto `--gray-900`. Hover: borda `--guara-violet`, texto `--guara-violet`. Em fundo escuro: borda `rgba(255,255,255,.2)`, texto branco.

**Botão terciário/link:** texto `--guara-violet` com underline animado que cresce da esquerda no hover (`scaleX 0→1`, origin left, 220ms).

**Card:** `bg-white`, `rounded-lg`, borda 1px `--gray-200`, `p-6 md:p-8`, `shadow-soft`. Hover: `translateY(-4px)` + `shadow-card` + borda vira `--guara-violet-glow` · 260ms.

**Input:** `rounded-md`, borda 1px `--gray-200`, `px-4 py-3`, `bg-white`. Focus: borda `--guara-violet` + ring `0 0 0 3px rgba(124,58,237,.12)`. Error: borda `--error` + mensagem 13px abaixo. Placeholder `--gray-400`.

**Badge:** `rounded-full`, `px-3 py-1`, 12px, weight 600, uppercase, tracking 0.06em. Variantes: violet (`--guara-violet-tint` / texto `--guara-violet-deep`), dark (`rgba(255,255,255,.08)` / texto `--guara-violet-glow`), success.

---

## 4. ARQUITETURA DAS PÁGINAS

### `/` — Home (landing principal)
Objetivo: converter os dois públicos (comprar e consertar) sem canibalizar um ao outro. Estrutura completa na seção 5. CTA principal: **"Falar no WhatsApp"**. CTA secundário: **"Ver como chegar"** (Maps).

### `/assistencia-tecnica`
Objetivo: capturar busca por conserto e servir de destino do menu.
Layout: hero escuro compacto → lista de serviços em grid (tela, bateria, conector de carga, câmera, placa, aparelho molhado, botões, alto-falante, Face ID) com descrição e prazo estimado → "como funciona" em 4 passos (diagnóstico → orçamento no WhatsApp → aprovação → conserto e retirada) → política de garantia → FAQ técnico → CTA final.
CTA principal: **"Pedir orçamento no WhatsApp"** com mensagem pré-preenchida citando o serviço clicado. CTA secundário: "Ver localização".

### `/produtos`
Objetivo: vitrine de confiança, **não e-commerce** — não há carrinho, checkout nem preço fixo. Cada card leva ao WhatsApp perguntando disponibilidade e valor.
Layout: hero claro → filtro por categoria em pills (iPhone · iPad · Apple Watch · AirPods · Mac · Acessórios) com filtragem client-side e animação `layout` do Framer Motion → grid de cards de produto (imagem, nome, badge de condição: Lacrado / Seminovo / Vitrine, chip "Consultar valor") → bloco explicando o que significa cada condição e o que acompanha (nota fiscal, garantia, checagem de bateria) → CTA final.

### `/404`
Fundo escuro, tipografia gigante "404", texto "Essa página deu tela azul. Ou melhor: tela preta." + botão voltar pra home. Leve, sem drama.

### Navegação global
Navbar fixa no topo, altura 72px, `backdrop-blur-xl` + `bg-white/80` que ganha borda inferior e sombra sutil depois de 40px de scroll. Logo à esquerda (usar arquivo enviado pelo cliente — `[CONFIRMAR: LOGO]`, provisoriamente wordmark "GUARA **iPHONES**" em Inter Tight com "iPHONES" em `--guara-violet`). Links: Início · Produtos · Assistência Técnica · Sobre · Contato. À direita, botão WhatsApp. Mobile: menu full-screen com slide da direita, links em 28px com stagger de 60ms.

---

## 5. ESTRUTURA POR SEÇÕES — HOME

**1. Hero (fundo escuro `--black-rich`, altura 92vh, com `--grad-glow` no topo)**
- Badge: "Especialistas Apple em Guarapuava"
- H1: **"O seu iPhone tem endereço aqui."**
- Subheadline: "Venda de produtos Apple e assistência técnica especializada. Loja física na Av. Manoel Ribas — você compra, e se precisar, conserta com quem vendeu."
- CTAs: [Falar no WhatsApp] [Ver produtos]
- Visual: foto de iPhone em ângulo levemente girado, flutuando, com glow roxo atrás e reflexo suave abaixo. `[CONFIRMAR: FOTO HERO]`
- Rodapé do hero: 3 micro-provas em linha — "Loja física · Sala 7" | "Assistência própria" | "Garantia com nota"

**2. Barra de confiança (faixa clara, logo abaixo do hero)**
Linha discreta com 4 selos em ícone + label: Produtos originais Apple · Garantia real · Assistência técnica no local · Atendimento por WhatsApp.

**3. Os dois caminhos (seção-chave, fundo `--off-white`)**
Dois cards grandes lado a lado (empilhados no mobile), cada um com imagem, título, texto e CTA:
- **"Quero comprar"** → "iPhones lacrados e seminovos checados peça por peça. Sem surpresa, sem 'gato por lebre'." → [Ver produtos]
- **"Quero consertar"** → "Tela, bateria, conector, placa. Diagnóstico honesto e orçamento antes de qualquer serviço." → [Pedir orçamento]

**4. Produtos em destaque (fundo branco)**
Título: "O que tem na loja agora". Grid de 6 cards de produto com foto, nome, badge de condição e "Consultar valor no WhatsApp". Link no fim: "Ver tudo →".

**5. Assistência técnica (fundo escuro)**
Título: **"Quebrou? Respira. A gente resolve."**
Grid 3x2 de serviços com ícone, nome e prazo: Troca de tela · Troca de bateria · Conector de carga · Câmera · Reparo de placa · Aparelho molhado. `[CONFIRMAR: PRAZOS REAIS]`
Abaixo: linha do tempo horizontal em 4 passos (Diagnóstico → Orçamento no WhatsApp → Você aprova → Conserto e retirada).
CTA: [Falar com o técnico].

**6. Por que a Guara (fundo claro, layout editorial em 2 colunas)**
Título: "Por que comprar aqui e não num anúncio qualquer".
Quatro blocos de texto curto com número grande em roxo:
1. **Loja física, endereço fixo.** Av. Manoel Ribas 1945, Sala 7. Você sabe onde nos achar depois da compra.
2. **Só Apple.** Não somos loja de celular genérica. É especialização, não improviso.
3. **Assistência própria.** Quem vende é quem conserta. O problema não vira jogo de empurra.
4. **Garantia com nota.** Produto com nota fiscal e garantia — no papel, não na promessa.

**7. Depoimentos (fundo `--guara-violet-tint`)**
Carrossel de 3 cards com foto, nome, cidade e texto. **`[CONFIRMAR: DEPOIMENTOS REAIS — não publicar inventado. Pegar prints de avaliação do Google/Instagram do cliente.]` Enquanto não vierem, montar a seção com estrutura pronta e 3 depoimentos marcados claramente como placeholder no código (comentário `// TODO: substituir por depoimento real`).**

**8. Localização e horário (fundo branco, 2 colunas)**
Esquerda: mapa Google Maps embed com pin na Av. Manoel Ribas 1945, Sala 7 — Guarapuava/PR.
Direita: endereço completo, horário (Seg a Sex 09h–19h · Sáb 09h–15h · Dom fechado), WhatsApp, e-mail, redes. Badge dinâmico "Aberto agora" / "Fechado" calculado em JS a partir do horário local. Botão [Traçar rota no Maps].

**9. FAQ (fundo `--off-white`)**
Accordion, 8 perguntas (conteúdo na seção 9).

**10. CTA final (fundo escuro, full-width, glow roxo central)**
H2: **"Chama no WhatsApp. A resposta vem rápido."**
Sub: "Dúvida sobre modelo, valor, disponibilidade ou conserto — manda mensagem que a gente te responde no horário comercial."
Botão WhatsApp grande + linha "Seg a Sex 09h–19h · Sáb até 15h".

**11. Rodapé (fundo `--black-rich`)**
4 colunas: logo + tagline · Navegação · Serviços · Contato e redes (Instagram, Facebook, TikTok — `[CONFIRMAR: @handles]`). Linha inferior: "Guara iPhones LTDA · Av. Manoel Ribas 1945, Sala 7 — Guarapuava/PR" + "© 2026 Guara iPhones. Todos os direitos reservados." + "Site por NexKai".

**Botão flutuante de WhatsApp:** canto inferior direito, 56px, verde, aparece após 400px de scroll com fade+scale, pulso sutil de 3 em 3 segundos, `z-50`. No mobile, respeitar safe-area.

---

## 6. COMPONENTES REUTILIZÁVEIS

`Navbar` · `MobileMenu` · `Footer` · `Section` (wrapper com prop `variant: 'light' | 'off' | 'dark' | 'tint'` que aplica fundo, cor de texto e padding) · `Container` · `Button` (`variant: primary | whatsapp | secondary | ghost`, `size: sm | md | lg`) · `Badge` · `Card` · `ProductCard` · `ServiceCard` · `PathCard` (os dois caminhos) · `ReasonBlock` · `TestimonialCarousel` · `FAQAccordion` · `StepsTimeline` · `TrustBar` · `MapEmbed` · `OpenNowBadge` · `WhatsAppFAB` · `CTASection` · `SectionHeading` (eyebrow + título + subtítulo) · `AnimatedGlow` · `Reveal` (wrapper de scroll reveal).

Todo link de WhatsApp passa pelo helper `lib/whatsapp.ts`:
```ts
export const WHATSAPP = "5542991220341";
export const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
```
Mensagens pré-preenchidas por contexto:
- Hero / genérico: `"Olá! Vim pelo site da Guara iPhones e gostaria de mais informações."`
- Produto: `"Olá! Vi o {produto} no site e quero saber a disponibilidade e o valor."`
- Assistência: `"Olá! Preciso de um orçamento para {serviço} no meu {modelo}."`
- CTA final: `"Olá! Vim pelo site e quero falar com um atendente."`

---

## 7. MOTION DESIGN (Framer Motion)

Easings padrão: `easeOut = [0.22, 1, 0.36, 1]` · `easeSoft = [0.4, 0, 0.2, 1]` · `spring = { type: 'spring', stiffness: 260, damping: 26 }`.

**Hero — timeline cinematográfica de entrada (total 1.6s, roda uma vez no mount):**
| t | Elemento | De → Para | Duração | Easing |
|---|---|---|---|---|
| 0.00s | Glow radial roxo | opacity 0 → 0.35, scale 0.7 → 1 | 1.2s | easeSoft |
| 0.15s | Badge | y +16, opacity 0 → y 0, opacity 1 | 0.5s | easeOut |
| 0.28s | H1 (por linha, stagger 0.08s) | y +28, opacity 0, blur 6px → y 0, opacity 1, blur 0 | 0.7s | easeOut |
| 0.55s | Subheadline | y +20, opacity 0 → 0,1 | 0.6s | easeOut |
| 0.72s | CTAs (stagger 0.07s) | y +16, opacity 0, scale 0.96 → 0,1,1 | 0.5s | spring |
| 0.45s | iPhone | y +60, opacity 0, scale 0.88, rotateZ -6° → y 0, opacity 1, scale 1, rotateZ -3° | 1.1s | easeOut |
| 1.20s | Reflexo/sombra do iPhone | opacity 0 → 0.4, scaleX 0.7 → 1 | 0.6s | easeSoft |
| 1.30s | Micro-provas (stagger 0.06s) | opacity 0 → 1 | 0.4s | easeOut |

Depois da entrada, o iPhone entra em **float loop**: `y: [0, -12, 0]`, 6s, `ease: 'easeInOut'`, `repeat: Infinity`. E responde ao scroll com `useScroll` + `useTransform`: `y: [0, 80]` e `rotateZ: [-3°, 0°]` ao longo dos primeiros 100vh (parallax leve).

**Scroll reveal padrão (componente `Reveal`):** `whileInView`, `viewport={{ once: true, amount: 0.25, margin: "-80px" }}`, de `{ opacity: 0, y: 32 }` para `{ opacity: 1, y: 0 }`, 0.6s, easeOut. Em grids, `staggerChildren: 0.08`.

**Títulos de seção:** mesma revelação, mas com `y: 40` e blur 4px → 0.

**Cards de produto/serviço:** entram com `y: 40, opacity: 0, scale: 0.97`, stagger 0.07s. Hover: `y: -6`, sombra cresce, imagem interna `scale: 1.05` em 400ms.

**Timeline de 4 passos:** a linha conectora anima `scaleX: 0 → 1` (origin left) em 0.9s quando entra na viewport; cada bolinha aparece com `scale: 0 → 1` em spring, stagger 0.18s, sincronizada com o avanço da linha.

**Números / contadores** (se usados na barra de confiança): count-up de 0 ao valor em 1.4s com easeOut, disparado por `whileInView`.

**Accordion FAQ:** `height: 0 → auto` com `AnimatePresence`, 0.35s easeSoft; ícone `+` rotaciona 45° virando `×`.

**Carrossel de depoimentos:** transição por `AnimatePresence` mode `wait`, slide horizontal ±40px + fade, 0.4s. Autoplay 6s, pausa no hover, drag habilitado no mobile.

**Filtro de produtos:** `layout` + `AnimatePresence` com `layoutId`, itens reposicionam em spring, entram/saem com fade+scale 0.95.

**Menu mobile:** overlay com `x: '100%' → 0`, 0.4s easeOut; links com stagger 0.06s; fundo com blur.

**Navbar:** ao passar de 40px de scroll, anima `backgroundColor`, `borderColor` e `boxShadow` em 0.3s. No mobile, esconde ao scrollar pra baixo e reaparece ao scrollar pra cima (`y: -100% / 0`, 0.25s).

**FAB WhatsApp:** entra com `scale: 0 → 1` + fade após 400px. Pulso: anel externo `scale: 1 → 1.6, opacity: 0.5 → 0`, 2s, repeat com delay de 3s.

**Comportamento no mobile:** desativar parallax e o float loop do iPhone (custam FPS), reduzir distâncias de reveal de 32px para 20px e durações em ~25%, remover blur de entrada dos títulos.

**Acessibilidade de movimento:** envolver tudo em `useReducedMotion()`. Com `prefers-reduced-motion: reduce`, todas as animações viram fade simples de 0.2s, o float loop e o pulso do FAB são desligados, e o parallax é removido.

---

## 8. MICROINTERAÇÕES

- **Hover em links de navegação:** underline roxo que cresce da esquerda (`scaleX 0→1`, 220ms).
- **Hover em card:** elevação + borda roxa suave + imagem com zoom 1.05.
- **Hover em botão primário:** elevação 2px + `shadow-violet` + brilho.
- **Active/tap:** todo elemento clicável faz `scale: 0.97` (`whileTap`).
- **Focus visible:** anel roxo 2px com offset 3px em todos os interativos, sempre visível no teclado.
- **Loading:** skeleton shimmer (gradiente cinza deslizante, 1.4s loop) nas imagens de produto até carregarem.
- **Success:** ao copiar o endereço ou o WhatsApp, o botão vira ícone de check verde por 1.8s com texto "Copiado!".
- **Error:** shake horizontal de 6px (3 oscilações, 0.35s) + mensagem em vermelho.
- **Disabled:** opacity 0.5, sem hover, cursor not-allowed.
- **Scroll reveal:** conforme seção 7.
- **Parallax:** só no glow do hero e nos blocos escuros (movimento máximo de 60px), desktop apenas.
- **Botões magnéticos:** apenas nos dois CTAs principais do hero — o botão segue o cursor até 6px de deslocamento com spring, volta ao sair. Desktop e ponteiro fino apenas.
- **Cursor:** padrão do sistema. Sem cursor customizado.
- **Badge "Aberto agora":** ponto verde com pulso suave quando aberto; cinza estático quando fechado.

---

## 9. CONTEÚDO INICIAL — COPY COMPLETA (pt-BR)

### Hero
- Eyebrow: `Especialistas Apple em Guarapuava`
- H1: **`O seu iPhone tem endereço aqui.`**
- Sub: `Venda de produtos Apple e assistência técnica especializada. Loja física na Av. Manoel Ribas — você compra, e se precisar, conserta com quem vendeu.`
- CTA1: `Falar no WhatsApp` · CTA2: `Ver produtos`
- Micro-provas: `Loja física · Sala 7` | `Assistência própria` | `Garantia com nota`

### Barra de confiança
`Produtos originais Apple` · `Garantia com nota fiscal` · `Assistência técnica no local` · `Atendimento direto no WhatsApp`

### Os dois caminhos
- Eyebrow: `Como podemos ajudar`
- H2: `Duas portas, o mesmo cuidado.`
- Card 1 — `Quero comprar` / `iPhones lacrados e seminovos checados peça por peça. A gente te fala a real sobre bateria, estado e garantia antes de você decidir.` / botão `Ver produtos`
- Card 2 — `Quero consertar` / `Tela, bateria, conector, placa. Diagnóstico honesto e orçamento no WhatsApp antes de qualquer serviço — sem surpresa na retirada.` / botão `Pedir orçamento`

### Produtos em destaque
- Eyebrow: `Vitrine`
- H2: `O que tem na loja agora.`
- Sub: `Disponibilidade e valores mudam toda semana. Clica no modelo e a gente te passa o preço atualizado na hora.`
- Micro: `Valores sob consulta · Parcelamento disponível` `[CONFIRMAR: condições de parcelamento]`
- Link: `Ver todos os produtos →`

### Assistência técnica
- Eyebrow: `Assistência técnica`
- H2: **`Quebrou? Respira. A gente resolve.`**
- Sub: `Reparo especializado em aparelhos Apple, feito na nossa própria bancada. Você acompanha cada etapa pelo WhatsApp.`
- Serviços: `Troca de tela` · `Troca de bateria` · `Conector de carga` · `Câmera` · `Reparo de placa` · `Aparelho molhado`
- Passos: `1. Diagnóstico` → `2. Orçamento no WhatsApp` → `3. Você aprova` → `4. Conserto e retirada`
- CTA: `Falar com o técnico`

### Por que a Guara
- Eyebrow: `Por que a Guara`
- H2: `Por que comprar aqui e não num anúncio qualquer.`
- 01 `Loja física, endereço fixo.` / `Av. Manoel Ribas 1945, Sala 7. Você sabe exatamente onde nos encontrar depois da compra — e isso muda tudo.`
- 02 `Só Apple.` / `Não somos loja de celular genérica. É especialização de verdade: conhecemos cada modelo, cada defeito comum, cada peça.`
- 03 `Quem vende é quem conserta.` / `Comprou aqui e deu problema? Volta aqui. Sem jogo de empurra, sem "fala com o fabricante".`
- 04 `Garantia com nota.` / `Produto com nota fiscal e garantia registrada. No papel, não na promessa.`

### Depoimentos
- Eyebrow: `Quem já passou por aqui`
- H2: `A melhor propaganda continua sendo a indicação.`
- `[CONFIRMAR: 3 DEPOIMENTOS REAIS + primeiro nome + cidade. Marcar no código como placeholder até chegarem.]`

### Localização
- Eyebrow: `Onde estamos`
- H2: `Passa aqui na loja.`
- Endereço: `Av. Manoel Ribas, 1945 — Sala 7 · Guarapuava/PR` `[CONFIRMAR: CEP e bairro]`
- Horário: `Segunda a sexta: 09h às 19h` / `Sábado: 09h às 15h` / `Domingo: fechado`
- WhatsApp: `(42) 99122-0341` · E-mail: `adrianom.dacruz2@gmail.com` `[CONFIRMAR: e-mail comercial no domínio próprio]`
- Botões: `Traçar rota` · `Copiar endereço`

### FAQ
1. **Vocês vendem iPhone lacrado ou só seminovo?** — `Os dois. Trabalhamos com aparelhos lacrados e com seminovos revisados. Em todo seminovo a gente informa antes o estado real, a saúde da bateria e o que acompanha.`
2. **Tem garantia?** — `Sim. Todo produto sai com nota fiscal e garantia. O prazo varia conforme o modelo e a condição do aparelho — a gente te informa antes da compra.` `[CONFIRMAR: prazos de garantia]`
3. **Quanto tempo demora um conserto?** — `Depende do serviço. Reparos comuns como tela e bateria costumam ser rápidos; casos de placa ou aparelho molhado exigem diagnóstico primeiro. Você recebe o prazo junto com o orçamento.` `[CONFIRMAR: prazos médios]`
4. **Preciso pagar pra saber o orçamento?** — `Não. O diagnóstico e o orçamento vêm antes, no WhatsApp. Só depois que você aprova é que o serviço começa.` `[CONFIRMAR]`
5. **Vocês parcelam?** — `Sim, trabalhamos com parcelamento. Fala com a gente no WhatsApp que te passamos as condições atualizadas.` `[CONFIRMAR: formas de pagamento e nº de parcelas]`
6. **Aceitam meu aparelho usado na troca?** — `[CONFIRMAR: a loja faz trade-in?]`
7. **Vocês entregam ou é só retirada na loja?** — `[CONFIRMAR: entrega em Guarapuava? envio pra outras cidades?]`
8. **Onde vocês ficam?** — `Av. Manoel Ribas, 1945 — Sala 7, em Guarapuava. Segunda a sexta das 09h às 19h e sábado até às 15h.`

### CTA final
- H2: **`Chama no WhatsApp. A resposta vem rápido.`**
- Sub: `Dúvida sobre modelo, valor, disponibilidade ou conserto — manda mensagem que a gente te responde no horário comercial.`
- Botão: `Falar no WhatsApp agora`
- Micro: `Seg a Sex 09h–19h · Sáb 09h–15h`

### Microcopy
- Placeholder de busca: `Buscar modelo...`
- Vazio de filtro: `Nada nessa categoria agora. Chama no WhatsApp que a gente verifica o estoque.`
- Erro genérico: `Algo deu errado aqui. Tenta de novo ou fala com a gente no WhatsApp.`
- Loading: `Carregando...`
- Copiado: `Copiado!`
- Badge produto: `Lacrado` · `Seminovo` · `Vitrine`
- Preço: `Consultar valor`
- Alt de imagem padrão: `[nome do produto] disponível na Guara iPhones, Guarapuava`

---

## 10. SEO

- `<title>`: `Guara iPhones — Produtos Apple e Assistência Técnica em Guarapuava/PR`
- `<meta name="description">`: `Venda de iPhone, iPad, Apple Watch e AirPods, novos e seminovos, com assistência técnica especializada em Guarapuava. Loja física na Av. Manoel Ribas. Atendimento no WhatsApp.`
- Keywords (contexto, não meta tag): iphone guarapuava, assistência técnica iphone guarapuava, conserto de iphone guarapuava, troca de tela iphone guarapuava, comprar iphone guarapuava, apple guarapuava, iphone seminovo paraná.
- Canonical: `https://guaraiphones.com.br/`
- `lang="pt-BR"`, `theme-color: #7C3AED`
- **Open Graph:** `og:type=website`, `og:site_name=Guara iPhones`, `og:title`, `og:description`, `og:url`, `og:image` 1200×630 `[CONFIRMAR: imagem OG — usar foto da loja com logo]`, `og:locale=pt_BR`
- **Twitter:** `summary_large_image` com mesmos campos.
- **Titles por página:** `/produtos` → `Produtos Apple — iPhone, iPad, Watch e AirPods | Guara iPhones`; `/assistencia-tecnica` → `Assistência Técnica iPhone em Guarapuava | Guara iPhones`
- **Schema.org (JSON-LD no `<head>`):** `LocalBusiness` + `Store`, com `name: "Guara iPhones"`, `legalName: "GUARA IPHONES LTDA"`, `address` (Av. Manoel Ribas, 1945, Sala 7, Guarapuava, PR, BR), `telephone: "+5542991220341"`, `email`, `openingHoursSpecification` (Mo–Fr 09:00–19:00, Sa 09:00–15:00), `url`, `sameAs` com Instagram/Facebook/TikTok, `priceRange: "$$"`, `geo` `[CONFIRMAR: lat/long]`. Adicionar `Service` schema na página de assistência e `BreadcrumbList` nas internas.
- `robots.txt` liberado + `sitemap.xml` com as 3 rotas públicas.
- Estrutura semântica: um `<h1>` por página, hierarquia de headings correta, `<main>`, `<section aria-labelledby>`, `<nav>`, `<footer>`.

---

## 11. PERFORMANCE

- Meta: **Lighthouse > 90** em Performance, Acessibilidade, Boas Práticas e SEO. LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Imagens em **WebP** com fallback, `srcset` responsivo, `width`/`height` explícitos pra travar layout, `loading="lazy"` em tudo exceto a imagem do hero (`fetchpriority="high"` + preload).
- Code splitting por rota com `React.lazy` + `Suspense` e fallback de skeleton.
- Fontes: `display=swap`, preconnect no Google Fonts, subset latin + latin-ext, apenas os pesos usados (Inter 400/500/600, Inter Tight 600/700).
- Animações só em `transform` e `opacity`. Nada de animar `width`, `height`, `top` ou `left`. `will-change` aplicado com parcimônia e removido depois.
- Manter 60 FPS: no mobile, desligar parallax, float loop e blurs pesados (`backdrop-filter` só na navbar).
- Ícones importados individualmente do `lucide-react` (tree-shaking).
- Sem bibliotecas de UI pesadas. Sem jQuery, sem carrossel de terceiros — carrossel feito com Framer Motion.
- Mapa do Google carregado com `loading="lazy"` e só quando entra na viewport (evita bloquear o LCP).

---

## 12. ACESSIBILIDADE

- **WCAG 2.1 AA.** Contraste mínimo 4.5:1 em texto normal e 3:1 em texto grande. Atenção: `--guara-violet` sobre branco passa; texto roxo pequeno deve usar `--guara-violet-deep`.
- Navegação completa por teclado, ordem de foco lógica, foco sempre visível (anel roxo 2px offset 3px). Nunca `outline: none` sem substituto.
- Skip link "Pular para o conteúdo" como primeiro elemento focável.
- HTML semântico: `header`, `nav`, `main`, `section`, `article`, `footer`. Botão é `<button>`, link é `<a>`.
- ARIA: `aria-label` em ícones sem texto (FAB do WhatsApp = "Falar no WhatsApp"), `aria-expanded` + `aria-controls` no accordion e no menu mobile, `aria-current="page"` no link ativo, `aria-live="polite"` nas mensagens de sucesso/erro, `role="region"` com `aria-labelledby` nas seções.
- Menu mobile aberto: foco preso dentro do overlay, `Esc` fecha, scroll do body travado.
- Toda imagem com `alt` descritivo; imagens puramente decorativas com `alt=""` e `aria-hidden`.
- Carrossel com botões anterior/próximo acessíveis, autoplay pausável, e navegação por setas do teclado.
- Alvos de toque com mínimo 44×44px.
- Suporte completo a `prefers-reduced-motion` conforme seção 7.
- Nada comunicado apenas por cor — badges de condição têm texto, não só cor.

---

## 13. ESTRUTURA DE PASTAS

```
src/
├── components/
│   ├── layout/       Navbar.tsx  MobileMenu.tsx  Footer.tsx  Container.tsx  Section.tsx
│   ├── ui/           Button.tsx  Badge.tsx  Card.tsx  Input.tsx  Accordion.tsx
│   │                 Skeleton.tsx  SectionHeading.tsx  Reveal.tsx  AnimatedGlow.tsx
│   ├── product/      ProductCard.tsx  ProductGrid.tsx  CategoryFilter.tsx
│   ├── service/      ServiceCard.tsx  StepsTimeline.tsx
│   └── shared/       WhatsAppFAB.tsx  TrustBar.tsx  MapEmbed.tsx  OpenNowBadge.tsx
│                     TestimonialCarousel.tsx  FAQAccordion.tsx  CTASection.tsx  PathCard.tsx
├── sections/
│   ├── home/         Hero.tsx  TrustStrip.tsx  TwoPaths.tsx  FeaturedProducts.tsx
│   │                 TechSupport.tsx  WhyGuara.tsx  Testimonials.tsx  Location.tsx
│   │                 FAQ.tsx  FinalCTA.tsx
│   ├── products/     ProductsHero.tsx  ProductsCatalog.tsx  ConditionsExplained.tsx
│   └── support/      SupportHero.tsx  ServicesGrid.tsx  HowItWorks.tsx  WarrantyPolicy.tsx
├── pages/            Home.tsx  Products.tsx  Support.tsx  NotFound.tsx
├── hooks/            useScrollPosition.ts  useReducedMotionSafe.ts  useOpenNow.ts
│                     useMediaQuery.ts  useCopyToClipboard.ts
├── lib/              whatsapp.ts  seo.ts  schema.ts  utils.ts
├── data/             products.ts  services.ts  faq.ts  testimonials.ts  navigation.ts
├── styles/           globals.css  tokens.css
├── types/            index.ts
├── assets/
│   ├── images/       (logo, foto da loja, produtos)
│   └── icons/
├── App.tsx
└── main.tsx
```

Todo conteúdo textual e listas (produtos, serviços, FAQ, depoimentos) mora em `src/data/` como arrays tipados — nada hardcoded dentro de JSX. Isso é obrigatório: o cliente vai atualizar produtos com frequência.

---

## 14. BANCO DE DADOS

**Não se aplica.** O projeto não tem backend, autenticação nem persistência. Não crie Supabase, não crie tabelas, não crie formulário com envio de dados. Toda conversão acontece via link de WhatsApp com mensagem pré-preenchida. O catálogo de produtos é estático, alimentado por `src/data/products.ts`.

---

## 15. INTEGRAÇÕES

- **WhatsApp** — via `wa.me/5542991220341` com mensagem pré-preenchida por contexto (helper na seção 6). Presente no hero, em cada card de produto, em cada card de serviço, na navbar, no CTA final, no rodapé e no FAB.
- **Google Maps** — iframe embed com o endereço `Av. Manoel Ribas, 1945, Sala 7 — Guarapuava/PR`, lazy loaded, mais botão externo "Traçar rota" abrindo `google.com/maps/dir/?api=1&destination=...`.
- **Google Analytics 4** — snippet no `index.html` com placeholder `G-XXXXXXXXXX` `[CONFIRMAR: ID do GA4]`. Disparar evento customizado `whatsapp_click` com parâmetro `origem` (hero, produto, servico, cta_final, fab, navbar) em todo clique de WhatsApp.
- **Meta Pixel** — snippet com placeholder `[CONFIRMAR: Pixel ID]`, evento `Contact` no clique de WhatsApp. Deixar comentado e pronto pra ativar.
- **Redes sociais** — links no rodapé e na seção de contato para Instagram, Facebook e TikTok `[CONFIRMAR: @handles exatos — o cliente informou apenas o nome "Guara iPhones"]`.
- **Sem Stripe, sem Mercado Pago, sem checkout, sem Calendly, sem e-mail transacional.**

---

## 16. CRITÉRIOS DE QUALIDADE

O resultado precisa parecer feito por uma agência premium, não por um gerador de site.

- **Primeira impressão:** ao abrir, deve dar a sensação de keynote da Apple adaptada pra uma loja local — clareza, respiro, produto em destaque, tipografia grande e confiante.
- **Confiança acima de tudo:** endereço, horário, garantia e rosto do negócio precisam estar visíveis sem esforço. O visitante nunca deve se perguntar "isso é golpe?".
- **Conversão:** nenhum ponto do site pode ficar a mais de uma rolagem de distância de um CTA de WhatsApp.
- **Consistência:** mesmos raios, mesmas sombras, mesmos espaçamentos, mesma escala tipográfica em todas as páginas. Nada de improviso por seção.
- **Mobile é o principal.** A maioria vai abrir pelo Instagram, no celular, com 4G. Testar mentalmente cada seção em 375px antes de considerar pronta.
- **Movimento com propósito.** Animação existe pra guiar o olho e dar sofisticação, nunca pra chamar atenção pra si mesma. Se travar, corta.
- **Zero lorem ipsum.** Use exatamente a copy da seção 9. Onde houver `[CONFIRMAR: ...]`, deixe o marcador visível no código como comentário `// TODO:` e use um placeholder honesto — **nunca invente prazo de garantia, preço, número de clientes ou depoimento.**

---

## OBSERVAÇÕES FINAIS PRO LOVABLE

- Gere o projeto completo de uma vez: as 3 rotas, o 404, todos os componentes, todos os dados em `src/data/`.
- Use imagens placeholder de alta qualidade (Unsplash) para produtos e loja enquanto as fotos reais não chegam, sempre com o comentário `// TODO: substituir por foto real do cliente`.
- Logo: usar wordmark tipográfico provisório `GUARA iPHONES` até o arquivo do cliente ser enviado.
- Não crie página de blog, área de login, carrinho ou checkout.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://guara-apple-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ce24d454-e31c-4a00-9e7c-ad5270857d8d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
