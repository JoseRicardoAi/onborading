---
description: construção e validação de design system no Codex — auditoria, tokenização, componentes e qualidade visual
---

# Design System Build & Quality Workflow

Workflow Codex para construção e validação de design systems completos. Usa ferramentas disponíveis no Codex: leitura de arquivos, shell, plugins/MCPs disponíveis, browser/testes locais e documentação versionada.

## Quando Usar

- Para criar design system do zero em projeto greenfield
- Para auditar e refatorar design system existente
- Para tokenizar um sistema ad-hoc em sistema estruturado
- Para validar consistência visual de componentes

---

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.codex/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes.
3. Todas as operações operam na raiz do projeto.

---

## Step 1: Discovery e Audit (@ux + @brad-frost)

### 1A: Audit do Estado Atual (Brownfield)

**Invocar @ux com Mission: `audit-design-system`**

```
Mission: audit-design-system
Context: Auditar sistema de design existente ou ausência de sistema
```

O @ux vai:

1. Mapear tokens existentes (cores, tipografia, espaçamento)
2. Inventariar componentes em uso
3. Identificar inconsistências e padrões não documentados
4. Gerar relatório de estado atual

### 1B: Research de Referência (@analyst)

**Invocar @analyst com Mission: `research-design-references`**

```
Mission: research-design-references
Context: Pesquisar design systems referência para [tipo de produto]
```

Output: `docs/design-system/references.md`

---

## Step 2: Design Foundation (@ux + Stitch MCP)

**Invocar @ux com Mission: `define-design-foundation`**

```
Mission: define-design-foundation
Input: audit report, references
```

O @ux vai definir:

### Tokens Fundamentais

```yaml
# design-tokens.yaml
colors:
  primary: { value: '#...', usage: 'CTAs, links' }
  secondary: { value: '#...', usage: 'backgrounds' }
  # ...

typography:
  heading-1: { size: '...', weight: '...', line-height: '...' }
  # ...

spacing:
  xs: 4px
  sm: 8px
  # ...
```

### Geração de Paletas no Codex

> Use geração de imagem, plugin visual ou especificação textual disponível no Codex para criar pranchetas de paletas de cores, tipografia e espaçamento.

**Invocar @brad-frost com Mission: `create-token-library`**

```
Mission: create-token-library
Input: design-foundation tokens
Tool: capacidade visual disponível no Codex para visualização
Output: docs/design-system/tokens.md
```

---

## Step 3: Geração de Screens de Referência no Codex

**Invocar @ux com Mission: `generate-reference-screens`**

```
Mission: generate-reference-screens
Tools: capacidade de geração visual disponível no Codex
Context: Criar telas de referência do design system
```

Screens a gerar:

- Style guide (cores, tipografia, ícones)
- Kit de componentes (buttons, inputs, cards)
- Page templates (dashboard, form, landing)
- Estados (loading, empty, error)

Output: Screens no projeto Stitch + exports em `docs/design-system/screens/`

---

## Step 4: Implementação de Atoms (@dev + @brad-frost)

Seguindo Atomic Design (Brad Frost):

### Step 4.1: Atoms Base

**Stories de atom:**

- Buttons (primary, secondary, danger, ghost)
- Inputs (text, select, checkbox, radio)
- Typography components
- Icon wrappers
- Badges e tags

**@dev com Mission: `build-atoms`**

```
Mission: build-atoms
Design_Spec: docs/design-system/tokens.md + Stitch screens
Context: Implementar atoms com tokens definidos
```

**@brad-frost valida cada atom:**

```
Mission: validate-atom
Checklist: component-quality-checklist.md
Tool: browser/plugin/testes locais disponíveis no Codex para screenshot real do componente
```

### Step 4.2: Molecules

Stories de molecules (combinações de atoms):

- Form groups (label + input + error)
- Card com ações
- Navigation items
- List items

### Step 4.3: Organisms

Stories de organisms:

- Header completo
- Sidebar
- Forms completos
- Tables e data grids

---

## Step 5: QA de Design System (@qa + @ux)

**Invocar @qa com Mission: `qa-design-system`**

```
Mission: qa-design-system
Checklist: component-quality-checklist.md
Context: Validar design system completo
```

Checklist obrigatória:

- [ ] Todos os tokens documentados e em uso
- [ ] Componentes com storybook ou equivalente
- [ ] Responsividade testada em 3 breakpoints
- [ ] Acessibilidade: contraste, ARIA labels, keyboard nav
- [ ] Dark mode (se aplicável)
- [ ] Testes visuais de regressão

> **Validação visual Codex:** use browser/plugin/testes locais disponíveis para screenshots e evidências versionáveis.

---

## Step 6: Documentação Final (@brad-frost + @ux)

**Invocar @brad-frost com Mission: `document-design-system`**

```
Mission: document-design-system
Output: docs/design-system/README.md
```

Documentação deve incluir:

- Princípios de design
- Como usar tokens
- Como criar novos componentes
- Regras de extensão do sistema
- Exemplos de uso correto e incorreto

---

## Resultado Esperado

- Design Foundation (tokens) documentada ✅
- Screens de referência geradas com capacidade visual disponível ✅
- Atoms, Molecules e Organisms implementados ✅
- QA de acessibilidade e responsividade PASSED ✅
- Documentação completa em `docs/design-system/` ✅

---

## Capacidades Visuais no Codex

| Capacidade | Execucao Codex |
| --- | --- |
| Gerar screens | plugin/MCP disponivel ou especificacao textual |
| Gerar paletas | geracao de imagem disponivel ou tokens documentados |
| Validar visualmente | browser/plugin/testes locais |
| Registrar evidencia | screenshot, log ou artefato versionado |
