# Task: check-architecture-first

## Propósito

Valida se operações de escrita em paths protegidos possuem documentação arquitetural prévia.

## Gatilho

Edição ou criação de arquivos em paths como `supabase/functions/` ou `supabase/migrations/`.

## Input Necessário

- `file_path`: Path do arquivo a ser criado ou editado.

## Procedimento de Validação

1. Verifique se o `file_path` está na lista ALWAYS_ALLOWED: `.codex/`, `.synapse/`, `docs/`, `outputs/`, `squads/`, `node_modules/`, `.git/`, `package.json`, `tsconfig.json`, `.env`, `README.md`.
2. Verifique se o `file_path` corresponde a `supabase/functions/` ou `supabase/migrations/`.
3. Se estiver em um PROTECTED_PATH, extraia o `{nome}` correspondente (ex: de `supabase/functions/{nome}/index.ts`).
4. Verifique a existência de documentos aprovados para o componente, via comando ou ferramenta de listagem em `docs/architecture/{nome}.md` ou `docs/approved-plans/{nome}.md` ou similar.
5. Se o arquivo alvo original (`file_path`) já existe no disco, a operação é uma edição.
6. Avalie o resultado.

## Caminhos de Decisão

- Se Path em ALWAYS_ALLOWED → retornar ALLOWED
- Se arquivo alvo (`file_path`) já existir no disco (edição) → retornar ALLOWED
- Se doc arquitetural no pattern de aprovação for encontrado → retornar ALLOWED
- Se doc não for encontrado e não for edição de arquivo existente → retornar REQUIRES_APPROVAL

## Formato de Output

> A task retorna apenas o resultado. O SKILL.md combina com governance-config.md
> para determinar a ação final (prosseguir / notify_user / bloquear).

RESULT: ALLOWED
Motivo: [...]

— OU —

RESULT: REQUIRES_APPROVAL
Operação: Criação em path protegido ({file_path})
Regra: architecture_first
Motivo: Nenhuma documentação aprovada encontrada para este escopo.
Contexto: A arquitetura e suas regras exigem um PRD ou documento no approval flow.
Ação se aprovado: O arquivo será criado ou substituído sem doc de respaldo.
Alternativa: Crie doc provisório (ex: `docs/approved-plans/plano.md`).

## Casos de Teste

| Cenário | Input                                                                 | Resultado Esperado |
| ------- | --------------------------------------------------------------------- | ------------------ |
| 1       | editar "supabase/functions/payment/index.ts" sem doc          | REQUIRES_APPROVAL  |
| 2       | editar "supabase/functions/payment/index.ts" com doc aprovado | ALLOWED            |
| 3       | editar "docs/architecture/payment.md"                         | ALLOWED            |
| 4       | editar "package.json"                                         | ALLOWED            |
| 5       | Editar arquivo existente em supabase/functions/                       | ALLOWED            |
