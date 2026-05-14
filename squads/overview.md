# Squads Overview

## Default Squad (SDC - Story Development Cycle)

A **Default Squad** é a configuração padrão de orquestração para desenvolvimento de features complexas (ex: projetos Greenfield) dentro do ecossistema AIOX, com suporte a Antigravity e Codex. Ela garante que o ciclo SDC (Story Development Cycle) seja cumprido rigorosamente, evitando a execução em modo generalista (YOLO Mode).

### Composição e Encadeamento

A execução do SDC pela Squad Padrão segue a seguinte passagem de bastão:

1. **`@pm` (Product Manager):** Levanta e alinha o Product Requirement Document (PRD).
2. **`@architect` (Arquiteto):** Define a base técnica, estrutura de pastas e cria o `ui-guidelines.yaml` ou `project-brief`.
3. **`@ui-builder` (UX/UI Builder):** Consome as diretrizes e gera a interface (ex: usando o Google Stitch MCP).
4. **`@dev` (Desenvolvedor):** Implementa a lógica de negócio, integra APIs e dá vida aos componentes de UI.
5. **`@qa` (Quality Assurance):** Testa as entregas, valida os critérios de aceite e garante a estabilidade.

A Default Squad é automaticamente sugerida caso o usuário não especifique uma squad durante a requisição de tarefas que envolvam grande impacto arquitetural.
