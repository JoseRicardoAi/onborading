# Workflow: Mind Research Loop

Ciclo iterativo de pesquisa para encontrar as melhores mentes e frameworks de um domínio.

## Runtime

Este workflow é compartilhado e usa as tools declaradas em `research-specialists.md`:

- Antigravity: `search_web`, `read_url_content` e `view_file` nativos.
- Codex: capacidades equivalentes de browsing/leitura disponíveis, com fallback para fontes fornecidas pelo usuário quando necessário.

## Pre-flight

1. Confirmar domínio e objetivo do squad.
2. Carregar `squads/squad-creator/agents/research-specialists.md`.
3. Confirmar critérios de descarte de falsos especialistas.
4. Definir se a pesquisa usará web ativa ou fontes fornecidas pelo usuário.

## Passos

1. **Initialize Research** (@research-specialists):
   - Definir 3 keywords core do domínio.
   - Identificar 10 nomes iniciais.
2. **Deep Filter** (Daniel):
   - Cruzar nomes com "skin in the game".
   - Eliminar mentes sem frameworks documentados (livros/cursos).
3. **Framework Extraction** (Victoria/Tim):
   - Ler sumários, transcrições ou artigos das mentes restantes.
   - Sintetizar o "Thinking Pattern" principal de cada uma.
4. **Curated Selection**:
   - Selecionar as top 3-5 mentes.
   - Preparar resumo para o usuário.

## Output esperado

Uma lista formatada pronta para o `squad-chief` apresentar.

## Quality Gate

- Cada mente selecionada tem fonte, framework principal e relevância para o domínio.
- Mentes sem evidência pública suficiente são descartadas.
- A saída contém top 3-5 mentes, não uma lista genérica.

## Handoff

Entregar a lista curada para `clone-mind.md` e para o estado `CLONING` de `create-squad-workflow.md`.
