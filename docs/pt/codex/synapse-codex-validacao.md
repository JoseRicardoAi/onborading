# Validacao SYNAPSE para Codex

## Resumo

O SYNAPSE ja existe no projeto como estrutura compartilhada em `.synapse/` e runtime em `.aiox-core/core/synapse/`. Para Codex, ele esta parcialmente disponivel: os dominios, parser, engine, diagnosticos e testes focados funcionam; a parte que nao esta disponivel de forma completa e a injecao automatica via hook de IDE, que hoje e Antigravity-specific.

Conclusao: nao precisamos duplicar `.synapse/` dentro de `.codex/`. Precisamos manter o modo Antigravity como skill semi-automatica e adaptar o modo Codex para ser explicito, por skill/comando/CLI. Os hooks aparecem no codigo como heranca historica do Claude e nao devem ser tratados como requisito obrigatorio para Antigravity ou Codex.

## Fontes Consultadas

- `docs/pt/antigravity/guides/context-engine.md`
- `docs/pt/antigravity/skills/overview.md`
- `.antigravity/skills/synapse/SKILL.md`
- `.codex/skills/synapse/SKILL.md`
- `.synapse/manifest`
- `.synapse/commands`
- `.synapse/context`
- `.synapse/global`
- `.aiox-core/core/synapse/engine.js`
- `.aiox-core/core/synapse/runtime/hook-runtime.js`
- `.aiox-core/core/synapse/diagnostics/synapse-diagnostics.js`
- `.aiox-core/core/synapse/diagnostics/collectors/hook-collector.js`

## Funcionalidades SYNAPSE Identificadas

| Area | Funcionalidade | Estado para Codex |
| --- | --- | --- |
| Estrutura `.synapse/` | Manifest, constitution, global, context, agent domains, workflow domains, commands, sessions e metrics | Disponivel |
| L0 Constitution | Regras fundamentais nao negociaveis | Disponivel via engine |
| L1 Global/Context | Regras globais e bracket de contexto | Disponivel via engine |
| L2 Agent | Regras do agente ativo conforme manifest | Disponivel quando a chamada passa `manifest` e `session.active_agent.id` |
| L3-L7 | Workflow, task, squad, keyword/star-command | Implementado no runtime, mas nao ativo por padrao no engine atual |
| Star-commands | `*brief`, `*dev`, `*review`, `*plan`, `*debug`, `*synapse ...` | Disponivel como definicao em `.synapse/commands`; no Codex precisa interpretacao explicita |
| Sessions | `.synapse/sessions/` e `_active-agent.json` | Disponivel |
| Metrics | `.synapse/metrics/uap-metrics.json` e `hook-metrics.json` | Disponivel parcialmente; hook metrics dependem de execucao do engine |
| Diagnostics | `runDiagnostics(process.cwd())` | Disponivel |
| Hook automatico herdado | `UserPromptSubmit` em `.antigravity/settings.local.json` e `.antigravity/hooks/synapse-engine.cjs` | Legado Claude; opcional, nao obrigatorio para Antigravity/Codex |
| Skill Antigravity | `.antigravity/skills/synapse/SKILL.md` | Disponivel |
| Skill Codex | `.codex/skills/synapse/SKILL.md` | Disponivel e adaptada |
| CLI Codex/AIOX | `aiox synapse status/domains/validate/diagnose/run` | Implementado |

## Decisoes de Adaptacao para Codex

1. `.synapse/` permanece compartilhada na raiz do projeto.
2. `.codex/` nao deve receber copia da pasta `.synapse/`.
3. A skill `.codex/skills/synapse/SKILL.md` deve orientar acionamento explicito via Codex.
4. O Codex deve usar comandos locais quando precisar executar o engine ou diagnostico:

```bash
node -e "const {runDiagnostics}=require('./.aiox-core/core/synapse/diagnostics/synapse-diagnostics'); console.log(runDiagnostics(process.cwd()))"
```

5. Para executar o engine com L0-L2 no Codex, carregar o manifest explicitamente:

```bash
node -e "const path=require('path'); const {SynapseEngine}=require('./.aiox-core/core/synapse/engine'); const {parseManifest}=require('./.aiox-core/core/synapse/domain/domain-loader'); (async()=>{const synapsePath=path.join(process.cwd(),'.synapse'); const manifest=parseManifest(path.join(synapsePath,'manifest')); const engine=new SynapseEngine(synapsePath,{manifest}); const result=await engine.process('prompt',{prompt_count:0,active_agent:{id:'dev'}}); console.log(result.xml);})()"
```

6. Nao assumir hook automatico no Codex. Quando o usuario pedir `*synapse status`, `*synapse debug` ou `*synapse-diagnose`, o Codex deve executar/levar em conta os arquivos e comandos acima.
7. A documentacao antiga fala em 8 camadas ativas, mas o engine atual usa L0-L2 por padrao. L3-L7 ficam disponiveis no codigo e no manifest, mas o modo completo depende de `SYNAPSE_LEGACY_MODE=true`.
8. O validador `validate:synapse` deve validar a execucao real Antigravity/Codex sem exigir hook.

## Comandos Implementados

```bash
node bin/aiox.js synapse status
node bin/aiox.js synapse domains
node bin/aiox.js synapse validate
node bin/aiox.js synapse validate --runtime antigravity
node bin/aiox.js synapse validate --runtime codex
node bin/aiox.js synapse diagnose
node bin/aiox.js synapse run "prompt" --agent dev
npm.cmd run validate:synapse
```

## Resultado do Diagnostico

Comando executado:

```bash
node -e "const {runDiagnostics}=require('./.aiox-core/core/synapse/diagnostics/synapse-diagnostics'); console.log(runDiagnostics(process.cwd()))"
```

Resultado resumido:

- Manifest integrity: PASS para constitution, global, context, commands, agentes e workflows registrados.
- Session status: `_active-agent.json` existe e aponta para `dev` com `activation_quality: partial`.
- UAP bridge: PASS.
- Hook registered: FAIL, porque `.antigravity/settings.local.json` nao existe.
- Hook file exists: FAIL, porque `.antigravity/hooks/synapse-engine.cjs` nao existe.

Interpretacao: essas falhas indicam ausencia do hook herdado do Claude, nao quebra da estrutura Synapse. Para Antigravity, o uso real continua sendo skill semi-automatica. Para Codex, o uso real passa a ser skill/comando/CLI explicito.

## Validacao Comprobatoria Antigravity e Codex

### Antigravity

Comando executado:

```bash
node bin\aiox.js synapse validate --runtime antigravity
```

Resultado: PASS.

Evidencias:

- `.synapse/` existe.
- Manifest parse: 19 dominios registrados.
- Arquivos base existem: `manifest`, `constitution`, `global`, `context`, `commands`.
- Todos os arquivos de dominio registrados existem.
- Engine explicita executa com `bracket=FRESH`, `layers_loaded=3`, `total_rules=70`.
- Skill Antigravity existe em `.antigravity/skills/synapse/SKILL.md`.
- Politica de hook Antigravity: PASS, porque o runtime real usa skill semi-automatica e hooks Claude sao opcionais/legados.

### Codex

Comando executado:

```bash
node bin\aiox.js synapse validate --runtime codex
```

Resultado: PASS.

Evidencias:

- `.synapse/` existe.
- Manifest parse: 19 dominios registrados.
- Arquivos base existem: `manifest`, `constitution`, `global`, `context`, `commands`.
- Todos os arquivos de dominio registrados existem.
- Engine explicita executa com `bracket=FRESH`, `layers_loaded=3`, `total_rules=70`.
- Skill Codex existe em `.codex/skills/synapse/SKILL.md`.
- Politica de hook Codex: PASS, porque o runtime usa skill/CLI explicito e nao depende de hook automatico.

## Validacoes Executadas

```bash
npm.cmd test -- tests\synapse\paths.test.js tests\synapse\l0-constitution.test.js tests\synapse\l1-global.test.js tests\synapse\l2-agent.test.js tests\synapse\hook-runtime.test.js --runInBand
```

Resultado: 5 suites passaram, 48 testes passaram.

```bash
npm.cmd run validate:synapse
```

Resultado: PASS para runtime `all`, cobrindo Antigravity e Codex.

```bash
npm.cmd test -- tests\synapse --runInBand
```

Resultado: PASS. Foram 35 suites passadas, 2 suites legadas de hook puladas, 732 testes passados e 45 testes pulados. As suites puladas correspondem ao hook herdado do Claude, que nao existe no runtime atual Antigravity/Codex.

```bash
node -e "const path=require('path'); const {SynapseEngine}=require('./.aiox-core/core/synapse/engine'); const {parseManifest}=require('./.aiox-core/core/synapse/domain/domain-loader'); (async()=>{const synapsePath=path.join(process.cwd(),'.synapse'); const manifest=parseManifest(path.join(synapsePath,'manifest')); const engine=new SynapseEngine(synapsePath,{manifest}); const result=await engine.process('validar synapse para codex',{prompt_count:0,active_agent:{id:'dev'}}); console.log('bracket='+result.bracket); console.log('layers_loaded='+result.metrics.layers_loaded); console.log('layers_skipped='+result.metrics.layers_skipped); console.log('total_rules='+result.metrics.total_rules);})()"
```

Resultado: `bracket=FRESH`, `layers_loaded=3`, `layers_skipped=5`, `total_rules=70`.

## Pendencias Recomendadas

- Criado alias npm `validate:synapse`.
- Criado comando AIOX explicito para `synapse status`, `synapse domains`, `synapse validate`, `synapse debug/diagnose` e `synapse run`.
- Ajustados testes legados de hook para nao falharem quando o hook Claude/Antigravity nao existir.
- Avaliar se o Codex deve expor modo completo L0-L7 por comando separado usando `SYNAPSE_LEGACY_MODE=true`.
- Atualizar documentacao publica para deixar claro que, no Codex, SYNAPSE nao e injetado automaticamente por hook de IDE.
