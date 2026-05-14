---
description: Trocar a IDE/runtime ativa do AIOX depois da instalacao
---

# Switch IDE Runtime Workflow

Workflow Codex para alternar a runtime ativa do AIOX entre Antigravity e Codex sem reinstalar o projeto.

## Quando Usar

- Quando o projeto foi instalado com Antigravity e o usuario quer passar a usar Codex.
- Quando o projeto foi instalado com Codex e o usuario quer voltar para Antigravity.
- Quando houver duvida sobre qual runtime esta ativa no projeto.

## Step 0: Verificacao do Projeto

1. Confirmar que o AIOX esta instalado na raiz do projeto:
   - `.aiox-core/core-config.yaml`
   - `.antigravity/`
   - `.codex/`
2. Ler `.aiox-core/core-config.yaml`.
3. Identificar `ide.selected[0]` como runtime atual.
4. Mostrar ao usuario: `Runtime atual: Antigravity` ou `Runtime atual: Codex`.

## Step 1: Menu de Escolha

Exibir o menu abaixo e aguardar a escolha do usuario:

| Opcao | Runtime | Valor tecnico |
| --- | --- | --- |
| `[1]` | Antigravity | `antigravity-code` |
| `[2]` | Codex | `codex` |

Marcar a runtime atual com `(ativa)`.

Se o usuario escolher a runtime ja ativa, informar que nenhuma troca e necessaria e oferecer apenas a validacao.

## Step 2: Confirmacao

Antes de alterar arquivos, confirmar explicitamente:

```text
Confirmar troca de runtime AIOX de <atual> para <nova>? Esta acao atualizara .aiox-core/core-config.yaml e sincronizara os artefatos da IDE escolhida.
```

Se o usuario nao confirmar, encerrar sem alterar arquivos.

## Step 3: Executar Troca

Para ativar Antigravity:

```bash
aiox config ide --set antigravity-code
npm.cmd run sync:ide:antigravity
npm.cmd run validate:runtime
npm.cmd run validate:antigravity-integration
```

Para ativar Codex:

```bash
aiox config ide --set codex
npm.cmd run sync:ide:codex
npm.cmd run sync:skills:codex
npm.cmd run validate:runtime
npm.cmd run validate:codex-integration
```

## Step 4: Fallback Sem Scripts NPM

Se os scripts npm nao existirem no projeto instalado, usar:

```bash
node .aiox-core/infrastructure/scripts/ide-sync/index.js sync --ide <runtime>
node .aiox-core/infrastructure/scripts/validate-runtime-single.js
```

Para Codex, se `.aiox-core/infrastructure/scripts/codex-skills-sync/index.js` existir, executar tambem:

```bash
node .aiox-core/infrastructure/scripts/codex-skills-sync/index.js
```

## Step 5: Resultado

1. Ler novamente `.aiox-core/core-config.yaml`.
2. Confirmar que `ide.selected` contem somente a runtime escolhida.
3. Confirmar que apenas uma entrada em `ide.configs` esta `true`.
4. Informar ao usuario:

```text
Runtime AIOX ativa: <Antigravity|Codex>
Validacao runtime unico: PASS
```
