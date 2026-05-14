---
description: workflow brownfield UI — evolução de frontend existente — audit, spec de mudanças, design system, implementação visual com QA
---

# Brownfield UI Workflow

Workflow para evolução de frontends existentes. Foco em consistência visual, design system e mudanças não destrutivas ao codebase atual.

## Quando Usar

- Para adicionar/modificar páginas, componentes ou layouts em frontend existente
- Para refatorar componentes mantendo behavior
- Para implementar novos designs em sistema existente

**Pré-requisito:** Executar `brownfield-discovery.md` se arquitetura não documentada.

---

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.antigravity/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes a partir de `.antigravity/agent-memory/`.
3. Carregar `.aiox/gotchas.json` se existir (filtrar: Frontend, CSS, Components, Accessibility).
4. Verificar se `docs/architecture/` existe. Se não, alertar: "⚠️ Execute `brownfield-discovery.md` primeiro para auditar o frontend existente."
5. Confirmar: "✅ Contexto do projeto carregado. Pronto para evolução do frontend."

---

## Step 1: Carregar Contexto Frontend

```bash
# Leitura obrigatória
docs/architecture/              # Arquitetura documentada
docs/front-end-spec.md          # Spec de frontend (existente)
aiox/gotchas.json              # Gotchas específicos de UI/CSS
```

---

## Step 2: Audit de Componentes Existentes (@ux)

**Invocar @ux com Mission: `audit-frontend`**

```
Mission: audit-frontend
Context: Auditar componentes existentes para [feature/mudança]
Input: docs/front-end-spec.md, codebase
```

O @ux vai:

1. Mapear componentes existentes reutilizáveis
2. Identificar design tokens em uso
3. Verificar consistência do sistema atual
4. Reportar componentes quebrados ou inconsistentes

Output: Relatório de audit + mapa de reutilização

---

## Step 3: Spec de Mudanças de UI (@ux)

**Invocar @ux com Mission: `spec-ui-changes`**

```
Mission: spec-ui-changes
Input: audit report, docs/prd.md ou requisito de mudança
Context: Adaptar ao sistema de design existente
```

O @ux vai:

1. Especificar mudanças de design
2. Definir quais componentes reutilizar, adaptar ou criar
3. Atualizar `docs/front-end-spec.md` com novas seções

> **AntiGravity Exclusivo:** Use `mcp_stitch_*` para gerar visualizações das mudanças propostas antes de implementar. Mostra ao usuário como ficará antes de escrever código.

---

## Step 4: Validação Arquitetural Frontend (@architect)

**Invocar @architect com Mission: `validate-ui-changes`**

```
Mission: validate-ui-changes
Input: spec de mudanças, arquitetura existente
Focus: State management, routing, performance implications
```

---

## Step 5: Criação de Épico e Stories (@pm + @sm)

**@pm: `create-brownfield-epic`** com foco em entregas de UI.

**@sm: `create-brownfield-story`** para cada componente/página.

Cada story de UI deve especificar:

- [ ] Componente ou página alvo
- [ ] Comportamentos mantidos (regressão)
- [ ] Novos comportamentos/designs
- [ ] Breakpoints afetados

---

## Step 6: Ciclo de Desenvolvimento (Loop por Story)

### Step 6.1: Componente Discovery (@dev)

Antes de implementar, mapear impacto:

```bash
# Verificar uso atual do componente
grep -r "ComponentName" src/ --include="*.tsx" # ou .vue, .html
# Listar todos os usos que serão afetados
```

### Step 6.2: Implementar (@dev)

```
Mission: develop-brownfield-story
Story: [path da story]
Mode: Interactive
```

O @dev deve:

1. Verificar `aiox/gotchas.json` para gotchas de CSS/componentes
2. Seguir padrões de código existentes (mesmos patterns)
3. Não quebrar breakpoints existentes
4. Manter acessibilidade atual ou melhorar

### Step 6.3: Validação Visual (@ux)

Antes do QA formal:

```
Mission: review-visual-implementation
Context: Verificar se implementação segue a spec de UI
Tool: browser_subagent para screenshot comparativo
```

> **AntiGravity:** Use `browser_subagent` para capturar screenshots da implementação e comparar com a spec visualmente. Grava WebP do fluxo completo.

### Step 6.4: QA Review (@qa)

```
Mission: review-ui-story
Story: [path da story]
Focus: Responsividade, cross-browser, acessibilidade, testes de componente
Checklist: component-quality-checklist.md
```

- **Se NEEDS_WORK:** Loop @dev → @ux → @qa
- **Se APPROVED:** Próxima story

### Step 6.5: Commit (@devops)

---

## Regras Específicas de Brownfield UI

1. **Respeite o design system existente** — Não introduza novos tokens sem justificativa
2. **Componente primeiro** — Modifique o componente isolado antes de integrar nas páginas
3. **Snapshot testing** — Execute testes de snapshot para detectar regressões visuais
4. **Mobile first** — Verifique mobile antes de desktop em cada mudança

---

## Resultado Esperado

- Audit de componentes existentes documentado ✅
- Spec de UI atualizada ✅
- Mudanças implementadas sem regressões visuais ✅
- QA APPROVED com checklist de componentes ✅
- Commits criados prontos para push ✅
