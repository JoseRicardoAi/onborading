# Inventario Antigravity

Inventario inicial levantado a partir de `.antigravity/` em 2026-05-06.

## Fonte Documental

`docs/pt/antigravity/` foi adotada como fonte real de conhecimento funcional e de usabilidade. Ela cobre:

- onboarding e passo a passo em `antigravity-guide.md`, `getting-started.md` e `processo-passo-a-passo-novo-projeto.md`;
- agentes core, chiefs, mind clones e especiais em `agents/`;
- workflows greenfield, brownfield, dev-quality e especiais em `workflows/`;
- regras de governanca em `rules/`;
- skills e criacao de skills em `skills/`;
- squads e processo de criacao em `squads/`;
- templates e mapeamento de ferramentas em `templates/` e `tools/`.

| Familia | Quantidade | Destino Codex | Classificacao |
| --- | ---: | --- | --- |
| raiz (`ANTIGRAVITY.md`, utilitarios) | 2 | `.codex/` + `.codex/CODEX.md` | adaptar para Codex |
| `agent-memory/` | 10 | `.codex/agent-memory/` | copiar direto |
| `agents/` | 30 | `.codex/agents/` | copiar e complementar via fonte canonica |
| `commands/` | 12 | `.codex/commands/` | copiar direto |
| `rules/` | 27 | `.codex/rules/` | copiar e adaptar interpretacao |
| `skills/` | 24 | `.codex/skills/` | copiar e gerar skills Codex canonicas |
| `squads/` | 7 | `.codex/squads/` | copiar direto |
| `templates/` | 20 | `.codex/templates/` | copiar direto |
| `workflows/` | 16 | `.codex/workflows/` | copiar e adaptar interpretacao |

## Observacoes

- Agentes canonicos continuam em `.aiox-core/development/agents/`.
- `.codex/agents/` deve ser validavel por `npm run validate:codex-sync`.
- `.codex/skills/aiox-*` deve ser gerado por `npm run sync:skills:codex`.
- Regras que citam ferramentas exclusivas do Antigravity devem ser lidas como intencao operacional no Codex e executadas com capacidades equivalentes.
