---
description: executar brownfield discovery em projeto existente — mapear arquitetura, documentar gotchas, gerar architecture doc
---

# Brownfield Discovery Workflow

Workflow para análise profunda de projetos existentes. Mapeia arquitetura real, identifica gotchas, padrões estabelecidos, e gera documentação atualizada.

## Quando Usar

- Ao iniciar trabalho em projeto brownfield (já existente)
- Quando precisar entender a arquitetura atual antes de novas features
- Para atualizar documentação arquitetural desatualizada
- Antes de iniciar qualquer Sprint/Epic em projeto legado

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.codex/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes a partir de `.codex/agent-memory/`.
3. Verificar se `docs/architecture/` existe. Se não, informar: "📂 Nenhuma documentação arquitetural encontrada. O discovery irá gerar de raiz."
4. Confirmar: "✅ Projeto pronto. Iniciando discovery na raiz do projeto."

---

## Step 1: Git e Status Inicial

Verifique o estado do repositório git na raiz do projeto:

```bash
git log --oneline -20          # Últimos 20 commits
git status --short             # Mudanças pendentes
git branch -a                  # Branches disponíveis
```

Registrar: data do último commit significativo, branches ativos, estado do working tree.

---

## Step 2: Mapeamento de Estrutura (@architect)

**Invocar @architect com Mission: `analyze-project`**

```
Mission: analyze-project
Context: Brownfield discovery — mapear estrutura completa do projeto
```

O @architect vai:

1. Mapear toda a estrutura de diretórios
2. Identificar tech stack completa
3. Documentar padrões arquiteturais usados
4. Mapear integrações externas (APIs, DBs, MCPs)
5. Output: `docs/architecture/project-structure.md`

---

## Step 3: Database Discovery (@data-engineer)

Se projeto tem banco de dados:

**Invocar @data-engineer com Mission: `schema-audit`**

```
Mission: schema-audit
Context: Brownfield discovery — auditar schema atual
```

O @data-engineer vai:

1. Mapear todas as tabelas e relacionamentos
2. Verificar RLS policies existentes
3. Identificar migrations pendentes
4. Documentar em `supabase/docs/SCHEMA.md`

---

## Step 4: Frontend Audit (@ux)

Se projeto tem frontend:

**Invocar @ux com Mission: `audit`**

```
Mission: audit
Context: Brownfield discovery — auditar design patterns existentes
```

O @ux vai:

1. Identificar componentes existentes
2. Mapear design tokens e sistema de design
3. Documentar padrões de UI estabelecidos
4. Output: relatório de audit + recomendações

---

## Step 5: Captura de Gotchas

Compilar gotchas críticos descobertos nas fases anteriores:

```json
// aiox/gotchas.json (atualizar ou criar)
{
  "version": "1.0",
  "entries": [
    {
      "id": "GOTCHA-001",
      "category": "Architecture",
      "title": "[Título do gotcha]",
      "description": "[Descrição detalhada]",
      "agents": ["dev", "architect"],
      "severity": "high|medium|low",
      "discovered": "[data]"
    }
  ]
}
```

---

## Step 6: Geração do Architecture Doc (@architect)

**Invocar @architect com Mission: `create-brownfield-arch`**

```
Mission: create-brownfield-arch
Context: Gerar documento de arquitetura baseado no discovery
Template: brownfield-architecture-tmpl.yaml
```

O @architect vai:

1. Usar template `brownfield-architecture-tmpl.yaml`
2. Preencher com todos os dados descobertos
3. Documentar decisões arquiteturais existentes
4. Output: `docs/architecture/brownfield-architecture.md`

---

## Step 7: Validação e PRD Check (@pm opcional)

Se existir PRD do projeto:

**Invocar @pm com Mission: `check-prd`**

```
Mission: check-prd
Context: Verificar se PRD ainda reflete a realidade do projeto
```

---

## Resultado Esperado

- Architecture doc atualizado ✅
- Schema documentado (se DB existente) ✅
- Gotchas catalogados em `.aiox/gotchas.json` ✅
- UI patterns documentados (se frontend) ✅
- PRD alinhado com realidade (se existente) ✅

**Próximo passo após discovery:** Criar/atualizar épicos com informações descobertas.
