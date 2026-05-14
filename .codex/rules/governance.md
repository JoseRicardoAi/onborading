# Governance — Regras de Governança Automática

> **NOTA ARQUITETURAL:** Este arquivo define a governanca operacional Codex.
> Como o Codex nao usa hooks automáticos do projeto, estas regras devem ser aplicadas **proativamente** pelo agente antes de cada operação crítica (ou direcionadas via AGP).

---

## AIOX Governance Pipeline (AGP)

> **MECANISMO DE EXECUÇÃO:** As regras abaixo são implementadas como tasks ativas.
> Em vez de verificar manualmente item por item, usar o pipeline de governance:
>
> ```text
> → skill: governance  (.codex/skills/governance/SKILL.md)
> → Task correspondente deve ser executada ANTES da operação
> ```
>
> As seções abaixo servem como **referência das políticas** (source of truth).
> O AGP é o **mecanismo de execução** dessas políticas. Configurações em `.codex/rules/governance-config.md`.

---

## Verificações Obrigatórias por Operação

### 🔴 Antes de ESCREVER ou EDITAR código em paths protegidos

**Task AGP:** `check-architecture-first` → `.codex/skills/governance/`

**Gatilho:** Qualquer criacao ou edicao de arquivo em:

- `supabase/functions/**`
- `supabase/migrations/**`

**Checklist obrigatório:**

- [ ] Existe documentação aprovada em `docs/architecture/{nome}.md`?
- [ ] OU existe em `docs/approved-plans/{nome}.md`?
- [ ] Se o arquivo já existir — operação de edição é permitida

**Ação se documentação NÃO existe:**

1. Criar documentação de arquitetura primeiro
2. Obter aprovação (notify_user para revisão)
3. ENTÃO retornar à operação de código

**Paths ALWAYS ALLOWED (não requerem doc):**

```
.codex/        |  docs/  |  outputs/  |  squads/
.aiox-core/    |  .aiox-custom/  |  node_modules/  |  .git/
package.json   |  package-lock.json  |  tsconfig.json
.env           |  README.md
```

---

### 🔴 Antes de CRIAR arquivo em `squads/*/agents/*.md`

**Task AGP:** `check-mind-clone-dna` → `.codex/skills/governance/`

**Gatilho:** Qualquer criacao de novo agente em squads

**Checklist obrigatório:**

- [ ] O agent-id tem sufixo funcional? (`-chief`, `-orchestrator`, `-chair`, `-validator`, `-calculator`, `-generator`, `-extractor`, `-analyzer`, `-architect`, `-mapper`, `-designer`, `-engineer`)
- [ ] OU o agent-id começa com `tools-`, `process-`, `workflow-`?

Se SIM → ✅ Agente funcional, criar normalmente

Se NÃO → VERIFICAR DNA:

- [ ] Existe `squads/{pack}/data/minds/{agent_id}_dna.yaml`?
- [ ] OU existe `squads/{pack}/data/minds/{agent_id}_dna.md`?
- [ ] OU existe `squads/{pack}/data/{agent_id}-dna.yaml`?
- [ ] OU existe `outputs/minds/{agent_id}/`?

Se DNA NÃO existe → **BLOQUEAR. Executar pipeline:**

```
*collect-sources → *extract-voice-dna → *extract-thinking-dna → *create-agent
```

---

### 🔴 Antes de EXECUTAR SQL via run_command

**Task AGP:** `check-sql-governance` → `.codex/skills/governance/`

**Gatilho:** Qualquer `run_command` contendo SQL DDL

**Comandos BLOQUEADOS (nunca executar diretamente):**

```sql
CREATE TABLE ...
CREATE VIEW ...
CREATE FUNCTION ...
CREATE TRIGGER ...
ALTER TABLE ...
DROP TABLE ...
DROP VIEW ...
DROP FUNCTION ...
CREATE TABLE AS SELECT ...  -- backup proibido
```

**Comandos PERMITIDOS:**

```bash
supabase migration new {nome}   # Via CLI oficial
supabase db push                # Via CLI oficial
pg_dump ...                     # Backup/export
```

**Ação:** Usar SEMPRE o Supabase CLI para operações de schema.

---

### 🔴 Antes de GIT PUSH

**Task AGP:** `check-git-push-authority` → `.codex/skills/governance/`

**Gatilho:** Qualquer `run_command` com `git push`

**Verificação:**

- [ ] O agente ativo é `@devops` (Gage)?

Se NÃO → **BLOQUEAR.** Delegar para @devops via:

```
→ @devops *push
```

Se SIM → Verificar quality gates antes de push:

- [ ] `npm run lint` passou?
- [ ] `npm run typecheck` passou?
- [ ] `npm test` passou?

---

### 🟡 Antes de SALVAR documentos (warnings)

**Task AGP:** `check-write-path` → `.codex/skills/governance/`

**Verificar paths corretos:**

| Tipo de Documento | Path Correto             |
| ----------------- | ------------------------ |
| Sessions/handoffs | `docs/sessions/YYYY-MM/` |
| Arquitetura       | `docs/architecture/`     |
| Guias             | `docs/guides/`           |
| Stories           | `docs/stories/`          |
| Approved plans    | `docs/approved-plans/`   |

**Ação:** Se o documento parece estar no path errado, alertar antes de salvar.

---

### 🟡 Formato de Slugs — Validação Obrigatória

**Task AGP:** `check-slug-format` → `.codex/skills/governance/`

**Regra:** Todos os slugs e IDs DEVEM ser snake_case

```
Padrão válido: ^[a-z0-9]+(_[a-z0-9]+)*$
```

| Exemplo              | Status                  |
| -------------------- | ----------------------- |
| `jose_carlos_amorim` | ✅ VÁLIDO               |
| `workflow_execution` | ✅ VÁLIDO               |
| `jose-carlos-amorim` | ❌ INVÁLIDO (hífen)     |
| `JoseAmorim`         | ❌ INVÁLIDO (camelCase) |
| `jose.carlos`        | ❌ INVÁLIDO (ponto)     |

---

### 🔵 Leitura Parcial de Arquivos Protegidos

**Arquivos que NUNCA devem ser lidos parcialmente (com StartLine/EndLine em contextos críticos):**

- `.codex/CODEX.md`
- `.codex/rules/*.md`
- `.aiox-core/development/agents/*.md`
- `supabase/docs/SCHEMA.md`
- `package.json`, `tsconfig.json`

**Regra:** Sempre ler o arquivo completo quando estiver tomando decisões sobre estes arquivos.

---

### 🟡 Antes de CRIAR ou REMOVER Git Worktrees

**Task AGP:** `check-git-push-authority` → `.codex/skills/governance/`

**Gatilho:** Qualquer `run_command` com `git worktree add` ou `git worktree remove`

**Verificação obrigatória:**

- [ ] O agente ativo é `@devops` (Gage)?

Se NÃO → **BLOQUEAR.** Worktrees devem ser gerenciados apenas por @devops:

```
→ @devops *create-worktree {branch}
→ @devops *remove-worktree {branch}
→ @devops *list-worktrees
```

Se SIM → Seguir protocolo do workflow `auto-worktree.md`:

- Verificar `git status --short` antes de criar
- Nunca criar worktree com mudanças não commitadas
- Sempre documentar worktree criado em `.aiox/worktrees.json` (se existir)

---

### 🟡 Antes de usar Stitch MCP opcional (Design System)

**Gatilho:** Qualquer invocacao de Stitch MCP opcional quando essa dependencia estiver disponivel na sessao.

**Verificação:**

- [ ] O contexto é de Design System ou UI? (workflows: `design-system-build.md`, `greenfield-ui.md`, `brownfield-ui.md`)
- [ ] O output será salvo/referenciado em `docs/design-system/` ou `docs/`?

Se SIM → Prosseguir normalmente.
Se NÃO → Alertar: "Use Stitch MCP apenas no contexto de workflows de UI/Design System."

---

## Exit Codes de Referência

> Para referência metodológica em validadores e scripts Codex.

| Exit Code | Ação Recomendada                                |
| ---------------- | ----------------------------------------------- |
| 0 — Permitido    | Prosseguir normalmente                          |
| 2 — Bloqueado    | Auto-bloquear + solicitar aprovação ou repensar |
| Outro — Aviso    | Log interno + continuar                         |

---

## Validacao Manual

> **Nota:** Para uso integrado, prefira o AGP via `skill governance`.

No Codex, execute a skill local `.codex/skills/governance/SKILL.md` ou os validadores npm aplicaveis antes de concluir a tarefa.
