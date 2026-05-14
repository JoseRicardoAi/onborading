# Registro de Execucao - Codex Parity

## 2026-05-07

### Plano de Validacao - Instalacao Runtime Unico

- Formalizado o plano de auditoria e correcao do processo de instalacao em `docs/pt/codex/plano-validacao-instalacao-runtime-unico.md`.
- O plano cobre instalacao em projetos novos e brownfield, integridade de `.aiox-core/`, `.antigravity/`, `.codex/`, `.synapse/` e `squads/`, validadores, testes focados e handoff para build/instalacao em projeto de teste.
- Mantidas as restricoes da frente atual: runtime unico, nao tocar em `.antigravity/` sem necessidade explicita, preservar o diff preexistente em `.aiox-core/data/entity-registry.yaml` e manter `RepasseDoc_002.md` como repasse local ate decisao explicita.

### Instalacao Runtime Unico - Integridade Operacional

#### Tarefas Executadas

- Criada story `docs/stories/instalacao-runtime-unico-integridade-operacional.md`.
- Mapeado o pipeline de instalacao, wizard, manifests, validador pos-instalacao e validador de pacote.
- Identificada lacuna no instalador: `.codex/` e `.synapse/` constavam no pacote, mas nao eram garantidos pela copia principal fora de `.aiox-core/`.
- Centralizada a lista de raizes operacionais obrigatorias em `packages/installer/src/installer/aiox-core-installer.js`.
- Ajustado instalador para copiar `.antigravity/`, `.codex/`, `.synapse/` e `squads/` preservando arquivos existentes em projetos brownfield.
- Manifest simples da instalacao agora registra `operational_roots` e `operational_files` sem misturar esses caminhos no hash tracking de `.aiox-core/`.
- Atualizado `scripts/validate-package-completeness.js` para validar a estrutura atual Antigravity + Codex + SYNAPSE + squads, removendo expectativas legadas de hooks Antigravity antigos e binario `aiox-core`.
- Confirmado que `.synapse/commands` e um arquivo, nao diretorio; o validador foi ajustado para esse contrato real.
- Adicionados testes focados em `tests/installer/aiox-core-installer.test.js` e `tests/unit/validate-package-completeness.test.js`.
- Atualizado `docs/pt/codex/plano-validacao-instalacao-runtime-unico.md` com checklist concluido.

#### Comandos Executados

```bash
npm.cmd test -- tests\installer\aiox-core-installer.test.js tests\unit\validate-package-completeness.test.js --runInBand
node scripts\validate-package-completeness.js --verbose
npm.cmd run validate:runtime
npm.cmd run validate:codex-operational
npm.cmd run validate:codex-skills
npm.cmd run validate:synapse
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run typecheck
npx.cmd eslint packages\installer\src\installer\aiox-core-installer.js scripts\validate-package-completeness.js tests\installer\aiox-core-installer.test.js tests\unit\validate-package-completeness.test.js
npm.cmd run lint
```

#### Resultados Observados

- Testes focados passaram: 2 suites, 14 testes.
- `node scripts\validate-package-completeness.js --verbose` passou com 59/59 checks depois de executado com permissao elevada por limitacao `EPERM` do sandbox em `npm pack --dry-run`.
- `npm.cmd run validate:runtime` passou com runtime ativo `codex`.
- `npm.cmd run validate:codex-operational` passou com 42 arquivos operacionais escaneados.
- `npm.cmd run validate:codex-skills` passou com 12 skills verificadas.
- `npm.cmd run validate:synapse` passou para runtime `all`.
- `npm.cmd run validate:codex-sync` passou com 12/12 sincronizados, 0 drift e 30 orphaned especialistas esperados.
- `npm.cmd run validate:codex-integration` passou com aviso conhecido de contagem `42/12`.
- `npm.cmd run typecheck` passou.
- `npm.cmd run lint` passou sem erros; warnings restantes sao legados e fora dos arquivos alterados neste lote.
- `.antigravity/` nao foi alterado neste lote.
- O diff preexistente em `.aiox-core/data/entity-registry.yaml` foi preservado sem alteracao.
- `docs/pt/codex/RepasseDoc_002.md` permaneceu como repasse local sem alteracao.

#### Handoff

- Esta etapa esta pronta para a proxima fase: build do pacote e instalacao real em projeto novo e projeto brownfield de teste.

### Instalacao Runtime Unico - Workflow de Troca de IDE/Runtime

#### Tarefas Executadas

- Adicionado workflow `switch-ide-runtime` em `.antigravity/workflows/` e `.codex/workflows/`.
- O workflow detecta runtime atual, apresenta menu com Antigravity e Codex, confirma a troca, executa `aiox config ide --set <runtime>`, sincroniza artefatos e valida runtime unico.
- Atualizado `docs/pt/antigravity/manual-usabilidade-integracao-aiox-antigravity.md` para incluir `[18] switch-ide-runtime` no menu `!workflows`.
- Atualizados os READMEs de workflows Antigravity e Codex.
- `generateCoreConfig()` agora emite `ideSync.targets` para `codex` e `antigravity-code`, habilitando somente a runtime selecionada.
- `aiox config ide --set <runtime>` agora garante targets default de sync quando ausentes e mostra comandos recomendados para Codex e Antigravity.
- O wizard repete o IDE sync depois da geracao final de `.aiox-core/core-config.yaml`, garantindo que a escolha feita na instalacao seja a fonte de verdade do sync final.
- `validate:codex-operational` passou a reconhecer `switch-ide-runtime` como workflow cross-runtime intencional.
- Adicionados testes para template de config e troca CLI `codex`/`antigravity-code`.

#### Comandos Executados

```bash
npm.cmd test -- tests\installer\core-config-template.test.js tests\unit\validate-runtime-single.test.js tests\config\config-cli.test.js --runInBand
npm.cmd test -- tests\installer\core-config-template.test.js tests\unit\validate-runtime-single.test.js --runInBand
npm.cmd test -- tests\config\config-cli.test.js --runInBand --forceExit
npm.cmd run validate:runtime
npm.cmd run validate:codex-operational
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:antigravity-integration
npm.cmd run validate:antigravity-sync
npm.cmd run typecheck
npm.cmd run lint
```

#### Resultados Observados

- Testes focados de runtime/template passaram: 2 suites, 9 testes.
- Testes de `config-cli` passaram: 1 suite, 15 testes. A execucao conjunta tambem passou no resumo, mas manteve open handles e atingiu timeout; a verificacao dedicada usou `--forceExit`.
- `npm.cmd run validate:runtime` passou com runtime ativo `codex`.
- `npm.cmd run validate:codex-operational` passou com 17 workflows Codex e 16 workflows Antigravity escaneados.
- `npm.cmd run validate:codex-sync` passou com 12/12 sincronizados, 0 drift e 30 orphaned especialistas esperados.
- `npm.cmd run validate:codex-integration` passou com aviso conhecido de contagem `42/12`.
- `npm.cmd run validate:antigravity-integration` passou com aviso conhecido de hooks ausentes.
- `npm.cmd run validate:antigravity-sync` falhou porque a runtime ativa atual e `codex` e o target `antigravity-code` esta corretamente desabilitado; este comando deve ser executado apos trocar a runtime para Antigravity.
- `npm.cmd run typecheck` passou.
- `npm.cmd run lint` passou sem erros; warnings restantes sao legados.

### Revisao Runtime Unico - Lote 6: Auditoria Runtime-Aware em Squads Compartilhadas

#### Tarefas Executadas

- Corrigida linguagem Antigravity-biased em `squads/squad-creator/tasks/create-agent.md`.
- A task `create-agent` agora declara runtime compartilhado e resolve templates/capacidades pela interface ativa persistida.
- Expandido `validate:codex-operational` para detectar linguagem enviesada para Antigravity em artefatos compartilhados de `squads/`.
- Adicionado teste unitario dedicado para o validador operacional cobrindo falha com linguagem Antigravity-biased e sucesso com linguagem runtime-aware Antigravity/Codex.
- Atualizada story `docs/stories/codex-runtime-unico-revisao-operacional.md` com checklist e file list do lote.

#### Comandos Executados

```bash
npm.cmd test -- tests\unit\validate-codex-operational-artifacts.test.js --runInBand
npm.cmd run validate:codex-operational
npm.cmd run validate:runtime
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:synapse
npm.cmd run validate:parity
npm.cmd test -- tests\unit\validate-codex-operational-artifacts.test.js tests\unit\wizard\ide-selector.test.js tests\installer\core-config-template.test.js tests\unit\validate-runtime-single.test.js --runInBand
npm.cmd test -- packages\installer\tests\unit\config-validator.test.js --runInBand
npm.cmd test -- --runInBand
```

#### Resultados Observados

- Teste novo passou: 1 suite, 2 testes.
- `npm.cmd run validate:codex-operational` passou com 42 arquivos escaneados, 26 arquivos compartilhados em `squads/` e workflows Codex/Antigravity/compartilhados validados.
- `npm.cmd run validate:runtime` passou com runtime ativo `codex`.
- `npm.cmd run typecheck` passou.
- `npm.cmd run lint` passou sem erros, mantendo warnings preexistentes do projeto.
- `npm.cmd run validate:codex-sync` passou com 12/12 sincronizados, 0 drift e 30 orphaned especialistas esperados.
- `npm.cmd run validate:codex-integration` passou com aviso conhecido de contagem `42/12`.
- `npm.cmd run validate:codex-skills` passou com 12 skills canonicas.
- `npm.cmd run validate:synapse` passou para runtime `all`.
- `npm.cmd run validate:parity` falhou no sandbox por `spawnSync ... EPERM` em `codex-sync`, mas passou com permissao elevada.
- Testes focados de runtime/operacional passaram: 4 suites, 23 testes.
- Teste focado do validator do installer passou: 1 suite, 30 testes.
- A suite completa `npm.cmd test -- --runInBand` chegou ao resumo, mas nao encerrou por open handles e bateu timeout de 300s; manteve falhas legadas fora do escopo, incluindo `validate-publish`, `validate-aiox-core-deps`, `cli.test` com `spawn EPERM` no sandbox e `antigravity-md-ownership`.
- Decisao de processo: a suite completa legada nao sera usada como blocker nesta frente Codex, porque os testes estao defasados desde conversoes anteriores e precisam ser reconstruidos. O criterio de aceite desta revisao permanece nas validacoes diretas/focadas de runtime, Codex operacional, paridade, SYNAPSE, lint e typecheck.
- Criada story futura `docs/stories/reconstrucao-suite-testes-runtime-atual.md` para reconstruir a suite de testes com base no codigo atual antes de tornar `npm.cmd test -- --runInBand` um gate oficial novamente.
- `.antigravity/` nao foi alterado neste lote.
- O diff preexistente em `.aiox-core/data/entity-registry.yaml` foi preservado sem alteracao.

### Revisao Runtime Unico - Lote 5: Workflows

#### Tarefas Iniciadas

- Identificada lacuna no plano: workflows precisam de etapa propria, nao apenas mencao dentro de correcoes por lote.
- Atualizado plano em `docs/pt/codex/plano-revisao-operacional-runtime-unico.md` com a etapa `Revisao Especifica de Workflows`.
- Atualizada story `docs/stories/codex-runtime-unico-revisao-operacional.md` com acceptance criteria, tasks e file list especificos de workflows.
- Inventario inicial localizou workflows ativos em `.codex/workflows/`, `.antigravity/workflows/`, `.codex/squads/design-system/workflows/` e `squads/**/workflows/`.
- Criada matriz `docs/pt/codex/matriz-workflows-runtime-unico.md`.
- Corrigida linguagem de workflows Codex para substituir capacidade exclusiva por capacidade runtime-aware.
- Preservados workflows em `.antigravity/workflows/` como contratos nativos do Antigravity, sem adaptação textual para Codex.
- Complementados workflows compartilhados de `squad-creator` e `skill-creator` com Runtime, Pre-flight, Quality Gate e Handoff.
- Expandido `validate:codex-operational` para validar workflows Codex, Antigravity e compartilhados como familia propria.

#### Validacoes Planejadas

```bash
rg -n "\.codex/|\.antigravity/|search_web|read_url_content|view_file|write_to_file|replace_file_content|mcp_stitch_|generate_image|browser_subagent|ANTIGRAVITY\.md|CODEX\.md|runtime ativo|Antigravity|Codex" .codex/workflows .antigravity/workflows .codex/squads squads -g "*.md" -g "*.yaml" -g "*.yml"
npm.cmd run validate:codex-operational
npm.cmd run validate:runtime
npm.cmd run validate:parity
```

#### Resultados Observados

- `npm.cmd run validate:codex-operational` passou, registrando 16 workflows Codex, 15 workflows Antigravity e 4 workflows compartilhados.
- Buscas focadas nao encontraram linguagem de capacidade exclusiva em `.codex/workflows` nem em workflows compartilhados.
- Workflows Codex nao referenciam `.antigravity/` nem tools nativas sem mapeamento.
- Workflows Antigravity nao referenciam `.codex/`.

### Correcao de Tratamento de Tools em Squads Compartilhadas

#### Tarefas Executadas

- Revisadas as alteracoes fora de `.codex`, com foco em `squads/`.
- Restaurado/preservado o contrato `tools:` dos agentes compartilhados:
  `oalanicolas` com 7 tools, `pedro-valerio` com 3 tools e `research-specialists` com 3 tools.
- Adicionado `Runtime Tool Mapping` nos agentes compartilhados para manter tools nativas do Antigravity e equivalentes operacionais no Codex.
- Ajustada a linguagem dos workflows/tasks compartilhados para sempre listar Antigravity e Codex como destinos do runtime ativo.
- Ajustado `validate:codex-operational` para permitir tools Antigravity apenas em artefatos compartilhados explicitamente runtime-aware, mantendo bloqueio para Codex operacional puro.

#### Comandos Executados

```bash
rg -n "runtime_tools:|Runtime Tool Mapping|view_file|grep_search|find_by_name|write_to_file|replace_file_content|search_web|read_url_content" squads .codex/skills .antigravity/skills -g "*.md" -g "*.yaml" -g "*.yml"
rg -n "\.codex/|\.antigravity/|Antigravity|Codex|tools:|runtimeTargets:" squads -g "*.md" -g "*.yaml" -g "*.yml"
npm.cmd run validate:codex-operational
npm.cmd run validate:runtime
npm.cmd test -- tests/unit/wizard/ide-selector.test.js tests/installer/core-config-template.test.js tests/unit/validate-runtime-single.test.js --runInBand
npm.cmd test -- packages/installer/tests/unit/config-validator.test.js --runInBand
npm.cmd run typecheck
npm.cmd run lint
```

#### Resultados Observados

- Nenhum `runtime_tools:` remanescente foi encontrado em `squads/`.
- `oalanicolas.md` preserva as 7 tools originais: `view_file`, `grep_search`, `find_by_name`, `write_to_file`, `replace_file_content`, `search_web`, `read_url_content`.
- As referencias `.codex/` em `squads/` aparecem pareadas com alternativa `.antigravity/`.
- `npm.cmd run validate:codex-operational` passou. A regra ampliada passou a registrar warnings de backlog em `.codex/agents` para `grep_search`/`find_by_name`, sem erro.
- `npm.cmd run validate:runtime` passou.
- Testes focados de runtime unico passaram: 21 testes.
- Teste unitario do validator do installer passou: 30 testes.
- `npm.cmd run typecheck` passou.
- `npm.cmd run lint` passou com warnings preexistentes.

### Revisao Runtime Unico - Lote 1

#### Tarefas Executadas

- Registrado plano de acao em `docs/pt/codex/plano-revisao-operacional-runtime-unico.md`.
- Criada story `docs/stories/codex-runtime-unico-revisao-operacional.md`.
- Criada matriz inicial `docs/pt/codex/matriz-runtime-unico.md`.
- Ajustado wizard de IDE para escolha unica.
- Ajustado template de `core-config.yaml` para gerar um unico runtime ativo, com Codex como default.
- Ajustado `aiox config ide` para trocar runtime apenas por `--set <ide>`.
- Criado validador `validate:runtime` para impedir Codex e Antigravity ativos simultaneamente.
- Atualizado `.aiox-core/core-config.yaml` local para manter somente Codex ativo.

#### Comandos Planejados para Validacao

```bash
npm.cmd test -- tests/unit/wizard/ide-selector.test.js tests/installer/core-config-template.test.js tests/unit/validate-runtime-single.test.js --runInBand
npm.cmd run validate:runtime
npm.cmd run validate:parity
npm.cmd run lint
npm.cmd run typecheck
```

#### Resultados Observados

- `npm.cmd run validate:runtime` passou com runtime ativo `codex`.
- Testes focados passaram: `tests/unit/wizard/ide-selector.test.js`, `tests/installer/core-config-template.test.js` e `tests/unit/validate-runtime-single.test.js` com 21 testes.
- `npm.cmd run validate:codex-operational` passou, agora inventariando 170 arquivos `.codex` e registrando backlog de adaptacao fora de `skills/` e `squads/` como warnings.
- `npm.cmd run validate:parity` falhou no sandbox por `spawnSync ... EPERM` no `codex-sync`, mas passou com permissao elevada.
- `npm.cmd run lint` passou com warnings preexistentes.
- `npm.cmd run typecheck` passou.
- `node bin\aiox.js config ide --list` mostrou runtime atual `codex`.
- `npm.cmd run validate:codex-sync` passou: 12 esperados, 12 sincronizados, 0 missing, 0 drift, 30 orphaned especialistas.
- `npm.cmd run validate:codex-integration` passou com aviso conhecido de contagem `42/12`.
- `npm.cmd run validate:codex-skills` passou com 12 skills canonicas.
- `npm.cmd run validate:synapse` passou para runtime `all`, com warnings de timeout de camada ja observados em diagnosticos.

### Revisao Runtime Unico - Lote 2: Agentes Codex

#### Tarefas Executadas

- Mapeado que os 12 agentes canonicos em `.codex/agents` devem permanecer controlados por `sync:ide:codex`.
- Identificado que o backlog de agentes estava nos 30 agentes especialistas/orfaos espelhados.
- Normalizados paths operacionais de agentes para `.codex/...`.
- Substituidas referencias a ferramentas nativas Antigravity por capacidades genericas Codex ou dependencias opcionais.
- Corrigida tentativa inicial de reescrita que afetou encoding, restaurando conteudo versionado e reaplicando a normalizacao com UTF-8 explicito.

#### Comandos Executados

```bash
rg -n "\.antigravity[\\/]|ANTIGRAVITY\.md|search_web|read_url_content|view_file|write_to_file|replace_file_content|multi_replace_file_content|view_file_outline|mcp_stitch_" .codex/agents -g "*.md"
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-operational
```

#### Resultados Observados

- `rg` focado em `.codex/agents` nao encontrou referencias proibidas.
- `npm.cmd run validate:codex-sync` passou: 12 synced, 0 missing, 0 drift, 30 orphaned esperados.
- `npm.cmd run validate:codex-operational` passou; backlog restante reportado em `rules`, `templates` e `workflows`.

### Revisao Runtime Unico - Lote 3: Regras Codex

#### Tarefas Executadas

- Normalizados paths operacionais em `.codex/rules`.
- Substituidas referencias de ferramentas nativas Antigravity por capacidades Codex ou descricoes neutras.
- Atualizada governance para direcionar ao AGP via `.codex/skills/governance/SKILL.md`, sem hooks Python herdados.

#### Resultados Observados

- `rg` focado em `.codex/rules` nao encontrou referencias proibidas.
- `npm.cmd run validate:codex-operational` passou.

### Revisao Runtime Unico - Lote 4: Templates, Workflows e Memorias

#### Tarefas Executadas

- Normalizados paths operacionais em `.codex/templates`, `.codex/workflows` e `.codex/agent-memory`.
- Workflows Codex passaram a confirmar `.codex/` como estrutura operacional.
- Referencias a pesquisa web e leitura de URL foram convertidas para capacidades abstratas disponiveis no runtime Codex.
- Referencias Stitch hardcoded foram convertidas para dependencia opcional.

#### Comandos Executados

```bash
npm.cmd run validate:codex-operational
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:runtime
npm.cmd run validate:parity
npm.cmd run typecheck
npm.cmd test -- tests/unit/wizard/ide-selector.test.js tests/installer/core-config-template.test.js tests/unit/validate-runtime-single.test.js --runInBand
npm.cmd run lint
```

#### Resultados Observados

- `npm.cmd run validate:codex-operational` passou sem warnings de backlog.
- `npm.cmd run validate:codex-sync` passou: 12 synced, 0 drift, 30 orphaned esperados.
- `npm.cmd run validate:codex-integration` passou com aviso conhecido `42/12`.
- `npm.cmd run validate:codex-skills` passou.
- `npm.cmd run validate:runtime` passou com runtime ativo `codex`.
- `npm.cmd run validate:parity` falhou no sandbox por `spawnSync ... EPERM`, mas passou com permissao elevada.
- `npm.cmd run typecheck` passou.
- Testes focados de runtime unico passaram: 21 testes.
- `npm.cmd run lint` passou com warnings preexistentes.

### Tarefas Executadas

- Complementado `docs/pt/codex/README.md` com o mapa de pastas usadas no processo Codex, fontes de referencia Antigravity, pastas operacionais, arquivos de configuracao, validadores e scripts npm relevantes.

### Comandos Executados

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test -- --runInBand
```

### Resultados Observados

- `docs/pt/codex/README.md` passou a servir tambem como indice operacional das areas envolvidas na adaptacao Antigravity -> Codex.
- `npm.cmd run lint` passou com warnings preexistentes no projeto.
- `npm.cmd run typecheck` passou.
- `npm.cmd test -- --runInBand` executou a suite, mas encerrou por timeout apos 180s. O resultado manteve falhas fora do escopo desta atualizacao documental, incluindo `spawn EPERM` no sandbox e expectativas legadas em testes como `validate-publish`, `ide-selector` e `antigravity-md-ownership`.

## 2026-05-06

### Tarefas Executadas

- Criada a pasta `.codex/` como espelho inicial de `.antigravity/`.
- Adicionado `.codex/CODEX.md` como contrato operacional local do Codex.
- Criada story `docs/stories/codex-parity-antigravity.md`.
- Criada documentacao de controle em `docs/pt/codex/`.
- Habilitado Codex em `.aiox-core/core-config.yaml`.
- Adicionados aliases npm Codex em `package.json`.
- Adotada `docs/pt/antigravity/` como fonte funcional de conhecimento e decisao.
- Instaladas dependencias com `npm.cmd install` para permitir execucao dos scripts locais.
- Executado sync de agentes e skills Codex.
- Ajustado `validate-parity` para respeitar alvos IDE habilitados e usar o contrato de compatibilidade existente.
- Executadas validacoes Codex, paridade e quality gates.
- Convertidos artefatos principais de `.codex/` de copia bruta para operacao Codex-native:
  `.codex/rules/tool-usage.md`, `.codex/rules/quick-menu-system.md`,
  `.codex/rules/codex-adaptation.md` e `.codex/workflows/README.md`.
- Removido `.codex/tmp_replace.js`, copiado do Antigravity mas sem funcao operacional Codex.
- Removido `.codex/ANTIGRAVITY.md`; no Codex o arquivo raiz correto e `.codex/CODEX.md`.
- Registrada etapa final planejada para adicionar Codex ao menu de selecao de IDE e permitir troca posterior.
- Implementada a etapa de seletor de IDE:
  `packages/installer/src/config/ide-configs.js` agora lista Codex CLI no menu,
  e `aiox config ide` permite consultar/trocar IDEs ativas depois da instalacao.
- Validado processo SYNAPSE para Codex:
  inventariada `.synapse/`, localizada documentacao funcional em
  `docs/pt/antigravity/guides/context-engine.md`, executado diagnostico local,
  rodados testes focados e adaptada `.codex/skills/synapse/SKILL.md`.
- Implementado comando `aiox synapse` para operacao explicita sem hooks:
  `status`, `domains`, `validate`, `diagnose/debug` e `run`.
- Ajustado `validate:synapse` para validar Antigravity e Codex sem exigir hooks herdados do Claude.
- Validado que Antigravity segue operacional por skill semi-automatica e Codex por skill/CLI explicito.
- Ajustados testes legados de hook SYNAPSE para ficarem `skip` quando `.antigravity/hooks/synapse-engine.cjs` nao existir.
- Validado processo sensivel de skills e squads para Codex.
- Adaptadas skills Codex sensiveis: `squad`, `skill-creator`, `governance`, `tech-search`, `clone-mind`, `enhance-workflow` e `checklist-runner`.
- Adaptada squad global `.codex/squads/design-system`.
- Tornados runtime-aware os squads compartilhados `squads/squad-creator` e `squads/skill-creator`.
- Criado validador `validate:codex-operational`.

### Comandos Executados

```bash
Copy-Item -Recurse -Force .antigravity .codex
npm run sync:ide:codex
npm run sync:skills:codex
npm.cmd run sync:ide:codex
npm.cmd run sync:skills:codex
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:parity
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test -- --runInBand
npm.cmd test -- tests/unit/validate-parity.test.js --runInBand
npm.cmd test -- tests/unit/config/ide-configs.test.js --runInBand
node bin\aiox.js config ide --list
node -e "const {runDiagnostics}=require('./.aiox-core/core/synapse/diagnostics/synapse-diagnostics'); console.log(runDiagnostics(process.cwd()))"
npm.cmd test -- tests\synapse\paths.test.js tests\synapse\l0-constitution.test.js tests\synapse\l1-global.test.js tests\synapse\l2-agent.test.js tests\synapse\hook-runtime.test.js --runInBand
node bin\aiox.js synapse validate --runtime antigravity
node bin\aiox.js synapse validate --runtime codex
npm.cmd run validate:synapse
npm.cmd test -- tests\synapse --runInBand
npm.cmd run validate:codex-operational
npm.cmd run validate:codex-skills
npm.cmd run validate:parity
```

### Resultados Observados

- `npm run ...` falhou no PowerShell por bloqueio de Execution Policy sobre `npm.ps1`.
- `npm.cmd run ...` iniciou corretamente, mas falhou porque `node_modules` nao existe e o modulo `fs-extra` nao esta instalado.
- Apos `npm.cmd install`, `sync:ide:codex` passou com 12 agentes gerados.
- `sync:skills:codex` passou com 12 skills locais geradas.
- `validate:codex-sync` passou.
- `validate:codex-integration` passou com aviso esperado: `.codex/agents` tem 42 arquivos porque inclui 30 agentes especialistas espelhados alem dos 12 canonicos.
- `validate:codex-skills` passou.
- `validate:parity` passou com permissao elevada; sem elevacao, o sandbox bloqueou subprocessos Node (`spawnSync ... EPERM`).
- `lint` passou com warnings existentes.
- `typecheck` passou.
- `npm.cmd test -- --runInBand` estourou timeout apos 120s e ja mostrava falhas fora do escopo desta story: testes de `ide-configs`, `pro-detector`, timestamp de `entity-registry` e outros pontos preexistentes.
- `tests/unit/validate-parity.test.js` passou isoladamente.
- `tests/unit/config/ide-configs.test.js` passou com 22 testes.
- `node bin\aiox.js config ide --list` mostrou a selecao atual e os IDEs suportados.
- Diagnostico SYNAPSE passou para manifest, sessoes e UAP bridge, mas acusou falhas esperadas no hook Antigravity:
  `.antigravity/settings.local.json` e `.antigravity/hooks/synapse-engine.cjs` nao existem.
- Testes focados de SYNAPSE passaram: 5 suites, 48 testes.
- Simulacao do `SynapseEngine` com manifest carregado retornou `bracket=FRESH`, `layers_loaded=3`, `layers_skipped=5`, `total_rules=70`.
- Decisao: no Codex, SYNAPSE deve ser acionado explicitamente por skill/comando/CLI; nao ha hook automatico de IDE equivalente ao Antigravity.
- `node bin\aiox.js synapse validate --runtime antigravity` passou.
- `node bin\aiox.js synapse validate --runtime codex` passou.
- `npm.cmd run validate:synapse` passou cobrindo `runtime=all`.
- `npm.cmd test -- tests\synapse --runInBand` passou: 35 suites passadas, 2 puladas, 732 testes passados, 45 pulados.
- `npm.cmd run validate:codex-operational` passou: 42 arquivos Codex escaneados, 13 skills Antigravity com equivalentes Codex, 7 arquivos de squad espelhados e 26 arquivos de squads compartilhadas escaneados.
- `npm.cmd run validate:codex-skills` passou com 12 skills canonicas verificadas.
- `npm.cmd run validate:parity` falhou no sandbox por `spawnSync ... EPERM`, mas passou com permissao elevada. Avisos conhecidos: `.antigravity/hooks` ausente, contagem Codex 42/12 por agentes especialistas extras e `.gemini/rules.md` ausente.

### Ajuste de Diretriz - Separacao Nativa de Interfaces

- Confirmado que `.antigravity/` deve permanecer exclusivo/nativo do Antigravity.
- Confirmado que `.codex/` deve permanecer exclusivo/nativo do Codex.
- A decisao de execucao fica no runtime selecionado e no resolvedor, que escolhe `.antigravity/` ou `.codex/`; os artefatos nativos nao devem tentar carregar a outra interface.
- Workflows compartilhados em `squads/` continuam runtime-aware por serem artefatos comuns de projeto.
- Busca cruzada executada:
  - `.codex/`: sem referencias residuais a operacao Antigravity.
  - `.antigravity/`: sem referencias residuais a operacao Codex.
  - `git diff -- .antigravity`: sem alteracoes.
- Apos `sync:ide:codex` com permissao elevada para escrita em `.codex/`, `validate:codex-sync` passou com 12/12 agentes sincronizados, drift 0 e 30 orfaos especialistas esperados.
- `validate:codex-operational` passou novamente com 42 agentes, 35 skills Codex inventariadas, 16 workflows Codex, 15 workflows Antigravity e 4 compartilhados.
- `validate:runtime` passou com runtime unico atual `codex`.
- `validate:codex-integration` passou com aviso conhecido de contagem 42/12 por agentes especialistas extras.
- `validate:codex-skills` passou com 12 skills canonicas.
- `typecheck` passou.
- `lint` passou sem erros; manteve warnings preexistentes, incluindo `.antigravity/tmp_replace.js`, que ja e arquivo versionado e nao foi alterado nesta rodada.
- Testes focados passaram: `validate-runtime-single`, `ide-selector` e `core-config-template` com 21 testes.

### Pendencias de Validacao

- Reexecutar a suite completa de testes fora do limite de 120s, se necessario:
  `npm.cmd test -- --runInBand`.
- Avaliar falhas preexistentes de testes fora do escopo Codex parity.
- Validar em instalacao real que o wizard exibe Codex CLI no menu interativo.
- Criar alias npm ou comando AIOX dedicado para diagnostico SYNAPSE Codex, por exemplo `validate:synapse`.
- Implementar comandos explicitos para `synapse status`, `synapse domains`, `synapse debug` e `synapse diagnose`, caso a experiencia Codex precise ficar no mesmo nivel de conveniencia do Antigravity.
