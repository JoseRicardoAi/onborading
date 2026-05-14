# Agent Authority — Regras Detalhadas

## Matriz de Delegação

### @devops (Gage) — Autoridade EXCLUSIVA

| Operação                        | Exclusivo? | Outros Agentes |
| ------------------------------- | ---------- | -------------- |
| `git push` / `git push --force` | SIM        | BLOQUEADO      |
| `gh pr create` / `gh pr merge`  | SIM        | BLOQUEADO      |
| MCP add/remove/configure        | SIM        | BLOQUEADO      |
| Gerenciamento de CI/CD pipeline | SIM        | BLOQUEADO      |
| Gerenciamento de releases       | SIM        | BLOQUEADO      |

### @pm (Morgan) — Orquestração de Épicos

| Operação                                  | Exclusivo? | Delegado De |
| ----------------------------------------- | ---------- | ----------- |
| `*execute-epic`                           | SIM        | —           |
| `*create-epic`                            | SIM        | —           |
| Gerenciamento de EPIC-{ID}-EXECUTION.yaml | SIM        | —           |
| Coleta de requisitos                      | SIM        | —           |
| Escrita de spec (spec pipeline)           | SIM        | —           |

### @po (Pax) — Validação de Stories

| Operação                                      | Exclusivo? | Detalhes               |
| --------------------------------------------- | ---------- | ---------------------- |
| `*validate-story-draft`                       | SIM        | Checklist de 10 pontos |
| Rastreamento de contexto de stories em épicos | SIM        | —                      |
| Gerenciamento de contexto de épico            | SIM        | —                      |
| Priorização de backlog                        | SIM        | —                      |

### @sm (River) — Criação de Stories

| Operação                     | Exclusivo? | Detalhes             |
| ---------------------------- | ---------- | -------------------- |
| `*draft` / `*create-story`   | SIM        | A partir de epic/PRD |
| Seleção de template de story | SIM        | —                    |

### @dev (Dex) — Implementação

Limitado estritamente ao código da aplicação em `src/` e `packages/`.

| Permitido                                                | Bloqueado                                   |
| -------------------------------------------------------- | ------------------------------------------- |
| `git add`, `git commit`, `git status`                    | `git push` (delegar para @devops)           |
| `git branch`, `git checkout`, `git merge` (local)        | `gh pr create/merge` (delegar para @devops) |
| `git stash`, `git diff`, `git log`                       | Gerenciamento de MCP                        |
| Atualizações de arquivo de story (File List, checkboxes) | Atualizações de story (AC, escopo, título)  |

### @architect (Aria) — Autoridade de Design

Documentação de arquitetura baseada prioritariamente em `docs/architecture/`.

| Owns                               | Delega Para                          |
| ---------------------------------- | ------------------------------------ |
| Decisões de arquitetura de sistema | —                                    |
| Seleção de tecnologia              | —                                    |
| Arquitetura de dados de alto nível | @data-engineer (DDL detalhado)       |
| Padrões de integração              | @data-engineer (otimização de query) |
| Avaliação de complexidade          | —                                    |

### @data-engineer (Dara) — Database

Escopo restrito a `supabase/` (ou diretório de db correspondente do projeto atual).

| Owns (delegado de @architect)         | NÃO Owns               |
| ------------------------------------- | ---------------------- |
| Design de schema (DDL detalhado)      | Arquitetura de sistema |
| Otimização de queries                 | Código de aplicação    |
| Implementação de RLS policies         | Git operations         |
| Estratégia de índices e execução      | Frontend/UI            |
| Planejamento e execução de migrations | —                      |

### @aiox-master — Governança do Framework

| Capacidade                         | Detalhes                                  |
| ---------------------------------- | ----------------------------------------- |
| Executar QUALQUER task diretamente | Sem restrições                            |
| Governança do framework            | Enforcement constitucional                |
| Override de limites de agente      | Quando necessário para saúde do framework |

## Padrões de Delegação Cross-Agent

### Fluxo de Git Push

```
QUALQUER agente → @devops *push
```

### Fluxo de Design de Schema

```
@architect (decide tecnologia) → @data-engineer (implementa DDL)
```

### Fluxo de Story

```
@sm *draft → @po *validate → @dev *develop → @qa *qa-gate → @devops *push
```

### Fluxo de Épico

```
@pm *create-epic → @pm *execute-epic → @sm *draft (por story)
```

## Regras de Escalação

1. Agente não consegue completar task → Escalar para @aiox-master
2. Quality gate falha → Retornar para @dev com feedback específico
3. Violação constitucional detectada → BLOQUEAR, exigir correção antes de prosseguir
4. Conflito de limites de agente → @aiox-master medeia
