# Workflows Antigravity - Indice e Guia de Selecao

> Ponto de entrada unico para todos os workflows do AIOX no ambiente Antigravity.

**Total de Workflows:** 15 | **Atualizacao:** 2026-05-07

---

## Guia de Selecao Rapida

### Novo Projeto?

| Tipo de Projeto | Workflow |
| --- | --- |
| Full-stack | [greenfield-fullstack.md](./greenfield-fullstack.md) |
| Backend/API | [greenfield-service.md](./greenfield-service.md) |
| Frontend/UI | [greenfield-ui.md](./greenfield-ui.md) |

### Projeto Existente?

| Situacao | Primeiro passo |
| --- | --- |
| Nao conheco o projeto | [brownfield-discovery.md](./brownfield-discovery.md) |
| Conheco - Full-stack | [brownfield-fullstack.md](./brownfield-fullstack.md) |
| Conheco - Backend/API | [brownfield-service.md](./brownfield-service.md) |
| Conheco - Frontend/UI | [brownfield-ui.md](./brownfield-ui.md) |

### Processo de Desenvolvimento?

| Situacao | Workflow |
| --- | --- |
| Ideia para backlog | [spec-pipeline.md](./spec-pipeline.md) |
| Epico para executar stories | [epic-orchestration.md](./epic-orchestration.md) |
| Story pronta para implementar | [story-development-cycle.md](./story-development-cycle.md) |
| QA reprovou e precisa correcao | [qa-loop.md](./qa-loop.md) |
| Criar design system | [design-system-build.md](./design-system-build.md) |
| Criar novo squad de agentes IA | [create-squad.md](./create-squad.md) |
| Trabalho paralelo em features | [auto-worktree.md](./auto-worktree.md) |
| Trocar IDE/runtime ativa | [switch-ide-runtime.md](./switch-ide-runtime.md) |

---

## Indice Completo

### Greenfield

| Workflow | Arquivo | Quando Usar |
| --- | --- | --- |
| Greenfield Full-stack | `greenfield-fullstack.md` | App full-stack do zero |
| Greenfield Service | `greenfield-service.md` | Backend/API do zero |
| Greenfield UI | `greenfield-ui.md` | Frontend do zero |

### Brownfield

| Workflow | Arquivo | Quando Usar |
| --- | --- | --- |
| Brownfield Discovery | `brownfield-discovery.md` | Primeiro mapeamento de projeto legado |
| Brownfield Full-stack | `brownfield-fullstack.md` | Evolucao full-stack existente |
| Brownfield Service | `brownfield-service.md` | Evolucao backend existente |
| Brownfield UI | `brownfield-ui.md` | Evolucao frontend existente |

### Processos de Desenvolvimento

| Workflow | Arquivo | Quando Usar |
| --- | --- | --- |
| Spec Pipeline | `spec-pipeline.md` | Ideia para PRD, epicos e stories |
| Epic Orchestration | `epic-orchestration.md` | Execucao coordenada de epico completo |
| Story Development Cycle | `story-development-cycle.md` | Uma story com analise, dev, QA e commit |
| QA Loop | `qa-loop.md` | Ciclo iterativo de correcao QA |

### Especiais e Ambiente

| Workflow | Arquivo | Quando Usar |
| --- | --- | --- |
| Design System Build | `design-system-build.md` | Criar/refatorar design system |
| Create Squad | `create-squad.md` | Criar squad de mind clones |
| Auto Worktree | `auto-worktree.md` | Desenvolvimento paralelo de features |
| Switch IDE Runtime | `switch-ide-runtime.md` | Trocar runtime ativa Antigravity/Codex |

---

## Fluxo entre Workflows

```text
Novo Projeto:
  greenfield-* -> spec-pipeline -> epic-orchestration -> story-development-cycle -> qa-loop

Projeto Existente:
  brownfield-discovery -> brownfield-* -> epic-orchestration -> story-development-cycle -> qa-loop

Processos Transversais:
  spec-pipeline -> Qualquer fluxo de desenvolvimento
  qa-loop -> Qualquer story com NEEDS_WORK
  design-system -> Greenfield UI ou Brownfield UI
  auto-worktree -> Qualquer workflow
  create-squad -> Independente, qualquer momento
  switch-ide-runtime -> Independente, qualquer momento
```
