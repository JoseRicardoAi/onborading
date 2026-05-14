# Templates — Catálogo Completo

Os **17 templates** em `.antigravity/templates/` são documentos-modelo usados pelos agentes AIOX para gerar artefatos padronizados.

---

## Como Usar Templates

Os agentes acessam templates via `view_file`:

```
@pm use o template de PRD para iniciar o documento do produto X
→ @pm view_file('.antigravity/templates/prd-tmpl.yaml')
→ preenche os campos e salva em docs/
```

Nenhum template deve ser editado diretamente — eles ficam em `.antigravity/templates/` como referência imutável.

---

## Catálogo de Templates

### Templates de Produto

| Template                   | Tamanho | Agente Principal | Path                                              |
| -------------------------- | ------- | ---------------- | ------------------------------------------------- |
| `prd-tmpl.yaml`            | 6.4KB   | `@pm`            | `.antigravity/templates/prd-tmpl.yaml`            |
| `project-brief-tmpl.yaml`  | 7.1KB   | `@pm`            | `.antigravity/templates/project-brief-tmpl.yaml`  |
| `brownfield-prd-tmpl.yaml` | 7.4KB   | `@architect`     | `.antigravity/templates/brownfield-prd-tmpl.yaml` |
| `story-tmpl.yaml`          | 4.4KB   | `@po`            | `.antigravity/templates/story-tmpl.yaml`          |

### Templates de Arquitetura

| Template                           | Tamanho | Agente Principal    | Path                                                      |
| ---------------------------------- | ------- | ------------------- | --------------------------------------------------------- |
| `fullstack-architecture-tmpl.yaml` | 13.8KB  | `@architect`        | `.antigravity/templates/fullstack-architecture-tmpl.yaml` |
| `front-end-architecture-tmpl.yaml` | 6.7KB   | `@architect`        | `.antigravity/templates/front-end-architecture-tmpl.yaml` |
| `front-end-spec-tmpl.yaml`         | 7.9KB   | `@ux-design-expert` | `.antigravity/templates/front-end-spec-tmpl.yaml`         |

### Templates de Banco de Dados

| Template                          | Tamanho | Agente Principal | Path                                                     |
| --------------------------------- | ------- | ---------------- | -------------------------------------------------------- |
| `database-schema-request-full.md` | 9.7KB   | `@data-engineer` | `.antigravity/templates/database-schema-request-full.md` |
| `database-schema-request-lite.md` | 5.6KB   | `@data-engineer` | `.antigravity/templates/database-schema-request-lite.md` |

### Templates de Pesquisa e Análise

| Template                         | Tamanho | Agente Principal | Path                                                    |
| -------------------------------- | ------- | ---------------- | ------------------------------------------------------- |
| `market-research-tmpl.yaml`      | 7.9KB   | `@analyst`       | `.antigravity/templates/market-research-tmpl.yaml`      |
| `competitor-analysis-tmpl.yaml`  | 7.7KB   | `@analyst`       | `.antigravity/templates/competitor-analysis-tmpl.yaml`  |
| `brainstorming-output-tmpl.yaml` | 5.1KB   | `@analyst`       | `.antigravity/templates/brainstorming-output-tmpl.yaml` |

### Templates de Qualidade

| Template            | Tamanho | Agente Principal | Path                                       |
| ------------------- | ------- | ---------------- | ------------------------------------------ |
| `qa-gate-tmpl.yaml` | 2.4KB   | `@qa`            | `.antigravity/templates/qa-gate-tmpl.yaml` |

### Templates de Sistema (Meta-templates)

| Template                 | Tamanho | Usado Por      | Path                                            |
| ------------------------ | ------- | -------------- | ----------------------------------------------- |
| `agent-template.yaml`    | 1.7KB   | `@squad-chief` | `.antigravity/templates/agent-template.yaml`    |
| `workflow-template.yaml` | 3.1KB   | `@squad-chief` | `.antigravity/templates/workflow-template.yaml` |
| `task-template.md`       | 1.5KB   | `@squad-chief` | `.antigravity/templates/task-template.md`       |
| `notebook-ids.yaml`      | 1.0KB   | `@squad-chief` | `.antigravity/templates/notebook-ids.yaml`      |

---

## Detalhes por Template

### `prd-tmpl.yaml` — Product Requirements Document

**Usado por:** `@pm`  
**Quando:** Ao iniciar especificação de produto ou feature principal

**Seções cobertas:**

- Executive Summary
- Problem Statement e User Pain Points
- Goals e Success Metrics
- User Personas
- Feature Requirements (MoSCoW)
- Non-functional Requirements
- Timeline e Milestones

---

### `story-tmpl.yaml` — Story de Desenvolvimento

**Usado por:** `@po`  
**Quando:** `@po *create-story`

**Seções cobertas:**

- Story ID e título
- Como um [persona], eu quero [feature] para que [benefício]
- Acceptance Criteria (BDD: Given/When/Then)
- Definition of Done
- File List (rastreamento de mudanças)
- Progress checkboxes

---

### `fullstack-architecture-tmpl.yaml` — Arquitetura Full-Stack

**Usado por:** `@architect`  
**Quando:** Antes de implementações em `supabase/functions/` (Architecture First)

**Seções cobertas:**

- System Overview e Context Diagram
- Technology Stack decisions (ADRs)
- Frontend Architecture
- Backend Architecture
- Database Schema overview
- Security Considerations
- Deployment Strategy

---

### `database-schema-request-full.md` vs `lite.md`

**Usado por:** `@data-engineer`

| Versão            | Quando Usar                                 |
| ----------------- | ------------------------------------------- |
| `full.md` (9.7KB) | Schema novo complexo, multi-tabela, com RLS |
| `lite.md` (5.6KB) | Adição simples de tabela ou campo           |

---

### `agent-template.yaml` — Template de Agente

**Usado por:** `@squad-chief`  
**Quando:** Criar novo agente em um squad

**Estrutura gerada:**

```yaml
agent:
  name: ...
  id: ...
  title: ...
persona:
  role: ...
  style: ...
  voice_dna: []
commands: []
quality_gates: {}
```

---

### `workflow-template.yaml` — Template de Workflow

**Usado por:** `@squad-chief`  
**Quando:** Criar novo workflow para um squad

**Seções:**

- `description` — O que faz
- `trigger` — Quando executar
- `steps` — Passos numerados
- `output` — Artefatos gerados

---

## Localização dos Outputs

Após preencher um template, salve o arquivo no path correto:

| Template                           | Output Path                            |
| ---------------------------------- | -------------------------------------- |
| `prd-tmpl.yaml`                    | `docs/architecture/{projeto}-prd.md`   |
| `story-tmpl.yaml`                  | `docs/stories/active/{id}-{titulo}.md` |
| `market-research-tmpl.yaml`        | `docs/research/{topic}.md`             |
| `fullstack-architecture-tmpl.yaml` | `docs/architecture/{feature}.md`       |
| `qa-gate-tmpl.yaml`                | `docs/qa/{story-id}-qa-report.md`      |

---

## `README.md` dos Templates

O arquivo `.antigravity/templates/README.md` contém orientações adicionais e o índice completo:

```
view_file('.antigravity/templates/README.md')
```
