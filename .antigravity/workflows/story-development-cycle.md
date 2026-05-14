---
description: workflow de desenvolvimento de story completo — análise de impacto, desenvolvimento, QA e commit
---

# Story Development Cycle (SDC)

Workflow principal de desenvolvimento de uma story. Envolve análise de impacto arquitetural, desenvolvimento autônomo, QA review, e commit.

## Quando Usar

- Quando uma story está em status `Ready` no backlog
- Quando iniciar development sprint de uma storia
- Para o ciclo completo: análise → implementa → QA → commit

---

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.antigravity/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes.
3. Todas as operações operam na raiz do projeto.

---

## Step 1: Validação de Pré-condição

Verificar se a story está no estado correto antes de iniciar:

```bash
# A story deve estar em status Ready
# Verificar em docs/stories/ o arquivo da story
```

- [ ] Story em status `Ready`
- [ ] Acceptance Criteria definidos
- [ ] Estimativa de story points presente

---

## Step 2: Análise de Impacto Arquitetural (@architect)

**Invocar @architect com Mission: `analyze-impact`**

```
Mission: analyze-impact
Story: [path da story]
Context: Analisar impacto arquitetural antes do desenvolvimento
```

O @architect vai:

1. Ler a story completa
2. Mapear arquivos que serão impactados
3. Identificar riscos arquiteturais
4. Documentar em `docs/stories/{story-id}/impact-analysis.md`

**Continuar apenas se @architect aprovado (sem blocking concerns)**

---

## Step 3: Desenvolvimento (@dev ou @ui-builder)

**Para lógicas, backend ou stories genéricas:**
**Invocar @dev com Mission: `develop-story`**

**Para stories focadas em Frontend/UI (com ui-guidelines.yaml):**
**Invocar @ui-builder com Mission: `develop-story`**

```
Mission: develop-story
Story: [path da story]
Context: Implementar todos os acceptance criteria da story
```

O agente executor (@dev ou @ui-builder) vai:

1. Carregar contexto (git status, gotchas, technical preferences)
2. Seguir protocolo IDS (REUSE > ADAPT > CREATE)
3. Implementar TODOS os acceptance criteria
4. Aplicar self-critique nos checkpoints
5. Executar lint + typecheck antes de concluir

**Não continuar até @dev reportar conclusão com DoD checklist PASS**

---

## Step 4: QA Review (@qa)

**Invocar @qa com Mission: `review-story`**

```
Mission: review-story
Story: [path da story]
Context: Review completo de implementação vs acceptance criteria
```

O @qa vai:

1. Revisar todo o código implementado
2. Verificar AC coverage
3. Executar quality gates (lint, tests, security)
4. Emitir gate decision: APPROVED / NEEDS_WORK / FAIL

**Se NEEDS_WORK:** Criar fix request → Loop de volta para @dev
**Se FAIL:** Escalar para usuário com análise completa
**Se APPROVED:** Continuar para Step 5

---

## Step 5: Commit e Story Closure (@devops)

**Invocar @devops com Mission: `commit`**

```
Mission: commit
Story: [path da story]
Context: Commit seletivo das mudanças da story implementada
```

O @devops vai:

1. Stage seletivo por categoria dos arquivos
2. Criar commit message seguindo Conventional Commits
3. Atualizar status da story para `Done`
4. **NÃO fazer push** (requer aprovação explícita separada)

---

## Resultado Esperado

- Story implementada com todos os AC ✅
- Tests passando ✅
- Lint/typecheck limpo ✅
- QA APPROVED ✅
- Commit criado (não pushed) ✅
- Story status: `Done` ✅
