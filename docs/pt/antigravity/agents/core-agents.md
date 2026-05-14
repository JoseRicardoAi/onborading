# Agentes Core AIOX

Os 11 agentes fundamentais do AffHub AIOX, todos disponíveis em qualquer projeto com `.antigravity/`.

---

## Tabela de Referência Rápida

| Agente                  | Persona            | Escopo                          | Ferramentas-chave                             |
| ----------------------- | ------------------ | ------------------------------- | --------------------------------------------- |
| `@dev`                  | Dex                | Implementação de código         | `write_to_file`, `run_command`, `grep_search` |
| `@qa`                   | Quinn              | Testes e qualidade              | `run_command` (test), `find_by_name`          |
| `@architect`            | Aria               | Arquitetura e design técnico    | `search_web`, `read_url_content`, `view_file` |
| `@pm`                   | Morgan             | Product management              | `view_file` (templates), `write_to_file`      |
| `@po`                   | Pax                | Product Owner, stories/epics    | `view_file` (templates), `write_to_file`      |
| `@sm`                   | River              | Scrum Master                    | `view_file`, modelo: `gemini-2.0-flash`       |
| `@analyst`              | Alex               | Pesquisa e análise              | `search_web`, `read_url_content`              |
| `@data-engineer`        | Dara               | Database design                 | `run_command` (supabase), SQL governance      |
| `@ux-design-expert`     | Uma                | UX/UI design (Conceitos)        | `generate_image`, `mcp_stitch_*`              |
| `@ui-builder`           | Stitch Architect   | Construtor Autônomo de Telas    | `mcp_stitch_*`, `read_file`                   |
| `@devops`               | Gage               | CI/CD, git push (**EXCLUSIVO**) | `run_command` (git), `.github/`               |
| `@squad-chief`          | Squad Architect 🎨 | Criação de squads e mind clones | `search_web`, `write_to_file`                 |
| `@research-specialists` | Research Team 🔍   | Deep research e frameworks      | `search_web`, `read_url_content`              |
| `@aiox-master`          | Framework Master 🧠  | Gestão central do framework     | `view_file`, `write_to_file`, `run_command`   |

---

## Perfis Detalhados

### `@dev` — Dex (Desenvolvedor)

**Arquivo:** `.antigravity/agents/aiox-dev.md`

Responsável por toda implementação de código. Segue o princípio **REUSE > ADAPT > CREATE**: sempre busca código existente antes de criar novo.

**Escopo:**

- `packages/`, `.aiox-core/core/`, `bin/`
- Lógicas de Negócios, scripts, APIs, e back-end em geral.
- Implementar features a partir de stories aprovadas pelo `@po`
- Refatoração e manutenção de código existente
- **Nota Importante:** O `@dev` é estritamente focado em back-end e lógica. Projetos front-end ricos, mockups e telas baseadas em UI guidelines devem ser repassados para a esteira do **`@ui-builder`**.

**Ferramentas nativas configuradas:**

```
view_file, write_to_file, replace_file_content,
multi_replace_file_content, grep_search, find_by_name,
run_command, read_url_content
```

**Governança inline:**

- Verifica arquitetura antes de tocar em `supabase/functions/`
- Usa imports absolutos (`@/`)
- Sem `any` no TypeScript

---

### `@qa` — Quinn (QA)

**Arquivo:** `.antigravity/agents/aiox-qa.md`

Quality gates adaptados para o Antigravit. Executa testes e valida critérios de aceitação antes do push.

**Quality Gates:**

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # Jest
```

**Quando `@qa` deve bloquear:**

- Cobertura de testes abaixo do mínimo configurado
- TypeScript errors presentes
- Lint failures não resolvidas

---

### `@architect` — Aria (Arquiteta)

**Arquivo:** `.antigravity/agents/aiox-architect.md`

Design de sistema e decisões arquiteturais. Documenta em `docs/architecture/`.

**Ferramentas-chave:**

- `search_web` — pesquisa de padrões e melhores práticas
- `read_url_content` — leitura de documentação técnica
- Toda decisão arquitetural deve estar em `docs/architecture/{nome}.md`

---

### `@pm` — Morgan (Product Manager)

**Arquivo:** `.antigravity/agents/aiox-pm.md`

Product management e planejamento. Acessa templates via `view_file`:

**Templates disponíveis:**

- `prd-tmpl.yaml` — PRD
- `project-brief-tmpl.yaml` — Project Brief
- `market-research-tmpl.yaml` — Pesquisa de mercado

---

### `@po` — Pax (Product Owner)

**Arquivo:** `.antigravity/agents/aiox-po.md`

Criação e validação de stories. Todas as stories ficam em `docs/stories/`.

**Workflow típico:**

```
@po *create-story → [preenche story-tmpl.yaml] → move para docs/stories/active/
```

**Template:** `.antigravity/templates/story-tmpl.yaml`

---

### `@sm` — River (Scrum Master)

**Arquivo:** `.antigravity/agents/aiox-sm.md`

Facilitação de cerimônias e remoção de impedimentos.

> **Nota:** O `@sm` usa `model: gemini-2.0-flash` por padrão — otimizado para velocidade em facilitações.

---

### `@analyst` — Alex (Analista)

**Arquivo:** `.antigravity/agents/aiox-analyst.md`

Pesquisa de mercado, análise competitiva e inteligência de negócios.

**Ferramentas-chave:**

- `search_web` — pesquisa em tempo real
- `read_url_content` — extração de conteúdo web

**Templates:**

- `competitor-analysis-tmpl.yaml`
- `market-research-tmpl.yaml`
- `brainstorming-output-tmpl.yaml`

---

### `@data-engineer` — Dara (Data Engineer)

**Arquivo:** `.antigravity/agents/aiox-data-engineer.md`

Design e manutenção de schemas de banco de dados. Possui **SQL governance inline**.

**Regras de SQL (governance inline):**

| Operação                           | Permitido    |
| ---------------------------------- | ------------ |
| `CREATE TABLE` diretamente via SQL | ❌ NUNCA     |
| `supabase migration new {nome}`    | ✅ SEMPRE    |
| `supabase db push`                 | ✅ Via CLI   |
| `SELECT`, `INSERT`, `UPDATE`       | ✅ Permitido |

**Templates:**

- `database-schema-request-full.md` (9.7KB)
- `database-schema-request-lite.md` (5.6KB)

---

### `@ux-design-expert` — Uma (UX/UI)

**Arquivo:** `.antigravity/agents/aiox-ux.md`

O agente mais enriquecido na migração — vai além do Antigravity Code por ter acesso a:

**Ferramentas exclusivas do Antigravit:**

```
generate_image       → Gerar imagens, mockups, assets visuais
mcp_stitch_create_project     → Criar projeto de design
mcp_stitch_generate_screen_from_text  → Gerar tela a partir de texto
mcp_stitch_edit_screens       → Editar telas existentes
mcp_stitch_generate_variants  → Gerar variações de tela
mcp_stitch_get_project        → Ver projeto
mcp_stitch_get_screen         → Ver tela específica
mcp_stitch_list_projects      → Listar projetos
mcp_stitch_list_screens       → Listar telas
```

**Uso típico:**

```
@ux-design-expert crie os conceitos visuais e os recursos da tela de onboarding
```

---

### `@ui-builder` — Construtor de Telas (Stitch Architect)

**Arquivo:** `.antigravity/agents/ui-builder.md`

O `@ui-builder` é o especialista máximo em Frontend visual. Quando uma Sprint demanda criação ou refatoração visual, a story é redirecionada do `@dev` para ele.

**Heurísticas nativas:**

1. Obrigatoriedade de leitura do arquivo de restrições (`ui-guidelines.yaml`).
2. Delegação exclusiva do layout estático e estrutural para a ferramenta **Google Stitch (MCP)** sem alucinar CSS manualmente.
3. Atuação focada em Business Binding (Hooks, Roteamento, APIs) apenas na fase pós-Stitch.

**Ferramentas Exclusivas:**

```
mcp_stitch_*
view_file
```

---

### `@devops` — Gage (DevOps)

**Arquivo:** `.antigravity/agents/aiox-devops.md`

**Autoridade exclusiva de git push.** Nenhum outro agente pode executar `git push`.

**Escopo:**

- `.github/` — CI/CD pipelines
- Configuração de infraestrutura
- Git operations (push, merge, tag)
- Gerenciamento de MCP servers

**Quality Gates obrigatórios antes de push:**

```bash
npm run lint && npm run typecheck && npm test
```

---

### `@squad-chief` — Squad Architect 🎨

**Arquivo:** `.antigravity/agents/squad-chief.md` (16KB)

O agente mais complexo do sistema. Cria squads completos com mind clones para qualquer domínio.

**Princípio central: MINDS FIRST**

```
SEMPRE clonar mente real > criar bot genérico
```

**Flow de criação de squad:**

1. Usuário solicita squad para um domínio
2. **IMEDIATAMENTE** pesquisa as melhores mentes reais (sem perguntas primeiro)
3. Apresenta mentes de elite com frameworks documentados
4. Extrai DNA de cada especialista (`*clone-mind`)
5. Cria agentes com DNA extraído
6. Gera estrutura completa do squad

**Comandos disponíveis:**

```
*create-squad   → Squad completo para um domínio
*create-agent   → Agente individual
*clone-mind     → Extrair DNA de uma mente
*validate-squad → Verificar qualidade de squad
*research-minds → Pesquisar mentes de elite em domínio
*list-squads    → Listar squads existentes
*extend-squad   → Adicionar agente a squad existente
```

**Subagentes delegados (Packs):**

- `@oalanicolas` — Mind Cloning Architect (DNA extraction)
- `@pedro-valerio` — Process Absolutist (workflow validation)
- `@research-specialists` — Research Specialists (Victoria, Tim, Daniel consolidated)

> Locais de implementação: `squads/squad-creator/agents/`

> Para detalhes completos: [Mind Clones](./mind-clones.md)
