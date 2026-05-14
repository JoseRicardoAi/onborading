---
name: synapse
description: 'Use esta skill para entender o engine de contexto SYNAPSE do AIOX, gerenciar domínios, configurar regras de contexto, ou solucionar problemas de injeção de regras. Use quando perguntado sobre arquitetura SYNAPSE, gerenciamento de domínios, star-commands, context brackets, ou o pipeline de processamento de 8 camadas.'
---

# SYNAPSE Context Engine

## Visão Geral

SYNAPSE (AIOX Adaptive Processing & State Engine) é o engine de contexto unificado do AIOX. Opera através de um conjunto de arquivos em `.synapse/` que definem domínios, regras, e comandos que são carregados por contexto.

**O que faz:**

- Organiza regras por domínio em `.synapse/`
- Processa 8 camadas (L0 Constitution através de L7 Star-Commands)
- Adapta volume de injeção baseado em context brackets (FRESH/MODERATE/DEPLETED/CRITICAL)
- Integra com estado de agente (agente ativo, workflow, task, squad)

> [!NOTE]
> No Antigravity, o SYNAPSE opera como estrutura de dados de contexto (`.synapse/`) sem o hook de execução automática do Antigravity CLI. As regras são carregadas manualmente ou referenciadas por agentes.

## Estrutura de Arquivos

```
.synapse/
├── manifest          # Registro central de domínios (KEY=VALUE)
├── constitution      # Domínio L0 - regras fundamentais
├── global            # Domínio L1 - regras globais
├── context           # Domínio L1 - contexto do projeto
├── agent-*           # Domínios L2 - escopados por agente
├── workflow-*        # Domínios L3 - escopados por workflow
├── commands          # Definições de star-commands (L7)
├── sessions/         # Estado de sessão (gitignored)
└── cache/            # Cache (gitignored)
```

## Pipeline de 8 Camadas

| Camada | Nome          | Descrição                         |
| ------ | ------------- | --------------------------------- |
| L0     | Constitution  | Regras fundamentais e invariáveis |
| L1     | Global        | Contexto global do projeto        |
| L2     | Agent-Scoped  | Regras específicas por agente     |
| L3     | Workflow      | Contexto de workflow ativo        |
| L4     | Task          | Contexto da task atual            |
| L5     | Squad         | Contexto do squad ativo           |
| L6     | Session       | Estado de sessão atual            |
| L7     | Star-Commands | Comandos especiais `*`            |

## Comandos Disponíveis

| Comando            | O que faz                             |
| ------------------ | ------------------------------------- |
| `*synapse status`  | Mostrar estado atual do engine        |
| `*synapse domains` | Listar todos os domínios registrados  |
| `*synapse debug`   | Mostrar info de debug detalhada       |
| `*synapse help`    | Mostrar todos os sub-comandos         |
| `*synapse create`  | Criar novo domínio                    |
| `*synapse add`     | Adicionar regra a domínio existente   |
| `*synapse edit`    | Editar ou remover regra por índice    |
| `*synapse toggle`  | Ativar/desativar domínio              |
| `*synapse command` | Criar novo star-command               |
| `*synapse suggest` | Sugerir melhor domínio para uma regra |

## Formato de Domínio

Domínios usam formato KEY=VALUE:

```
# Domínio: agent-dev
AGENT_SCOPE=dev
PREFERRED_LANGUAGE=TypeScript
AVOID_PATTERNS=any, callbacks_over_promises
ENFORCE_LINT=true
```

## Context Brackets

SYNAPSE adapta volume de injeção baseado no uso do context window:

| Bracket  | Uso do Context | Camadas Ativas |
| -------- | -------------- | -------------- |
| FRESH    | < 30%          | Todas (L0-L7)  |
| MODERATE | 30-60%         | L0-L5          |
| DEPLETED | 60-80%         | L0-L3          |
| CRITICAL | > 80%          | L0 apenas      |

## Integração com Antigravity

No Antigravity, o SYNAPSE serve como:

1. **Repositório de contexto** — agentes leem `.synapse/` durante carregamento
2. **Definição de star-commands** — comandos `*` registrados no `.synapse/commands`
3. **Estado de sessão** — `.synapse/sessions/` para persistência cross-sessão

Agentes que usam contexto SYNAPSE devem ler o arquivo relevante no início da sessão conforme documentado no `.antigravity/rules/agent-memory-imports.md`.
