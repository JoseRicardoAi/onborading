# Tool Usage Rules - AIOX Codex

Esta regra define o uso de ferramentas na arvore operacional Codex.

## Principio

Use as capacidades reais disponiveis no Codex nesta ordem:

1. Ferramentas nativas do Codex/Codex CLI expostas na sessao.
2. Shell e comandos npm/git seguros, respeitando sandbox e aprovacoes.
3. Skills locais em `.codex/skills/`.
4. MCPs/conectores disponiveis na sessao.
5. Documentacao operacional em `.codex/` e `docs/pt/codex/`.

## Mapeamento de Ferramentas

| Necessidade | No Codex use |
| --- | --- |
| `read_file_available` | leitura por shell (`Get-Content`) ou ferramenta de leitura disponivel |
| `grep_search` | `rg` |
| `find_by_name` | `rg --files` ou `Get-ChildItem` |
| `edit_file_available` | `apply_patch` para arquivos versionados |
| `edit_file_available` | `apply_patch` |
| `multi_edit_file_available` | patches pequenos e revisaveis |
| `run_command` | `shell_command` com aprovacao quando exigida |
| `browser_subagent` | plugin/browser skill quando disponivel; caso contrario Playwright/testes locais |
| `generate_image` | skill/ferramenta de imagem quando disponivel |
| `Stitch MCP opcional` | registrar como dependencia externa; usar fallback de especificacao UI quando MCP nao existir |
| KI System | memoria versionada em `.codex/agent-memory/` e docs de handoff |
| governanca automatica | validadores npm, `AGENTS.md`, story checklist e disciplina de workflow |

## Regras Praticas

- Para pesquisa de codigo, prefira `rg`.
- Para edicao manual, use `apply_patch`.
- Para scripts npm no Windows, prefira `npm.cmd` quando `npm.ps1` estiver bloqueado.
- Quando um comando falhar por sandbox/permissao, solicite aprovacao ou passe o comando ao usuario.
- Nao execute `git push`; no modelo AIOX, isso continua restrito ao fluxo `@devops`.

## Quality Gates

Use estes comandos como substitutos operacionais dos hooks automaticos:

```bash
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:parity
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
```
