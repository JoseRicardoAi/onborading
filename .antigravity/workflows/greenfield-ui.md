---
description: workflow greenfield UI — construção de frontend do zero — spec, design system, componentes e implementação visual
---

# Greenfield UI Workflow

Workflow para construção de frontends do zero. Focado em user experience, design system e implementação visual de alta qualidade. **Aproveita capacidades exclusivas do AntiGravity** (Stitch MCP + generate_image).

## Quando Usar

- Para novos projetos frontend puro (React, Next.js, landing page, dashboard)
- Quando existe backend separado ou API externa
- Para projetos com foco intenso em UX/UI
- Quando é necessário design system desde o início

**Não usar se:** projeto tem backend integrado → usar `greenfield-fullstack.md`

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.antigravity/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes a partir de `.antigravity/agent-memory/`.
3. Confirmar: "✅ Projeto pronto. Todas as ações operam na raiz do projeto."

---

## Fase 0: Bootstrap do Ambiente (@devops)

```bash
cat .aiox/environment-report.json   # Se existir → pular Fase 0
```

Se NÃO existir, **Invocar @devops com Mission: `environment-bootstrap`**

---

## Fase 1: Research e Especificação

### Step 1.1: User Research Opcional (@ux)

**Invocar @ux com Mission: `user-research`** (se necessário)

```
Mission: user-research
Context: [Público-alvo do produto]
```

O @ux vai mapear personas, jornadas e pain points antes da spec.

### Step 1.2: PRD de Produto (@pm)

**Invocar @pm com Mission: `create-prd`**

```
Mission: create-prd
Template: prd-tmpl.yaml
Focus: Frontend features, user journeys, design principles
```

Output: `docs/prd.md`

### Step 1.3: Front-End Spec (@ux)

**Invocar @ux com Mission: `create-frontend-spec`**

```
Mission: create-frontend-spec
Template: front-end-spec-tmpl.yaml
Input: docs/prd.md
```

O @ux vai:

1. Definir design tokens e sistema de cores
2. Especificar tipografia e espacamento
3. Mapear componentes necessários
4. Definir breakpoints e responsividade
5. Criar wireframes conceituais

Output: `docs/front-end-spec.md`

> **🚀 Vantagem AntiGravity:** Use `mcp_stitch_generate_screen_from_text` para gerar wireframes e telas de alta fidelidade diretamente nesta fase. O @ux pode criar designs completos sem ferramentas externas.

### Step 1.4: Geração de UI com Stitch MCP (@ux)

**Opcionalmente invocar @ux com Mission: `generate-ui-screens`**

```
Mission: generate-ui-screens
Tool: mcp_stitch_generate_screen_from_text
Context: Gerar telas principais baseadas na front-end-spec
```

Telas sugeridas para gerar:

- Home/Landing page
- Dashboard principal
- Formulários chave
- Estados de erro e empty state

### Step 1.5: Arquitetura Frontend (@architect)

**Invocar @architect com Mission: `create-frontend-architecture`**

```
Mission: create-frontend-architecture
Template: front-end-architecture-tmpl.yaml
Input: docs/prd.md, docs/front-end-spec.md
Focus: Estrutura de componentes, state management, routing
```

Output: `docs/frontend-architecture.md`

### Step 1.6: Validação (@po)

**Invocar @po com Mission: `validate-artifacts`**

---

## Fase 2: Design System Bootstrap (@ux + @brad-frost)

**Se projeto requer design system:**

**Invocar @brad-frost com Mission: `setup-design-system`**

```
Mission: setup-design-system
Input: docs/front-end-spec.md
Context: Implementar design system usando Atomic Design
```

O @brad-frost vai:

1. Definir tokens de design (cores, tipografia, espaçamento)
2. Criar atoms base (buttons, inputs, icons)
3. Documentar em `docs/design-system/`
4. Gerar exemplos de uso

> **AntiGravity Exclusivo:** @brad-frost pode usar `mcp_stitch_*` para criar e validar componentes de design system visualmente em tempo real.

---

## Fase 3: Ciclo de Desenvolvimento (Loop por Story)

Fragmentar PRD:

**@po com Mission: `shard-documents`** → source-tree, tech-stack, coding-standards

Para cada story:

### Step 3.1: Story de Componente (@sm)

```
Mission: create-next-story
Focus: Componentes React, páginas, integração com API
Context: Seguir design system e front-end-spec
```

### Step 3.2: Implementar (@dev + @ux)

```
Mission: develop-story
Story: [path da story]
Context: Frontend — CSS, componentes, responsividade
```

O @ux pode ser invocado para revisão de implementação visual antes do QA.

### Step 3.3: QA Review (@qa)

```
Mission: review-story
Story: [path da story]
Focus: Responsividade, acessibilidade, CSS quality, component tests
Tool: browser_subagent para validação visual em browser
```

> **AntiGravity Exclusivo:** Use `browser_subagent` para testar visualmente o resultado em browser e fazer screenshots para validação. Gravação de WebP automática.

- **Se NEEDS_WORK:** Loop @dev → @ux → @qa
- **Se APPROVED:** Próxima story

### Step 3.4: Commit (@devops)

---

## Resultado Esperado

- Ambiente configurado ✅
- PRD, Front-End Spec e Arquitetura aprovados ✅
- Design system documentado (se aplicável) ✅
- Telas geradas com Stitch MCP (se aplicável) ✅
- Componentes implementados com QA APPROVED ✅
- Aplicação responsiva e acessível ✅

---

## Templates Necessários

| Template                           | Usado em |
| ---------------------------------- | -------- |
| `prd-tmpl.yaml`                    | Fase 1.2 |
| `front-end-spec-tmpl.yaml`         | Fase 1.3 |
| `front-end-architecture-tmpl.yaml` | Fase 1.5 |
| `story-tmpl.yaml`                  | Fase 3.1 |

## Skills Relacionadas

- `architect-first` — Para decisões arquiteturais de componentes
- `enhance-workflow` — Para enhancement de features UI específicas
