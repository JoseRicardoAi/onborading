# Workflows — Os 14 Workflows Nativos

> **Atualizado:** 2026-04-01 | **Total:** 16 workflows + README de seleção

Os **16 workflows** em `.antigravity/workflows/` são equivalentes a slash commands e sequências do Antigravity Code, traduzidos e enriquecidos para o formato nativo do Antigravity.

---

## O que são Workflows no Antigravity?

No Antigravity Code, os workflows eram slash commands como `/AIOX:story`, `/cohort-squad:create`. No Antigravity, eles são arquivos `.md` em `.antigravity/workflows/` que os agentes executam como sequências de passos estruturados.

**Formato:**

```yaml
---
description: breve descrição do workflow
---
## Passos
1. ...
2. ...
```

> **Índice completo com guia de seleção:** [`.antigravity/workflows/README.md`](../../../../.antigravity/workflows/README.md)

---

## Tabela Completa de Workflows

### Greenfield — Projetos Novos

| Workflow                                                     | Quando Usar                        | Responsável                                                      |
| ------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------------- |
| [`greenfield-fullstack`](greenfield/greenfield-fullstack.md) | Nova aplicação full-stack do zero  | `@analyst → @pm → @ux → @architect → @po → @dev → @qa → @devops` |
| [`greenfield-service`](greenfield/greenfield-service.md)     | Novo backend/API do zero           | `@architect → @data-engineer → @dev → @qa`                       |
| [`greenfield-ui`](greenfield/greenfield-ui.md)               | Novo frontend/landing page do zero | `@ux → @ui-builder → @qa` (+ Stitch MCP)                         |

### Brownfield — Projetos Existentes

| Workflow                                                     | Quando Usar                        | Responsável                                    |
| ------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------- |
| [`brownfield-discovery`](brownfield/brownfield-discovery.md) | Novo no projeto — precisa entender | `@architect → @analyst → @data-engineer → @ux` |
| [`brownfield-fullstack`](brownfield/brownfield-fullstack.md) | Adicionar feature full-stack       | `@architect → @dev → @qa → @devops`            |
| [`brownfield-service`](brownfield/brownfield-service.md)     | Adicionar endpoint/serviço         | `@data-engineer → @dev → @qa`                  |
| [`brownfield-ui`](brownfield/brownfield-ui.md)               | Adicionar página/componente        | `@ux → @ui-builder → @qa` (+ browser_subagent) |

### Desenvolvimento e Qualidade

| Workflow                                                            | Quando Usar                         | Responsável                                        |
| ------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------- |
| [`story-development-cycle`](dev-quality/story-development-cycle.md) | Implementar uma story               | `@sm → @po → @dev`/`@ui-builder` `→ @qa → @devops` |
| [`spec-pipeline`](dev-quality/spec-pipeline.md)                     | Ideia → backlog completo            | `@pm → @analyst → @architect → @po → @dev`         |
| [`epic-orchestration`](dev-quality/epic-orchestration.md)           | Executar épico completo             | `@po → @sm → @dev → @qa → @devops`                 |
| [`qa-loop`](dev-quality/qa-loop.md)                                 | QA reprovou → corrigir e re-validar | `@qa → @dev → @qa` (máx. 5 iterações)              |

### Especiais

| Workflow                                                 | Quando Usar                          | Responsável                      |
| -------------------------------------------------------- | ------------------------------------ | -------------------------------- |
| [`design-system-build`](specials/design-system-build.md) | Criar ou refatorar design system     | `@ux → @brad-frost → @dev → @qa` |
| [`stitch-ui-workflow`](stitch-ui-workflow.md)            | Pipeline mandatório para gerar telas | `@ui-builder` orquestrando MCP   |
| [`create-squad`](specials/create-squad.md)               | Criar squad de especialistas         | `@squad-chief → @oalanicolas`    |
| [`auto-worktree`](specials/auto-worktree.md)             | Desenvolvimento paralelo de features | `@devops`                        |

### Correspondência com Antigravity Code

| Slash Command Antigravity   | Workflow Antigravity                            |
| ---------------------- | ----------------------------------------------- |
| `/AIOX:story`          | `story-development-cycle.md`                    |
| `/AIOX:spec-pipeline`  | `spec-pipeline.md`                              |
| `/cohort-squad:create` | `create-squad.md`                               |
| `/cohort-squad:sync`   | `auto-worktree.md` (parcial)                    |
| Analysis commands      | `brownfield-discovery.md`                       |
| _(não existia)_        | `greenfield-fullstack.md` (novo)                |
| _(não existia)_        | `greenfield-ui.md` + Stitch MCP **(exclusivo)** |
| _(não existia)_        | `design-system-build.md` **(exclusivo)**        |
| _(não existia)_        | `epic-orchestration.md` (novo)                  |
| _(não existia)_        | `qa-loop.md` (novo)                             |

---

## Detalhes dos Workflows Principais

### `story-development-cycle` — Ciclo Completo de Story

**Arquivo:** `.antigravity/workflows/story-development-cycle.md`

O workflow mais usado — governa o ciclo completo de desenvolvimento de uma feature.

**Sequência:**

```
@sm *draft
  ↓
@po *validate
  ↓
@dev *develop (Lados lógicos/backend) OU @ui-builder (Telas e frontend via Stitch MCP)
  ↓
@qa *qa-gate
  ↓
@devops *push
```

| Etapa    | Agente               | Artefato                      | Critério de Saída                 |
| -------- | -------------------- | ----------------------------- | --------------------------------- |
| Draft    | `@sm`                | Story em `docs/stories/`      | Story com critérios iniciais      |
| Validate | `@po`                | Story com acceptance criteria | ACs mensuráveis e completos       |
| Develop  | `@dev`/`@ui-builder` | Código implementado           | Todos os ACs cobertos             |
| QA Gate  | `@qa`                | Relatório de qualidade        | lint ✅ + typecheck ✅ + tests ✅ |
| Push     | `@devops`            | PR criado / branch pushed     | Remote atualizado                 |

---

### `greenfield-fullstack` — Projeto Full-Stack do Zero

**Arquivo:** `.antigravity/workflows/greenfield-fullstack.md`

Workflow completo para construir aplicações full-stack do zero. Inclui 4 fases:

```
Fase 0: Bootstrap de ambiente
Fase 1: Discovery & Planning (@analyst → @pm → @ux → @architect → @po)
Fase 2: Fragmentação de documentos
Fase 3: Ciclo de desenvolvimento (SDC repetido para cada story)
```

---

### `qa-loop` — Ciclo Iterativo de Correção QA

**Arquivo:** `.antigravity/workflows/qa-loop.md`

Ativado quando `@qa` emite veredicto `REJECT`. Opera com máximo de **5 iterações**:

```
@qa review → veredicto REJECT
  ↓
@qa create-fix-request
  ↓
@dev apply-fixes
  ↓
Incrementa iteração — volta para review
  ↓ (se iteração ≥ 5 ou BLOCKED)
ESCALAÇÃO para humano
```

**Veredictos:** `APPROVE` / `REJECT` / `BLOCKED`

---

### `design-system-build` — Design System com Stitch MCP

**Arquivo:** `.antigravity/workflows/design-system-build.md`

> ⭐ Workflow exclusivo do Antigravity — utiliza ferramentas que o Antigravity Code não possui.

```
@ux audit → @brad-frost atomic design review
→ mcp_stitch_* (wireframes e telas)
→ generate_image (assets visuais)
→ @dev implementa tokens e componentes
→ @qa valida visual com browser_subagent
```

---

### `create-squad` — Criação de Squad

**Arquivo:** `.antigravity/workflows/create-squad.md`

```
@squad-chief recebe request
→ Pesquisa mentes de elite (search_web)
→ Curada de especialistas reais com frameworks
→ DNA extraction por @oalanicolas
→ Geração de agentes
→ Estrutura do squad em squads/
```

---

## Encadeamento Natural entre Workflows

Alguns workflows se encadeiam naturalmente após a conclusão de outro:

| Workflow Concluído        | Próximo Sugerido                  | Condição                            |
| ------------------------- | --------------------------------- | ----------------------------------- |
| `brownfield-discovery`    | `brownfield-fullstack/service/ui` | Baseado no tipo de evolução         |
| `spec-pipeline`           | `epic-orchestration`              | Após épicos gerados                 |
| `epic-orchestration`      | `story-development-cycle`         | Para cada story                     |
| `story-development-cycle` | `qa-loop`                         | Se QA emitir REJECT                 |
| `greenfield-ui`           | `design-system-build`             | Quando design system for necessário |

---

## Documentação Relacionada

- [Índice de Workflows](../../../../.antigravity/workflows/README.md) — Seleção rápida completa
- [Agentes Core](../agents/core-agents.md) — Agentes que executam os workflows
- [Templates](../templates/overview.md) — Templates usados nos workflows
- [Skills](../skills/overview.md) — Skills chamadas durante os workflows
