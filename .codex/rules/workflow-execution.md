# Workflow Execution — Regras Detalhadas

## Princípio Task-First

**Workflows são compostos por tasks conectadas, não por agentes conectados.** Cada task define seus inputs, outputs, pré/pós-condições e modos de execução. Os agentes listados abaixo são os **executores padrão** de cada task — mas a sequência, as regras e as dependências vêm das definições de tasks em `.aiox-core/development/tasks/`.

Uma task validada é lei: deve ser executada conforme configurada, com todas as suas dependências respeitadas, independente de quem a executa (agent, worker, clone ou humano).

---

## 4 Workflows Primários

### 1. Story Development Cycle (SDC) — PRIMÁRIO

**Workflow completo de 4 fases para todo trabalho de desenvolvimento.**

#### Fase 1: Create (@sm)

- **Task:** `create-next-story.md`
- **Inputs:** PRD fragmentado, contexto de épico
- **Output:** `{epicNum}.{storyNum}.story.md`
- **Status:** Draft

#### Fase 2: Validate (@po)

- **Task:** `validate-next-story.md`
- **Checklist de 10 pontos** (ver `story-lifecycle.md`)
- **Decisão:** GO (>=7) ou NO-GO (correções necessárias listadas)

#### Fase 3: Implement (@dev)

- **Task:** `dev-develop-story.md`
- **Modos:** Interactive / YOLO / Pre-Flight
- **CodeRabbit:** Auto-healing máx 2 iterações
- **Status:** Ready → InProgress

#### Fase 4: QA Gate (@qa)

- **Task:** `qa-gate.md`
- **7 verificações de qualidade** (ver `story-lifecycle.md`)
- **Decisão:** PASS / CONCERNS / FAIL / WAIVED
- **Status:** InProgress → InReview → Done

---

### 2. QA Loop — REVISÃO ITERATIVA

**Ciclo automatizado de revisão-correção após QA gate inicial.**

```
@qa review → verdict → @dev fixes → re-review (máx 5)
```

**Comandos:**

- `*qa-loop {storyId}` — Iniciar loop
- `*qa-loop-review` — Retomar da revisão
- `*qa-loop-fix` — Retomar da correção
- `*stop-qa-loop` — Pausar, salvar estado
- `*resume-qa-loop` — Retomar do estado salvo
- `*escalate-qa-loop` — Forçar escalação

**Configuração:**

- Máx iterações: 5
- Arquivo de status: `qa/loop-status.json`

**Verdicts:**

- APPROVE → Completo, marcar como Done
- REJECT → @dev corrige, re-revisar
- BLOCKED → Escalar imediatamente

**Gatilhos de Escalação:**

- `max_iterations_reached`
- `verdict_blocked`
- `fix_failure`
- `manual_escalate`

---

### 3. Spec Pipeline — PRÉ-IMPLEMENTAÇÃO

**Transforma requisitos informais em spec executável.**

| Fase          | Agente     | Output                | Pular Se      |
| ------------- | ---------- | --------------------- | ------------- |
| 1. Gather     | @pm        | `requirements.json`   | Nunca         |
| 2. Assess     | @architect | `complexity.json`     | source=simple |
| 3. Research   | @analyst   | `research.json`       | Classe SIMPLE |
| 4. Write Spec | @pm        | `spec.md`             | Nunca         |
| 5. Critique   | @qa        | `critique.json`       | Nunca         |
| 6. Plan       | @architect | `implementation.yaml` | Se APPROVED   |

**Classes de Complexidade:**

| Pontuação | Classe   | Fases                        |
| --------- | -------- | ---------------------------- |
| <= 8      | SIMPLE   | gather → spec → critique (3) |
| 9-15      | STANDARD | Todas as 6 fases             |
| >= 16     | COMPLEX  | 6 fases + ciclo de revisão   |

**5 Dimensões de Complexidade (pontuadas 1-5):**

- **Scope:** Arquivos afetados
- **Integration:** APIs externas
- **Infrastructure:** Mudanças necessárias
- **Knowledge:** Familiaridade do time
- **Risk:** Nível de criticidade

**Verdicts de Crítica:**

| Verdict        | Pontuação Média | Próximo Passo           |
| -------------- | --------------- | ----------------------- |
| APPROVED       | >= 4.0          | Plan (Fase 6)           |
| NEEDS_REVISION | 3.0-3.9         | Revisar (Fase 5b)       |
| BLOCKED        | < 3.0           | Escalar para @architect |

**Gate Constitucional (Artigo IV — No Invention):**
Cada declaração em spec.md DEVE rastrear para FR-_, NFR-_, CON-\*, ou resultado de pesquisa. SEM features inventadas.

---

### 4. Brownfield Discovery — AVALIAÇÃO DE LEGADO

**Avaliação de dívida técnica em 10 fases para codebases existentes.**

**Coleta de Dados (Fases 1-3):**

- Fase 1: @architect → `system-architecture.md`
- Fase 2: @data-engineer → `SCHEMA.md` + `DB-AUDIT.md` (se DB existir)
- Fase 3: @ux → `frontend-spec.md`

**Draft & Validação (Fases 4-7):**

- Fase 4: @architect → `technical-debt-DRAFT.md`
- Fase 5: @data-engineer → `db-specialist-review.md`
- Fase 6: @ux → `ux-specialist-review.md`
- Fase 7: @qa → `qa-review.md` (QA Gate: APPROVED | NEEDS WORK)

**Finalização (Fases 8-10):**

- Fase 8: @architect → `technical-debt-assessment.md` (final)
- Fase 9: @analyst → `TECHNICAL-DEBT-REPORT.md` (executivo)
- Fase 10: @pm → Épico + stories prontas para desenvolvimento

**QA Gate (Fase 7):**

- **APPROVED:** Todos os débitos validados, sem gaps críticos, dependências mapeadas
- **NEEDS WORK:** Gaps não endereçados, retornar à Fase 4

---

## Guia de Seleção de Workflow

| Situação                                    | Workflow                  |
| ------------------------------------------- | ------------------------- |
| Nova story de épico                         | Story Development Cycle   |
| QA encontrou problemas, precisa de iteração | QA Loop                   |
| Feature complexa precisa de spec            | Spec Pipeline → então SDC |
| Entrando em projeto existente               | Brownfield Discovery      |
| Correção simples de bug                     | SDC apenas (modo YOLO)    |

---

## Squads: Globais vs Projeto

### Squad Global (`.codex/squads/`)
- Disponível para o projeto onde o AIOX está instalado
- Ex: `legal`, `storytelling`, `design`, `squad-creator`
- Criado por `@squad-chief` como parte do framework

### Squad de Projeto (`squads/`)
- Específico do projeto corrente
- Configurado para o stack/domínio do projeto
- Criado por `@squad-chief` quando o usuário solicita

> **Protocolo:** Ao criar squad, `@squad-chief` deve perguntar:  
> "Este squad é **global** (parte do framework) ou **de projeto** (específico deste projeto)?"

---

## Todos os 14 Workflows AIOX (Referência Completa)

> Ver `.codex/workflows/README.md` para guia de seleção visual completo.

### Greenfield (Novos Projetos)

| Workflow              | Arquivo                   | Quando Usar                   |
| --------------------- | ------------------------- | ----------------------------- |
| Greenfield Full-Stack | `greenfield-fullstack.md` | App full-stack do zero        |
| Greenfield Service    | `greenfield-service.md`   | Backend/API do zero           |
| Greenfield UI         | `greenfield-ui.md`        | Frontend do zero + Stitch MCP |

### Brownfield (Projetos Existentes)

| Workflow              | Arquivo                   | Quando Usar                   |
| --------------------- | ------------------------- | ----------------------------- |
| Brownfield Discovery  | `brownfield-discovery.md` | Primeiro mapeamento de legado |
| Brownfield Full-Stack | `brownfield-fullstack.md` | Evolução full-stack existente |
| Brownfield Service    | `brownfield-service.md`   | Evolução backend existente    |
| Brownfield UI         | `brownfield-ui.md`        | Evolução frontend existente   |

### Desenvolvimento e Processo

| Workflow              | Arquivo                      | Quando Usar                 |
| --------------------- | ---------------------------- | --------------------------- |
| Story Dev Cycle (SDC) | `story-development-cycle.md` | Uma story completa          |
| Spec Pipeline         | `spec-pipeline.md`           | Ideia → PRD → Stories       |
| Epic Orchestration    | `epic-orchestration.md`      | Gerenciar épico completo    |
| QA Loop               | `qa-loop.md`                 | Ciclo iterativo de correção |

### Especiais

| Workflow            | Arquivo                  | Quando Usar                   |
| ------------------- | ------------------------ | ----------------------------- |
| Design System Build | `design-system-build.md` | Criar/refatorar design system |
| Create Squad        | `create-squad.md`        | Criar squad de mind clones    |
| Auto Worktree       | `auto-worktree.md`       | Desenvolvimento em paralelo   |
