# Sistema de Agentes — Visão Geral

O Antigravit possui **28 agentes** organizados em 4 categorias, todos residentes em `.antigravity/agents/`.

---

## Categorias de Agentes

| Categoria                                | Quantidade | Descrição                                            |
| ---------------------------------------- | ---------- | ---------------------------------------------------- |
| [Core AIOX](./core/aiox-dev.md)          | 11         | Agentes fundamentais do ciclo de desenvolvimento     |
| [Chiefs](./chiefs/copy-chief.md)         | 8          | Orquestradores especializados por domínio de negócio |
| [Mind Clones](./minds/brad-frost.md)     | 5          | Clones de mentes reais (Design Squad)                |
| [Especiais](./specials/design-system.md) | 6          | Agentes com capacidades únicas                       |

### Índice Completo de Agentes

**Core AIOX:**
[Dex (aiox-dev)](./core/aiox-dev.md) • [Quinn (aiox-qa)](./core/aiox-qa.md) • [Aria (aiox-architect)](./core/aiox-architect.md) • [Morgan (aiox-pm)](./core/aiox-pm.md) • [Pax (aiox-po)](./core/aiox-po.md) • [River (aiox-sm)](./core/aiox-sm.md) • [Alex (aiox-analyst)](./core/aiox-analyst.md) • [Dara (aiox-data-engineer)](./core/aiox-data-engineer.md) • [Uma (aiox-ux)](./core/aiox-ux.md) • [Gage (aiox-devops)](./core/aiox-devops.md) • [Squad Architect (squad-chief)](chiefs/squad-chief.md)

**Chiefs:**
[Jarvis (copy-chief)](./chiefs/copy-chief.md) • [Romanoff (cyber-chief)](./chiefs/cyber-chief.md) • [Strange (data-chief)](./chiefs/data-chief.md) • [Janet (design-chief)](./chiefs/design-chief.md) • [Murdock (legal-chief)](./chiefs/legal-chief.md) • [Loki (story-chief)](./chiefs/story-chief.md) • [Pietro (traffic-masters-chief)](./chiefs/traffic-masters-chief.md) • [Squad Architect (squad-chief)](./chiefs/squad-chief.md)

**Mind Clones:**
[brad-frost](./minds/brad-frost.md) • [dan-mall](./minds/dan-mall.md) • [dave-malouf](./minds/dave-malouf.md) • [oalanicolas](./minds/oalanicolas.md) • [pedro-valerio](./minds/pedro-valerio.md)

**Especiais:**
[Sentinel (design-system)](./specials/design-system.md) • [UI Builder (ui-builder)](./specials/ui-builder.md) • [Jocasta (db-sage)](./specials/db-sage.md) • [Pym (nano-banana-generator)](./specials/nano-banana-generator.md) • [Taskmaster (sop-extractor)](./specials/sop-extractor.md) • [Forge (tools-orchestrator)](./specials/tools-orchestrator.md)

---

## Ativação de Agentes

```
@{agent-id}  → ativa o agente
```

O agente lê seu próprio arquivo `.antigravity/agents/{id}.md`, adota a persona definida e exibe um greeting inline.

**Importante:** A persona fica **inline no arquivo do agente** — não há dependências externas. Isso torna a ativação mais robusta que no Antigravity Code.

---

## Hierarquia e Autoridade

O AIOX define uma hierarquia clara de autoridade via `.antigravity/rules/agent-authority.md`:

```
Constitution (L1)
  └── Framework Rules (L2)
        └── Agent Authority (L3)
              └── Task Scope (L4)
```

Cada agente tem escopo definido. Respeitar os limites de escopo é **obrigatório**.

### Regra de Ouro

> **Apenas `@devops` (Gage) pode executar `git push` para remote.**  
> Todos os outros agentes devem delegar via `→ @devops *push`.

---

## Mapeamento Agente → Codebase

| Agente           | Diretórios Principais                   |
| ---------------- | --------------------------------------- |
| `@dev` (Dex)     | `packages/`, `.aiox-core/core/`, `bin/` |
| `@architect` (Aria) | `docs/architecture/`, design de sistema |
| `@data-engineer` (Dara) | `packages/db/`, migrations, schema      |
| `@qa` (Quinn)    | `tests/`, `*.test.js`, quality gates    |
| `@po` (Pax)      | Stories, epics, requirements            |
| `@devops` (Gage) | `.github/`, CI/CD, git operations       |
| `@ux` (Uma)      | UI/UX, mockups, design system           |
| `@brad-frost`    | Design System, Atomic Design            |
| `@squad-chief` (Squad Architect) | `squads/`, criação de agentes           |
| `@copy-chief` (Jarvis) | Redação estruturada e tom de voz |
| `@cyber-chief` (Romanoff) | Segurança e compliance |
| `@ui-builder` (UI Builder) | Geração visual via Stitch |

---

## Sistema de Comandos (`*`)

Dentro de qualquer agente ativo, use o prefixo `*`:

| Comando Universal | Descrição                     |
| ----------------- | ----------------------------- |
| `*help`           | Lista comandos do agente      |
| `*create-story`   | Cria story de desenvolvimento |
| `*task {nome}`    | Executa task específica       |
| `*exit`           | Sai do modo agente            |

Cada agente pode ter comandos específicos adicionais listados em seu arquivo de definição.

---

## Agent Memory

Cada agente possui memória persistente em `.antigravity/agent-memory/{id}/MEMORY.md`.

**Agentes com memória:**

| Agente           | Arquivo de Memória                                   |
| ---------------- | ---------------------------------------------------- |
| `aiox-dev`       | `.antigravity/agent-memory/aiox-dev/MEMORY.md`       |
| `aiox-qa`        | `.antigravity/agent-memory/aiox-qa/MEMORY.md`        |
| `aiox-architect` | `.antigravity/agent-memory/aiox-architect/MEMORY.md` |
| `aiox-pm`        | `.antigravity/agent-memory/aiox-pm/MEMORY.md`        |
| `aiox-po`        | `.antigravity/agent-memory/aiox-po/MEMORY.md`        |
| `aiox-devops`    | `.antigravity/agent-memory/aiox-devops/MEMORY.md`    |
| `squad`          | `.antigravity/agent-memory/squad/MEMORY.md`          |

A memória é lida pelo agente no início de cada sessão, conforme as regras em `.antigravity/rules/agent-memory-imports.md`.

---

## Handoffs entre Agentes

Quando um agente precisa delegar para outro, usa o formato de handoff definido em `.antigravity/rules/agent-handoff.md`:

```
→ @{agent-id} — {razão do handoff}
Contexto: {resumo do que foi feito}
Próximo passo: {o que precisa ser feito}
```

**Exemplo:**

```
→ @devops — implementação concluída, quality gates passando
Contexto: Feature X implementada na branch feat/feature-x
Próximo passo: Push para remote e criar PR
```

---

## Knowledge Items (KI System)

O Antigravit usa o **KI System** para memória cross-session estruturada:

- KIs ficam em `C:\Users\Administrador\.gemini\antigravity\knowledge\`
- Cada KI contém `metadata.json` e `artifacts/`
- **Sempre verificar KI summaries** antes de pesquisar — evita trabalho duplicado
- Criar KIs após cada squad criado ou decisão arquitetural importante

> Regra: `.antigravity/rules/agent-memory-imports.md`

---

## Framework vs Project Boundary (L1-L4)

Os agentes operam dentro de um modelo de 4 camadas que define o que pode ser modificado:

| Camada                     | Mutabilidade            | Exemplos                                |
| -------------------------- | ----------------------- | --------------------------------------- |
| **L1** Framework Core      | NUNCA modificar         | `.aiox-core/core/`, `bin/aiox.js`       |
| **L2** Framework Templates | NUNCA modificar         | `.aiox-core/development/`               |
| **L3** Project Config      | Permitido (com cuidado) | `.aiox-core/data/`, `MEMORY.md`         |
| **L4** Project Runtime     | SEMPRE pode modificar   | `docs/stories/`, `packages/`, `squads/` |

> Regra formal: `.antigravity/rules/agent-authority.md`

---

## Subagentes do Squad-Chief

O `@squad-chief` orquestra dois subagentes especializados:

| Subagente       | Trigger de ativação                            | Localização                                           |
| --------------- | ---------------------------------------------- | ----------------------------------------------------- |
| `oalanicolas`   | Clonagem de mente, extração de DNA, fidelidade | `squads/squad-creator/agents/oalanicolas.md`          |
| `pedro-valerio` | Design de workflow, validação de processo      | `squads/squad-creator/agents/pedro-valerio.md`        |
| `research-...`  | Deep research e frameworks                     | `squads/squad-creator/agents/research-specialists.md` |

---

## Handoffs entre Workflows

Além do handoff entre agentes, os workflows se encadeiam naturalmente. Ao concluir um workflow, o agente notifica qual workflow pode ser o próximo:

| Workflow Concluído        | Próximo Sugerido                  |
| ------------------------- | --------------------------------- |
| `brownfield-discovery`    | `brownfield-fullstack/service/ui` |
| `spec-pipeline`           | `epic-orchestration`              |
| `epic-orchestration`      | `story-development-cycle`         |
| `story-development-cycle` | `qa-loop` (se QA reprovar)        |
| `greenfield-ui`           | `design-system-build`             |

> Ver detalhes: [`.antigravity/rules/agent-handoff.md`](../../../../.antigravity/rules/agent-handoff.md)

---

## Documentação Relacionada

- [Agentes Core](./core-agents.md)
- [Chiefs](./chiefs.md)
- [Mind Clones](./mind-clones.md)
- [Agentes Especiais](./special-agents.md)
- [Rules: Agent Authority](../rules/overview.md)
- [Rules: Agent Handoff](../rules/overview.md)
- [Rules: Agent Memory](../rules/overview.md)
