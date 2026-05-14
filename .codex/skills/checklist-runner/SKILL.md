---
name: checklist-runner
description: |
  Motor genérico de execução de checklists para qualquer arquivo .md.
  Use esta skill quando um agente precisa validar seu trabalho contra um checklist.
  Suporta modos YOLO (autônomo) e interativo com verdicts PASS/FAIL/PARTIAL.
user-invocable: true
argument-hint: '[checklist-name] [--mode yolo|interactive]'
---

# Checklist Runner

Motor genérico de execução de checklists. Valida trabalho contra qualquer checklist `.md` com comportamento consistente entre todos os agentes.

## Uso

```
run checklist story-dod-checklist
run checklist pre-push-checklist --mode yolo
run checklist po-master-checklist --mode interactive
```

## Execução

### 1. Resolver Checklist

Fazer parse dos argumentos para nome do checklist. Buscar na ordem:

1. `.codex/checklists/{name}.md`
2. `.codex/checklists/{name}`
3. Fuzzy match se exato não encontrado (ex: "dod" → "story-dod-checklist.md")

Se nenhum checklist especificado ou múltiplos matches, apresentar lista numerada de opções.

### 2. Determinar Modo

| Modo            | Comportamento                                                       |
| --------------- | ------------------------------------------------------------------- |
| `yolo` (padrão) | Processar todas as seções autonomamente, apresentar relatório final |
| `interactive`   | Seção por seção com confirmação do usuário entre cada uma           |

### 3. Carregar Contexto

Reunir documentos e artefatos especificados no topo do checklist:

- Story files de `docs/stories/`
- Arquivos de código-fonte da File List da story
- Resultados de testes da última execução `npm test`
- Git diff para mudanças atuais

### 4. Processar Itens do Checklist

Para cada item no checklist:

1. Ler e entender o requisito
2. Buscar evidências na documentação/código que o satisfaçam
3. Considerar menções explícitas e cobertura implícita

Marcar cada item:

| Verdict | Símbolo | Significado                                |
| ------- | ------- | ------------------------------------------ |
| PASS    | ✅      | Requisito claramente atendido              |
| FAIL    | ❌      | Requisito não atendido ou insuficiente     |
| PARTIAL | ⚠️      | Alguns aspectos cobertos, precisa melhorar |
| N/A     | ➖      | Não aplicável (com justificativa)          |

### 5. Resumo por Seção

Para cada seção calcular:

- Taxa de pass: `(contagem PASS) / (total - contagem N/A) * 100`
- Temas comuns em itens reprovados
- Recomendações específicas para melhoria

### 6. Relatório Final

```markdown
## Relatório de Checklist: {checklist-name}

**Data:** {YYYY-MM-DD}
**Agente:** {agente atual}
**Modo:** {yolo|interactive}

### Resumo

| Seção | Itens | Pass | Fail | Partial | N/A | Taxa |
| ----- | ----- | ---- | ---- | ------- | --- | ---- |
| ...   | ...   | ...  | ...  | ...     | ... | ...% |

**Total:** {TAXA}% ({total_pass}/{total_aplicável})

### Itens Reprovados

1. **{item}** — {razão} → {recomendação}

### Decisão

**{APPROVED | NEEDS_WORK | FAIL}**

- APPROVED: >= 90% taxa de pass, 0 FAIL em itens críticos
- NEEDS_WORK: 70-89% taxa de pass OU qualquer FAIL em não-críticos
- FAIL: < 70% taxa de pass OU qualquer FAIL em itens críticos
```

## Checklists Disponíveis

| Checklist                        | Usado Por  | Propósito                                    |
| -------------------------------- | ---------- | -------------------------------------------- |
| `story-dod-checklist.md`         | @dev       | Definition of Done para stories              |
| `self-critique-checklist.md`     | @dev       | Auto-revisão em checkpoints de implementação |
| `pre-push-checklist.md`          | @devops    | Quality gate antes de git push               |
| `release-checklist.md`           | @devops    | Verificação de readiness para release        |
| `po-master-checklist.md`         | @po        | Checklist de validação do PO                 |
| `change-checklist.md`            | @po        | Avaliação de impacto de mudanças             |
| `architect-checklist.md`         | @architect | Validação de decisões arquiteturais          |
| `story-draft-checklist.md`       | @sm        | Validação de draft de story                  |
| `component-quality-checklist.md` | @ux        | Qualidade de componentes React               |
