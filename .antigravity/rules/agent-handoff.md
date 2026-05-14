# Agent Handoff Protocol — Compactação de Contexto

## Propósito

Prevenir acumulação de janela de contexto ao trocar entre agentes AIOX. Cada troca de agente compacta a persona completa do agente anterior em um artefato de handoff estruturado (~379 tokens) em vez de reter a definição completa (~3-5K tokens).

## Quando Aplicar

Este protocolo ativa sempre que:

1. Um usuário invoca um novo agente via `@agent-name`
2. A sessão atual já tem um agente diferente ativo

## Protocolo de Handoff

### Na Troca de Agente (agente saindo)

Antes de carregar o novo agente, gere mentalmente um artefato de handoff:

```yaml
handoff:
  from_agent: '{id_agente_atual}'
  to_agent: '{id_novo_agente}'
  story_context:
    story_id: '{ID da story ativa}'
    story_path: '{path da story ativa}'
    story_status: '{status atual}'
    current_task: '{última task sendo trabalhada}'
    branch: '{branch git atual}'
  decisions:
    - '{decisão chave 1}'
    - '{decisão chave 2}'
  files_modified:
    - '{arquivo 1}'
    - '{arquivo 2}'
  blockers:
    - '{qualquer bloqueador ativo}'
  next_action: '{o que o agente entrante deve fazer}'
```

### Na Troca de Agente (agente entrando)

O agente entrante recebe:

1. Seu próprio **perfil completo** (persona, comandos, dependências)
2. O **artefato de handoff** do agente anterior (resumo compacto)
3. **NÃO** a persona/instruções/definições de ferramentas completas do agente anterior

### Limites de Compactação

| Limite                                | Valor                                       |
| ------------------------------------- | ------------------------------------------- |
| Tamanho máximo do artefato de handoff | 500 tokens                                  |
| Máximo de resumos de agente retidos   | 3 (o mais antigo é descartado no 4º switch) |
| Máximo de decisões no artefato        | 5                                           |
| Máximo de entradas em files_modified  | 10                                          |
| Máximo de bloqueadores                | 3                                           |

### O Que Preservar (SEMPRE incluir)

- ID e path da story ativa
- Task atual sendo trabalhada
- Nome do branch git
- Decisões arquiteturais chave tomadas
- Arquivos criados ou modificados
- Bloqueadores ativos

### O Que Descartar (NUNCA carregar adiante)

- Definição de persona completa do agente anterior
- Lista de comandos do agente anterior
- Lista de dependências do agente anterior
- Configurações de ferramentas do agente anterior

## Armazenamento

### Antigravity: Sistema de Brain/KI

No ambiente Antigravity, os artefatos de handoff são integrados ao sistema de `brain/`:

- Artefatos de handoff: `C:\Users\Administrador\.gemini\antigravity\brain\{conversation-id}\handoffs\`
- Formato: `handoff-{from}-to-{to}-{timestamp}.yaml`
- Para persistência cross-session → criar KI (Knowledge Item) com a decisão

### Persistência Avançada (KI System)

Para decisões críticas que devem persistir além da sessão:

1. Criar um KI com a decisão arquitetural
2. Nomear: `{nome-do-projeto}-{decisão}`
3. O KI fica disponível em todas as sessões futuras

## Exemplo

Fluxo de sessão: `@sm` cria story → `@dev` implementa → `@qa` revisa

Após switch `@sm` → `@dev`:

- Persona completa de `@sm` (~3K tokens) é **descartada**
- Artefato de handoff (~379 tokens) é **retido**: story ID, decisões, arquivos, próxima ação
- Persona completa de `@dev` (~5K tokens) é **carregada**
- **Contexto total: ~5.4K** em vez de ~8K (redução de 33% por switch)

Após switch `@dev` → `@qa`:

- Persona de `@dev` é **descartada**
- Artefato de handoff de `@dev` é **retido** ao lado do handoff de `@sm`
- Persona completa de `@qa` é **carregada**
- **Contexto total: ~5.2K** em vez de ~12K (redução de 57% após 2 switches)

---

## Handoffs entre Workflows

Além do handoff entre agentes, alguns workflows se encadeiam naturalmente. Ao concluir um workflow, o agente deve comunicar qual workflow é o próximo sugerido:

| Workflow Concluído        | Próximo Workflow Sugerido                 | Condição                               |
| ------------------------- | ----------------------------------------- | -------------------------------------- |
| `brownfield-discovery`    | `brownfield-fullstack` / `service` / `ui` | Baseado no tipo de evolução necessária |
| `spec-pipeline`           | `epic-orchestration`                      | Após PRD e épicos gerados              |
| `epic-orchestration`      | `story-development-cycle`                 | Para cada story do épico               |
| `story-development-cycle` | `qa-loop`                                 | Apenas se QA emitir NEEDS_WORK         |
| `greenfield-ui`           | `design-system-build`                     | Quando design system for necessário    |
| `greenfield-fullstack`    | `epic-orchestration`                      | Após fragmentação de documentos        |
| `brownfield-fullstack`    | `epic-orchestration`                      | Após criação do épico brownfield       |

### Prompt de Notificação de Handoff de Workflow

Ao encerrar um workflow, use este padrão:

---

## Protocolo de Atualização de MEMORY.md

O `MEMORY.md` é o registro de decisões arquiteturais e aprendizados críticos do projeto. Reside em `.aiox/MEMORY.md` ou `.antigravity/agent-memory/`.

### Quando Atualizar

Atualizar MEMORY.md quando ocorrer **qualquer** das situações:
- Decisão arquitetural não-trivial tomada
- Bug complexo ou gotcha crítico resolvido
- Novo padrão de código estabelecido no projeto
- Gotcha relevante identificado (complementar ao gotchas.json)
- Story finalizada com aprendizado importante

### Como Atualizar

```markdown
## [YYYY-MM-DD] — [1 linha descrevendo o que foi feito]

**Decisão:** [o que foi decidido]
**Rationale:** [por que essa decisão foi tomada]
**Alternativas descartadas:** [o que foi considerado e rejeitado]
**Arquivos impactados:** [principais arquivos criados/modificados]
**Agente responsável:** [@agente que fez a decisão]
```

### Quem Atualiza

- **@dev:** após implementar pattern novo ou resolver bug complexo
- **@architect:** após decisão arquitetural ou mudança de design
- **@data-engineer:** após migration ou mudança de schema
- **@qa:** após encontrar bug crítico ou definir novo padrão de teste

### Regras

- Entradas em ordem cronológica (mais recente no topo)
- Máximo 3-5 linhas por entrada
- NÃO duplicar informações já no `gotchas.json`
- Formato consistente (usar template acima)

> **Referência:** Ver `.antigravity/agent-memory/MEMORY-PROTOCOL.md` para guia completo.
