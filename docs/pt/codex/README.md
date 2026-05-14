# Codex AIOX

Esta pasta contem somente documentacao e controle da paridade Antigravity -> Codex.

Os artefatos operacionais ficam em `.codex/`, na raiz do projeto, ao lado de `.antigravity/`.

## Documentos

- `plano-mestre.md` - plano executavel por etapas independentes.
- `registro-execucao.md` - tarefas executadas, comandos e resultados.
- `inventario-antigravity.md` - inventario da base Antigravity usada como origem.
- `matriz-paridade.md` - decisao de paridade por familia de artefatos.
- `synapse-codex-validacao.md` - levantamento do SYNAPSE e disponibilidade no Codex.
- `skills-squads-codex-validacao.md` - validacao de skills/squads sensiveis para Codex.

## Comandos Principais

```bash
npm run sync:ide:codex
npm run sync:skills:codex
npm run validate:codex-sync
npm run validate:codex-integration
npm run validate:codex-skills
npm run validate:parity
npm run validate:synapse
npm run validate:codex-operational
```

## Pastas Usadas no Processo

### Documentacao e controle do processo Codex

A pasta principal para registrar plano, decisoes, status e validacoes e:

- `docs/pt/codex/`

Arquivos principais:

- `docs/pt/codex/README.md`
- `docs/pt/codex/plano-mestre.md`
- `docs/pt/codex/registro-execucao.md`
- `docs/pt/codex/inventario-antigravity.md`
- `docs/pt/codex/matriz-paridade.md`
- `docs/pt/codex/synapse-codex-validacao.md`
- `docs/pt/codex/skills-squads-codex-validacao.md`

Stories de acompanhamento:

- `docs/stories/codex-parity-antigravity.md`
- `docs/stories/synapse-codex-validation.md`
- `docs/stories/codex-skills-squads-validation.md`

Observacao: `docs/stories/` pode estar ignorado no git, mas e usado localmente para controle conforme `AGENTS.md`.

### Documentacao de referencia Antigravity

A principal fonte funcional e de usabilidade usada para entender o comportamento esperado e:

- `docs/pt/antigravity/`

Subpastas e documentos importantes:

- `docs/pt/antigravity/skills/`
- `docs/pt/antigravity/squads/`
- `docs/pt/antigravity/workflows/`
- `docs/pt/antigravity/guides/`
- `docs/pt/antigravity/rules/`
- `docs/pt/antigravity/agents/`
- `docs/pt/antigravity/templates/`
- `docs/pt/antigravity/guides/context-engine.md`
- `docs/pt/antigravity/skills/overview.md`
- `docs/pt/antigravity/skills/create-skill-guide.md`
- `docs/pt/antigravity/squads/overview.md`
- `docs/pt/antigravity/squads/managing-squads.md`

Tambem foi consultado:

- `docs/archive/synapse-antigravity-legacy/`

### Pastas operacionais

Antigravity preservado:

- `.antigravity/`
- `.antigravity/agents/`
- `.antigravity/commands/`
- `.antigravity/rules/`
- `.antigravity/skills/`
- `.antigravity/squads/`
- `.antigravity/templates/`
- `.antigravity/workflows/`
- `.antigravity/agent-memory/`

Codex adaptado:

- `.codex/`
- `.codex/CODEX.md`
- `.codex/agents/`
- `.codex/commands/`
- `.codex/rules/`
- `.codex/skills/`
- `.codex/squads/`
- `.codex/templates/`
- `.codex/workflows/`
- `.codex/agent-memory/`

SYNAPSE compartilhado:

- `.synapse/`
- `.synapse/manifest`
- `.synapse/constitution`
- `.synapse/global`
- `.synapse/context`
- `.synapse/commands`
- `.synapse/agent-*`
- `.synapse/workflow-*`
- `.synapse/sessions/`
- `.synapse/metrics/`

Core AIOX e scripts:

- `.aiox-core/`
- `.aiox-core/core/synapse/`
- `.aiox-core/cli/commands/`
- `.aiox-core/infrastructure/scripts/`
- `.aiox-core/infrastructure/scripts/ide-sync/`
- `.aiox-core/infrastructure/scripts/codex-skills-sync/`

Squads compartilhadas do projeto:

- `squads/`
- `squads/squad-creator/`
- `squads/skill-creator/`

### Arquivos de configuracao importantes

- `AGENTS.md`
- `package.json`
- `.aiox-core/core-config.yaml`
- `packages/installer/src/config/ide-configs.js`
- `bin/aiox.js`

### Validadores criados ou adaptados

- `.aiox-core/infrastructure/scripts/validate-parity.js`
- `.aiox-core/infrastructure/scripts/validate-codex-integration.js`
- `.aiox-core/infrastructure/scripts/codex-skills-sync/validate.js`
- `.aiox-core/infrastructure/scripts/validate-codex-operational-artifacts.js`

Scripts npm relevantes:

```bash
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:codex-operational
npm.cmd run validate:synapse
npm.cmd run validate:parity
```
