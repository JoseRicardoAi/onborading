---
description: ciclo iterativo de revisão e correção QA — automação de revisão após gate inicial com máximo de 5 iterações e escalação automática
---

# QA Loop Workflow

Workflow de ciclo iterativo de qualidade. Ativado após o QA gate inicial quando a story precisa de correções. Automatiza o loop revisão → correção → re-revisão com controle de iterações e escalação.

## Quando Usar

- Quando @qa emite `NEEDS_WORK` ou `REJECT` em uma story
- Para automatizar ciclos de correção sem intervenção manual a cada iteração
- Quando uma story precisa de múltiplos rounds de QA antes de aprovação

**NÃO usar para:** QA de primeiro review — usar o `story-development-cycle.md` para o review inicial.

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.antigravity/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes.
3. Todas as operações operam na raiz do projeto.

---

## Comandos de Controle

| Comando              | Descrição                    |
| -------------------- | ---------------------------- |
| `*qa-loop {storyId}` | Iniciar loop                 |
| `*qa-loop-review`    | Retomar da fase de revisão   |
| `*qa-loop-fix`       | Retomar da fase de correção  |
| `*stop-qa-loop`      | Pausar e salvar estado atual |
| `*resume-qa-loop`    | Retomar do estado salvo      |
| `*escalate-qa-loop`  | Forçar escalação imediata    |

---

## Configuração

```yaml
max_iterations: 5 # Máximo de ciclos revisão-correção
status_file: qa/loop-status.json # Arquivo de estado persistente
auto_escalate_on_blocked: true # Escalar automaticamente se BLOCKED
```

---

## Step 1: Inicialização do Loop

Criar ou atualizar arquivo de estado:

```json
// qa/loop-status.json
{
  "story_id": "{storyId}",
  "story_path": "{path}",
  "iteration": 1,
  "max_iterations": 5,
  "status": "reviewing",
  "history": []
}
```

---

## Step 2: Revisão (@qa)

**Invocar @qa com Mission: `review-story`**

```
Mission: review-story
Story: {path da story}
Context: QA Loop — Iteração {n} de 5
Previous_Issues: {lista de issues da iteração anterior, se houver}
```

O @qa vai:

1. Revisar implementação vs acceptance criteria
2. Executar quality gates (lint, tests, security)
3. Emitir verdict:

| Verdict | Ação                                |
| ------- | ----------------------------------- |
| APPROVE | Completar loop → Story → Done       |
| REJECT  | Criar lista de fixes → ir ao Step 3 |
| BLOCKED | Escalar imediatamente               |

Atualizar `qa/loop-status.json` com resultado.

---

## Step 3: Correção (@dev)

Se verdict = REJECT:

**Invocar @dev com Mission: `apply-qa-fixes`**

```
Mission: apply-qa-fixes
Story: {path da story}
Fix_Request: {lista de issues do @qa}
Context: QA Loop — Iteração {n}, corrigindo para re-review
```

O @dev vai:

1. Resolver cada issue da lista do @qa
2. Executar testes locais antes de notificar
3. Confirmar que cada fix está endereçado
4. NÃO introduzir novas mudanças além dos fixes solicitados

---

## Step 4: Verificação de Iteração

**Após cada ciclo revisão-correção:**

```
iteration_atual = iteration_atual + 1

SE iteration > max_iterations:
  → Ir para ESCALAÇÃO
SENÃO:
  → Voltar ao Step 2 com nova iteração
```

---

## Step 5: Resultado do Loop

### APPROVE

```
✅ QA Loop Concluído — Story APPROVED

Story: {storyId}
Iterações: {n} de 5
Resultado: APPROVED

Próximos passos:
- @devops: commit e push da story
- Atualizar status no backlog para Done
```

### Escalação (BLOCKED ou max iterações)

**@qa ou usuário deve ser notificado via `notify_user`:**

```
⚠️ QA Loop Escalado

Story: {storyId}
Razão: {max_iterations_reached | verdict_blocked | fix_failure | manual_escalate}
Iterações realizadas: {n}
Último verdict: {REJECT/BLOCKED}
Issues não resolvidos: [lista]

Ação necessária: Revisão manual ou sessão dedicada com @dev e @qa
```

Salvar resumo em `qa/escalation-report-{storyId}.md`.

---

## Gatilhos de Escalação Automática

| Gatilho                  | Condição                         |
| ------------------------ | -------------------------------- |
| `max_iterations_reached` | Alcançou 5 iterações sem APPROVE |
| `verdict_blocked`        | @qa emite BLOCKED                |
| `fix_failure`            | @dev não consegue aplicar fixes  |
| `manual_escalate`        | Usuário usa `*escalate-qa-loop`  |

---

## Resultado Esperado

- Story APPROVED com máximo de 5 ciclos ✅
- Estado persistido em `qa/loop-status.json` ✅
- Histórico de iterações documentado ✅
- Escalação automática se não resolvido ✅
