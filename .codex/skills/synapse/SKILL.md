---
name: synapse
description: 'Use esta skill no Codex para entender o engine de contexto SYNAPSE do AIOX, diagnosticar a pasta .synapse/, consultar dominios, interpretar star-commands, validar context brackets ou executar o runtime SYNAPSE de forma explicita. Use quando perguntado sobre arquitetura SYNAPSE, gerenciamento de dominios, star-commands, context brackets, diagnostico ou pipeline de camadas.'
---

# SYNAPSE Context Engine no Codex

## Visão Geral

SYNAPSE (AIOX Adaptive Processing & State Engine) e o engine de contexto unificado do AIOX. No Codex, ele opera como estrutura local compartilhada em `.synapse/` mais runtime em `.aiox-core/core/synapse/`. O Codex nao deve copiar `.synapse/` para `.codex/`; deve ler e executar a fonte real da raiz do projeto.

**O que faz:**

- Organiza regras por dominio em `.synapse/`
- Processa L0-L2 por padrao no engine atual; L3-L7 existem no runtime e podem ser avaliadas em modo legado
- Adapta volume de injecao baseado em context brackets (FRESH/MODERATE/DEPLETED/CRITICAL)
- Integra com estado de agente quando a chamada passa `manifest` e `session.active_agent.id`
- Fornece diagnostico local via `.aiox-core/core/synapse/diagnostics/synapse-diagnostics.js`

> [!NOTE]
> No Codex, nao assuma hook automatico de IDE. Quando o usuario pedir `*synapse status`, `*synapse debug`, `*synapse domains` ou `*synapse-diagnose`, leia a pasta `.synapse/` e execute os diagnosticos locais quando necessario.

## Estrutura de Arquivos

```
.synapse/
├── manifest          # Registro central de dominios (KEY=VALUE)
├── constitution      # Dominio L0 - regras fundamentais
├── global            # Dominio L1 - regras globais
├── context           # Dominio L1 - contexto do projeto
├── agent-*           # Dominios L2 - escopados por agente
├── workflow-*        # Dominios L3 - escopados por workflow
├── commands          # Definicoes de star-commands (L7)
├── sessions/         # Estado de sessao
└── metrics/          # Metricas de UAP/SYNAPSE
```

## Pipeline de 8 Camadas

| Camada | Nome          | Descrição                         |
| ------ | ------------- | --------------------------------- |
| L0     | Constitution  | Regras fundamentais e invariaveis |
| L1     | Global        | Contexto global do projeto        |
| L2     | Agent-Scoped  | Regras especificas por agente     |
| L3     | Workflow      | Contexto de workflow ativo        |
| L4     | Task          | Contexto da task atual            |
| L5     | Squad         | Contexto do squad ativo           |
| L6     | Session       | Estado de sessão atual            |
| L7     | Star-Commands | Comandos especiais `*`            |

## Operacao no Codex

1. Para validar o SYNAPSE no projeto sem exigir hooks herdados do Claude:

```bash
npm.cmd run validate:synapse
```

2. Para consultar o estado atual:

```bash
node bin/aiox.js synapse status
```

3. Para listar dominios registrados:

```bash
node bin/aiox.js synapse domains
```

4. Para executar a injecao explicitamente:

```bash
node bin/aiox.js synapse run "prompt" --agent dev
```

5. Para diagnostico completo, incluindo checks legados de hook:

```bash
node bin/aiox.js synapse diagnose
```

6. Se o usuario usar `*synapse status`, resuma manifest, sessao ativa, bracket e metricas.
7. Se o usuario usar `*synapse domains`, liste os dominios registrados em `.synapse/manifest`.
8. Se o usuario usar `*synapse debug` ou `*synapse-diagnose`, execute o diagnostico e destaque FAIL/WARN. Explique que falhas de hook sao legado Claude quando o runtime atual nao depender desses hooks.

## Comandos Disponíveis

| Comando            | O que faz                             |
| ------------------ | ------------------------------------- |
| `*synapse status`  | Mostrar estado atual do engine        |
| `*synapse domains` | Listar todos os dominios registrados  |
| `*synapse debug`   | Mostrar info de debug detalhada       |
| `*synapse help`    | Mostrar todos os sub-comandos         |
| `*synapse create`  | Criar novo dominio                    |
| `*synapse add`     | Adicionar regra a dominio existente   |
| `*synapse edit`    | Editar ou remover regra por indice    |
| `*synapse toggle`  | Ativar/desativar dominio              |
| `*synapse command` | Criar novo star-command               |
| `*synapse suggest` | Sugerir melhor dominio para uma regra |

## Formato de Dominio

Dominios usam formato KEY=VALUE:

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

## Integracao com Codex

No Codex, o SYNAPSE serve como:

1. **Repositorio de contexto** - agentes e skills podem ler `.synapse/` durante a execucao.
2. **Definicao de star-commands** - comandos `*` ficam registrados em `.synapse/commands`, mas precisam ser interpretados explicitamente pelo Codex.
3. **Estado de sessao** - `.synapse/sessions/` pode persistir estado cross-session.
4. **Diagnostico** - `runDiagnostics(process.cwd())` valida manifest, sessao, pipeline, UAP bridge e lacunas de hook.

Agentes que usam contexto SYNAPSE devem ler o arquivo relevante em `.synapse/` no inicio da tarefa. Hooks automaticos legados devem ser tratados como lacuna ou substituidos por comando explicito no Codex.
