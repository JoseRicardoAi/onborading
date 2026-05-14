# CODEX.md - AIOX Codex

Este arquivo configura a camada operacional do AIOX para Codex CLI neste repositorio.

## Fonte de Verdade

- `AGENTS.md` e o contrato principal de execucao no Codex.
- `.aiox-core/constitution.md` continua sendo a fonte de verdade constitucional.
- `.aiox-core/development/agents/` continua sendo a fonte canonica de agentes AIOX.
- `.codex/` contem os artefatos locais de operacao Codex.

## Estrutura Codex

- `.codex/agents/` - agentes auxiliares e especialistas para Codex.
- `.codex/commands/` - comandos/agentes sincronizados para uso operacional.
- `.codex/rules/` - regras adaptadas para governanca no Codex, especialmente `codex-adaptation.md`.
- `.codex/skills/` - skills locais do Codex; prefira este caminho versionado em vez de `~/.codex/skills`.
- `.codex/squads/` - squads locais espelhadas.
- `.codex/templates/` - templates operacionais.
- `.codex/workflows/` - workflows operacionais.
- `.codex/agent-memory/` - memoria local de agentes quando o fluxo exigir contexto persistente.

## Operacao

1. Ative agentes preferencialmente por `/skills` usando `aiox-<agent-id>`.
2. Para atalhos como `@architect`, `/dev` ou `/qa`, siga o mapeamento definido em `AGENTS.md`.
3. Quando um artefato Codex divergir da fonte canonica, rode o sync antes de editar manualmente.
4. Artefatos em `.codex/` devem apontar para capacidades e paths Codex.
5. Registre decisoes e status da revisao em `docs/pt/codex/`.

## Operacao Codex, Nao Copia

`.codex/` e a arvore operacional do Codex. No Codex:

- `AGENTS.md` substitui a ativacao automatica de arquivo raiz da IDE.
- `.codex/CODEX.md` e o documento raiz da camada Codex.
- `/skills` substitui menus nativos de agente.
- validadores npm substituem hooks automaticos.
- menus `!` sao tabelas Markdown geradas a partir de arquivos reais.
- capacidades externas opcionais devem ter fallback explicito ou limitacao documentada.

## Comandos de Paridade

```bash
npm run sync:ide:codex
npm run sync:skills:codex
npm run validate:codex-sync
npm run validate:codex-integration
npm run validate:codex-skills
npm run validate:codex-operational
npm run validate:parity
npm run validate:synapse
```

## SYNAPSE no Codex

SYNAPSE permanece compartilhado na raiz em `.synapse/`. No Codex, nao copie essa pasta para `.codex/` e nao assuma hook automatico de IDE. Use a skill local `.codex/skills/synapse/SKILL.md` ou o CLI explicito:

```bash
node bin/aiox.js synapse status
node bin/aiox.js synapse domains
node bin/aiox.js synapse validate --runtime codex
node bin/aiox.js synapse run "prompt" --agent dev
```
