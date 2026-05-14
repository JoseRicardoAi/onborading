# Governance — AIOX Governance Pipeline (AGP)

> **Origem:** Este arquivo substitui os **6 hooks Python** (PreToolUse) do Antigravity Code.  
> Como o Antigravit não possui sistema de interceptação automática de ferramentas, estas verificações são aplicadas **proativamente** pelo agente antes de cada operação crítica através do AGP (`.antigravity/skills/governance/SKILL.md`).

---

## O que é o AGP?

O AIOX Governance Pipeline (AGP) é o mecanismo de avaliação executado por agentes antes de efetuarem ações potencialmente destrutivas ou foras da convenção de código. Diferente do Antigravity Code em que tudo era checado passivamente, aqui o pipeline é acionado diretamente e instrucionalmente através da `skill: governance`.

O resultado de governança opera com três `outputs` possíveis, controlados no arquivo raiz [governance-config.md](../../../../.antigravity/rules/governance-config.md):

- **ALLOWED**: Operação livre; o pipeline encerra em sucesso.
- **REQUIRES_APPROVAL**: O agente é instruído a parar e perguntar ao usuário (`notify_user` com `BlockedOnUser=true`) justificando a intenção de sobrepor a regra.
- **BLOCKED**: O agente é instruído a abortar imediatamente a intenção, provendo um alerta ao usuário da proibição explícita.

---

## Como Funciona vs Antigravity Code

No Antigravity Code, haviam scripts Python que **bloqueavam automaticamente** operações indesejadas antes de executarem. No Antigravity, suas lógicas foram migradas para `Tasks` de validação em Markdown:

| Antigravity Code (Hooks PreToolUse)  | Antigravity (AGP Tasks)       |
| ------------------------------- | ----------------------------- |
| `enforce-architecture-first.py` | `check-architecture-first.md` |
| `mind-clone-governance.py`      | `check-mind-clone-dna.md`     |
| `sql-governance.py`             | `check-sql-governance.md`     |
| `enforce-git-push-authority.sh` | `check-git-push-authority.md` |
| `write-path-validation.py`      | `check-write-path.md`         |
| `slug-validation.py`            | `check-slug-format.md`        |

Em caso de dúvidas nos resultados aplicados pelo ambiente, valide regras diretamente invocando: `→ skill: governance`

---

## Verificações Obrigatórias (Tasks Mapeadas)

### 🔴 Antes de ESCREVER em paths protegidos

**Task AGP Associada**: `check-architecture-first`

**Gatilho:** `write_to_file` ou `replace_file_content` em:

- `supabase/functions/**`
- `supabase/migrations/**`

**Checklist:**

- [ ] Existe `docs/architecture/{nome}.md` aprovado?
- [ ] Ou existe `docs/approved-plans/{nome}.md` aprovado?
- [ ] Se o arquivo já existir → operação de edição é **permitida**

**Se documentação NÃO existe:**

1. Criar documentação arquitetural primeiro
2. Obter aprovação via `notify_user`
3. Então retornar à operação de código

**Paths ALWAYS ALLOWED** (não requerem doc):

```
.antigravity/  |  docs/  |  outputs/  |  squads/
.aiox-core/    |  .aiox-custom/  |  node_modules/  |  .git/
package.json   |  tsconfig.json  |  .env  |  README.md
```

---

### 🔴 Antes de CRIAR agente em `squads/*/agents/*.md`

**Task AGP Associada**: `check-mind-clone-dna`

**Gatilho:** `write_to_file` criando novo `.md` em diretório `squads/*/agents/`

**Checklist — verificar se é agente funcional:**

- [ ] O agent-id tem sufixo funcional?  
       (`-chief`, `-orchestrator`, `-chair`, `-validator`, `-calculator`, `-generator`, `-extractor`, `-analyzer`, `-architect`, `-mapper`, `-designer`, `-engineer`)
- [ ] Ou começa com `tools-`, `process-`, `workflow-`?

**Se SIM** → ✅ Agente funcional. Criar normalmente.

**Se NÃO** (provavelmente pessoa real) → Verificar DNA:

- [ ] Existe `squads/{pack}/data/minds/{agent_id}_dna.yaml`?
- [ ] Ou `squads/{pack}/data/{agent_id}-dna.yaml`?
- [ ] Ou `outputs/minds/{agent_id}/`?

**Se DNA NÃO existe** → **BLOQUEAR.** Executar pipeline:

```
*collect-sources → *extract-voice-dna → *extract-thinking-dna → *create-agent
```

---

### 🔴 Antes de EXECUTAR SQL DDL via `run_command`

**Task AGP Associada**: `check-sql-governance`

**Gatilho:** `run_command` contendo qualquer SQL DDL

**Comandos BLOQUEADOS** (nunca executar diretamente):

```sql
CREATE TABLE ...
CREATE VIEW ...
CREATE FUNCTION ...
CREATE TRIGGER ...
ALTER TABLE ...
DROP TABLE ...
DROP VIEW ...
DROP FUNCTION ...
```

**Comandos PERMITIDOS:**

```bash
supabase migration new {nome}   # Via CLI oficial
supabase db push                # Deploy de migration
pg_dump ...                     # Backup/export
SELECT / INSERT / UPDATE        # DML é permitido
```

---

### 🔴 Antes de GIT PUSH

**Task AGP Associada**: `check-git-push-authority`

**Gatilho:** `run_command` com `git push`

**Verificação:**

- [ ] O agente ativo é `@devops` (Gage)?

**Se NÃO** → **BLOQUEAR.** Delegar:

```
→ @devops *push
```

**Se SIM** → Executar quality gates antes de push:

```bash
npm run lint         # ✅ deve passar
npm run typecheck    # ✅ deve passar
npm test             # ✅ deve passar
```

---

### 🟡 Antes de CRIAR ou REMOVER Git Worktrees

**Task AGP Associada**: `check-worktree-authority`

**Gatilho:** `run_command` com `git worktree add` ou `git worktree remove`

**Verificação obrigatória:**

- [ ] O agente ativo é `@devops` (Gage)?

Se NÃO → **BLOQUEAR.** Worktrees devem ser gerenciados apenas por @devops:

```
→ @devops *create-worktree {branch}
→ @devops *remove-worktree {branch}
→ @devops *list-worktrees
```

Se SIM → Seguir protocolo do workflow `auto-worktree.md`.

---

### 🟡 Antes de usar `mcp_stitch_*`

**Gatilho:** Qualquer invocação de ferramentas Stitch MCP

**Verificação:**

- [ ] O contexto é de Design System ou UI? (workflows: `design-system-build.md`, `greenfield-ui.md`, `brownfield-ui.md`)

Se SIM → Prosseguir normalmente.
Se NÃO → Alertar: use Stitch MCP apenas no contexto de workflows de UI/Design System.

Verificar se o tipo de documento está no path correto (**Task AGP Associada**: `check-write-path`):

| Tipo de Documento   | Path Correto                                        |
| ------------------- | --------------------------------------------------- |
| Sessions / handoffs | `docs/sessions/YYYY-MM/`                            |
| Arquitetura         | `docs/architecture/`                                |
| Guias               | `docs/guides/`                                      |
| Stories             | `docs/stories/active/` ou `docs/stories/completed/` |
| Planos aprovados    | `docs/approved-plans/`                              |

Se o documento parece estar no path errado → alertar antes de salvar.

---

### 🟡 Formato de Slugs e IDs

**Task AGP Associada**: `check-slug-format`

**Regra:** Todos os slugs e IDs devem ser `snake_case`

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

**Arquivos que NUNCA devem ser lidos parcialmente** (sem StartLine/EndLine quando tomando decisões):

- `.antigravity/ANTIGRAVITY.md`
- `.antigravity/rules/*.md`
- `.aiox-core/development/agents/*.md`
- `supabase/docs/SCHEMA.md`
- `package.json`, `tsconfig.json`

**Regra:** Ler o arquivo completo quando tomando decisões sobre estes arquivos.

---

## Validação Manual com Scripts Originais

Os scripts Python do `.antigravity/hooks/` ainda existem e podem ser usados para validação manual.
> ⚠️ **Scripts legados** — usar apenas para debug manual. O AGP instrucional através deste `governance.md` é o seu fluxo primário.

```bash
# Validar architecture-first
echo '{"tool_name": "Write", "tool_input": {"file_path": "supabase/functions/minha-funcao/index.ts"}}' \
  | python3 .antigravity/hooks/enforce-architecture-first.py

# Validar mind-clone governance
echo '{"tool_name": "Write", "tool_input": {"file_path": "squads/meu-squad/agents/gary-halbert.md"}}' \
  | python3 .antigravity/hooks/mind-clone-governance.py

# Validar slug
echo '{"tool_name": "Bash", "tool_input": {"command": "criar slug jose-carlos"}}' \
  | python3 .antigravity/hooks/slug-validation.py
```

---

## Referência

| Conceito              | Arquivo                                 |
| --------------------- | --------------------------------------- |
| Regra completa        | `.antigravity/rules/governance.md`      |
| Autoridade de agentes | `.antigravity/rules/agent-authority.md` |
| Documento master      | `.antigravity/ANTIGRAVITY.md`           |
