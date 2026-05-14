# Workflow: Auto Worktree

**Arquivo de origem nativo:** `.antigravity/workflows/auto-worktree.md`

O processo **Auto Worktree** rege o desenvolvimento paralelo seguro através de diretórios git isolados. Diferente do Antigravity Code original que tentava gerenciar isso com hooks opacos, o AntiGravity delega essa responsabilidade expressamente ao agente `@devops` e comandos explícitos, garantindo que o chão de ambiente não vire uma bagunça de branches invisíveis.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow para:

- Codificar a `Feature A` e a `Feature B` simultaneamente sem que as quebras de compilação da `A` afetem a `B`.
- Fazer uma correção urgente em produção (`hotfix`) enquanto você tem um épico massivo inacabado na sua pasta local.
- Rodar múltiplos servidores locais em portas diferentes (ex: backend em um worktree, worker em outro).

## 2. A Jornada Operacional (Fases)

### Fase 1: Criação e Bifurcação Física (@devops)

Você inicia invocando o comando `*create-worktree {branch}`. O `@devops` executa no terminal um clone raso associado `git worktree add ../aiox-{feature} -b feat/{feature-name}`.
**Importante:** A pasta nova é criada _um nível acima_ ou em diretório paralelo ao principal, garantindo que o root original continue limpo.

### Fase 2: O Retiro de Desenvolvimento

Os desenvolvedores (como `@dev` e `@qa`) são movidos fisicamente para `cd ../aiox-{feature}`. Tudo o que acontece lá é isolado:

- Novo `node_modules` instalado do zero.
- Testes rodam apenas do que foi tocado lá.
- As anotações do `.aiox/` desse worktree não sujam o projeto mãe.

### Fase 3: A Tribo Retorna (Merge e Limpeza)

Ao bater o martelo com `QA Approved`, você não faz merge ali dentro. O fluxo correto aciona o `@devops` (`*merge-worktree {branch}`), que volta para o diretório `main` (projeto principal), realiza o merge da branch do worktree (podendo aplicar _squash_), e em seguida extermina fisicamente a pasta paralela com `git worktree remove` e o `git branch -d`.

## 3. Matriz de Entregáveis

- Sistema construído em pastas de HD virtuais atreladas ao git (Isolamento de dependências).
- Branches deletadas após o merge para manter a higiene do repositório mãe.
