# Ambiente Antigravity — Visão Geral

> **Versão:** 2.0 | **Idioma:** PT-BR | **Atualizado:** 2026-02-26 | **Status:** ✅ Produção

O **Antigravity** é o ambiente de configuração do AIOX para o **Google Gemini**. Ele reside em `.antigravity/` e define agentes, regras, skills, workflows e templates que controlam o comportamento do assistente neste repositório.

> Em termos simples: o `.antigravity/` é para o Antigravity o que o `.antigravity/` é para o Antigravity Code — o cérebro do sistema. Com uma diferença: o Antigravity tem capacidades que o Antigravity Code não possui.

---

## O que é o `.antigravity/`?

```
.antigravity/
├── ANTIGRAVITY.md          ← Documento master do ambiente
├── agents/                 ← 28+ agentes (core, chiefs, mind clones, especiais)
├── rules/                  ← Regras de comportamento e governança
├── skills/                 ← 6 skills modulares (SKILL.md)
├── workflows/              ← 14 workflows + README de seleção
├── templates/              ← 16 templates de documentação
└── agent-memory/           ← Memória persistente de agentes
```

---



## Por que Antigravity?

| Dimensão              | Antigravity Code                   | Antigravity                            |
| --------------------- | ----------------------------- | -------------------------------------- |
| Motor de IA           | Antigravity (Anthropic)            | Gemini (Google DeepMind)               |
| Arquivo master        | `.antigravity/ANTIGRAVITY.md`           | `.antigravity/ANTIGRAVITY.md`          |
| Hooks automáticos     | 6 scripts Python (PreToolUse) | `governance.md` instrucional           |
| Geração de imagens    | ❌ N/A                        | ✅ `generate_image`                    |
| Design de UI          | ❌ N/A                        | ✅ `@ui-builder` + `mcp_stitch_*`      |
| Automação de browser  | ❌ N/A                        | ✅ `browser_subagent` (com vídeo WebP) |
| Memória cross-session | MEMORY.md por agente          | KI System + Cérebro isolado `aiox/`    |
| Gestão Multi-Projeto  | ❌ Mente única isolada        | ✅ Host Multi-Projeto `registry.json`  |
| Quick Menu System     | ❌ Força memorização          | ✅ Renderização Two-Tier de Menus Interativos |
| Workflows ativáveis   | Ocultos em repos dispersos    | ✅ Centralizados em `.antigravity/workflows`  |

---

## Início Rápido — Interaja com o Antigravity

O AIOX Antigravity foi projetado para ser **Conversacional Mapeado**. Você não precisa decorar a lista que se segue. Dentro do seu chat, digite os atalhos de **Quick Menu**:

- `!workflows` — O robô lerá a base de engenharia e listará todos os processos disponíveis de Gênese a Deploy.
- `!squads` — Acessará a arquitetura Two-Tier e revelará em tempo real a hierarquia atualizada de todos os especialistas.

*(Para efeitos de documentação e visão panorâmica, apresentamos abaixo o mapeamento detalhado de pontos de entrada convencionais e seus workflows-alvo).*

### Projeto Novo?

| Tipo de Projeto           | Diga ao Antigravity                | Workflow Ativado          |
| ------------------------- | ---------------------------------- | ------------------------- |
| Full-Stack (front + back) | "Criar nova aplicação fullstack"   | `greenfield-fullstack.md` |
| Backend / API apenas      | "Criar novo serviço/API"           | `greenfield-service.md`   |
| Frontend / UI apenas      | "Criar novo frontend/landing page" | `greenfield-ui.md`        |

### Projeto Existente?

| Situação                      | Diga ao Antigravity                      | Workflow Ativado          |
| ----------------------------- | ---------------------------------------- | ------------------------- |
| Não conheço o projeto         | "Fazer discovery do projeto existente"   | `brownfield-discovery.md` |
| Adicionar feature full-stack  | "Evoluir aplicação existente"            | `brownfield-fullstack.md` |
| Adicionar feature no backend  | "Adicionar endpoint/serviço ao projeto"  | `brownfield-service.md`   |
| Adicionar feature no frontend | "Adicionar página/componente ao projeto" | `brownfield-ui.md`        |

### No Desenvolvimento?

| Situação                     | Fluxo                                | Workflow Ativado             |
| ---------------------------- | ------------------------------------ | ---------------------------- |
| Transformar ideia em backlog | "Criar spec para feature X"          | `spec-pipeline.md`           |
| Executar épico completo      | "Executar todas as stories do épico" | `epic-orchestration.md`      |
| Implementar uma story        | Ciclo SDC completo                   | `story-development-cycle.md` |
| QA reprovou → corrigir       | "Loop de correção da story X"        | `qa-loop.md`                 |
| Criar design system          | "Criar/refatorar design system"      | `design-system-build.md`     |
| Criar squad de especialistas | "Criar squad de [domínio]"           | `create-squad.md`            |
| Trabalhar em paralelo        | "Criar worktree para feature X"      | `auto-worktree.md`           |

> **Referência completa:** [`.antigravity/workflows/README.md`](../../../.antigravity/workflows/README.md)

---

## Índice da Documentação

### 🚀 Início Rápido

- [Getting Started](./getting-started.md) — Primeiros passos, instalação e ciclo de desenvolvimento
- [**Guia de Onboarding Definitivo**](./antigravity-guide.md) — Passo-a-passo para setup, workaround de iteração e primeiro projeto

### 🤖 Agentes

- [Visão Geral dos Agentes](./agents/overview.md) — Sistema de agentes: ativação, hierarquia, memória
- [Agentes Core AIOX](./agents/core-agents.md) — Os 11 agentes fundamentais
- [Chiefs](./agents/chiefs.md) — Chiefs especializados por domínio
- [Mind Clones](./agents/mind-clones.md) — Clones de mentes do Design Squad
- [Agentes Especiais](./agents/special-agents.md) — Agentes com capacidades únicas

### 📋 Rules

- [Visão Geral das Rules](./rules/overview.md) — Como as regras de comportamento funcionam
- [Governance](./rules/governance.md) — Governança: worktrees, SQL, Stitch MCP, git push

### 🛠️ Skills

- [Visão Geral das Skills](./skills/overview.md) — As 10 skills e como usá-las
- [Análise Detalhada de Skills](./skills-analysis.md) — Histórico descritivo


### 🏗️ Squads (Packs)

- [Squads & Escalabilidade](./squads/overview.md) — O modelo de packs e o `squad-creator`
- [Exemplo Prático: Squad Angular/NG-Zorro](./guia-criacao-squad-angular-ng-zorro.md)
- [Criando Squads](./squads/squad-creator-process.md) — O processo interno de clonagem
- [Gerenciamento de Squads](./squads/managing-squads.md) — Estrutura e expansão

### 💻 Usabilidade na IDE

- [O Fluxo Diário](./guides/ide-usability.md) — Como pilotar o Antigravity
- [Context Engine (SYNAPSE)](./guides/context-engine.md) — As 8 camadas de injeção

### 🔄 Workflows

- [Visão Geral dos Workflows](./workflows/overview.md) — Os 16 workflows nativos e como selecioná-los

### 📄 Templates

- [Catálogo de Templates](./templates/overview.md) — Os 16 templates disponíveis

### 🔧 Ferramentas

- [Mapeamento de Ferramentas](./tools/tool-mapping.md) — Antigravity → Antigravity + ferramentas exclusivas

### 🔀 Migração

- [Migração do Antigravity](./migration/from-antigravity.md) — Do `.antigravity/` para `.antigravity/`

---

## Referência Rápida

### Ativar um agente

```
@dev          → Dex (Desenvolvimento)
@qa           → Quinn (Qualidade)
@architect    → Aria (Arquitetura)
@pm           → Kai (Product Manager)
@po           → Nova (Product Owner)
@sm           → River (Scrum Master)
@analyst      → Zara (Análise)
@data-engineer → Dara (Banco de dados)
@ux           → Uma (UX/UI Design)
@ui-builder   → Construtor de UI Autônomo (Google Stitch)
@devops       → Gage (DevOps + git push exclusivo)
@brad-frost   → Brad Frost (Design System)
@squad-chief  → Squad Architect 🎨
@aiox-master  → Framework Master 🧠
```

### Ciclo completo de desenvolvimento (SDC)

```
@sm *draft → @po *validate → @dev *develop → @qa *qa-gate → @devops *push
```

### Ferramentas exclusivas do Antigravity

```typescript
generate_image()         // Gerar imagens, mockups e paletas de design
browser_subagent()       // Automação de browser com gravação de vídeo WebP
mcp_stitch_*()           // Design de interfaces — wireframes e telas completas
```

---

## Princípio Fundamental: CLI First

```
CLI First → Observability Second → UI Third
```

Toda implementação começa pela CLI. A UI jamais é pré-requisito para operação.

---

_AffHub AIOX — Antigravity Environment v2.0_
_Atualizado em 2026-04-01 — 16 workflows integrados_
