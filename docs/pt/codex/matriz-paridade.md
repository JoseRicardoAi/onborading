# Matriz de Paridade

| Area | Origem Antigravity | Destino Codex | Politica |
| --- | --- | --- | --- |
| Contrato operacional | `.antigravity/ANTIGRAVITY.md` | `.codex/CODEX.md` e `AGENTS.md` | adaptar, nao copiar |
| Fonte funcional | `docs/pt/antigravity/` | `docs/pt/codex/*` | documentar decisoes |
| Agentes canonicos | `.aiox-core/development/agents/` | `.codex/agents/` | gerar por sync |
| Agentes especialistas | `.antigravity/agents/` | `.codex/agents/` | copiar, preservando nomes |
| Comandos AIOX | `.antigravity/commands/` | `.codex/commands/` | copiar |
| Regras | `.antigravity/rules/` | `.codex/rules/` | reescrever quando depender de ferramentas/hook Antigravity |
| Skills Antigravity | `.antigravity/skills/` | `.codex/skills/` | copiar |
| Skills Codex AIOX | `.aiox-core/development/agents/` | `.codex/skills/aiox-*` | gerar por sync |
| Squads | `.antigravity/squads/` | `.codex/squads/` | copiar |
| Templates | `.antigravity/templates/` | `.codex/templates/` | copiar |
| Workflows | `.antigravity/workflows/` | `.codex/workflows/` | adaptar execucao para `/skills`, leitura explicita e validators |
| Documentacao de controle | plano aprovado | `docs/pt/codex/` | documentar apenas |
| Selecao de IDE | menu de instalacao | `IDE_CONFIGS` + `.aiox-core/core-config.yaml` + `aiox config ide` | Codex adicionado e troca posterior implementada |

## Limites

- Codex nao replica automaticamente todos os hooks e ferramentas nativas do Antigravity.
- O enforcement automatico deve ser substituido por `AGENTS.md`, skills locais, validadores e quality gates.
- Onde `docs/pt/antigravity/` exigir capacidades nativas como Stitch, KI System ou menus interativos da IDE, o Codex deve manter a intencao do fluxo e registrar a diferenca operacional.

## Decisao de Adaptacao

- `.codex/ANTIGRAVITY.md` foi removido para evitar ambiguidade; `.codex/CODEX.md` e o unico documento raiz Codex.
- `.codex/rules/tool-usage.md`, `.codex/rules/quick-menu-system.md` e `.codex/workflows/README.md` foram reescritos para Codex.
- `.codex/rules/codex-adaptation.md` e a regra central para converter instrucoes Antigravity em comportamento Codex.
- A selecao de IDE deve ser tratada como estado configuravel do projeto, nao como decisao fixa de instalacao.
