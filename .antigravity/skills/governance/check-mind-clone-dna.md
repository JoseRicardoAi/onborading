# Task: check-mind-clone-dna

## Propósito

Valida se agents criados como mind clones (pessoas reais) possuem extração prévia de DNA documentada.

## Gatilho

`write_to_file` criando novo arquivo em `squads/*/agents/*.md`.

## Input Necessário

- `file_path`: Path do novo arquivo de agente.

## Procedimento de Validação

1. Verificar se `file_path` já existe no disco (edição a agentes). Se sim, pular regras de criação e validar positivamente.
2. Extrair `{pack}` e `{agent_id}` via identificador no path: `squads/{pack}/agents/{agent_id}.md`.
3. Validar se `{agent_id}` atende aos padrões de nomes funcionais:
   - **Sufixos:** `-chief`, `-orchestrator`, `-chair`, `-validator`, `-calculator`, `-generator`, `-extractor`, `-analyzer`, `-architect`, `-mapper`, `-designer`, `-engineer`.
   - **Prefixos:** `tools-`, `process-`, `workflow-`.
4. Verificar se DNA do mind clone foi armazenado, testando os seguintes diretórios base:
   `squads/{pack}/data/minds/{agent_id}_dna.yaml`, `squads/{pack}/data/minds/{agent_id}_dna.md`, `squads/{pack}/data/{agent_id}-dna.yaml`, `outputs/minds/{agent_id}/`.
5. Avaliar o resultado encontrado através da árvore de decisão.

## Caminhos de Decisão

- Se arquivo já existe → retornar ALLOWED
- Se `{agent_id}` tem prefixo/sufixo funcional listado → retornar ALLOWED
- Se DNA for encontrado nas opções de path do regex → retornar ALLOWED
- Se DNA não for encontrado no disco/sistema na formatação correta → retornar BLOCKED

## Formato de Output

> A task retorna apenas o resultado. O SKILL.md combina com governance-config.md
> para determinar a ação final (prosseguir / notify_user / bloquear).

RESULT: ALLOWED
Motivo: [...]

— OU —

RESULT: BLOCKED
Motivo: Mind clone detectado e falta arquivo de DNA pré-processado pela pipeline.
Regra violada: mind_clone_dna
Ação corretiva: Interromper imediatamente, rodar tools do Chief para criar background verificável.
Pipeline sugerido:
→ @squad-chief *collect-sources {agent_id}
→ @squad-chief *extract-voice-dna {agent_id}
→ @squad-chief *extract-thinking-dna {agent_id}
→ @squad-chief *create-agent {agent_id}

## Casos de Teste

| Cenário | Input                                              | Resultado Esperado |
| ------- | -------------------------------------------------- | ------------------ |
| 1       | Criar squads/mkt/agents/gary-halbert.md sem DNA    | BLOCKED            |
| 2       | Criar squads/mkt/agents/gary-halbert.md com DNA    | ALLOWED            |
| 3       | Criar squads/mkt/agents/campaign-chief.md          | ALLOWED            |
| 4       | Criar squads/mkt/agents/tools-validator.md         | ALLOWED            |
| 5       | Editar squads/mkt/agents/gary-halbert.md existente | ALLOWED            |
