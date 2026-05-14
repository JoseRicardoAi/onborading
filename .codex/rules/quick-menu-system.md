# Quick Menu System - AIOX Codex

No Codex, menus `!agents`, `!workflows` e `!squads` sao tratados como comandos textuais interpretados pelo agente.

## Regra Geral

Quando o usuario digitar um gatilho `!`, responda com uma tabela Markdown simples, baseada nos arquivos reais em `.codex/`, e aguarde a escolha do usuario antes de executar qualquer workflow.

## Gatilhos

| Gatilho | Fonte Codex | Resultado |
| --- | --- | --- |
| `!agents`, `!agentes` | `.codex/agents/` e `.codex/skills/aiox-*` | listar agentes e sugerir `/skills` ou atalho `@agent` |
| `!commands`, `!comandos` | agente ativo ou `.aiox-core/development/agents/*.md` | listar star commands do agente ativo |
| `!workflows`, `!workflow` | `.codex/workflows/workflow.meta.json` e `.codex/workflows/*.md` | listar workflows por categoria |
| `!squads`, `!squad` | `.codex/squads/*/squad.meta.json` | listar squads e depois especialistas da squad escolhida |
| `!rules`, `!regras` | `.codex/rules/` | listar regras Codex aplicaveis |

## Regras Codex

- Codex nao intercepta menus como recurso nativo de IDE.
- A execucao deve ser explicitamente confirmada pelo usuario quando houver risco, custo ou alteracao ampla.
- Use `/skills` para ativacao primaria de agentes AIOX.
- Use atalhos `@architect`, `/dev`, `@qa` etc. conforme `AGENTS.md` apenas como fallback textual.
- Sempre use arquivos `.codex/` durante uma sessao Codex.

## Fluxo de Execucao

1. Ler a fonte real do menu.
2. Mostrar opcoes numeradas.
3. Aguardar escolha.
4. Carregar o agente, skill ou workflow selecionado.
5. Registrar progresso na story ativa quando houver implementacao.
