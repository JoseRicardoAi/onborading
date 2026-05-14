# Workflow: Create Skill

Orquestração do ciclo completo de ideação, design e geração de uma nova Skill para o runtime AIOX ativo (Antigravity ou Codex).

## Runtime

Este workflow é compartilhado e deve usar a interface ativa persistida:

- Antigravity: gerar em `.antigravity/skills/`.
- Codex: gerar em `.codex/skills/`.

Nenhuma execução deve gerar artefatos nas duas interfaces ao mesmo tempo.

## Pre-flight

1. Confirmar o runtime ativo.
2. Carregar `squads/skill-creator/squad.yaml`.
3. Confirmar domínio, gatilhos e escopo da skill.
4. Verificar se já existe skill equivalente no runtime ativo.

## Estados

1. **ELICITATION**: O usuário fornece o domínio, assunto ou funcionalidade desejada para a Skill.
2. **WEB RESEARCH**: `@skill-researcher` realiza navegação autônoma na web para buscar como o mercado lida com essa tarefa, encontrando os melhores padrões e processos para a inteligência de execução.
3. **SYNAPSE DESIGN**: Baseado na pesquisa, `@skill-architect` elabora estrategicamente a Synapse (descrição e inteligência de execução da Skill) e solicita aprovação/ajuste do usuário.
4. **INTEGRATION**: Após aprovar a Synapse, `@mcp-specialist` oferece a lista de integrações opcionais:
   - **NotebookLM**: Para consumo de bases de conhecimento externas.
   - **Context7** / outros MCPs: Para acesso e contexto via ferramentas de terceiros.
5. **GENERATION**: `@skill-architect` consolida tudo e gera os arquivos na pasta de skills do runtime ativo:
   - Antigravity: `.antigravity/skills/`
   - Codex: `.codex/skills/`

## Transições

- Recusa na **SYNAPSE DESIGN** → `@skill-architect` refaz a proposta.
- Aprovação na **SYNAPSE DESIGN** → Avança para **INTEGRATION**.
- Conclusão da **INTEGRATION** → Avança para **GENERATION**.

## Quality Gates

- `SKILL.md` possui frontmatter válido.
- A descrição informa quando usar a skill e quando não usar.
- Integrações opcionais têm fallback quando indisponíveis no runtime ativo.
- Arquivos são gerados somente na pasta de skills do runtime ativo.

## Handoff

Ao concluir, entregar caminho da skill criada, integrações escolhidas e pendências de validação.
