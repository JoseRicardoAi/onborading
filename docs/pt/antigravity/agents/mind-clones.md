# Mind Clones — Design Squad

Os **5 Mind Clones** são agentes criados a partir de **extração de DNA** de especialistas reais do mundo do design e sistemas. Eles fazem parte do **Design Squad** e são subagentes do `@squad-chief`.

---

## O que é um Mind Clone?

Um Mind Clone é um agente que replica a **forma de pensar, comunicar e trabalhar** de um especialista real. Diferente de bots genéricos, cada Mind Clone tem:

- **Voice DNA** — 5 frases-assinatura que captura o estilo de comunicação
- **Thinking DNA** — Frameworks e heurísticas reais do especialista
- **Fonte verificável** — Books, talks, posts documentados

---

## Os 5 Mind Clones do Design Squad

| Agente          | Especialista Real | Especialidade                           | Arquivo                                |
| --------------- | ----------------- | --------------------------------------- | -------------------------------------- |
| `brad-frost`    | Brad Frost        | Atomic Design, design systems           | `.antigravity/agents/brad-frost.md`    |
| `dan-mall`      | Dan Mall          | Design system adoption, ROI business    | `.antigravity/agents/dan-mall.md`      |
| `dave-malouf`   | Dave Malouf       | DesignOps, maturidade organizacional    | `.antigravity/agents/dave-malouf.md`   |
| `oalanicolas`   | Oala Nicolas      | Mind Cloning Architect (DNA extraction) | `.antigravity/agents/oalanicolas.md`   |
| `pedro-valerio` | Pedro Valério     | Process Absolutist (workflow audit)     | `.antigravity/agents/pedro-valerio.md` |

---

## Perfis Detalhados

### `brad-frost` — Atomic Design Expert

**Arquivo:** `.antigravity/agents/brad-frost.md`

Clone do **Brad Frost**, criador do Atomic Design. Especialista em design systems como produto.

**Domínios de expertise:**

- Atomic Design (Atoms, Molecules, Organisms, Templates, Pages)
- Design system governance e contribuição
- Pattern Lab e ferramentas de design system
- Integração com **Stitch MCP** para protótipos

**Voice DNA:**

- _"Design systems are products serving products."_
- _"Start with the atomic pieces, not the pages."_

**Quando ativar:**

```
@brad-frost revise a arquitetura do nosso design system
@brad-frost crie um atomic design guide para o projeto
```

---

### `dan-mall` — Design System Business Strategist

**Arquivo:** `.antigravity/agents/dan-mall.md`

Clone do **Dan Mall**, especialista em adoção de design systems e ROI.

**Domínios de expertise:**

- Convencer stakeholders (business case de design systems)
- Métrica de adoção e ROI tangível
- Super Friendly model de colaboração designer-dev
- Estratégia de design system como produto de negócio

**Voice DNA:**

- _"Design systems should be boring so products can be exciting."_
- _"Adoption is the only metric that matters."_

**Quando ativar:**

```
@dan-mall como convencer nosso C-suite a investir em design system
```

---

### `dave-malouf` — DesignOps Leader

**Arquivo:** `.antigravity/agents/dave-malouf.md`

Clone do **Dave Malouf**, pioneiro em DesignOps.

**Domínios de expertise:**

- Maturidade de práticas de design em organizações
- Métricas de operações de design
- Ritmo de trabalho e workflows de design teams
- Capacitação e crescimento de designers

**Voice DNA:**

- _"DesignOps is about the business of design."_
- _"Measure what matters to the design team's value."_

**Quando ativar:**

```
@dave-malouf avalie a maturidade operacional do nosso design team
```

---

### `oalanicolas` — Mind Cloning Architect

**Arquivo:** `.antigravity/agents/oalanicolas.md`

O **meta-especialista**: especializado em criar outros mind clones. É subagente direto do `@squad-chief`.

**Responsabilidades:**

- Curadoria de fontes para extração de DNA
- Extração de Voice DNA (estilo de comunicação)
- Extração de Thinking DNA (frameworks e heurísticas)
- Geração de `mind_dna_complete.yaml`
- Validação de fidelidade do clone

**Pipeline de clonagem:**

```
*collect-sources      → Curar fontes (livros, talks, posts)
*extract-voice-dna    → Extrair padrões de comunicação
*extract-thinking-dna → Extrair frameworks e heurísticas
*create-agent         → Gerar agente com DNA extraído
```

**Quando é ativado automaticamente:**

- Quando `@squad-chief` detecta request de criação de agente baseado em pessoa real
- Quando o trigger "clone mind", "extract DNA", ou "fidelidade" aparece

---

### `pedro-valerio` — Process Absolutist

**Arquivo:** `.antigravity/agents/pedro-valerio.md`

Especialista em design e auditoria de workflows. É subagente do `@squad-chief`.

**Domínios de expertise:**

- Design de processo e condições de veto
- Checkpoint validation em workflows
- Audit de handoffs entre agentes
- Validação de consistência de processo

**Voice DNA:**

- _"Process is not bureaucracy — it's the elimination of variation."_
- _"Every handoff is a potential point of failure."_

**Quando é ativado:**

- Trigger words: `workflow design`, `process validation`, `veto conditions`, `checkpoint`, `handoff issues`, `validação de processo`

---

## Pipeline de Criação de Mind Clone

Para criar um novo mind clone via `@squad-chief`:

```
1. @squad-chief *clone-mind "Nome do Especialista"
2. → Roteado para @oalanicolas
3. oalanicolas *collect-sources     → Lista de fontes verificáveis
4. oalanicolas *extract-voice-dna   → Voice DNA (5+ frases assinatura)
5. oalanicolas *extract-thinking-dna → Thinking DNA (frameworks)
6. oalanicolas gera mind_dna_complete.yaml
7. @squad-chief *create-agent usando mind_dna_complete.yaml
```

---

## Governança de Mind Clones

Antes de criar qualquer agente baseado em pessoa real, a governança exige:

```
squads/{pack}/data/minds/{agent_id}_dna.yaml  ← DNA deve existir
```

Se o DNA não existir → **BLOQUEADO**. Pipeline de extração deve ser executado primeiro.

> Regra formal: `.antigravity/rules/governance.md` — seção "Antes de CRIAR arquivo em squads/"

---

## Qualidade de Mind Clone (Quality Gate SC_AGT_002)

| Check             | Critério                                         |
| ----------------- | ------------------------------------------------ |
| DNA extraído      | `mind_dna_complete.yaml` existe antes da criação |
| Voice DNA         | Captura estilo real e verificável                |
| Thinking DNA      | Captura frameworks reais e documentados          |
| Fonte verificável | Livro, palestra, post com referência             |

**Threshold:** 4/4 — todos obrigatórios.
