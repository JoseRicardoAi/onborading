# 🗄️ Database Schema Request - Lite Version

**Tipo:** [TABLE | BUCKET | VIEW | RPC FUNCTION | INDEX]
**Nome:** `[schema].[object_name]`
**Priority:** [High | Medium | Low]
**Data:** YYYY-MM-DD

---

## 1. Context & Objective

**Context:**
[1-2 frases sobre o contexto de negócio]

**Objective:**
[O que precisa ser resolvido]

**Scope:**

- **Objects:** [Número de tabelas/views/functions]
- **Expected Volume:** [Estimativa inicial de dados]
- **Integration:** [Tabelas/sistemas relacionados]

---

## 2. Complete Schema

```sql
-- ============================================================================
-- [OBJECT_NAME] - [Purpose]
-- Version: 1.0
-- Pattern: [Padrão similar no sistema existente]
-- ============================================================================

CREATE TABLE [schema_name].[table_name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core Fields
  [field_name] [TYPE] [CONSTRAINTS],

  -- Relationships
  [fk_field] UUID REFERENCES [other_table](id) ON DELETE [CASCADE|SET NULL],

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT [constraint_name] CHECK ([condition])
);

-- Indexes
CREATE INDEX idx_[table]_[field] ON [schema].[table]([field]);

-- Comments
COMMENT ON TABLE [schema].[table] IS '[Purpose]';

-- RLS
ALTER TABLE [schema].[table] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "[policy_name]" ON [schema].[table]
  FOR [SELECT|INSERT|UPDATE|DELETE]
  TO [authenticated|anon|service_role]
  USING ([condition]);
```

---

## 3. Justificativa

**Problem Statement:**
[Descrição clara do problema]

**Why This Is Needed:**
[Por que essa solução é necessária]

**Business Impact:**

- [Impacto 1]
- [Impacto 2]

---

## 4. Dados que NÃO Existem

Prove que os dados necessários não existem em nenhuma tabela atual:

| Data Needed | Current Table | Why It Doesn't Work                       |
| ----------- | ------------- | ----------------------------------------- |
| [Dado 1]    | ✗ None        | Não existe em nenhuma tabela              |
| [Dado 2]    | `[table_x]`   | Tabela X não suporta [reason]             |
| [Dado 3]    | `[table_y]`   | Relacionamento impossível sem nova tabela |

---

## 5. Alternativas Consideradas

| Alternative    | Pros        | Cons           | Decision     |
| -------------- | ----------- | -------------- | ------------ |
| **[Alt 1]**    | [Vantagens] | [Desvantagens] | ❌ Rejeitada |
| **[Alt 2]**    | [Vantagens] | [Desvantagens] | ❌ Rejeitada |
| **[Proposta]** | [Vantagens] | [Desvantagens] | ✅ Escolhida |

**Why Alternatives Don't Work:**

- **Alt 1:** [Explicação detalhada]
- **Alt 2:** [Explicação detalhada]

---

## 6. Impact Analysis

### 6.1 Security

- **RLS:** [Estratégia de Row Level Security]
- **Sensitive Data:** [Yes/No] - [Como será protegido]
- **Access Control:** [Quem pode acessar]

### 6.2 Performance

- **Volume Estimates:**
  - Initial: [X records]
  - 6 months: [Y records]
  - 1 year: [Z records]
- **Query Patterns:** [Queries mais frequentes]
- **Index Strategy:** [Justificativa dos indexes]

### 6.3 Cost

- **Storage:** ~[X MB/GB] inicial, ~[Y GB] em 1 ano
- **Compute Impact:** [Baixo|Médio|Alto]
- **Monthly Cost Estimate:** $[X] (inicial) → $[Y] (1 ano)

---

## 7. Migration & Rollback

### 7.1 Migration Plan

```sql
-- Step 1: Create table
-- Estimated time: [X seconds]
-- Risk: Low

[CREATE TABLE statements]

-- Step 2: Migrate existing data (if applicable)
-- Estimated time: [X minutes]
-- Risk: [Low|Medium|High]

[Migration SQL]
```

### 7.2 Rollback Plan

```sql
-- Emergency rollback (execute in reverse order)

DROP TABLE IF EXISTS [schema].[table_name] CASCADE;

-- Restore data from backup if needed
-- [Backup restoration steps]
```

---

## 8. Integration Points

### 8.1 API Changes Needed

```typescript
// New endpoint or function
interface [TypeName] {
  [field]: [type];
}

async function [functionName](params: [Type]): Promise<[ReturnType]> {
  // [Brief implementation notes]
}
```

### 8.2 Frontend Changes

- [ ] [Component/page que precisa ser atualizado]
- [ ] [Hook/query que precisa ser criado]

---

## 9. Testing Plan

### Quick Tests

```sql
-- Test 1: Basic CRUD
INSERT INTO [table] ([fields]) VALUES ([values]);
SELECT * FROM [table] WHERE [condition];
UPDATE [table] SET [field] = [value] WHERE [condition];
DELETE FROM [table] WHERE [condition];

-- Test 2: RLS
-- (Test as different user roles)

-- Test 3: Performance
EXPLAIN ANALYZE SELECT * FROM [table] WHERE [indexed_field] = [value];
-- Expected: Index Scan, <10ms
```

---

## 10. Success Criteria

- [ ] Table/view/function created without errors
- [ ] Indexes working correctly
- [ ] RLS policies enforced
- [ ] Migration completed successfully
- [ ] Performance tests pass (<[X]ms for common queries)
- [ ] Integration tests pass
- [ ] No data loss or corruption

---

## 11. Approval

**Requested by:** [Seu nome]
**Reviewed by:** [A preencher]
**Status:** ⏳ Awaiting Approval

**Posso prosseguir com a criação deste schema?**

---

## Appendix: Sample Data

```json
{
  "id": "uuid-here",
  "field1": "value1",
  "field2": "value2",
  "created_at": "2026-01-13T10:00:00Z"
}
```
