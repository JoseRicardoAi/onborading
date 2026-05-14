# Codex Operation Rules

Esta regra define como operar a arvore `.codex/` sem depender de outra interface.

## Fontes

- Operacao Codex: `.codex/`.
- Contrato principal Codex: `AGENTS.md`.

## Politica de Adaptacao

| Tipo de artefato | Politica Codex |
| --- | --- |
| agentes canonicos | gerar/sincronizar de `.aiox-core/development/agents/` para `.codex/agents/` |
| agentes especialistas | manter em `.codex/agents/` como perfis de referencia/ativacao textual |
| skills AIOX | gerar `aiox-*` em `.codex/skills/` para `/skills` |
| skills | manter apenas quando executaveis como `SKILL.md` no Codex |
| regras | reescrever regras que dependem de hooks ou ferramentas indisponiveis no Codex |
| workflows | manter arquivos, mas executar por leitura explicita + agente/skill + quality gates npm |
| templates | copiar quando forem dados estaticos |
| squads | copiar manifesto e agentes, ativar por leitura explicita ou menu `!squads` textual |
| memoria | usar `.codex/agent-memory/` como memoria versionada, sem KI System automatico |

## Anti-Patterns

- Nao dizer que plugins visuais, browser automatizado, KI System ou hooks existem no Codex se nao estiverem disponiveis na sessao.
- Nao usar outra arvore operacional durante uma sessao Codex.
- Nao editar skills geradas `aiox-*` manualmente; rode `npm.cmd run sync:skills:codex`.
- Nao transformar limitacao em promessa. Documente fallback.

## Fallbacks Obrigatorios

- UI: gerar `docs/architecture/ui-guidelines.yaml` ou especificacao textual se MCP/plugin visual nao existir.
- Hooks: rodar validadores npm explicitamente.
- Menus de IDE: renderizar tabelas Markdown.
- Memoria cross-session: atualizar arquivos em `.codex/agent-memory/` ou docs de handoff.
