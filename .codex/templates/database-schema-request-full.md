# Database Schema Request Template

**Status:** [Draft | Review | Approved | Implemented]
**Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Author:** @username
**Reviewers:** @reviewer1, @reviewer2

---

## 1. Executive Summary

### Context

[Breve descrição do contexto de negócio que motivou a solicitação]

### Objective

[Objetivo principal desta solicitação de schema]

### Scope

- **Tables:** [Número] novas tabelas
- **Expected Volume:** [Estimativa de registros]
- **Integration:** [Sistemas/schemas relacionados]
- **Priority:** [High | Medium | Low]

---

## 2. Business Requirements

### Problem Statement

[Descrição clara do problema que precisa ser resolvido]

### Success Metrics

- **Metric 1:** [KPI esperado]
- **Metric 2:** [KPI esperado]

### Users Impacted

- **Primary:** [Usuários principais]
- **Expected Load:** [Ex: 5K usuários, 100-200 concurrent]

---

## 3. Schema Design

### 3.1 Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       SCHEMA: [schema_name]                      │
├─────────────────────────────────────────────────────────────────┤
│  [Diagrama visual mostrando relacionamentos entre tabelas]       │
└─────────────────────────────────────────────────────────────────┘

Integration with Existing Systems:
[existing_table] ←→ [new_table] ([relationship description])
```

### 3.2 Tables Summary

| Table            | Purpose     | FK to Existing            | Pattern Alignment |
| ---------------- | ----------- | ------------------------- | ----------------- |
| `schema.table_1` | [Descrição] | `[existing_schema.table]` | [Pattern usado]   |
| `schema.table_2` | [Descrição] | `[existing_schema.table]` | [Pattern usado]   |

### 3.3 Key Design Decisions

1. **[Decisão 1]** - [Justificativa]
2. **[Decisão 2]** - [Justificativa]

### 3.4 Alternative Approaches Considered

| Approach            | Pros        | Cons           | Decision              |
| ------------------- | ----------- | -------------- | --------------------- |
| **[Alternativa 1]** | [Vantagens] | [Desvantagens] | [Escolhida/Rejeitada] |
| **[Alternativa 2]** | [Vantagens] | [Desvantagens] | [Escolhida/Rejeitada] |

---

## 4. Complete Schema Definition

```sql
-- ============================================================================
-- [SCHEMA NAME] - [Brief Description]
-- Version: 1.0
-- Tables: [X] ([list table names])
-- Pattern: [Design pattern being followed]
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS [schema_name];

-- ============================================================================
-- TABLE 1: [TABLE_NAME] - [Purpose]
-- ============================================================================

CREATE TABLE [schema_name].[table_name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core Fields
  [field_name] [TYPE] [CONSTRAINTS],

  -- Relationships
  [fk_field] UUID REFERENCES [other_schema].[other_table](id) ON DELETE [CASCADE|SET NULL|RESTRICT],

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT [constraint_name] CHECK ([condition]),
  UNIQUE([field1], [field2])
);

-- Indices
CREATE INDEX idx_[table]_[field] ON [schema].[table]([field]) WHERE [condition];
CREATE INDEX idx_[table]_[composite] ON [schema].[table]([field1], [field2]);
CREATE INDEX idx_[table]_[gin] ON [schema].[table] USING GIN([jsonb_field]);

-- Comments
COMMENT ON TABLE [schema].[table] IS '[Detailed table purpose]';
COMMENT ON COLUMN [schema].[table].[field] IS '[Field purpose]';

-- ============================================================================
-- VIEWS
-- ============================================================================

CREATE VIEW [schema].vw_[view_name] AS
SELECT [fields] FROM [schema].[table] WHERE [conditions];

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION [schema].[function_name](
  p_param1 [TYPE],
  p_param2 [TYPE] DEFAULT [default_value]
)
RETURNS [RETURN_TYPE] AS $$
BEGIN
  -- [Function logic]
  RETURN [result];
END;
$$ LANGUAGE plpgsql [STABLE|VOLATILE|IMMUTABLE];

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE [schema].[table] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "[policy_name]" ON [schema].[table]
  FOR [SELECT|INSERT|UPDATE|DELETE]
  TO [authenticated|anon|service_role]
  USING ([condition])
  WITH CHECK ([condition]);
```

---

## 5. Data Migration Plan

### 5.1 Existing Data

**Current State:** [Descrição e volumes atuais]
**Migration Needed:** [Yes | No]

### 5.2 Migration Steps

```sql
-- Step 1: [Description]
-- Estimated time: [X minutes]
-- Risk: [Low | Medium | High]
[SQL statements]
```

### 5.3 Rollback Plan

```sql
-- Emergency rollback
DROP TABLE IF EXISTS [schema].[table_name] CASCADE;
```

---

## 6. API/Application Integration

### 6.1 Required Endpoints

```typescript
interface [RequestType] { [field]: [type]; }
interface [ResponseType] { [field]: [type]; }

async function [functionName](params: [ParamsType]): Promise<[ReturnType]> {
  // [Implementation notes]
}
```

### 6.2 Frontend Changes

- [ ] [Component/page que precisa ser atualizado]
- [ ] [Hook/query que precisa ser criado]

---

## 7. Performance Considerations

### 7.1 Volume Estimates

| Table     | Initial  | 1 Month  | 6 Months | 1 Year   |
| --------- | -------- | -------- | -------- | -------- |
| [table_1] | [X rows] | [Y rows] | [Z rows] | [W rows] |

### 7.2 Query Patterns

**Queries mais frequentes:**

1. [Query pattern 1] - [Frequência]
2. [Query pattern 2] - [Frequência]

**Index Strategy:**

- [Index 1]: [Justification]

### 7.3 Partitioning Strategy

**Partitioning:** [Yes | No | Future]

```sql
CREATE TABLE [table_name] ([fields]) PARTITION BY [RANGE|LIST|HASH] ([partition_key]);
```

---

## 8. Security & Compliance

### 8.1 Data Classification

| Field     | Classification | Justification |
| --------- | -------------- | ------------- | ------------ | ----------- | -------- |
| [field_1] | [Public        | Internal      | Confidential | Restricted] | [Reason] |

### 8.2 Access Control

**RLS Policies:**

- [Policy 1]: [Who can access what]

**Encryption:**

- At-rest: [Strategy]
- In-transit: [Strategy]

### 8.3 Audit Requirements

**Audit Trail:** [Yes | No]
**Retention Period:** [Duration]
**PII Handling:** [Strategy if applicable]

---

## 9. Implementation Plan

### Phase 1: [Phase Name] ([Duration])

**Tasks:**

- [ ] Task 1
- [ ] Task 2

**Success Criteria:**

- [Criteria 1]

---

## 10. Testing Strategy

### 10.1 Unit Tests

```sql
-- Test 1: [Description]
[Test SQL]
```

### 10.2 Performance Tests

| Test     | Load   | Expected Response Time | Pass Criteria |
| -------- | ------ | ---------------------- | ------------- |
| [Test 1] | [Load] | [X ms]                 | [Criteria]    |

---

## 11. Monitoring & Alerts

| Metric        | Alert Threshold | Action   |
| ------------- | --------------- | -------- |
| Table size    | > [X GB]        | [Action] |
| Query latency | > [X ms]        | [Action] |

---

## 12. Cost Impact

| Phase    | Storage | Compute | Total/Month |
| -------- | ------- | ------- | ----------- |
| Initial  | $[X]    | $[Y]    | $[Z]        |
| 6 months | $[X]    | $[Y]    | $[Z]        |

---

## 13. Risks & Mitigations

| Risk     | Likelihood | Impact | Mitigation |
| -------- | ---------- | ------ | ---------- | ----- | --- | ---- | ------------ |
| [Risk 1] | [High      | Med    | Low]       | [High | Med | Low] | [Mitigation] |

---

## 14. Success Criteria

### Technical Success

- [ ] Todas as tabelas criadas sem erros
- [ ] Indexes funcionando corretamente
- [ ] RLS policies enforced
- [ ] Migration concluída com integridade de dados validada
- [ ] Performance benchmarks atingidos

### Business Success

- [ ] [Business metric 1] atingido
- [ ] Criérios de aceitação do usuário atendidos

---

## 15. Approval Sign-off

| Role              | Name | Status                    | Date |
| ----------------- | ---- | ------------------------- | ---- |
| **Architect**     |      | [ ] Approved [ ] Rejected |      |
| **DBA**           |      | [ ] Approved [ ] Rejected |      |
| **Product Owner** |      | [ ] Approved [ ] Rejected |      |

**Comments:** [Espaço para comentários]

---

## Changelog

- **YYYY-MM-DD v1.0:** Initial request

---

## Appendices

### Appendix A: Sample Data

```json
{
  "field1": "value1",
  "created_at": "2026-01-13T10:00:00Z"
}
```
