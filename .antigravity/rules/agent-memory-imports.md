# Agent Memory Imports

Cada agente AIOX possui um arquivo MEMORY.md canônico com conhecimento persistente.
Os agentes devem ler sua memória na ativação.

## Localização Canônica

Memória de agentes no ambiente Antigravity:

```
.antigravity/agent-memory/{agent-id}/MEMORY.md
```

## Agentes com Memória

| Agente            | Path                                                     |
| ----------------- | -------------------------------------------------------- |
| @dev              | `.antigravity/agent-memory/aiox-dev/MEMORY.md`           |
| @qa               | `.antigravity/agent-memory/aiox-qa/MEMORY.md`            |
| @architect        | `.antigravity/agent-memory/aiox-architect/MEMORY.md`     |
| @devops           | `.antigravity/agent-memory/aiox-devops/MEMORY.md`        |
| @pm               | `.antigravity/agent-memory/aiox-pm/MEMORY.md`            |
| @po               | `.antigravity/agent-memory/aiox-po/MEMORY.md`            |
| @sm               | `.antigravity/agent-memory/aiox-sm/MEMORY.md`            |
| @analyst          | `.antigravity/agent-memory/aiox-analyst/MEMORY.md`       |
| @data-engineer    | `.antigravity/agent-memory/aiox-data-engineer/MEMORY.md` |
| @ux               | `.antigravity/agent-memory/aiox-ux/MEMORY.md`            |
| @squad-chief      | `.antigravity/agent-memory/squad/MEMORY.md`              |
| @oalanicolas      | `.antigravity/agent-memory/oalanicolas/MEMORY.md`        |
| @pedro-valerio    | `.antigravity/agent-memory/pedro-valerio/MEMORY.md`      |

## Protocolo de Ativação

Na ativação do agente:

1. Ler `.antigravity/agent-memory/{agent-id}/MEMORY.md`
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

## Integração com KI System

Para memória persistente cross-session (além do arquivo MEMORY.md):

- Criar Knowledge Items (KIs) para decisões arquiteturais críticas
- KIs ficam disponíveis em TODAS as sessões futuras
- Usar KIs para: padrões de squad, decisões de arquitetura, bugs conhecidos
