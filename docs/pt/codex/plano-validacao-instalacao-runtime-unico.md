# Plano de Validacao e Correcao - Instalacao Runtime Unico

## Objetivo

Garantir que o processo de instalacao do AIOX em projetos novos e projetos existentes instale, preserve e valide corretamente todos os artefatos operacionais do runtime unico:

- `.aiox-core/`
- `.antigravity/`
- `.codex/`
- `.synapse/`
- `squads/`

Esta etapa cobre auditoria, correcao e validacao do instalador. A fase posterior sera build do pacote e instalacao real em projetos de teste.

## Regras Mantidas

- Runtime unico ativo por instalacao.
- `.antigravity/` permanece nativo/exclusivo do Antigravity.
- `.codex/` permanece nativo/exclusivo do Codex.
- `squads/` permanece compartilhado e runtime-aware.
- `.synapse/` permanece compartilhado.
- Nao tocar em `.antigravity/` sem necessidade explicita.
- Nao tocar no diff preexistente em `.aiox-core/data/entity-registry.yaml`.
- Nao versionar ou alterar `docs/pt/codex/RepasseDoc_002.md` sem decisao explicita.
- A suite completa legada nao sera blocker nesta frente; os gates serao validadores diretos e testes focados.

## Etapa 1 - Story e Escopo

- [x] Criar story propria em `docs/stories/`.
- [x] Registrar acceptance criteria para instalacao em projeto novo.
- [x] Registrar acceptance criteria para instalacao em projeto existente/brownfield.
- [x] Registrar file list da etapa.
- [x] Vincular esta etapa ao registro de execucao Codex.

## Etapa 2 - Mapeamento do Pipeline de Instalacao

Arquivos a revisar:

- [x] `packages/installer/src/installer/aiox-core-installer.js`
- [x] `packages/installer/src/installer/brownfield-upgrader.js`
- [x] `packages/installer/src/wizard/index.js`
- [x] `packages/installer/src/wizard/ide-selector.js`
- [x] `packages/installer/src/wizard/ide-config-generator.js`
- [x] `packages/installer/src/config/configure-environment.js`
- [x] `packages/installer/src/config/templates/core-config-template.js`
- [x] `packages/installer/src/installer/post-install-validator.js`
- [x] `scripts/generate-install-manifest.js`
- [x] `scripts/validate-package-completeness.js`
- [x] `package.json`

Resultado esperado:

- [x] Fluxo real documentado para projeto novo.
- [x] Fluxo real documentado para projeto existente.
- [x] Pontos de copia, validacao e preservacao identificados.
- [x] Lacunas separadas entre codigo, manifesto, pacote e testes.

## Etapa 3 - Integridade dos Artefatos Obrigatorios

- [x] Confirmar que o pacote inclui `.aiox-core/`.
- [x] Confirmar que o pacote inclui `.antigravity/`.
- [x] Confirmar que o pacote inclui `.codex/`.
- [x] Confirmar que o pacote inclui `.synapse/`.
- [x] Confirmar que o pacote inclui `squads/`.
- [x] Confirmar que o pacote inclui binarios atuais.
- [x] Remover expectativas legadas de validadores, quando confirmadas como obsoletas.

## Etapa 4 - Correcao do Instalador

- [x] Centralizar lista de raizes operacionais obrigatorias.
- [x] Garantir copia de `.antigravity/`.
- [x] Garantir copia de `.codex/`.
- [x] Garantir copia de `.synapse/`.
- [x] Garantir copia de `squads/`.
- [x] Preservar arquivos existentes em projetos brownfield.
- [x] Registrar no resultado da instalacao quais raizes foram instaladas/verificadas.
- [x] Ajustar mensagens do instalador para linguagem runtime-aware.

## Etapa 5 - Protecao para Brownfield

- [x] Validar que arquivos do usuario nao sao sobrescritos de forma destrutiva.
- [x] Validar que arquivos ausentes sao adicionados.
- [x] Validar que o runtime selecionado permanece unico.
- [x] Validar que Codex nao ativa fluxo exclusivo Antigravity.
- [x] Validar que Antigravity nao depende de artefatos exclusivos Codex.

## Etapa 6 - Validadores e Manifests

- [x] Atualizar `scripts/validate-package-completeness.js` para a estrutura atual.
- [x] Validar `package.json#files` contra as raizes obrigatorias.
- [x] Validar binarios reais do pacote.
- [x] Avaliar se o manifest de instalacao precisa registrar raizes operacionais fora de `.aiox-core/`.
- [x] Atualizar validacao pos-instalacao, se necessario, para cobrir runtime roots.

## Etapa 7 - Testes Focados

Cobertura minima esperada:

- [x] Instalador copia `.antigravity/`, `.codex/`, `.synapse/` e `squads/`.
- [x] Instalador preserva arquivo existente em projeto brownfield.
- [x] Validador de pacote falha quando falta raiz operacional obrigatoria.
- [x] Validador de pacote passa com estrutura atual correta.
- [x] Runtime unico continua validado.

## Etapa 8 - Quality Gates

Executar ao final da correcao:

```bash
npm.cmd test -- tests\installer\aiox-core-installer.test.js --runInBand
npm.cmd run validate:runtime
npm.cmd run validate:codex-operational
npm.cmd run validate:codex-sync
npm.cmd run validate:codex-integration
npm.cmd run validate:codex-skills
npm.cmd run validate:synapse
npm.cmd run typecheck
npm.cmd run lint
```

Executar quando o validador de pacote estiver ajustado:

```bash
node scripts/validate-package-completeness.js --verbose
```

## Etapa 9 - Registro e Handoff

- [x] Atualizar `docs/pt/codex/registro-execucao.md`.
- [x] Atualizar story com checklist e file list.
- [x] Registrar comandos executados.
- [x] Registrar falhas legadas ignoradas, se aparecerem novamente.
- [x] Registrar pendencias para build e instalacao em projeto teste.

## Criterio de Conclusao

Esta etapa sera considerada concluida quando:

- [x] O instalador garantir todas as pastas operacionais atuais.
- [x] Validadores refletirem Antigravity + Codex + runtime unico.
- [x] Testes focados passarem.
- [x] Documentacao operacional estiver atualizada.
- [x] Nenhuma alteracao indevida for feita em `.antigravity/`, `.aiox-core/data/entity-registry.yaml` ou `docs/pt/codex/RepasseDoc_002.md`.

## Proxima Fase

Apos a conclusao deste plano:

- [ ] Gerar build/pacote.
- [ ] Instalar em projeto novo de teste.
- [ ] Instalar em projeto existente/brownfield de teste.
- [ ] Validar execucao real do runtime Codex.
- [ ] Validar preservacao do runtime Antigravity.
