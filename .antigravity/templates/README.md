# Templates — .antigravity

Templates usados pelos agentes AIOX para criar documentos estruturados.
Todos os templates estão em PT-BR e foram adaptados do `.Antigravity/templates/`.

## Templates Disponíveis (17 arquivos)

| Template                           | Tamanho | Usado Por       | Descrição                                    |
| ---------------------------------- | ------- | --------------- | -------------------------------------------- |
| `agent-template.yaml`              | 1.7KB   | squad-chief     | Template base para criar novos agentes       |
| `brainstorming-output-tmpl.yaml`   | 5.1KB   | @analyst        | Resultados de sessão de brainstorming        |
| `brownfield-prd-tmpl.yaml`         | 7.4KB   | @pm             | PRD para enhancements em projetos existentes |
| `competitor-analysis-tmpl.yaml`    | 7.7KB   | @analyst        | Relatório de análise competitiva             |
| `database-schema-request-full.md`  | 9.7KB   | @data-engineer  | Schema DB completo (15+ seções)              |
| `database-schema-request-lite.md`  | 5.6KB   | @data-engineer  | Schema DB simplificado (11 seções)           |
| `front-end-architecture-tmpl.yaml` | 6.7KB   | @ux, @architect | Arquitetura de frontend                      |
| `front-end-spec-tmpl.yaml`         | 7.9KB   | @ux             | Especificação UI/UX                          |
| `fullstack-architecture-tmpl.yaml` | 13.8KB  | @architect      | Arquitetura fullstack unificada              |
| `market-research-tmpl.yaml`        | 7.9KB   | @analyst        | Relatório de pesquisa de mercado             |
| `prd-tmpl.yaml`                    | 6.4KB   | @pm             | Product Requirements Document                |
| `project-brief-tmpl.yaml`          | 7.1KB   | @analyst, @pm   | Project Brief                                |
| `qa-gate-tmpl.yaml`                | 2.4KB   | @qa             | Decisão de Quality Gate                      |
| `story-tmpl.yaml`                  | 4.4KB   | @sm, @po        | Template de story completa                   |
| `task-template.md`                 | 1.5KB   | agents          | Template base para task files                |
| `workflow-template.yaml`           | 3.1KB   | squad-chief     | Template base para workflows                 |

## Nota

A migração original de `.Antigravity/templates/` foi realizada via `write_to_file` pois o ambiente CMD estava instável (xcopy/robocopy travavam). Todos os 18 templates originais foram migrados e adaptados para PT-BR.

## Templates Nesta Pasta

| Template              | Tamanho Original | Usado Por   | Descrição                              |
| --------------------- | ---------------- | ----------- | -------------------------------------- |
| `agent-template.yaml` | 82L              | squad-chief | Template base para criar novos agentes |
| `story-tmpl.yaml`     | 137L             | @sm, @po    | Template de story completa             |
| `qa-gate-tmpl.yaml`   | 104L             | @qa         | Template de decisão de Quality Gate    |
| `task-template.md`    | 86L              | agents      | Template base para criar task files    |

## Templates Restantes (Copiar de `.Antigravity/templates/`)

Os seguintes templates existem no `.Antigravity/templates/` e devem ser copiados aqui quando necessário:

| Template                            | Tamanho | Usado Por       |
| ----------------------------------- | ------- | --------------- |
| `architecture-tmpl.yaml`            | 28KB    | @architect      |
| `brownfield-architecture-tmpl.yaml` | 21KB    | @architect      |
| `brownfield-prd-tmpl.yaml`          | 15KB    | @pm             |
| `competitor-analysis-tmpl.yaml`     | 12KB    | @analyst        |
| `database-schema-request-full.md`   | 12KB    | @data-engineer  |
| `database-schema-request-lite.md`   | 5KB     | @data-engineer  |
| `front-end-architecture-tmpl.yaml`  | 10KB    | @ux, @architect |
| `front-end-spec-tmpl.yaml`          | 14KB    | @ux             |
| `fullstack-architecture-tmpl.yaml`  | 33KB    | @architect      |
| `market-research-tmpl.yaml`         | 10KB    | @analyst        |
| `prd-tmpl.yaml`                     | 12KB    | @pm             |
| `project-brief-tmpl.yaml`           | 8KB     | @analyst        |
| `workflow-template.yaml`            | 3.5KB   | squad-chief     |
| `brainstorming-output-tmpl.yaml`    | 5KB     | @analyst        |

## Como Copiar

Para copiar todos de uma vez:

```bash
# Do diretório raiz do projeto:
copy ".Antigravity\templates\*.yaml" ".antigravity\templates\" /Y
copy ".Antigravity\templates\*.md" ".antigravity\templates\" /Y
```

Ou copiar individualmente conforme necessário.
