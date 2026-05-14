---
description: workflow brownfield service — evolução de backend/API existente — análise de impacto, database migrations, implementação segura
---

# Brownfield Service Workflow

Workflow para evolução de serviços backend/API existentes. Focado em mudanças seguras com rollback garantido e zero impacto em produções.

## Quando Usar

- Para adicionar/modificar endpoints em API existente
- Para evoluir lógica de negócio backend sem impactar frontend
- Quando é necessário database migration em produção

**Pré-requisito:** Executar `brownfield-discovery.md` se for a primeira vez no projeto.

---

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.codex/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes a partir de `.codex/agent-memory/`.
3. Carregar `.aiox/gotchas.json` se existir.
4. Verificar se `docs/architecture/` existe. Se não, alertar: "⚠️ Execute `brownfield-discovery.md` primeiro para mapear o serviço."
5. Confirmar: "✅ Contexto do projeto carregado. Pronto para evolução do serviço."

---

## Step 1: Carregar Contexto do Serviço

```bash
# Leitura obrigatória
docs/architecture/         # Arquitetura documentada
aiox/gotchas.json         # Gotchas — LEIA ANTES DE TUDO
supabase/docs/SCHEMA.md    # Schema atual (se DB existente)
```

---

## Step 2: Spec de Mudança (@pm / @architect)

**Invocar @pm com Mission: `spec-service-change`**

```
Mission: spec-service-change
Context: [Descrição da mudança no serviço]
Input: docs/architecture/, current codebase
```

O @pm vai documentar:

- Endpoints afetados (CRUD, Auth, Business Logic)
- Contratos de API (request/response) — mudanças são breaking?
- Consumidores do serviço afetados

Seguido de **@architect com Mission: `validate-service-change`**

```
Mission: validate-service-change
Focus: Breaking changes, backward compatibility, migration strategy
```

**Se breaking change:** Planejar versionamento de API (v1 → v2).

---

## Step 3: Database Migration Planning (@data-engineer)

Se a mudança afeta o banco de dados:

**Invocar @data-engineer com Mission: `plan-migration`**

```
Mission: plan-migration
Input: supabase/docs/SCHEMA.md
Context: [Mudanças necessárias no schema]
```

O @data-engineer vai:

1. Verificar se migration é compatível com dados existentes
2. Criar migration file seguindo convenções do projeto
3. Planejar rollback se necessário
4. Validar com `*db-dry-run` antes de aplicar

**Regra crítica:** NUNCA DROP em produção sem backup e plano de rollback.

---

## Step 4: Criação de Épico e Stories (@pm + @sm)

**@pm: `create-brownfield-epic`**

```
Mission: create-brownfield-epic
Context: Service changes — [descrição]
Output: docs/epics/service-{feature}-epic.md
```

**@po: `validate-epic`** antes de criar stories.

**@sm: `create-brownfield-story`** para cada entrega.

---

## Step 5: Ciclo de Desenvolvimento (Loop por Story)

### Step 5.1: Análise de Impacto (@architect)

```
Mission: analyze-impact
Story: [path da story]
Focus: Arquivos de serviço afetados, testes existentes, consumers
```

### Step 5.2: Implementar (@dev)

```
Mission: develop-brownfield-story
Story: [path da story]
Mode: Interactive
```

O @dev deve:

1. Verificar `aiox/gotchas.json`
2. Executar testes existentes ANTES de modificar
3. Implementar com backward compatibility
4. Adicionar testes para nova funcionalidade
5. Executar suite completa após implementação

### Step 5.3: Migration (se aplicável) (@data-engineer)

```
Mission: apply-migration
Context: Aplicar migration para [story]
```

Sequência obrigatória:

1. `*db-dry-run` — validar sem executar
2. `*db-snapshot` — backup do estado atual
3. `*db-apply-migration` — executar migration
4. `*db-smoke-test` — validar estado pós-migration

### Step 5.4: QA Review (@qa)

```
Mission: review-service-story
Story: [path da story]
Focus: Contract tests, integration tests, error handling, security
```

- **Se NEEDS_WORK:** Loop @dev → @qa (usar qa-loop.md para iterações)
- **Se APPROVED:** Próxima story

### Step 5.5: Commit (@devops)

---

## Resultado Esperado

- Mudanças no serviço implementadas com backward compatibility ✅
- Database migrations executadas com rollback testado ✅
- Suite de testes passando (incluindo novos e existentes) ✅
- QA APPROVED ✅
- Commits criados prontos para push ✅
