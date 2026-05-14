# Workflow: Greenfield UI

**Arquivo de origem nativo:** `.antigravity/workflows/greenfield-ui.md`

O processo **Greenfield UI** é um trilho de construção visual focado 100% no utilizador humano. Trata-se da linha de produção de Landing Pages, Dashboards desacomplados, e sistemas de interatividade complexos sem depender de integrações complexas de lógica de negócio no Backend em seu setup inicial.

> **Importante:** Este workflow aciona o verdadeiro poder exclusivo do modelo _Antigravity MCP (Stitch)_ com imagens, geração direta de wireframes interativos da linguagem falada pro código.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow exclusivamente para:

- SPAs em Next/React consumindo APIs que já estam no ar ou são mockadas.
- Construção pesada de Design-Systems orientados à Tokens.
- MVPs front-heavy (Foco pesado em retenção via Interface rica visualmente).

## 2. A Jornada Operacional (Fases)

### Fase 1: Research, Design Spec e a Interface Mágica

A orquestração foge da burocracia do engenheiro de dados e entra na era do design atômico puro:

1. `@ux` Inicia com User Research profundo de personas e pain points.
2. `@pm` formata isso no PRD focando em jornadas e fluxos de navegação.
3. Voltas ao `@ux`, que instiga a **Front-End Spec** base: Cores corporativas, fontes, breakpoints globais CSS e componentes essenciais da marca.
4. **Mágico:** `@ux` inicia o bypass de digitação e puxa alavanca do Stitch (`generate-ui-screens` com `mcp_stitch_generate_screen_from_text`), gerando botões e formulários esqueléticos em _runtime visual_.
5. `@architect` assume a arquitetura puramente Front (Como o Pinia/Redux operará em memória os dados injetados).
6. `@po` inspeciona os arquivos sob o checklist.

### Fase 2: Bootstrap do Sistema Atômico (Atomic Design)

Caso seja necessário, `@brad-frost` extrai toda a especificação dos arquivos do passo anterior e inicia o repositório cravando a biblioteca dos componentes UI em isolamento. Ele cria átomos e consolida tokens de cor nativos antes que o dev se machuque com CSS genérico.

### Fase 3: Refinamento de Componentes (O Loop da Story)

- `@sm` cria a história focada puramente em responsividade e design binding.
- Ao `@dev` entra desenvolvendo o CSS refinado ou chamando novamente a tela crua extraída pelo `@ux`.
- Surpreendendo, o `@qa` engatilha auditoria automática de **APCA Acessibility** e contraste nativo via o motor `browser_subagent`, o qual tira prints e vídeos em WebP para varredura cega por algoritmos de detecção de erros visuais estéticos.

## 3. Matriz de Entregáveis

- Ambiente UI inicializado, muitas vezes com pastas de design Tokens isoladas prontas e blindadas para evitar que Devs errem o HEX Colors em pull requests futuros.
- Funcionalidades Acessíveis aprovadas sob a WCAG nativa em cada Sprint avaliada pelo bot de Q&A visual.
