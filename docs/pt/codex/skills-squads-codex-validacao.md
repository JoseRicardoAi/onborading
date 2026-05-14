# Validacao de Skills e Squads para Codex

## Resumo

Skills e squads estavam presentes em `.codex/`, mas a primeira verificacao mostrou que quase todas as skills especializadas eram copia literal de `.antigravity/skills`. Isso preservava arquivos, mas nao garantia operacao Codex. Foram adaptados os pontos sensiveis para Codex, mantendo Antigravity funcional.

Resultado atual: PASS para a validacao operacional Codex.

## Fontes Consultadas

- `docs/pt/antigravity/skills/overview.md`
- `docs/pt/antigravity/skills/create-skill-guide.md`
- `docs/pt/antigravity/squads/overview.md`
- `docs/pt/antigravity/squads/managing-squads.md`
- `.antigravity/skills/`
- `.antigravity/squads/`
- `.codex/skills/`
- `.codex/squads/`
- `squads/skill-creator/`
- `squads/squad-creator/`

## Achados

| Area | Achado | Acao |
| --- | --- | --- |
| Skills especializadas | 12 de 13 skills herdadas eram copia literal da origem Antigravity | Adaptadas as skills sensiveis para Codex |
| `synapse` | Ja estava adaptada para Codex | Mantida |
| `squad` | Apontava para `.antigravity/agents`, `.antigravity/workflows` e ferramentas Antigravity | Corrigida para `.codex` e ferramentas Codex |
| `governance` | Apontava para `.antigravity/rules/governance-config.md` e tool names Antigravity | Corrigida para `.codex/rules` e linguagem generica de edicao |
| `tech-search` | Dependia de `search_web` e `read_url_content` | Adaptada para browsing/search Codex quando disponivel, com fallback explicito |
| `skill-creator` | Falava que skills estendem Antigravity | Adaptada para Codex/AIOX |
| `.codex/squads/design-system` | Espelho literal de Antigravity, com paths `.antigravity` e Stitch MCP hardcoded | Corrigida para `.codex`, AGENTS.md/CODEX.md e fallback sem Stitch |
| `squads/skill-creator` | Gerava sempre em `.antigravity/skills` | Tornada runtime-aware: Antigravity ou Codex |
| `squads/squad-creator` | Usava templates/memoria/ferramentas Antigravity | Tornada runtime-aware |

## Decisao de Runtime

- `.antigravity/skills` e `.antigravity/squads` continuam preservados para Antigravity.
- `.codex/skills` e `.codex/squads` sao a camada operacional Codex.
- `squads/` e uma camada compartilhada de projeto. Ela pode mencionar `.antigravity` apenas como alvo explicito de runtime, mas nao pode depender de ferramentas nativas Antigravity.
- Novas skills criadas pelo fluxo `skill-creator` devem ir para:
  - Codex: `.codex/skills/{skill-name}/`
  - Antigravity: `.antigravity/skills/{skill-name}/`

## Validador Criado

Foi criado:

```bash
npm.cmd run validate:codex-operational
```

Ele valida:

- toda skill Antigravity tem equivalente em `.codex/skills`;
- arquivos de `.antigravity/squads` possuem equivalente em `.codex/squads`;
- `.codex/skills` e `.codex/squads` nao contem referencias operacionais proibidas a `.antigravity`, `ANTIGRAVITY.md`, ferramentas Antigravity ou MCP Stitch hardcoded;
- squads compartilhadas em `squads/` nao dependem de tool names Antigravity.

## Resultado Comprobatorio

Comando:

```bash
npm.cmd run validate:codex-operational
```

Resultado:

- PASS.
- 42 arquivos Codex escaneados.
- Skills: Antigravity=13, Codex=25.
- Arquivos de squad espelhados da `.antigravity`: 7.
- Arquivos de squads compartilhadas escaneados: 26.

Tambem foi executado:

```bash
npm.cmd run validate:codex-skills
```

Resultado:

- PASS.
- 12 skills `aiox-*` canonicas verificadas.

Validacao complementar:

```bash
npm.cmd run validate:parity
```

Resultado:

- PASS com permissao elevada, porque o sandbox bloqueia subprocessos Node com `EPERM`.
- Avisos conhecidos: `.antigravity/hooks` ausente, contagem Codex 42/12 por agentes especialistas extras, `.gemini/rules.md` ausente.

## Status por Funcionalidade

| Funcionalidade | Codex |
| --- | --- |
| Catalogo de skills especializadas | Operacional |
| Skills `aiox-*` geradas por sync | Operacional |
| Skill `squad` | Adaptada |
| Skill `skill-creator` | Adaptada |
| Skill `governance` | Adaptada |
| Skill `tech-search` | Adaptada com fallback quando browsing nao estiver disponivel |
| Squad global `design-system` | Adaptada |
| Squad compartilhada `squad-creator` | Adaptada para runtime Antigravity/Codex |
| Squad compartilhada `skill-creator` | Adaptada para runtime Antigravity/Codex |
| Stitch MCP | Limitacao documentada; usa ferramenta se existir, senao fallback local |

## Pendencias Recomendadas

- Adicionar testes unitarios dedicados ao novo validador `validate-codex-operational`.
- Avaliar se os scripts Python dentro de `.codex/skills/skill-creator/scripts` devem ter mensagens 100% Codex em vez de AIOX generico.
- Rodar validacao completa antes de release: `validate:codex-operational`, `validate:codex-skills`, `validate:parity`, `lint`, `typecheck`, `npm test`.
