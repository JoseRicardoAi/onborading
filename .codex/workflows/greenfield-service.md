---
description: workflow greenfield service — construção de backend/API do zero — arquitetura, database, implementação e QA
---

# Greenfield Service Workflow

Workflow para construção de serviços backend/API do zero. Focado em API design, database schema e implementação de serviços robustos.

## Quando Usar

- Para novos projetos backend puro (REST API, GraphQL, microserviço)
- Sem necessidade de frontend (ou com frontend separado)
- Quando o foco é serviço/API com lógica de negócio

**Não usar se:** projeto tem frontend integrado → usar `greenfield-fullstack.md`

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
Context: Projeto greenfield service/backend — configurar ambiente
```

---

## Fase 1: Planejamento do Serviço

### Step 1.1: Brief e Requisitos (@analyst / @pm)

**Invocar @analyst com Mission: `create-project-brief`**

```
Mission: create-project-brief
Template: project-brief-tmpl.yaml
Context: [Descrição do serviço/API]
```

Seguido de **@pm com Mission: `create-prd`**

```
Mission: create-prd
Template: prd-tmpl.yaml
Focus: Service/API requirements, endpoints, business rules
```

Output: `docs/prd.md`

### Step 1.2: Arquitetura de Serviço (@architect)

**Invocar @architect com Mission: `create-service-architecture`**

```
Mission: create-service-architecture
Template: fullstack-architecture-tmpl.yaml
Input: docs/prd.md
Focus: API design, service layers, integrations
```

O @architect vai:

1. Definir estrutura de endpoints
2. Projetar camadas de serviço
3. Mapear integrações externas
4. Documentar decisões arquiteturais

Output: `docs/service-architecture.md`

### Step 1.3: Schema de Banco de Dados (@data-engineer)

**Invocar @data-engineer com Mission: `design-schema`**

```
Mission: design-schema
Template: database-schema-request-full.md
Input: docs/prd.md, docs/service-architecture.md
```

O @data-engineer vai:

1. Aplicar KISS Gate (validar necessidade de cada tabela)
2. Projetar schema normalizado
3. Definir RLS policies (se Supabase)
4. Criar migration inicial

Output: `supabase/docs/SCHEMA.md` (ou equivalente)

### Step 1.4: Validação (@po)

**Invocar @po com Mission: `validate-artifacts`**

```
Mission: validate-artifacts
Checklist: po-master-checklist.md
Artifacts: [prd, service-architecture, schema]
```

---

## Fase 2: Setup do Banco de Dados (@data-engineer)

**Se projeto usa banco de dados:**

**Invocar @data-engineer com Mission: `setup-database`**

```
Mission: setup-database
Context: Configurar banco conforme schema aprovado
```

O @data-engineer vai:

1. Executar migration inicial
2. Configurar RLS
3. Criar seeds de desenvolvimento
4. Validar com `*db-smoke-test`

---

## Fase 3: Ciclo de Desenvolvimento (Loop por Story)

Fragmentar PRD primeiro:

**@po com Mission: `shard-documents`** → `docs/architecture/source-tree.md`, `tech-stack.md`, `coding-standards.md`

Para cada story:

### Step 3.1: Criar Story (@sm)

```
Mission: create-next-story
Focus: Backend endpoints, business logic, database operations
```

### Step 3.2: Implementar (@dev)

```
Mission: develop-story
Story: [path da story]
Context: Backend only — seguir coding standards e service architecture
```

### Step 3.3: QA Review (@qa)

```
Mission: review-story
Story: [path da story]
Focus: Testes de API, coverage, edge cases, security
```

- **Se NEEDS_WORK:** Loop @dev → @qa
- **Se APPROVED:** Próxima story

### Step 3.4: Commit (@devops)

```
Mission: commit
Story: [path da story]
```

---

## Resultado Esperado

- Ambiente configurado ✅
- PRD e Arquitetura de Serviço aprovados ✅
- Schema de banco projetado e executado ✅
- Endpoints implementados com testes ✅
- QA APPROVED em todas as stories ✅
- Commits criados prontos para push ✅

---

## Templates Necessários

| Template                           | Usado em |
| ---------------------------------- | -------- |
| `project-brief-tmpl.yaml`          | Fase 1.1 |
| `prd-tmpl.yaml`                    | Fase 1.1 |
| `fullstack-architecture-tmpl.yaml` | Fase 1.2 |
| `database-schema-request-full.md`  | Fase 1.3 |
| `story-tmpl.yaml`                  | Fase 3.1 |
