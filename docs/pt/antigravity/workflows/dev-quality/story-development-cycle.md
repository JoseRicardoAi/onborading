# Workflow: Story Development Cycle (SDC)

**Arquivo de origem nativo:** `.antigravity/workflows/story-development-cycle.md`

O **Story Development Cycle (SDC)** é o workflow de maior rotatividade dentro de um estúdio Antigravity. Se concentra essencialmente na rotina isolada de um bloco estrito de programação focado no cumprimento impiedoso das obrigações documentadas (Acceptance Criterias) de um Ticket já validado.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow exclusivamente quando:

- Foi sinalizado luz verde para a Sprint.
- Quer processar uma única _Story_ cujo documento repousa confortavelmente no diretório `docs/stories/` sob a tag de status `Ready`.
- **NÃO DEVE** ser usado se a arquitetura geral mudar; isto trata apenas de tijolo por tijolo.

> **Nota de Interceptação (YOLO vs Squad Padrão):** O Antigravity agora possui um _Interception Hook_ nativo. Se você solicitar a criação de uma feature pesada sem focar em uma Squad específica, o sistema irá pausar e exibir um alerta. Você poderá então engatar a **Squad Padrão**, que executará este fluxo (SDC) a partir da elaboração do PRD ou UI Guidelines, evitando a execução desgovernada do YOLO Mode.

## 2. A Jornada Operacional (Fases)

### Fase 1: Pré-Leitura Fria

Check inicial duro das premissas via prompt local: A Story existe? Os pontos avaliativos e Criterios estão formatados? Caso não, cai do fluxo prematuramente.

### Fase 2: Teste de Abalos Sísmicos (@architect)

O `@architect` é temporariamente acionado (`analyze-impact`) com missão de varredura microscópica: Lê o que o ticket clama e deduz "quais arquivos `src/` quebram e sangrarão ao tentar fazer isso" baseando-se no `impact-analysis.md`. Uma trava se fecha se ele identificar colapsos nas fundações atuais.

### Fase 3: A Operação de Implementação Bruta (@dev / @ui-builder)

O trabalho pesado inicia seguindo a bifurcação natural da task:

- Sendo rotina lógica e sistêmica genérica: Delega-se ao dev raiz (`@dev`).
- Tendo apelo imensamente voltado a front-end governado por `ui-guidelines`: Redirecionamento obrigatório ao arquiteto visual (`@ui-builder`).
  Neste sub-loop o sistema obriga os agentes forçarem linting local e tipagem de código atômica (sem empurrar Typescript castigado).

### Fase 4: Auditoria Definitiva (@qa)

Código ezenhando, a verificação iterativa é acordada (`review-story`). O bot `@qa` cruza os códigos VS o Acceptance. Rejeitando, ele não varre para baixo do tapete e exige a cirurgia focada, retornando pro DEV prender os vazios do Criterio via fluxo de iterações (`qa-loop`). Se gravemente furado, ele grita por Human Intervention (Escalação).

### Fase 5: Prateleira de Lançamento (@devops)

Passado liso pelo tribunal (QA Approved), o `@devops` comita atrelando mensagens severamente ligadas sob _Conventional Commits_ de repasse e carimba a metamorfose da Story para _Done_. NÃO SE EFETUA PUSH; a entrega madura espera repousando localmente aprovações macro do repo (`push`).

## 3. Matriz de Entregáveis

- Código formatado sem warnings severos de tipagem/linter.
- Relatório de Impacto de modificações para histórico base.
- Ticket setado formalmente como _Done_ no painel morto e commits salvos isolados.
