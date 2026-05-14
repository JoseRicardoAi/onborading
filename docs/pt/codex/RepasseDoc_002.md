Estamos no projeto `f:\Projetos Códigos\AIOX Agentes\aiox-codex`.

Este repasse deve ser usado para continuar exatamente o processo de revisao operacional entre Antigravity e Codex, preservando todas as decisoes ja consolidadas nesta conversa.

## Objetivo Geral

Garantir que a aplicacao suporte os dois runtimes, com regra operacional clara:

- `.antigravity/` e exclusivo/nativo do Antigravity;
- `.codex/` e exclusivo/nativo do Codex;
- artefatos compartilhados, como `squads/`, devem decidir sua execucao com base na IDE/runtime persistente escolhida no projeto;
- nao pode existir estado valido com Codex e Antigravity ativos simultaneamente.

A decisao de execucao deve acontecer no runtime/resolvedor/configuracao persistida, e nao dentro dos artefatos nativos de cada interface.

## Decisoes Arquiteturais Ja Fechadas

1. **Runtime unico**
   - A aplicacao deve ter apenas uma interface ativa por vez.
   - A selecao feita na instalacao permanece persistida ate o usuario trocar explicitamente via menu/comando.
   - `aiox config ide --set codex` ativa apenas Codex.
   - `aiox config ide --set antigravity-code` ativa apenas Antigravity.
   - `--enable` e `--disable` nao podem recriar estado paralelo entre interfaces.

2. **Separacao nativa por pasta**
   - `.antigravity/` nao deve ser adaptado para Codex.
   - `.codex/` nao deve carregar linguagem, paths ou dependencias operacionais do Antigravity.
   - `squads/` e a principal camada compartilhada runtime-aware.

3. **Workflows**
   - Workflows em `.antigravity/workflows/` continuam exclusivos do Antigravity.
   - Workflows em `.codex/workflows/` devem ser exclusivos do Codex.
   - Workflows compartilhados em `squads/**/workflows/` devem ser runtime-aware.

4. **Skills, squads, agents e processos compartilhados**
   - Em artefatos compartilhados, nao reduzir tools originais do Antigravity.
   - Quando houver processo compartilhado, manter contrato funcional do Antigravity e mapear equivalente operacional para Codex.
   - O exemplo sensivel foi `squads/squad-creator/agents/oalanicolas.md`, que preserva 7 tools.

5. **SYNAPSE**
   - `.synapse/` permanece compartilhado na raiz do projeto.
   - Nao copiar `.synapse/` para `.codex/`.
   - No Codex, SYNAPSE e explicitamente acionado por skill/CLI.
   - Hooks herdados do Claude nao sao obrigatorios para Codex nem para Antigravity atual.

## Status Atual da Aplicacao

- Runtime unico implementado.
- Runtime atual local validado: `codex`.
- Separacao nativa entre `.antigravity/` e `.codex` reforcada.
- `.antigravity/` foi preservado sem alteracoes Codex.
- `.codex/` foi limpo para remover referencias residuais de operacao Antigravity.
- `squads/skill-creator` e `squads/squad-creator` seguem como artefatos compartilhados runtime-aware.

## Plano em Execucao

Story principal atual:

- `docs/stories/codex-runtime-unico-revisao-operacional.md`

Plano principal atual:

- `docs/pt/codex/plano-revisao-operacional-runtime-unico.md`

Matrizes/documentos de apoio:

- `docs/pt/codex/matriz-runtime-unico.md`
- `docs/pt/codex/matriz-workflows-runtime-unico.md`
- `docs/pt/codex/registro-execucao.md`
- `docs/pt/codex/inventario-antigravity.md`

Status do plano:

- configuracao de runtime unico: concluida;
- validador de runtime unico: concluido;
- inventario e validacao profunda de `.codex`: concluido;
- revisao especifica de workflows: concluida;
- revisao de skills/squads compartilhados com preservacao de tools Antigravity: concluida no lote tratado;
- limpeza operacional de `.codex` para ficar Codex-only: concluida;
- confirmacao de preservacao de `.antigravity`: concluida;
- quality gates focados desta rodada: concluidos.

## Arquivos e Pastas Principais em Trabalho

### Raizes operacionais

- `.antigravity/`
- `.codex/`
- `.synapse/`
- `.aiox-core/`
- `squads/`
- `docs/pt/codex/`
- `docs/stories/`

### Configuracao e runtime

- `AGENTS.md`
- `.aiox-core/core-config.yaml`
- `.aiox-core/cli/commands/config/index.js`
- `.aiox-core/infrastructure/scripts/validate-runtime-single.js`
- `packages/installer/src/config/templates/core-config-template.js`
- `packages/installer/src/config/validation/config-validator.js`
- `packages/installer/src/wizard/ide-selector.js`
- `package.json`

### Validadores e sincronizacao

- `.aiox-core/infrastructure/scripts/ide-sync/index.js`
- `.aiox-core/infrastructure/scripts/validate-codex-operational-artifacts.js`
- `.aiox-core/infrastructure/scripts/validate-codex-integration.js`
- `.aiox-core/infrastructure/scripts/codex-skills-sync/validate.js`

### Artefatos Codex revisados

- `.codex/CODEX.md`
- `.codex/agents/`
- `.codex/commands/`
- `.codex/rules/`
- `.codex/skills/`
- `.codex/templates/`
- `.codex/workflows/`
- `.codex/agent-memory/`
- `.codex/squads/design-system/workflows/generate-screen.md`

### Artefatos compartilhados em revisao/importantes

- `squads/squad-creator/agents/oalanicolas.md`
- `squads/squad-creator/agents/pedro-valerio.md`
- `squads/squad-creator/agents/research-specialists.md`
- `squads/squad-creator/squad.yaml`
- `squads/squad-creator/tasks/create-agent.md`
- `squads/squad-creator/workflows/clone-mind.md`
- `squads/squad-creator/workflows/create-squad-workflow.md`
- `squads/squad-creator/workflows/mind-research-loop.md`
- `squads/skill-creator/squad.yaml`
- `squads/skill-creator/tasks/generate-skill-files.md`
- `squads/skill-creator/tasks/select-integrations.md`
- `squads/skill-creator/workflows/create-skill.md`

### Referencias Antigravity

- `docs/pt/antigravity/`
- `docs/en/antigravity/tools/tool-mapping.md`
- `.antigravity/workflows/`

## Validacoes Ja Executadas com Sucesso

Passaram nesta linha de trabalho:

```bash
npm.cmd run validate:runtime
npm.cmd run validate:codex-sync
npm.cmd run sync:ide:codex
npm.cmd run validate:codex-operational
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:synapse
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test -- tests/unit/validate-runtime-single.test.js tests/unit/wizard/ide-selector.test.js tests/installer/core-config-template.test.js --runInBand
npm.cmd test -- packages/installer/tests/unit/config-validator.test.js --runInBand
```

Observacoes importantes:

- `validate:codex-sync` passou com `12/12` agentes sincronizados, `0 drift` e `30 orphaned` especialistas esperados.
- `validate:codex-integration` passa com aviso conhecido de contagem `42/12`, porque `.codex/agents` contem 12 canônicos e 30 especialistas extras.
- `lint` passa sem erros, mas com warnings preexistentes do projeto.
- A suite completa `npm.cmd test -- --runInBand` ainda nao foi fechada como limpa; houve historico de timeout e falhas preexistentes fora do escopo.

## Confirmacoes Importantes Ja Feitas

- Busca cruzada em `.codex/` nao encontrou referencias residuais de operacao Antigravity.
- Busca cruzada em `.antigravity/` nao encontrou referencias residuais de operacao Codex.
- `git diff -- .antigravity` estava limpo na rodada de confirmacao.
- Workflows Codex e Antigravity ficaram separados por runtime.
- Workflows compartilhados ficaram runtime-aware.

## Pendencias Reais para a Proxima Conversa

Continuar a partir daqui, sem refazer o que ja foi consolidado.

Prioridades sugeridas:

1. Retomar a tratativa de `Antigravity-only` com a regra correta:
   - itens em `.antigravity/` permanecem exclusivos do Antigravity;
   - itens em `.codex/` devem ser exclusivos do Codex;
   - itens compartilhados decidem execucao pela IDE persistente.

2. Revisar com extremo cuidado alteracoes em arquivos fora de `.codex/`, especialmente:
   - `squads/skill-creator/`
   - `squads/squad-creator/`
   - qualquer task/workflow compartilhado que possa ter ficado enviesado para Codex.

3. Validar se ainda existe qualquer linguagem ou comportamento que trate "Antigravity-only" de forma incorreta em artefatos compartilhados.

4. Se houver novas correcoes, atualizar obrigatoriamente:
   - `docs/pt/codex/registro-execucao.md`
   - `docs/stories/codex-runtime-unico-revisao-operacional.md`
   - file list/checklist correspondente

## Instrucoes de Continuidade para o Proximo Agente

- Nao reintroduzir multi-runtime simultaneo.
- Nao adaptar `.antigravity/` para Codex.
- Nao deixar `.codex/` com referencias operacionais Antigravity.
- Nao reduzir contratos de tools em artefatos compartilhados quando o Antigravity exigir mais capacidade.
- Preservar `squads/` como camada compartilhada runtime-aware.
- Usar `docs/pt/codex/registro-execucao.md` como fonte de verdade do andamento recente.
- Antes de editar, conferir se o alvo pertence a:
  - runtime nativo Antigravity;
  - runtime nativo Codex;
  - camada compartilhada.

## Estado Final Desta Conversa

O projeto ficou em estado consistente para continuidade:

- runtime unico funcionando;
- `.antigravity/` preservado;
- `.codex/` adaptado para operacao exclusiva Codex;
- compartilhados principais tratados como runtime-aware;
- documentacao e story atualizadas;
- validadores principais passando.
