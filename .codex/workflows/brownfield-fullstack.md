---
description: workflow brownfield fullstack — evolução de aplicação full-stack existente — discovery, planejamento de epics, implementação e QA
---

# Brownfield Fullstack Workflow

Workflow para evolução de aplicações full-stack existentes. Usado após o `brownfield-discovery` para implementar novos épicos com profundo respeito pelo codebase existente.

## Quando Usar

- Após completar `brownfield-discovery.md` (arquitetura já documentada)
- Para adicionar features completas (backend + frontend) em projeto existente
- Quando mudanças afetam múltiplas camadas do sistema

**Pré-requisito:** Executar `brownfield-discovery.md` primeiro se projeto novo para a equipe.

---

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.codex/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes a partir de `.codex/agent-memory/`.
3. Carregar `.aiox/gotchas.json` se existir.
4. Verificar se `docs/architecture/` existe. Se não, alertar: "⚠️ Execute `brownfield-discovery.md` primeiro para mapear o projeto."
5. Confirmar: "✅ Contexto do projeto carregado. Pronto para evolução."

---

## Step 1: Leitura do Contexto Existente

Antes de qualquer desenvolvimento, carregar o contexto do projeto:

```bash
# Leitura obrigatória ao início
docs/architecture/       # Arquitetura documentada pelo discovery
aiox/gotchas.json       # Gotchas críticos mapeados
docs/prd.md              # PRD existente (se houver)
```

**Se contexto não existe:** Executar `brownfield-discovery.md` primeiro.

---

## Step 2: Criação do PRD Brownfield (@pm)

**Invocar @pm com Mission: `create-brownfield-prd`**

```
Mission: create-brownfield-prd
Template: brownfield-prd-tmpl.yaml
Context: Evolução de [feature/épico] no projeto existente
Input: docs/architecture/, aiox/gotchas.json
```

O @pm vai:

1. Documentar estado atual (As-Is)
2. Definir estado desejado (To-Be)
3. Mapear impactos e dependências
4. Criar roadmap de épicos

Output: `docs/prd-brownfield-{feature}.md`

---

## Step 3: Validação Arquitetural (@architect)

**Invocar @architect com Mission: `validate-brownfield-prd`**

```
Mission: validate-brownfield-prd
PRD: docs/prd-brownfield-{feature}.md
Architecture: docs/architecture/
Gotchas: aiox/gotchas.json
```

O @architect vai:

1. Verificar viabilidade técnica com o stack existente
2. Identificar riscos arquiteturais específicos do brownfield
3. Propor estratégia de integração (REUSE > ADAPT > CREATE)
4. Documentar decisão e trade-offs

**Se NEEDS_REVISION:** Loop com @pm para ajustar PRD
**Se APPROVED:** Continuar

---

## Step 4: Front-End Spec (se mudanças no UI) (@ux)

Se o épico impacta o frontend:

**Invocar @ux com Mission: `update-frontend-spec`**

```
Mission: update-frontend-spec
Context: Brownfield — adaptar ao design system existente
Input: docs/front-end-spec.md (existente), docs/prd-brownfield-{feature}.md
```

O @ux vai:

1. Auditar componentes existentes que podem ser reutilizados
2. Projetar mudanças mínimas e coerentes com o sistema atual
3. Gerar wireframes dos novos componentes (Stitch MCP se disponível)

---

## Step 5: Schema de Banco (se mudanças no DB) (@data-engineer)

Se o épico impacta o banco de dados:

**Invocar @data-engineer com Mission: `plan-schema-changes`**

```
Mission: plan-schema-changes
Input: supabase/docs/SCHEMA.md (existente)
Context: [Mudanças necessárias para o épico]
```

O @data-engineer vai:

1. Aplicar KISS Gate antes de propor novas tabelas
2. Criar migration incremental (NUNCA DROP em produção)
3. Manter compatibilidade com dados existentes
4. Atualizar `supabase/docs/SCHEMA.md`

---

## Step 6: Criação de Épicos (@pm + @po)

**Invocar @pm com Mission: `create-brownfield-epic`**

```
Mission: create-brownfield-epic
PRD: docs/prd-brownfield-{feature}.md
```

Seguido de **@po com Mission: `validate-epic`**

```
Mission: validate-epic
Epic: [path do épico]
Checklist: po-master-checklist.md
```

Output: `docs/epics/{feature}-epic.md`

---

## Step 7: Ciclo de Desenvolvimento (Loop por Story)

Para cada story do épico brownfield:

### Step 7.1: Criar Story (@sm)

```
Mission: create-brownfield-story
Epic: [path do épico]
Context: Brownfield — REUSE > ADAPT > CREATE
```

### Step 7.2: Impacto Arquitetural (@architect)

Antes de implementar, verificar impacto:

```
Mission: analyze-impact
Story: [path da story]
Context: Quais arquivos existentes serão afetados?
```

### Step 7.3: Implementar (@dev)

```
Mission: develop-brownfield-story
Story: [path da story]
Mode: Interactive (brownfield requer mais cuidado)
```

O @dev deve:

1. Verificar `aiox/gotchas.json` antes de iniciar
2. Priorizar reutilização de código existente
3. Não quebrar funcionalidades atuais
4. Executar testes em cada step

### Step 7.4: QA Review (@qa)

```
Mission: review-brownfield-story
Story: [path da story]
Focus: Regressão, integração com código existente, testes
```

- **Se NEEDS_WORK:** Loop @dev → @qa (máximo 5 iterações, usar qa-loop.md)
- **Se APPROVED:** Próxima story

### Step 7.5: Commit (@devops)

```
Mission: commit
Story: [path da story]
Context: Brownfield — mensagem deve indicar feature adicionada
```

---

## Regra REUSE > ADAPT > CREATE (Obrigatória no Brownfield)

```
1. REUSE: Componente/função existente atende? → Usar sem modificar
2. ADAPT: Existente pode ser generalizado? → Adaptar com cuidado
3. CREATE: Não existe equivalente? → Criar novo, documentar razão
```

---

## Resultado Esperado

- PRD Brownfield aprovado com análise de impacto ✅
- Épico criado com stories prontas ✅
- Implementação sem quebras de funcionalidade existente ✅
- QA APPROVED com testes de regressão ✅
- Commits criados prontos para push ✅
