# Matriz Runtime Unico - Revisao Operacional `.codex`

## Decisao

A aplicacao deve manter somente uma interface ativa por vez. A fonte persistida e `.aiox-core/core-config.yaml`.

Estados validos:

- `ide.selected: [codex]` com `ide.configs.codex: true` e demais interfaces `false`.
- `ide.selected: [antigravity]` ou `ide.selected: [antigravity-code]` com somente o Antigravity correspondente habilitado.

Estados invalidos:

- `ide.selected` com zero ou mais de um item.
- `ide.configs` com zero ou mais de uma interface `true`.
- `ideSync.targets` com mais de um alvo habilitado.
- Codex e Antigravity habilitados ao mesmo tempo em qualquer combinacao.

## Matriz Inicial

| Familia | Codex | Antigravity | Estado | Validacao |
| --- | --- | --- | --- | --- |
| Config runtime | `.aiox-core/core-config.yaml` seleciona `codex` | seleciona `antigravity`/`antigravity-code` | Em implementacao | `validate:runtime` |
| Instalador | wizard escolhe um runtime | wizard escolhe um runtime | Em implementacao | `tests/unit/wizard/ide-selector.test.js` |
| Troca posterior | `aiox config ide --set codex` | `aiox config ide --set antigravity-code` | Em implementacao | smoke CLI |
| Agentes | `.codex/agents/` | `.antigravity/agents/` | Lote 2 concluido para Codex | `rg` focado + `validate:codex-sync` |
| Comandos | `.codex/commands/` | `.antigravity/commands/` | Pendente inventario profundo | validador operacional profundo |
| Regras | `.codex/rules/` | `.antigravity/rules/` | Lote 3 concluido para Codex | `rg` focado + `validate:codex-operational` |
| Skills | `.codex/skills/` | `.antigravity/skills/` | Parcialmente validado | `validate:codex-operational` + proximo lote |
| Squads | `.codex/squads/` e `squads/` runtime-aware | `.antigravity/squads/` e `squads/` runtime-aware | Parcialmente validado | `validate:codex-operational` + proximo lote |
| Templates | `.codex/templates/` | `.antigravity/templates/` | Lote 4 concluido para Codex | `rg` focado + `validate:codex-operational` |
| Workflows | `.codex/workflows/` | `.antigravity/workflows/` | Lote 4 concluido para Codex | `rg` focado + `validate:codex-operational` |
| Memorias | `.codex/agent-memory/` | `.antigravity/agent-memory/` | Lote 4 concluido para Codex | `rg` focado + `validate:codex-operational` |

## Inventario Observado - Lote 1

`validate:codex-operational` passou e inventariou 170 arquivos operacionais em `.codex/`:

| Familia | Arquivos |
| --- | ---: |
| agents | 42 |
| commands | 12 |
| rules | 28 |
| skills | 35 |
| squads | 7 |
| templates | 20 |
| workflows | 16 |
| agent-memory | 10 |

Backlog de adaptacao detectado fora de `skills/` e `squads/`:

- referencias `.antigravity/`: 42 arquivos;
- referencias `ANTIGRAVITY.md`: 1 arquivo;
- ferramentas Antigravity `search_web`/`read_url_content`: 18/17 arquivos;
- ferramentas Antigravity de arquivo `view_file`/`write_to_file`/`replace_file_content`: 30/31/29 arquivos;
- referencias hardcoded `mcp_stitch_*`: 11 arquivos.

Esses achados ficam como warnings no lote 1 para permitir correcao por familia nos proximos lotes.

## Lote 2 - Agentes `.codex/agents`

Resultado:

- 12 agentes canonicos sincronizados permaneceram sem drift.
- 30 agentes especialistas/orfaos foram normalizados para runtime Codex.
- Paths operacionais `.antigravity/agents`, `.antigravity/agent-memory`, `.antigravity/skills`, `.antigravity/rules`, `.antigravity/templates` e `.antigravity/squads` foram convertidos para `.codex/...`.
- Referencias a ferramentas nativas Antigravity em agentes foram substituidas por capacidades genericas Codex:
  - `view_file` -> `read_file_available`
  - `write_to_file`/`replace_file_content` -> `edit_file_available`
  - `multi_replace_file_content` -> `multi_edit_file_available`
  - `search_web` -> `web_search_available`
  - `read_url_content` -> `read_url_available`
  - `mcp_stitch_*` -> `stitch_mcp_optional` ou descricao de Stitch MCP opcional.

Validacoes:

- `rg` focado em `.codex/agents` nao encontrou referencias operacionais proibidas.
- `npm.cmd run validate:codex-sync` passou: 12 sincronizados, 0 drift, 30 orphaned esperados.
- `npm.cmd run validate:codex-operational` passou; backlog restante agora esta em `rules`, `templates` e `workflows`.

## Lote 3 - Regras `.codex/rules`

Resultado:

- Paths operacionais foram convertidos para `.codex/...`.
- Exemplos de ferramentas nativas Antigravity foram substituidos por capacidades Codex ou descricoes neutras.
- A regra de governance deixou de orientar uso de hooks Python herdados e passou a direcionar para `.codex/skills/governance/SKILL.md` e validadores npm.

Validacoes:

- `rg` focado em `.codex/rules` nao encontrou referencias operacionais proibidas.
- `npm.cmd run validate:codex-operational` passou.

## Lote 4 - Templates, Workflows e Memorias

Resultado:

- Workflows Codex agora confirmam `.codex/` como estrutura operacional.
- Workflows que dependem de pesquisa usam `web_search_available`/`read_url_available` como capacidades abstratas, nao tools Antigravity.
- Referencias hardcoded a Stitch foram substituidas por dependencia opcional.
- Templates e memorias passaram a apontar para `.codex/templates/`.

Validacoes:

- `rg` focado em `.codex/templates`, `.codex/workflows` e `.codex/agent-memory` nao encontrou referencias operacionais proibidas.
- `npm.cmd run validate:codex-operational` passou sem warnings de backlog.

## Proximos Lotes

1. Fechar validacao runtime unico com testes e quality gates focados.
2. Inventariar todos os artefatos `.codex` e equivalentes `.antigravity`.
3. Expandir o validador operacional profundo para todas as familias, nao apenas skills/squads.
4. Corrigir referencias indevidas por familia, registrando cada lote na story.
