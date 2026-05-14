# Task: check-git-push-authority

## Propósito

Garante que apenas perfis DevOps possam alterar repositório remoto ("git push") ou manusear worktrees em ambiente controlado.

## Gatilho

`run_command` com `git push` ou `git worktree add/remove`.

## Input Necessário

- `command`: O comando a ser rodado.
- `active_agent`: Seu ID de Agente Chief/Especialista na sessão.

## Procedimento de Validação

1. Veja no seu prompt qual a sua designação (Ex: `@dev`, `@architect`, `@data-engineer`, `@devops`).
2. Se o agente atual NÃO for `@devops`, pause. O perfil não tem alçada técnica de repositório CI/CD.
3. Se o agente atual É `@devops`, confirme primeiro os Quality Gates passados no código (verificação em base de _linting_, _typecheck_, ou _test suites_ rodadas com sucesso anteriormente).

## Caminhos de Decisão

- Se Agente NÃO É `@devops` e chamou comando → retornar REQUIRES_APPROVAL
- Se Agente É `@devops` e validou Gates localmente primeiro → retornar ALLOWED

## Formato de Output

> A task retorna apenas o resultado. O SKILL.md combina com governance-config.md
> para determinar a ação final (prosseguir / notify_user / bloquear).

RESULT: ALLOWED
Motivo: [...]

— OU —

RESULT: REQUIRES_APPROVAL
Operação: Operação com escopo modificado (git push/worktree) no versionamento de source.
Regra: git_push_authority
Motivo: Agente atual não possui cargo DevOps no seu setup de inicialização. Privilégio negado por default.
Contexto: Evitar commits quebrados de perfis com foco em outras entregas.
Ação se aprovado: O git push/worktree rodará livremente apesar da falha de autoridade.
Alternativa: Delegar permissão através de `→ @devops *push` ou `→ @devops *create-worktree {branch}`.

## Casos de Teste

| Cenário | Input                                                      | Resultado Esperado |
| ------- | ---------------------------------------------------------- | ------------------ |
| 1       | @dev executa "git push origin main"                        | REQUIRES_APPROVAL  |
| 2       | @devops executa "git push" com quality gates ok            | ALLOWED            |
| 3       | @architect executa "git worktree add ../feature feat/nova" | REQUIRES_APPROVAL  |
| 4       | @devops executa "git worktree add ..."                     | ALLOWED            |
| 5       | @dev executa "git commit ..."                              | ALLOWED            |
