---
paths:
  - '.aiox-core/**'
  - 'packages/**'
  - 'bin/**'
---

# IDS Principles — Desenvolvimento Incremental

> Status: Planejado (épico IDS está em Draft — princípios se aplicam como orientação aspiracional)

## Hierarquia de Decisão: REUSE > ADAPT > CREATE

### REUSE (Relevância >= 90%)

- Usar artefato existente diretamente sem modificação
- Importar/referenciar entidade existente
- Nenhuma justificativa necessária além de confirmar correspondência

### ADAPT (Relevância 60-89%)

- Score de adaptabilidade >= 0.6
- Mudanças NÃO DEVEM exceder 30% do artefato original
- Mudanças NÃO DEVEM quebrar consumidores existentes (verificar lista usedBy)
- Documentar mudanças no change log do artefato
- Atualizar relações no registry
- Análise de impacto obrigatória

### CREATE (Sem correspondência adequada)

Justificativa obrigatória:

- `evaluated_patterns`: Entidades existentes que você considerou
- `rejection_reasons`: Por que cada uma foi rejeitada (razões técnicas)
- `new_capability`: Que capacidade única isso fornece
- Registrar no Entity Registry em 24 horas
- Estabelecer relações com entidades existentes
- Definir restrições de adaptabilidade para reutilização futura

## Gates de Verificação G1-G6

### G1: Criação de Épico (@pm)

- **Tipo:** Humano-no-loop, Consultivo
- **Gatilho:** Workflow `*create-epic`
- **Ação:** Consultar registry para entidades relacionadas
- **Bloqueante:** Não

### G2: Criação de Story (@sm)

- **Tipo:** Humano-no-loop, Consultivo
- **Gatilho:** Workflow `*draft`
- **Ação:** Verificar tasks/templates existentes correspondentes ao trabalho da story
- **Bloqueante:** Não

### G3: Validação de Story (@po)

- **Tipo:** Humano-no-loop, Soft Block
- **Gatilho:** Workflow `*validate-story-draft`
- **Ação:** Verificar artefatos referenciados, detectar duplicação potencial
- **Bloqueante:** Soft (pode fazer override com razão)

### G4: Contexto de Dev (@dev)

- **Tipo:** Automatizado, Informacional
- **Gatilho:** Atribuição de story / início de `*develop`
- **Ação:** Exibir padrões correspondentes como lembrete
- **Bloqueante:** NÃO (apenas logado para métricas)

### G5: Review de QA (@qa)

- **Tipo:** Automatizado, Bloqueia Merge
- **Gatilho:** PR/merge request
- **Ação:** Verificar se novos artefatos poderiam ter reutilizado existentes
- **Bloqueante:** SIM se nova entidade sem entrada no registry ou justificativa

### G6: CI/CD (@devops)

- **Tipo:** Automatizado, Bloqueia Merge
- **Gatilho:** CI pipeline
- **Ação:** Verificação de integridade do registry + sync
- **Bloqueante:** SIM em CRITICAL, WARN em MEDIUM/LOW

## Política de Override

**Comando:** `--override-ids --override-reason "explicação"`

**Permitido quando:**

- Correção time-critical requer criação imediata
- Adaptação introduziria risco inaceitável
- Artefato existente está depreciado/congelado

**Requisitos:**

- Registrado para trilha de auditoria
- Revisado em 7 dias

## Artigo IV-A: Desenvolvimento Incremental (Emenda Constitucional)

**Severidade:** MUST

**Quatro Regras Centrais:**

1. **Consulta ao Registry Obrigatória** — Consultar antes de criar
2. **Hierarquia de Decisão** — REUSE > ADAPT > CREATE estritamente
3. **Limites de Adaptação** — Mudanças < 30%, não quebrar consumidores
4. **Requisitos de Criação** — Justificativa completa, registrar em 24h
