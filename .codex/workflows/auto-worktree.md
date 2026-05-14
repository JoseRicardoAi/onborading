---
description: gestão automática de git worktrees — criar, listar, mesclar e remover worktrees para desenvolvimento paralelo de features
---

# Auto Worktree Workflow

Workflow para gestão de Git Worktrees no Codex — permite desenvolvimento paralelo de múltiplas features/stories sem trocar de branch.

## Quando Usar

- Para trabalhar em múltiplas stories/features em paralelo
- Quando é necessário isolar mudanças de branch
- Para criar ambientes de teste isolados por feature

> [!NOTE]
> No Codex, worktrees são gerenciados por comandos git explícitos e validação humana/quality gates. A responsabilidade de criar, mesclar e limpar worktrees é instrucional.

---

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.codex/` e `.aiox-core/` presentes na raiz).
2. NUNCA criar worktrees baseados em diretórios de configuração do framework (`.codex/`, `.aiox-core/`).
3. Todos os comandos git operam na raiz do projeto.

---

## Comandos de Controle

| Comando                     | Descrição                              |
| --------------------------- | -------------------------------------- |
| `*create-worktree {branch}` | Criar novo worktree para o branch      |
| `*list-worktrees`           | Listar worktrees ativos                |
| `*merge-worktree {branch}`  | Mesclar worktree de volta ao main      |
| `*remove-worktree {branch}` | Remover worktree após merge            |
| `*cleanup-worktrees`        | Remover todos os worktrees finalizados |

---

## Step 1: Criar Worktree (@devops)

**Verificar estado atual:**

```bash
git status --short             # Verificar working tree limpa
git branch -a                  # Ver branches existentes
git worktree list              # Ver worktrees ativos
```

**Invocar @devops com Mission: `create-worktree`**

```
Mission: create-worktree
Branch: feat/{feature-name}
Story: {storyId}
Context: Criar worktree isolado para desenvolvimento de {feature}
```

O @devops vai:

```bash
# Criar branch e worktree em paralelo
git worktree add ../aiox-{feature} -b feat/{feature-name}

# Verificar criação
git worktree list
```

Estrutura resultante:

```
./                          ← Repositório principal (main)
../aiox-{feature}/          ← Worktree da feature
```

---

## Step 2: Desenvolvimento no Worktree

O desenvolvimento ocorre normalmente no worktree:

1. Navegar ao worktree: `cd ../aiox-{feature}`
2. Executar story development cycle
3. Commits feitos no worktree ficam no branch `feat/{feature-name}`

```bash
# Verificar em qual worktree está trabalhando
pwd                          # Deve mostrar o path do worktree
git branch --show-current    # Deve mostrar feat/{feature-name}
```

---

## Step 3: Listar Worktrees Ativos

**Invocar @devops com Mission: `list-worktrees`**

```bash
git worktree list --porcelain

# Output esperado:
# worktree /path/to/main
# HEAD {hash}
# branch refs/heads/main
#
# worktree /path/to/aiox-{feature}
# HEAD {hash}
# branch refs/heads/feat/{feature-name}
```

---

## Step 4: QA no Worktree

QA deve ser executado **no contexto do worktree**, não do main:

```bash
# No diretório do worktree
cd ../aiox-{feature}
npm test                    # Testes no isolamento da feature
npm run lint
npm run typecheck
```

---

## Step 5: Merge do Worktree (@devops)

Após QA APPROVED:

**Invocar @devops com Mission: `merge-worktree`**

```
Mission: merge-worktree
Branch: feat/{feature-name}
Strategy: squash | merge | rebase
Context: Mesclar {feature} ao main após QA aprovado
```

O @devops vai:

```bash
# No repositório principal
git checkout main
git merge feat/{feature-name} --no-ff   # ou squash
git push origin main                    # Apenas @devops tem autoridade
```

---

## Step 6: Remover Worktree (@devops)

Após merge confirmado:

**Invocar @devops com Mission: `remove-worktree`**

```bash
# Remover worktree físico
git worktree remove ../aiox-{feature}

# Deletar branch remoto (se aplicável)
git branch -d feat/{feature-name}
git push origin --delete feat/{feature-name}

# Verificar limpeza
git worktree list
```

---

## Múltiplos Worktrees Simultâneos

Para trabalho verdadeiramente paralelo:

```
./                              ← main
../aiox-feat-auth/              ← feat/authentication
../aiox-feat-dashboard/         ← feat/dashboard
../aiox-fix-critical-bug/       ← fix/critical-bug
```

**Regras de convivência:**

- Cada worktree tem seu próprio `node_modules` (instalar separadamente)
- Mudanças em `.aiox/` de um worktree NÃO afetam outros
- Commits em um worktree são isolados do outro

---

## Limpeza Geral (@devops)

**Invocar @devops com Mission: `cleanup-worktrees`**

```bash
git worktree prune             # Remove referências a worktrees deletados
git worktree list              # Verificar estado final
```

---

## Execucao Codex

| Funcionalidade | Execucao Codex |
| --- | --- |
| Criacao | comando git explicito |
| Listagem | `git worktree list` |
| Merge | @devops instrucional |
| Cleanup | `*cleanup-worktrees` |

---

## Resultado Esperado

- Worktree criado e isolado por feature ✅
- Desenvolvimento paralelo sem conflito ✅
- QA executado no isolamento correto ✅
- Merge limpo ao main ✅
- Branch e worktree removidos após merge ✅
