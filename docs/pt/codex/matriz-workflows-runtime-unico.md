# Matriz de Workflows - Runtime Unico

## Objetivo

Registrar a revisao especifica dos workflows para garantir que cada processo tenha:

- pre-flight claro;
- roteamento por runtime ativo;
- agentes, skills e tools resolvidos pela interface selecionada;
- entradas e saidas explicitas;
- quality gates e handoffs;
- ausencia de conceito de ferramenta exclusiva em `.codex/` e em workflows compartilhados quando houver mapeamento entre interfaces;
- preservacao dos workflows `.antigravity/` como contratos nativos do Antigravity.

## Escopo Inventariado

| Familia | Quantidade | Regra |
| --- | ---: | --- |
| `.codex/workflows/` | 16 | Deve resolver paths para `.codex/` e usar capacidades equivalentes do Codex. |
| `.antigravity/workflows/` | 15 | Deve resolver paths para `.antigravity/` e descrever tools como nativas da interface. |
| `.codex/squads/**/workflows/` | 1 | Deve ser Codex-native. |
| `squads/**/workflows/` | 4 | Deve ser runtime-aware e preservar paridade Antigravity/Codex. |

## Criterios de Validacao

| Criterio | Codex | Antigravity | Compartilhado |
| --- | --- | --- | --- |
| Runtime root | `.codex/` | `.antigravity/` | runtime ativo |
| Tools nativas | mapeadas para Codex | nativas da interface | tabela/contrato runtime-aware |
| Linguagem "exclusiva" | proibida | permitida no contrato nativo Antigravity | proibida |
| Pre-flight | obrigatorio | obrigatorio | obrigatorio |
| Quality gate | obrigatorio | obrigatorio | obrigatorio |
| Handoff | obrigatorio quando ha proxima etapa | obrigatorio quando ha proxima etapa | obrigatorio |

## Correcoes Aplicadas

- Workflows Codex visuais deixaram de falar em capacidades exclusivas de outra interface e passaram a usar linguagem Codex-native.
- Workflows Antigravity foram preservados como contratos nativos da interface Antigravity.
- Workflows compartilhados de `squad-creator` e `skill-creator` receberam seções de Runtime, Pre-flight, Quality Gate e Handoff.
- `validate:codex-operational` agora valida workflows Codex, Antigravity e compartilhados como familia propria.

## Resultado Atual

`npm.cmd run validate:codex-operational` passou validando:

- 16 workflows Codex;
- 15 workflows Antigravity;
- 4 workflows compartilhados.
