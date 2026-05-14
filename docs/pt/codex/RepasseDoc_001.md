Estamos no projeto `f:\Projetos Códigos\AIOX Agentes\aiox-codex`.

Objetivo geral: adaptar o projeto AIOX, que já estava operacional para Antigravity, para também operar corretamente no Codex, sem quebrar Antigravity. A regra central é: não copiar cegamente `.antigravity`; adaptar para o funcionamento real do Codex.

## Estado Geral

Já foi criada e adaptada a camada `.codex/` na raiz do projeto, ao lado de `.antigravity/`.

- `.codex/` é operacional.
- `docs/pt/codex/` é apenas documentação/controle.
- `.codex/CODEX.md` é o contrato operacional Codex.
- `.codex/ANTIGRAVITY.md` não deve existir.
- `AGENTS.md` continua sendo o contrato principal do Codex CLI.

## Principais mudanças implementadas

1. **Paridade Antigravity -> Codex**
   - Criada `.codex/`.
   - Criados/adaptados agentes, comandos, regras, skills, squads, templates, workflows e memórias.
   - Adicionados scripts Codex no `package.json`:
     - `sync:ide:codex`
     - `validate:codex-sync`
     - `validate:codex-integration`
     - `sync:skills:codex`
     - `sync:skills:codex:global`
     - `validate:codex-skills`
     - `validate:codex-operational`

2. **Configuração IDE**
   - Codex foi adicionado como IDE/runtime suportado.
   - `packages/installer/src/config/ide-configs.js` agora inclui `codex`.
   - Criado comando:
     - `aiox config ide`
     - `aiox config ide --list`
     - `aiox config ide --set codex,antigravity`
     - `aiox config ide --enable codex`
     - `aiox config ide --disable codex`

3. **SYNAPSE**
   - `.synapse/` permanece compartilhado na raiz.
   - Não deve ser copiado para `.codex/`.
   - Hooks são legado herdado do Claude e não requisito para Antigravity/Codex.
   - Antigravity usa SYNAPSE via skill semi-automática.
   - Codex usa SYNAPSE via skill/CLI explícito.
   - Criado comando:
     - `aiox synapse status`
     - `aiox synapse domains`
     - `aiox synapse validate`
     - `aiox synapse validate --runtime antigravity`
     - `aiox synapse validate --runtime codex`
     - `aiox synapse diagnose`
     - `aiox synapse run "prompt" --agent dev`
   - Criado script:
     - `validate:synapse`

4. **Skills e Squads**
   - Foi feita análise específica porque são processos sensíveis.
   - `.codex/skills` não deve ser cópia literal de `.antigravity/skills`.
   - Adaptadas skills sensíveis:
     - `squad`
     - `skill-creator`
     - `governance`
     - `tech-search`
     - `clone-mind`
     - `enhance-workflow`
     - `checklist-runner`
     - `synapse`
   - Adaptada `.codex/squads/design-system`.
   - `squads/squad-creator` e `squads/skill-creator` foram tornados runtime-aware: podem operar para Antigravity ou Codex.
   - Criado validador:
     - `.aiox-core/infrastructure/scripts/validate-codex-operational-artifacts.js`
     - script npm: `validate:codex-operational`

## Documentação criada/atualizada

Em `docs/pt/codex/`:

- `README.md`
- `plano-mestre.md`
- `registro-execucao.md`
- `inventario-antigravity.md`
- `matriz-paridade.md`
- `synapse-codex-validacao.md`
- `skills-squads-codex-validacao.md`

Stories criadas em `docs/stories/`:

- `codex-parity-antigravity.md`
- `synapse-codex-validation.md`
- `codex-skills-squads-validation.md`

Observação: `docs/stories/` pode estar ignorado no git, mas os arquivos existem localmente.

## Validações já executadas

Passaram:

```bash
npm.cmd run sync:ide:codex
npm.cmd run sync:skills:codex
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:codex-operational
npm.cmd run validate:synapse
npm.cmd run validate:parity
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test -- tests\synapse --runInBand
npm.cmd test -- tests/unit/validate-parity.test.js --runInBand
npm.cmd test -- tests/unit/config/ide-configs.test.js --runInBand


## Pastas usadas no processo

### Documentação e controle do processo Codex

A pasta principal para registrar plano, decisões, status e validações é:

- `docs/pt/codex/`

Arquivos principais nela:

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

Observação: `docs/stories/` pode estar ignorado no git, mas é usado localmente para controle conforme `AGENTS.md`.

### Documentação de referência Antigravity

A principal fonte funcional e de usabilidade usada para entender o comportamento esperado é:

- `docs/pt/antigravity/`

Subpastas/documentos importantes:

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

Também foi consultado:

- `docs/archive/synapse-antigravity-legacy/`

### Pastas operacionais do processo

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

### Arquivos de configuração importantes

- `AGENTS.md`
- `package.json`
- `.aiox-core/core-config.yaml`
- `packages/installer/src/config/ide-configs.js`
- `bin/aiox.js`

### Validadores criados/adaptados

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
