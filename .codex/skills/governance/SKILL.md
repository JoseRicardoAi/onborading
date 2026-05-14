---
name: governance
description: Pré-validação de operações críticas no Codex/AIOX — substitui hooks automáticos por execução proativa antes de ações sensíveis
---

# AIOX Governance Pipeline (AGP)

## Propósito

O AIOX Governance Pipeline (AGP) atua como um mecanismo de segurança para validar e autorizar operações críticas no ambiente Codex/AIOX. Ele substitui hooks automáticos herdados de outros runtimes por uma série de verificações pré-execução (_runtime-like_) implementadas através da invocação proativa de _tasks_ por agentes. O AGP garante aderência a padrões arquiteturais, validação de IDs, controle de autoridade no git, segurança de banco de dados e padronização de estrutura de diretórios.

## Quando Invocar (OBRIGATÓRIO)

Qualquer agente executando as operações listadas na **Tabela de Gatilhos** deve obrigatoriamente invocar esta skill e executar a _task_ de validação correspondente **ANTES** da operação pretendida.

## Tabela de Gatilhos

| Operação                             | Condição                                                     | Task a Executar          | Regra (Config)       |
| ------------------------------------ | ------------------------------------------------------------ | ------------------------ | -------------------- |
| edição/criação de arquivo            | path contém supabase/functions/                              | check-architecture-first | `architecture_first` |
| edição/criação de arquivo            | path contém supabase/migrations/                             | check-architecture-first | `architecture_first` |
| criação de arquivo novo              | path match squads/_/agents/_.md                              | check-mind-clone-dna     | `mind_clone_dna`     |
| run_command                          | contém CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE VIEW... | check-sql-governance     | `sql_ddl`            |
| run_command                          | contém git push                                              | check-git-push-authority | `git_push_authority` |
| run_command                          | contém git worktree add ou git worktree remove               | check-git-push-authority | `git_push_authority` |
| edição/criação de arquivo            | path em docs/ com nome suspeito para o local                 | check-write-path         | `write_path`         |
| Geração de ID/slug/nome              | ID proposto contém hífen, ponto ou maiúsculas                | check-slug-format        | `slug_format`        |

## Como Executar uma Task de Validação

1. Identifique a operação crítica a ser realizada.
2. Consulte a **Tabela de Gatilhos** para encontrar a task apropriada.
3. Obtenha a configuração da regra correspondente lendo o arquivo `.codex/rules/governance-config.md`.
4. Se a configuração estiver como `disabled` para a regra (ou se todo o pipeline `governance_mode` for `disabled`), prossiga imediatamente sem executar a task.
5. Leia a documentação da task associada (`check-{regra}.md` nesta pasta).
6. Execute o "Procedimento de Validação" listado na task usando as ferramentas do ambiente.
7. Aplique o resultado à sua própria execução com base em "Interpretando o Resultado" abaixo.

## Interpretando o Resultado

Após receber o output da task e ler o `governance-config.md` para aquela regra, aja conforme abaixo:

```python
config = ler("governance-config.md")[regra]

if config == "disabled":
    # prosseguir sem validação
    executar_operacao()

resultado = executar(task)

if resultado == ALLOWED:
    # A operação é permitida. Prossiga normalmente sem interromper o fluxo.
    executar_operacao()

elif resultado == REQUIRES_APPROVAL or (resultado == BLOCKED and config == "REQUIRES_APPROVAL"):
    # Crie uma interação de aprovação do usuário. A plataforma efetivamente pausa.
    notify_user(
        BlockedOnUser=True,
        Message=formatar_mensagem_approval(resultado),
        PathsToReview=[]
    )
    # Se usuário aprovou: executar_operacao.
    # Se usuário rejeitou: cancelar e sugerir alternativa.

elif resultado == BLOCKED and config == "BLOCKED":
    # A operação viola políticas vitais e não pode continuar.
    notify_user(
        BlockedOnUser=False,
        Message=formatar_mensagem_blocked(resultado)
    )
    # Retornar/cancelar fluxo de execução
```

## Tasks Disponíveis

- [check-architecture-first.md](check-architecture-first.md) — Valida presença de documentação arquitetural.
- [check-mind-clone-dna.md](check-mind-clone-dna.md) — Exige extração de DNA para mind clones.
- [check-sql-governance.md](check-sql-governance.md) — Requer que alterações em schema ocorram por _migrations_ usando comandos de scaffolding CLI permitidos (ex: `supabase migration new ...`).
- [check-git-push-authority.md](check-git-push-authority.md) — Garante que pushes diretos no Git requeiram autorizações específicas do @devops.
- [check-write-path.md](check-write-path.md) — Valida salvamentos em paths dentro da organização de `/docs`.
- [check-slug-format.md](check-slug-format.md) — Força _snake_case_ sem erros em strings e nomes que servem como identificadores.

## ALWAYS_ALLOWED

Arquivos dentro das seguintes pastas, ou matches absolutos, **não precisam ser validados** pelo `check-architecture-first` (sempre ALLOWED):
`.codex/`, `.synapse/`, `docs/`, `outputs/`, `squads/`, `node_modules/`, `.git/`, `package.json`, `tsconfig.json`, `.env`, `README.md`

## Exemplo de Uso Completo

Um agente do tipo `@data-engineer` é instruído a rodar `run_command` com `psql -d local -c 'CREATE TABLE users...'`.

1. O agente verifica sua tabela de protocolo AGP e vê o uso de operações de restrição DB usando SQL DDL.
2. Invoca a lógica acessando _task_ `check-sql-governance`.
3. A _task_ encontra e marca que `CREATE TABLE` é uma ocorrência restrita e o input avaliado resulta em **RESULT: BLOCKED**.
4. O _config_ em `.codex/rules/governance-config.md` para a regra de `sql_ddl` aponta `BLOCKED`.
5. O agente aborta o processo de rodar a query, retornando na forma de `notify_user` a restrição ocorrida, listando também o motivo explicitado na task (_Ação corretiva: usar "supabase migration new nome-da-tabela" para gerar modelo_).
