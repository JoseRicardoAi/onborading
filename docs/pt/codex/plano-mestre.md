# Plano Mestre - Paridade Antigravity para Codex

## Resumo

O Codex passa a ter uma pasta operacional `.codex/` na raiz, espelhada da `.antigravity/`, com adaptacoes minimas para respeitar o runtime do Codex CLI. A pasta `docs/pt/codex/` permanece exclusivamente documental.

## Fontes de Decisao

- `.antigravity/` e a fonte operacional real a ser espelhada.
- `docs/pt/antigravity/` e a fonte funcional de conhecimento, usabilidade e passo a passo.
- `.aiox-core/` segue como fonte canonica de agentes, sync, validadores, templates e constitution.
- `AGENTS.md` segue como contrato principal do Codex.

## Etapas

1. Bootstrap de controle: story, indice, plano e registro.
2. Inventario Antigravity: mapear familias de arquivos, documentacao em `docs/pt/antigravity/` e classificacao de migracao.
3. Fundacao `.codex/`: criar espelho e documento `CODEX.md`.
4. Paridade de agentes e comandos: usar sync canonico para `.codex/agents` e preservar comandos espelhados.
5. Paridade de regras e skills: copiar/adaptar regras e gerar skills locais `aiox-*`.
6. Paridade de workflows, templates e squads: preservar intencao operacional e registrar diferencas.
7. Configuracao e scripts: habilitar Codex em configs e aliases npm.
8. Validacao: rodar syncs, validadores, paridade e quality gates.
9. Seleção e troca de IDE runtime: atualizar o menu de instalacao/configuracao para incluir Codex e permitir troca posterior sem reinstalar o projeto. **Implementado.**

## Criterios de Conclusao

- `.codex/` existe e contem as familias operacionais equivalentes.
- `AGENTS.md` segue como contrato principal do Codex.
- `.aiox-core/core-config.yaml` habilita Codex como alvo de sync.
- `package.json` expoe scripts Codex documentados.
- Validadores Codex e paridade passam ou registram pendencia objetiva.

## Etapa Final Planejada - Seletor de IDE

### Decisao

A aplicacao precisa manter uma sinalizacao explicita de quais IDEs/runtimes AIOX estao ativos no projeto. Essa selecao nasce no instalador, mas deve poder ser alterada depois pelo usuario.

### Estado Atual Observado

- O menu vem de `packages/installer/src/config/ide-configs.js`.
- Hoje `IDE_CONFIGS` expoe apenas `antigravity`, por isso o menu mostra somente AntiGravity.
- `packages/installer/src/wizard/ide-selector.js` ja suporta multi-select e validacao generica.
- `.aiox-core/core-config.yaml` ja tem estrutura para `ide.selected`, `ide.configs` e `ideSync.targets`.

### Mudancas Implementadas

- Adicionado `codex` em `IDE_CONFIGS`, com display `Codex CLI`, `configFile: AGENTS.md`, `agentFolder: .codex/agents`, `skillsFolder: .codex/skills` e `recommended: true`.
- Restaurado o catalogo do menu para `codex`, `gemini`, `cursor`, `github-copilot` e `antigravity`.
- Exposto comando `aiox config ide` para alterar IDEs ativas sem reinstalacao.
- O comando atualiza `.aiox-core/core-config.yaml` (`ide.selected`, `ide.configs.*` e `ideSync.targets.*.enabled` quando o alvo existe).
- Quando o usuario habilitar Codex depois da instalacao, rodar/indicar:
  `npm.cmd run sync:ide:codex` e `npm.cmd run sync:skills:codex`.
- Quando desabilitar Codex, manter os arquivos `.codex/` por seguranca, mas marcar o alvo como inativo em config.

### Criterios de Aceitacao

- O menu de instalacao lista pelo menos AntiGravity e Codex CLI.
- A escolha pode conter uma ou mais IDEs.
- A configuracao persistida reflete a escolha atual do usuario.
- O usuario consegue trocar a escolha depois da instalacao sem recriar o projeto.
- Validadores de paridade respeitam apenas IDEs habilitadas no config.

### Comandos

```bash
aiox config ide --list
aiox config ide --set codex,antigravity
aiox config ide --enable codex
aiox config ide --disable codex
```
