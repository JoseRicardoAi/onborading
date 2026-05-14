# Workflow: Clone Mind (DNA Extraction)

Pipeline de extração de DNA Mental™ para criação de agentes de alta fidelidade.

## Runtime

Este workflow é compartilhado e deve usar a interface ativa persistida:

- Antigravity: memória, templates e skills em `.antigravity/`.
- Codex: memória, templates e skills em `.codex/`.

Ferramentas de pesquisa, leitura e escrita devem seguir o mapeamento do agente `oalanicolas.md`, preservando as 7 tools do contrato operacional.

## Pre-flight

1. Confirmar o runtime ativo antes de ler ou escrever artefatos operacionais.
2. Carregar `squads/squad-creator/agents/oalanicolas.md`.
3. Verificar memória da mente alvo no diretório do runtime ativo.
4. Confirmar fontes primárias mínimas antes de extrair Voice DNA ou Thinking DNA.

## Passos

1. **Source Curation** (@oalanicolas):
   - Coletar textos reais da mente (posts, artigos, transcrições).
2. **Voice DNA Extraction**:
   - Analisar tom, vocabulário e "signature phrases".
   - Gerar bloco `voice_dna` para o agente.
3. **Thinking DNA Extraction**:
   - Mapear lógica de decisão (heurísticas).
   - Identificar frameworks (Ex: Atomic Design para Brad Frost).
   - Gerar bloco `heuristics`.
4. **DNA Consolidation**:
   - Gerar `mind_dna_complete.yaml`.
   - Validar se o DNA é operacional (70/30 rule).

## Output esperado

Arquivo YAML de DNA pronto para ser injetado no `agent-template.md`.

## Quality Gate

- DNA contém fontes rastreáveis.
- Voice DNA e Thinking DNA estão separados.
- Frameworks citados têm exemplo de uso.
- Resultado pode ser usado por Antigravity e Codex sem reescrever o contrato de tools.

## Handoff

Entregar o YAML de DNA para `create-squad-workflow.md` ou `create-agent.md`, mantendo o caminho de destino conforme o runtime ativo.
