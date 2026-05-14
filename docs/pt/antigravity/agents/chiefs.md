# Chiefs — Orquestradores Especializados

Os **8 Chiefs** são agentes de alto nível especializados por domínio de negócio. Cada chief orquestra um conjunto de sub-especialistas usando um **Tier System** progressivo.

---

## O que é um Chief?

Um Chief é um agente que:

1. **Diagnostica** o request antes de agir (triage inteligente)
2. **Roteia** para o sub-especialista correto dentro do domínio
3. **Supervisiona** a qualidade do output usando checklists curados

Todos os Chiefs usam a mesma filosofia: **diagnosticar antes de criar**, **rotear antes de executar**.

---

## Tabela de Chiefs

| Chief                   | Squad             | Domínio                  | Tier System                                                                     |
| ----------------------- | ----------------- | ------------------------ | ------------------------------------------------------------------------------- |
| `copy-chief`            | Copywriting       | Copy e persuasão         | Diagnóstico (Hopkins) → T1 Fundamentos → T2 Técnicas → T3 Masters + 30 Triggers |
| `cyber-chief`           | Cybersecurity     | Segurança cibernética    | Triagem de urgência → Red Team → Blue Team → AppSec → Governance                |
| `data-chief`            | Data Intelligence | Dados e inteligência     | T0 Fundamentadores → T1 Operacional → T2 Comunicação                            |
| `design-chief`          | Design            | Design de produto        | Foundation → Masters → Specialists + Stitch MCP                                 |
| `legal-chief`           | Legal             | Direito e compliance     | Diagnóstico → Experts Globais → Especialistas BR                                |
| `story-chief`           | Storytelling      | Narrativa e storytelling | Estrutura + Gênero → 12 Storytellers especializados                             |
| `traffic-masters-chief` | Paid Traffic      | Tráfego pago e mídia     | Strategy → Platform Masters → Scaling                                           |
| `db-sage`               | Database          | Banco de dados           | KISS Gate → Schema → RLS → Migrations → Performance                             |

---

## Perfis Detalhados

### `copy-chief` — Chief de Copywriting

**Arquivo:** `.antigravity/agents/copy-chief.md`

Diagnóstico baseado nos princípios de **Antigravity Hopkins** — considera o produto, o público-alvo e o objetivo antes de qualquer copy.

**Tier System:**

- **T1 — Fundamentos:** Headlines, leads, estrutura básica
- **T2 — Técnicas Avançadas:** Storytelling, prova social, urgência
- **T3 — Masters:** 30 Triggers psicológicos de Sugarman, Cialdini, Halbert

**Ativar:**

```
@copy-chief preciso de copy para landing page de SaaS B2B
```

---

### `cyber-chief` — Chief de Cybersecurity

**Arquivo:** `.antigravity/agents/cyber-chief.md`

**Triagem de urgência** como primeiro passo — classifica severidade antes de agir.

**Tier System:**

- **Red Team:** Offensive security, pen testing, ethical hacking
- **Blue Team:** Defensive, SIEM, incident response
- **AppSec:** Code review, vulnerabilities, OWASP
- **Governance:** Compliance, políticas, frameworks (ISO 27001, NIST)

**Ativar:**

```
@cyber-chief temos um possível SQL injection no endpoint de login
```

---

### `data-chief` — Chief de Data Intelligence

**Arquivo:** `.antigravity/agents/data-chief.md`

**Tier System:**

- **T0 — Fundamentadores:** Data modeling, warehouse design, governance
- **T1 — Operacional:** ETL/ELT, pipelines, engenharia de dados
- **T2 — Comunicação:** Dashboards, data storytelling, reporting executivo

**Ativar:**

```
@data-chief analise o funil de conversão dos últimos 90 dias
```

---

### `design-chief` — Chief de Design

**Arquivo:** `.antigravity/agents/design-chief.md`

O único Chief com acesso direto ao **Stitch MCP** para prototipagem.

**Tier System:**

- **Foundation:** Principles, color theory, typography
- **Masters:** Brad Frost (Atomic Design), Don Norman (UX), Dieter Rams
- **Specialists:** Motion design, design systems, acessibilidade

**Ferramentas:**

```
mcp_stitch_*    → Prototipagem de UI
generate_image  → Assets e mockups
```

**Ativar:**

```
@design-chief revise a consistência visual do nosso design system
```

---

### `legal-chief` — Chief de Legal

**Arquivo:** `.antigravity/agents/legal-chief.md`

Diagnóstico jurisdicional antes de qualquer orientação — identifica o contexto legal (BR, EUA, UE, etc.).

**Tier System:**

- **Diagnóstico:** Jurisdição, tipo de questão, urgência
- **Experts Globais:** GDPR, contratos internacionais, propriedade intelectual
- **Especialistas BR:** LGPD, CLT, Código Civil, ANPD

> ⚠️ **Aviso:** Orientações são informativas. Para decisões legais reais, consulte um advogado qualificado.

**Ativar:**

```
@legal-chief revise nossos termos de uso para adequação à LGPD
```

---

### `story-chief` — Chief de Storytelling

**Arquivo:** `.antigravity/agents/story-chief.md`

12 storytellers especializados organizados por estrutura narrativa e gênero.

**Tier System:**

- **Estrutura:** Hero's Journey, 3 Act, Story Spine
- **Gênero:** Brand storytelling, case studies, pitch narratives
- **12 Storytellers:** McKee, Pixar, Freytag, etc.

**Ativar:**

```
@story-chief crie uma narrativa de origem para nossa marca
```

---

### `traffic-masters-chief` — Chief de Tráfego Pago

**Arquivo:** `.antigravity/agents/traffic-masters-chief.md`

**Tier System:**

- **Strategy:** Funil, budget allocation, KPIs
- **Platform Masters:** Meta Ads, Google Ads, TikTok, LinkedIn
- **Scaling:** Creative testing, lookalike audiences, automação

**Ativar:**

```
@traffic-masters-chief otimize nossas campanhas do Meta Ads
```

---

### `db-sage` — Database Sage

**Arquivo:** `.antigravity/agents/db-sage.md`

Chief especializado em banco de dados, complementando o `@data-engineer` com expertise em design e otimização.

**KISS Gate:** Verifica simplicidade antes de complexidade.

**Tier System:**

- **Schema:** Design relacional, normalização, índices
- **RLS (Row-Level Security):** Políticas Supabase, segurança por linha
- **Migrations:** Estratégia segura, rollback, zero-downtime
- **Performance:** EXPLAIN ANALYZE, query optimization, caching

**Regra de ouro:**

```
Nunca CREATE TABLE diretamente. Sempre:
supabase migration new {descricao}
```

**Ativar:**

```
@db-sage revise o schema de permissões e RLS policies
```
