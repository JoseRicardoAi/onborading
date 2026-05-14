---
paths:
  - 'docs/stories/**'
  - '.aiox-core/development/**'
---

# Story Lifecycle — Regras Detalhadas

## Progressão de Status

```
Draft → Ready → InProgress → InReview → Done
```

| Status     | Gatilho                    | Agente  | Ação                                             |
| ---------- | -------------------------- | ------- | ------------------------------------------------ |
| Draft      | @sm cria story             | @sm     | Arquivo de story criado                          |
| Ready      | @po valida (GO)            | @po     | **DEVE atualizar campo status de Draft → Ready** |
| InProgress | @dev inicia implementação  | @dev    | Atualizar campo de status                        |
| InReview   | @dev completa, @qa revisa  | @qa     | Atualizar campo de status                        |
| Done       | @qa PASS, @devops faz push | @devops | Atualizar campo de status                        |

**CRÍTICO:** A transição `Draft → Ready` é responsabilidade de @po durante `*validate-story-draft`. Quando o verdict é GO, @po DEVE atualizar o campo Status da story para `Ready` e registrar a transição no Change Log. Uma story deixada em `Draft` após um verdict GO é uma violação de processo.

## Fase 1: Create (@sm)

**Task:** `create-next-story.md`
**Inputs:** PRD fragmentado, contexto de épico
**Output:** `{epicNum}.{storyNum}.story.md`

## Fase 2: Validate (@po)

**Task:** `validate-next-story.md`

### Checklist de 10 Pontos de Validação

1. Título claro e objetivo
2. Descrição completa (problema/necessidade explicada)
3. Critérios de aceitação testáveis (Given/When/Then preferido)
4. Escopo bem definido (IN e OUT claramente listados)
5. Dependências mapeadas (stories/recursos pré-requisitos)
6. Estimativa de complexidade (pontos ou T-shirt sizing)
7. Valor de negócio (benefício para usuário/negócio claro)
8. Riscos documentados (problemas potenciais identificados)
9. Critérios de Done (definição clara de completo)
10. Alinhamento com PRD/Épico (consistência com docs fonte)

**Decisão:** GO (>=7/10) ou NO-GO (<7/10 com correções necessárias)

## Fase 3: Implement (@dev)

**Task:** `dev-develop-story.md`

### Modos de Execução

**YOLO (autônomo):**

- 0-1 prompts
- Decisões registradas em `decision-log-{story-id}.md`
- Melhor para: tasks simples, determinísticas

**Interactive (padrão):**

- 5-10 prompts com checkpoints educacionais
- Confirmações em pontos-chave de decisão
- Melhor para: aprendizado, decisões complexas

**Pre-Flight (plan-first):**

- Todas as perguntas antecipadas (10-15 prompts)
- Gera plano de execução
- Então execução zero-ambiguidade
- Melhor para: requisitos ambíguos, trabalho crítico

### CodeRabbit Self-Healing na Fase Dev

```
iteration = 0
while CRITICAL issues found AND iteration < 2:
  auto-fix CRITICAL/HIGH
  iteration++
if CRITICAL persist after 2 iterations:
  HALT — intervenção manual necessária
```

## Fase 4: QA Gate (@qa)

**Task:** `qa-gate.md`

### 7 Verificações de Qualidade

1. **Code review** — padrões, legibilidade, manutenibilidade
2. **Unit tests** — cobertura adequada, todos passando
3. **Acceptance criteria** — todos atendidos conforme AC da story
4. **No regressions** — funcionalidade existente preservada
5. **Performance** — dentro de limites aceitáveis
6. **Security** — OWASP básico verificado
7. **Documentation** — atualizada se necessário

### Decisões do Gate

| Decisão  | Pontuação               | Ação                                  |
| -------- | ----------------------- | ------------------------------------- |
| PASS     | Todos os checks OK      | Aprovar, prosseguir para @devops push |
| CONCERNS | Problemas menores       | Aprovar com observações documentadas  |
| FAIL     | Problemas HIGH/CRITICAL | Retornar para @dev com feedback       |
| WAIVED   | Problemas aceitos       | Aprovar com waiver documentado (raro) |

### Estrutura do Arquivo de Gate

```yaml
storyId: STORY-42
verdict: PASS | CONCERNS | FAIL | WAIVED
issues:
  - severity: low | medium | high
    category: code | tests | requirements | performance | security | docs
    description: '...'
    recommendation: '...'
```

## QA Loop (Revisão-Correção Iterativa)

```
@qa review → verdict → @dev fixes → re-review (máx 5 iterações)
```

**Comandos:**

- `*qa-loop {storyId}` — Iniciar loop completo
- `*stop-qa-loop` — Pausar e salvar estado
- `*resume-qa-loop` — Retomar do estado salvo
- `*escalate-qa-loop` — Forçar escalação manual

**Gatilhos de Escalação:**

- max_iterations_reached (padrão: 5)
- verdict_blocked
- fix_failure (após retentativas)
- manual_escalate (comando do usuário)

**Status:** Rastreado em `qa/loop-status.json`

## Regras de Atualização do Arquivo de Story

| Seção                            | Quem Pode Editar                |
| -------------------------------- | ------------------------------- |
| Título, Descrição, AC, Escopo    | Apenas @po                      |
| File List, Dev Notes, checkboxes | @dev                            |
| QA Results                       | Apenas @qa                      |
| Change Log                       | Qualquer agente (apenas append) |
