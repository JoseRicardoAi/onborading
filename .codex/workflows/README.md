# Workflows AIOX Codex

Este diretorio contem workflows operacionais do Codex.

## Como Executar No Codex

1. Ative o agente apropriado via `/skills` (`aiox-pm`, `aiox-architect`, `aiox-dev`, etc.) ou pelo atalho definido em `AGENTS.md`.
2. Leia explicitamente o workflow em `.codex/workflows/<workflow>.md`.
3. Execute as fases do workflow usando ferramentas reais do Codex.
4. Substitua hooks automaticos por validadores npm.
5. Registre progresso na story ativa e em `docs/pt/codex/` quando a mudanca fizer parte da revisao Codex.

## Guia de Selecionar Workflow

| Situacao | Workflow |
| --- | --- |
| projeto novo full-stack | `greenfield-fullstack.md` |
| projeto novo backend/API | `greenfield-service.md` |
| projeto novo frontend/UI | `greenfield-ui.md` |
| primeiro contato com legado | `brownfield-discovery.md` |
| evolucao full-stack em legado | `brownfield-fullstack.md` |
| evolucao backend em legado | `brownfield-service.md` |
| evolucao UI em legado | `brownfield-ui.md` |
| ideia para PRD/epicos/stories | `spec-pipeline.md` |
| executar epico coordenado | `epic-orchestration.md` |
| implementar uma story | `story-development-cycle.md` |
| corrigir QA reprovado | `qa-loop.md` |
| criar/refatorar design system | `design-system-build.md` |
| criar squad | `create-squad.md` |
| trabalho paralelo com worktrees | `auto-worktree.md` |
| trocar IDE/runtime ativa | `switch-ide-runtime.md` |

## Execucao Codex

| Necessidade | No Codex use |
| --- | --- |
| selecao de workflow | `!workflows` renderizado como tabela Markdown |
| governanca | validadores npm + checklist da story |
| validacao visual | browser/plugin/testes locais quando disponivel |
| geracao visual | MCP/plugin se disponivel; caso contrario especificacao UI textual |
| memoria operacional | `.codex/agent-memory/` e handoffs versionados |
| progresso | updates curtos no chat e `registro-execucao.md` |

## Validacao Recomendada

```bash
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:parity
```
