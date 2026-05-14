# Agent Memory Imports

Cada agente AIOX possui um arquivo MEMORY.md canônico com conhecimento persistente.
Os agentes devem ler sua memória na ativação.

## Localização Canônica

Memória de agentes no ambiente Codex:

```
.codex/agent-memory/{agent-id}/MEMORY.md
```

## Agentes com Memória

| Agente            | Path                                                     |
| ----------------- | -------------------------------------------------------- |
| @dev              | `.codex/agent-memory/aiox-dev/MEMORY.md`           |
| @qa               | `.codex/agent-memory/aiox-qa/MEMORY.md`            |
| @architect        | `.codex/agent-memory/aiox-architect/MEMORY.md`     |
| @devops           | `.codex/agent-memory/aiox-devops/MEMORY.md`        |
| @pm               | `.codex/agent-memory/aiox-pm/MEMORY.md`            |
| @po               | `.codex/agent-memory/aiox-po/MEMORY.md`            |
| @sm               | `.codex/agent-memory/aiox-sm/MEMORY.md`            |
| @analyst          | `.codex/agent-memory/aiox-analyst/MEMORY.md`       |
| @data-engineer    | `.codex/agent-memory/aiox-data-engineer/MEMORY.md` |
| @ux               | `.codex/agent-memory/aiox-ux/MEMORY.md`            |
| @squad-chief      | `.codex/agent-memory/squad/MEMORY.md`              |
| @oalanicolas      | `.codex/agent-memory/oalanicolas/MEMORY.md`        |
| @pedro-valerio    | `.codex/agent-memory/pedro-valerio/MEMORY.md`      |

## Protocolo de Ativação

Na ativação do agente:

1. Ler `.codex/agent-memory/{agent-id}/MEMORY.md`
2. Verificar "Projetos Ativos" para contexto relevante
3. Verificar "Decisões Chave" para evitar retrabalho

## Protocolo de Atualização

Após cada task significativa:

1. Atualizar MEMORY.md com aprendizados
2. Registrar decisões arquiteturais
3. Se > 200 linhas, curar entradas antigas mantendo as mais relevantes

## Estrutura Padrão de MEMORY.md

```markdown
# MEMORY — {Agent Name}

## Quick Stats

- Última atualização: {data}
- Projetos ativos: {N}

## Projetos Ativos

- {projeto}: {status}

## Decisões Chave

- {decisão}: {razão}

## Padrões que Funcionam

- {padrão}: {contexto}

## Erros Comuns (Evitar)

- {erro}: {correção}

## Notas Recentes

- {data}: {nota}
```

## Persistencia Cross-Session

Para memória persistente cross-session (além do arquivo MEMORY.md):

- Registrar decisões arquiteturais críticas em `MEMORY.md` e `docs/architecture/`
- Referenciar entradas importantes nas stories e handoffs
- Usar essa memória para: padrões de squad, decisões de arquitetura, bugs conhecidos
