---
description: orquestração de épicos completos — coordenação de múltiplas stories em paralelo com controle de dependências e progresso
---

# Epic Orchestration Workflow

Workflow para execução coordenada de épicos completos. Gerencia a sequência e paralelismo de stories, controla dependências e acompanha o progresso do épico até conclusão.

## Quando Usar

- Para épicos com 5+ stories que precisam de coordenação
- Quando stories têm dependências entre si (A deve completar antes de B)
- Para visibilidade e controle do progresso do épico
## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.antigravity/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes.
3. Todas as operações operam na raiz do projeto.

---

## Pré-requisito

O épico deve estar com todas as stories em status `Ready`:

```bash
# Verificar stories do épico
ls docs/stories/{epic-slug}/
# Todas devem ter status: Ready
```

---

## Step 1: Epic Planning (@po)

**Invocar @po com Mission: `plan-epic-execution`**

```
Mission: plan-epic-execution
Epic: docs/epics/{epic-slug}.md
Stories: docs/stories/{epic-slug}/
```

O @po vai:

1. Criar mapa de dependências entre stories
2. Identificar stories que podem ser executadas em paralelo
3. Definir sequência de execução
4. Output: `docs/epics/{epic-slug}-execution-plan.md`

### Exemplo de Mapa de Dependências

```
Story 1.1 (Setup DB) → Story 1.2 (API endpoints) → Story 1.3 (Frontend)
Story 1.4 (Auth) → Story 1.2 (depende de auth)
Story 1.5 (Tests) → Story 1.2 + Story 1.3 (depende de ambas)
```

---

## Step 2: Execução Sequencial por Wave

Executar stories por "waves" (grupos que podem ser feitos em paralelo):

### Wave Concept

```
Wave 1 (independentes):  Story 1.1, Story 1.4   ← sem dependências
Wave 2 (dependem de W1): Story 1.2              ← depende 1.1 e 1.4
Wave 3 (dependem de W2): Story 1.3, Story 1.5  ← dependem 1.2
```

---

## Step 3: Execução de Story (por wave)

Para cada story na wave atual:

### Step 3.1: Story Development Cycle

Executar workflow completo de desenvolvimento:

```
Story: [path da story]
→ @sm *create-story (se ainda não criada)
→ @architect *analyze-impact
→ @dev *develop-story
→ @qa *review-story
→ (se NEEDS_WORK) qa-loop.md
→ @devops *commit
```

### Step 3.2: Validação de Dependências

Antes de iniciar próxima wave, verificar:

```
✅ Todas as stories da wave anterior em status Done?
✅ Commits criados para cada story?
✅ Nenhum bloqueador ativo?
→ Iniciar próxima wave
```

---

## Step 4: Tracking de Progresso

**Manter arquivo de progresso:**

```json
// aiox/epic-status-{epic-slug}.json
{
  "epic": "{epic-slug}",
  "total_stories": 5,
  "completed": 2,
  "in_progress": 1,
  "pending": 2,
  "blocked": 0,
  "waves": {
    "wave-1": { "status": "done", "stories": ["1.1", "1.4"] },
    "wave-2": { "status": "in_progress", "stories": ["1.2"] },
    "wave-3": { "status": "pending", "stories": ["1.3", "1.5"] }
  }
}
```

**@sm pode consultar:** `*status` para ver progresso atual do épico.

---

## Step 5: Resolução de Bloqueadores

Se uma story bloqueia uma wave:

```
SE story está BLOCKED por 2+ dias:
  → @po: *escalate-blocker {storyId}
  → Notificar usuário com context do blocker
  → Avaliar se story pode ser re-priorizada ou subida para próxima wave
```

**Opções de resolução:**

1. **Mover para próxima release** — Remover da wave atual
2. **Simplificar scope** — Reduzir AC da story bloqueada
3. **Esperar resolução** — Se dependência externa (API terceiro, etc.)

---

## Step 6: Encerramento do Épico (@po)

Quando todas as waves completam:

**Invocar @po com Mission: `close-epic`**

```
Mission: close-epic
Epic: docs/epics/{epic-slug}.md
Context: Todas as stories Done — encerrar épico
```

O @po vai:

1. Verificar todos os ACs do épico atendidos
2. Atualizar status do épico para `Done`
3. Gerar relatório de retrospectiva
4. Propor próximo épico do PRD (se houver)

---

## Step 7: Push e Deploy (@devops)

**Invocar @devops com Mission: `push-epic`**

```
Mission: push-epic
Context: Epic {epic-slug} completo — push para remote
```

O @devops vai:

1. Verificar quality gates (lint, typecheck, tests)
2. Push de todos os commits do épico
3. Criar PR se configurado
4. Tag de versão se release

---

## Resultado Esperado

- Todas as stories do épico em status Done ✅
- Dependências respeitadas em sequência correta ✅
- Commits organizados por story ✅
- Relatório de épico gerado ✅
- Push realizado pelo @devops ✅

**Próximo passo:** Iniciar próximo épico do PRD com `spec-pipeline.md` ou direto com `epic-orchestration.md`.
