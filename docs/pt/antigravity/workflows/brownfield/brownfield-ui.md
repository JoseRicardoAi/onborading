# Workflow: Brownfield UI

**Arquivo de origem nativo:** `.antigravity/workflows/brownfield-ui.md`

O processo **Brownfield UI** trata com bisturi as alterações visuais de um código Client-Side (Next/Svelte/Vue) que não pode perder a harmonia corporativa implantada meses antes. Foco absoluto no reuso inteligente de Design Tokens e blindagem de Regressão Visual CSS.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow para:

- Encaixar novas rotas/páginas em Dashboards e Apps usando os bloquinhos Lego criados do Design System.
- Retocar animações e reações de componentes estáticos mantendo Behavior cru do React/Vue.

## 2. A Jornada Operacional (Fases)

A engenharia do Front-End não atua isolada do passado da marca, necessitando da tríade UX-DEV-QA estritamente coesa:

### Fase 1: Auditoria Cirúrgica e a Nova Spec Visual (@ux)

O `@ux` entra caçando no código base: Componentes com botões parecidos com a feature desejada e extrai todo os Hexadecimais oficiais do `front-end-spec.md`. Diferente de tentar puxar bibliotecas pesadas novas do NPM aleatoriamente, ele lista quais blocos reutilizar da tela anterior.
Em caso de mudança severa (Rebranding), invoca-se o **Antigravity MCP Stitch**, a IA conectada na viewport web, que tira screenshots pre-built para mostrar à direção antes mesmo de faturar as horas do desenvolvedor no ticket.

### Fase 2: O Pipeline Dev/Visual (@sm / @dev)

Ao codar, há uma regra de execução de `grep` vital que o agente engatilha silenciosamente: _"Onde esse componente InputTextoX é usado hoje no sistema?"_ — Antes do DEV tentar refatorá-lo.
As mudanças visuais descem na priorização severa do formato **Mobile First**.

### Fase 3: Barreira de Contenção de Qualidade (Review Visual)

Aqui reside um superpoder Antigravit: Antes do `@qa` codar unit tests, o script `browser_subagent` é ativado. Ele tira WebPs automatizados da renderização DOM crua e analisa para caçar blocos fora do lugar por refatorações CSS desastradas que vazaram da div parente, evitando deploys disformes para o humano final.

## 3. Matriz de Entregáveis

- Interfaces enriquecidas estritamente presas aos tokens corporativos.
- Regressões visuais e estouros de Breakpoint (telas Mobile mal formatadas) blindados pela máquina QA Visual.
