---
description: workflow greenfield full-stack — do zero ao desenvolvimento completo — brief, PRD, spec, arquitetura, stories, implementação e QA
---

# Greenfield Fullstack Workflow

Workflow principal para construção de aplicações full-stack do zero. Cobre desde o bootstrap do ambiente até o ciclo completo de desenvolvimento de stories.

## Quando Usar

- Para novos projetos full-stack (web-app, SaaS, enterprise, MVP, protótipo)
- Quando não existe codebase anterior
- Para garantir planejamento completo antes de desenvolvimento

**Não usar se:** projeto já tem codebase existente → usar `brownfield-fullstack.md`

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.codex/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes a partir de `.codex/agent-memory/`.
3. Confirmar: "✅ Projeto pronto. Todas as ações operam na raiz do projeto."

---

## Fase 0: Bootstrap do Ambiente (@devops)

**Verificar se ambiente está pronto:**

```bash
cat .aiox/environment-report.json   # Se existir → pular Fase 0
```

Se NÃO existir, **Invocar @devops com Mission: `environment-bootstrap`**

```
Mission: environment-bootstrap
Context: Projeto greenfield fullstack — configurar ambiente completo
```

O @devops vai:

1. Verificar CLIs (git, gh, node, npm)
2. Criar repositório GitHub
3. Gerar `.aiox/config.yaml` + `.aiox/environment-report.json`
4. Scaffold da estrutura inicial do projeto

---

## Fase 1: Descoberta e Planejamento

### Step 1.1: Project Brief (@analyst)

**Invocar @analyst com Mission: `create-project-brief`**

```
Mission: create-project-brief
Template: project-brief-tmpl.yaml
Context: [Descrição do projeto/produto]
```

Opcionais antes do brief:

- `*facilitate-brainstorming` — sessão de ideação
- `*market-research` — pesquisa de mercado/competidores

Output: `docs/project-brief.md`

### Step 1.2: PRD (@pm)

**Invocar @pm com Mission: `create-prd`**

```
Mission: create-prd
Template: prd-tmpl.yaml
Input: docs/project-brief.md
```

Output: `docs/prd.md`

### Step 1.3: Front-End Spec (@ux)

**Invocar @ux com Mission: `create-frontend-spec`**

```
Mission: create-frontend-spec
Template: front-end-spec-tmpl.yaml
Input: docs/prd.md
```

Opcional: `*generate-ai-frontend-prompt` para gerar prompt de UI com IA (Stitch MCP, v0, Lovable)

> **Capacidade visual Codex:** gere wireframes com plugin/MCP visual disponível no Codex ou registre fallback documental.

Output: `docs/front-end-spec.md`

### Step 1.4: Arquitetura (@architect)

**Invocar @architect com Mission: `create-fullstack-architecture`**

```
Mission: create-fullstack-architecture
Template: fullstack-architecture-tmpl.yaml
Inputs: docs/prd.md, docs/front-end-spec.md
```

Se @architect sugerir mudanças no PRD:

- Loop de volta para @pm atualizar
- Retornar para @architect revisar

Output: `docs/fullstack-architecture.md`

### Step 1.5: Validação de Artefatos (@po)

**Invocar @po com Mission: `validate-artifacts`**

```
Mission: validate-artifacts
Checklist: po-master-checklist.md
Artifacts: [brief, prd, front-end-spec, fullstack-architecture]
```

- **Se PROBLEMAS encontrados:** Retornar ao agente responsável para correção → Re-validar
- **Se APROVADO:** Prosseguir para Fase 2

---

## Fase 2: Fragmentação de Documentos (@po)

**Invocar @po com Mission: `shard-documents`**

```
Mission: shard-documents
Task: shard-doc.md
Input: docs/prd.md
```

O @po vai fragmentar o PRD em arquivos operacionais:

- `docs/prd/` — seções do PRD fragmentadas
- `docs/architecture/source-tree.md`
- `docs/architecture/tech-stack.md`
- `docs/architecture/coding-standards.md`

---

## Fase 3: Ciclo de Desenvolvimento (Loop por Story)

Para cada story do backlog:

### Step 3.1: Criar Story (@sm)

**Invocar @sm com Mission: `create-next-story`**

```
Mission: create-next-story
Input: docs/prd/, docs/architecture/
```

### Step 3.2: Implementar (@dev)

**Invocar @dev com Mission: `develop-story`**

```
Mission: develop-story
Story: [path da story]
Mode: Interactive | YOLO
```

### Step 3.3: QA Review (@qa)

**Invocar @qa com Mission: `review-story`**

```
Mission: review-story
Story: [path da story]
```

- **Se NEEDS_WORK:** Loop de volta para @dev
- **Se APPROVED:** Próxima story ou encerrar

### Step 3.4: Commit (@devops)

**Invocar @devops com Mission: `commit`** após todas as stories do épico

---

## Fluxo de Handoff entre Agentes

```
@analyst → @pm → @ux → @architect → @po → (fragmentação) → @sm → @dev → @qa → @devops
```

## Resultado Esperado

- Ambiente configurado e repositório criado ✅
- Project Brief, PRD, Front-End Spec, Arquitetura aprovados ✅
- PRD fragmentado em docs operacionais ✅
- Stories implementadas com QA APPROVED ✅
- Commits criados prontos para push ✅

**Próximo passo:** @devops `*push` para publicar (requer aprovação explícita)

---

## Templates Necessários (verificar .codex/templates/)

| Template                           | Usado em |
| ---------------------------------- | -------- |
| `project-brief-tmpl.yaml`          | Fase 1.1 |
| `prd-tmpl.yaml`                    | Fase 1.2 |
| `front-end-spec-tmpl.yaml`         | Fase 1.3 |
| `fullstack-architecture-tmpl.yaml` | Fase 1.4 |
| `story-tmpl.yaml`                  | Fase 3.1 |
