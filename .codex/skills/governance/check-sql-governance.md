# Task: check-sql-governance

## Propósito

Evita execuções diretas de SQL DDL que modifiquem o core ou gerem schema drift indesejável.

## Gatilho

`run_command` com bash shell contendo execuções de SQL em raw format, interações com `psql` e heredocs.

## Input Necessário

- `command`: O exato commando script/raw.

## Procedimento de Validação

1. Extraia o conteúdo mentalmente (ex. o interior de `psql -c "X"` ou do bloco HEREDOC) e o converta para UPPERCASE mentalmente para garantir captura via matching indepedente de letras minúsculas.
2. Identifique se o contexto aponta ser leitura segura (exemplo: `SELECT ...`, `pg_dump`, `supabase db push`, `supabase migration`, `information_schema`).
3. Verifique a existência de DDLs proibidos: `CREATE TABLE`, `CREATE VIEW`, `CREATE FUNCTION`, `CREATE TRIGGER`, `ALTER TABLE`, `DROP TABLE`, `DROP VIEW`, `DROP FUNCTION`, `CREATE TABLE AS SELECT`.
4. Decida o caminho correto da task.

## Caminhos de Decisão

- Se comando subjacente usar palavras explicitamente banidas na lista e não tem contexto liberado evidente → retornar BLOCKED
- Outros, incluindo `psql -f migrations`, DML `UPDATE`, ou ferramentas puramente informativas → retornar ALLOWED

## Formato de Output

> A task retorna apenas o resultado. O SKILL.md combina com governance-config.md
> para determinar a ação final (prosseguir / notify_user / bloquear).

RESULT: ALLOWED
Motivo: [...]

— OU —

RESULT: BLOCKED
Motivo: SQL DDL de mutação estrutural inserido via wrapper em linha de comando (risco de Schema Drift).
Regra violada: sql_ddl
Ação corretiva: Reverter e gerar script formolmente através de framework Supabase.
Pipeline sugerido: → supabase migration new {nome-descritivo}

## Casos de Teste

| Cenário | Input                                       | Resultado Esperado |
| ------- | ------------------------------------------- | ------------------ |
| 1       | "psql -c 'CREATE TABLE users (...)'"        | BLOCKED            |
| 2       | "psql -c 'ALTER TABLE users ADD COLUMN...'" | BLOCKED            |
| 3       | "supabase migration new add_users_table"    | ALLOWED            |
| 4       | "psql -c 'SELECT \* FROM users'"            | ALLOWED            |
| 5       | "supabase db push"                          | ALLOWED            |
