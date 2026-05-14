---
name: enhance-workflow
description: |
  Pipeline de enhancement com análise de determinismo, roundtable dinâmico por domínio,
  e validação QA. Usado para aprimorar projetos/features com perspectivas especializadas.
  Fluxo: Pre-flight → Determinism Check → Discovery → Research → Roundtable → Epic → QA
---

# Enhance Workflow v2.0 — Orquestração Multi-Agente

Pipeline de enhancement com análise de determinismo, roundtable dinâmico por domínio, e validação QA.

**Fluxo:** Pre-flight → Determinism Check → Discovery → Research → Roundtable (dinâmico) → Create Epic → QA Validation

---

## Domain Roundtable Map

O roundtable é selecionado automaticamente baseado no domínio do projeto:

```yaml
domain_roundtable_map:
  code_app:
    keywords: [app, api, database, frontend, backend, feature, refactor, bug]
    agents: [architect, data-engineer, devops, ux]

  copy_marketing:
    keywords: [copy, sales page, vsl, email, headline, funnel, launch, marketing]
    agents: [copy-chief, story-chief, funnel-architect, ads-analyst]

  mmos_minds:
    keywords: [mind, clone, persona, cognitive, behavioral, dna, emulator]
    agents:
      [
        barbara-cognitive-architect,
        daniel-behavioral-analyst,
        charlie-synthesis-expert,
        quinn-quality-specialist,
      ]

  design_brand:
    keywords: [design, ui, ux, brand, visual, logo, design system, component]
    agents: [design-chief, brad-frost, marty-neumeier, ux]

  storytelling_content:
    keywords: [story, narrative, content, course, curriculum, blog, video]
    agents: [story-chief, nancy-duarte, donald-miller, content-pm]

  traffic_ads:
    keywords: [ads, traffic, campaign, facebook, google ads, meta, tiktok]
    agents: [traffic-masters-chief, ads-analyst, creative-analyst, media-buyer]

  security:
    keywords: [security, pentest, vulnerability, audit, compliance, hack]
    agents: [cyber-chief, peter-kim, georgia-weidman, jim-manico]

  legal:
    keywords: [legal, contract, compliance, lgpd, privacy, terms, lawsuit]
    agents: [legal-chief, safe-counsel, lgpd-specialist, compliance-architect]

  hr_people:
    keywords: [hr, hiring, talent, culture, team, performance, onboarding]
    agents: [hr-chief, talent-classifier, behavior-detector, strengths-identifier]

  data_analytics:
    keywords: [analytics, metrics, kpi, dashboard, data, cohort, retention]
    agents: [data-chief, peter-fader, sean-ellis, avinash-kaushik]

  finops_cloud:
    keywords: [finops, cloud cost, aws, gcp, azure, billing, optimization]
    agents: [finops-chief, corey-quinn, jr-storment, mike-fuller]

  process_ops:
    keywords: [process, workflow, automation, sop, procedure, ops]
    agents: [process-architect, workflow-designer, qa-architect, compliance-validator]

  squad_workflow:
    keywords: [squad, skill, workflow, agent, pipeline, orchestration]
    agents: [pedro-valerio, squad-architect, qa, devops]

  advisory_strategy:
    keywords: [strategy, investment, board, advisor, pivot, fundraise]
    agents: [board-chair, ray-dalio, charlie-munger, naval-ravikant]
```

---

## Phase 0: Pre-flight Check

Antes de qualquer coisa, validar:

```
PRE-FLIGHT CHECKLIST:
[ ] Diretório outputs/enhance/ existe ou pode ser criado
[ ] Contexto do projeto foi fornecido (não vazio)

Se FALHAR: Abortar com mensagem clara do que falta.
```

---

## Phase 0.5: Determinism Analysis

**ANTES de gastar tokens com agentes**, avaliar se o enhancement pode ser resolvido deterministicamente:

| Tipo      | Padrões                                | Determinístico? | Ação                  |
| --------- | -------------------------------------- | --------------- | --------------------- |
| rename    | "renomear", "rename", "mudar nome"     | ✅ Sim          | Executar direto       |
| migration | "migrar", "upgrade", "atualizar deps"  | ✅ Sim          | Scripts automáticos   |
| format    | "formatar", "lint", "estilo de código" | ✅ Sim          | prettier, eslint      |
| bug_fix   | "corrigir", "fix", "bug", "erro"       | ❌ Não          | Pipeline completo     |
| feature   | "adicionar", "criar", "implementar"    | ❌ Não          | Pipeline completo     |
| refactor  | "refatorar", "melhorar código"         | Depende         | AST tools ou pipeline |

Se DETERMINÍSTICO: Sugerir comando ao usuário. Perguntar: `"Executar diretamente ou forçar pipeline? [D/p]"`

---

## Phase 0.7: Domain Classification

```
1. Extrair keywords do contexto do usuário
2. Match com domain_roundtable_map
3. Se múltiplos matches: perguntar ao usuário
4. Se nenhum match: usar code_app (default)
```

**Apresentar ao usuário:**

```
[enhance-workflow] Domínio detectado: copy_marketing
[enhance-workflow] Roundtable team: copy-chief, story-chief, funnel-architect, ads-analyst
[enhance-workflow] Confirma? [S/n]
```

---

## Input Collection

Pergunte ao usuário:

1. **Projeto**: Qual projeto/feature será enhanced?
2. **Scope**: greenfield (novo) ou brownfield (existente)?
3. **Foco**: Qual o resultado esperado?

---

## Estrutura de Artefatos

```
outputs/enhance/{slug}/
├── 00-INDEX.md           # Hub de navegação
├── .state.json           # Checkpoint state
├── 01-discovery.md       # Análise técnica (Phase 1)
├── 02-research.md        # Pesquisa estratégica (Phase 2)
├── 03-roundtable.md      # Consenso do roundtable (Phase 3)
├── 04-epic.md            # Epic completo (Phase 4)
└── 05-qa-report.md       # Validação QA (Phase 5)
```

---

## Execução das Fases

### Fase 1: Discovery (@architect)

Análise técnica do projeto. Identificar contexto, dependências, impacto.
Output: `01-discovery.md`

### Fase 2: Research (@analyst)

Pesquisa estratégica usando `search_web` + `read_url_content`.
Graceful degradation: Se falhar após 3 retries, continuar sem research (avisar usuário).
Output: `02-research.md`

### Fase 3: Roundtable (Dinâmico — Paralelo)

**4 agentes em paralelo** baseado no domínio classificado. Cada agente:

1. Lê `01-discovery.md` e `02-research.md`
2. Fornece perspectiva especializada
3. Inclui recomendações práticas

Resultado consolidado em `03-roundtable.md`.

### Fase 4: Create Epic (@pm)

Lê todos os artefatos (01+02+03) e cria o Epic completo com stories.
Output: `04-epic.md`

### Fase 5: QA Validation (@qa)

Validação do Epic:

**Checklist:**

- [ ] Epic Overview presente
- [ ] Scope (in/out) definido
- [ ] Success Metrics mensuráveis
- [ ] Todas as stories: formato "Como X, quero Y, para Z"
- [ ] Acceptance criteria com checkboxes
- [ ] Story points estimados (fibonacci)
- [ ] Definition of Done presente
- [ ] Risks and Mitigations documentados

**Gate Decision:**

- **PASS**: Todos os critérios atendidos → Entregar ao usuário
- **CONCERNS**: >80% atendidos → Entregar com warnings
- **FAIL**: <80% OU críticos faltando → Retry @pm (max 2x)

Output: `05-qa-report.md`

---

## Finalização

```
## Enhance Workflow Completo: {nome}

### Artefatos Gerados
- 00-INDEX.md   — Hub de navegação
- 01-discovery  — Análise técnica
- 02-research   — Pesquisa estratégica
- 03-roundtable — Consenso ({domain})
- 04-epic       — Epic completo
- 05-qa-report  — Validação QA

### Próximos Passos
Revisar epic em outputs/enhance/{slug}/04-epic.md
```

---

## Retry Policy

| Fase       | Max Tentativas | Se Máximo            |
| ---------- | -------------- | -------------------- |
| discovery  | 3              | fail_fast            |
| research   | 3              | graceful_skip        |
| roundtable | 2              | continue_partial     |
| epic       | 3              | fail_with_partial    |
| qa         | 2              | deliver_with_warning |

## Workflows Relacionados

Esta skill gera um Epic que pode ser executado pelos seguintes workflows:

| Contexto do Enhancement                  | Workflow Sugerido                                |
| ---------------------------------------- | ------------------------------------------------ |
| Projeto novo detectado (greenfield)      | `.antigravity/workflows/greenfield-fullstack.md` |
| Projeto existente detectado (brownfield) | `.antigravity/workflows/brownfield-fullstack.md` |
| Enhancement focado em UI                 | `.antigravity/workflows/brownfield-ui.md`        |
| Enhancement com spec complexa            | `.antigravity/workflows/spec-pipeline.md`        |
| Execução do épico gerado                 | `.antigravity/workflows/epic-orchestration.md`   |
