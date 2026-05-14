# Quick Menu System — Atalhos Interativos de Chat

Esta regra define o comportamento do **Sistema de Menu Rápido** do Antigravity. Quando o usuário digita um dos **gatilhos `!`** no chat, a IA **DEVE** responder com o menu interativo correspondente e **aguardar a escolha** antes de qualquer outra ação.

---

## Por que `!` como prefixo?

Os caracteres `@`, `/` e `#` são interceptados pela camada de UI do Gemini Code Assist antes de chegarem à IA. O `!` não possui função especial em nenhuma interface de IDE conhecida, passando diretamente para o processamento da IA.

| Caractere | Interceptado pela IDE? | Uso no Antigravity |
|---|---|---|
| `@` | ✅ SIM — abre menu nativo de arquivos/agentes | Mantido apenas como convenção textual nos prompts |
| `/` | ✅ PROVÁVEL — slash commands nativos | Mantido apenas como notação em menus |
| `#` | ✅ PROVÁVEL — busca de arquivo/heading | Mantido apenas como notação em menus |
| `*` | ❌ NÃO — passa como texto | Mantido como Star Command dentro de agentes |
| `!` | ❌ NÃO — sem conflito | **Prefixo do Quick Menu System** |

---

## Gatilhos e Menus

### `!agents` — Menu de Agentes
**Quando o usuário digita `!agents` ou `!agentes`:**

```
╔══════════════════════════════════════════════════════╗
║             🤖 AGENTES DO ANTIGRAVITY                ║
╠══════════════════════════════════════════════════════╣
║  CORE AIOX                                           ║
║   @dev           Dex — Implementação de código       ║
║   @architect     Aria — Arquitetura técnica          ║
║   @pm            Morgan — Product Management         ║
║   @po            Pax — Stories e backlog             ║
║   @sm            River — Scrum Master                ║
║   @qa            Quinn — Testes e qualidade          ║
║   @ux            Uma — UX/UI Design                  ║
║   @analyst       Alex — Pesquisa e análise           ║
║   @data-engineer Dara — Database e schema            ║
║   @devops        Gage — CI/CD e git push ⚠️          ║
╠══════════════════════════════════════════════════════╣
║  ESPECIALISTAS GLOBAIS                               ║
║   @squad-chief   Squad Architect — Cria squads       ║
║   @ui-builder    UI Builder — Telas via Stitch       ║
╠══════════════════════════════════════════════════════╣
║  SQUADS (use !squads para ver a lista completa)      ║
║   @web-ds-architect    Design System Web             ║
║   @mobile-ds-architect Design System Mobile          ║
╠══════════════════════════════════════════════════════╣
║  ⚠️ Sempre informe PROJECT_ROOT ao invocar           ║
╚══════════════════════════════════════════════════════╝
Responda com: @<nome-do-agente> <sua instrução>
```

---

### `!commands` — Menu de Star Commands
**Quando o usuário digita `!commands` ou `!comandos`:**

Informe o agente ativo no momento (se houver) e exiba:
```
╔══════════════════════════════════════════════════════╗
║         ⚡ STAR COMMANDS (Ações do Agente)           ║
╠══════════════════════════════════════════════════════╣
║  CICLO DE DESENVOLVIMENTO (SDC)                      ║
║   *draft         Rascunha a story com contexto       ║
║   *validate      Valida critérios de aceitação       ║
║   *develop       Implementa a story atual            ║
║   *qa-gate       Quality gate — PASS/FAIL            ║
║   *push          Git push ⚠️ (exclusivo @devops)     ║
╠══════════════════════════════════════════════════════╣
║  GERENCIAMENTO                                       ║
║   *help          Lista comandos do agente ativo      ║
║   *create-story  Cria nova story de desenvolvimento  ║
║   *task <nome>   Executa task específica             ║
║   *qa-loop <id>  Ciclo de correção QA (máx. 5x)     ║
║   *status        Progresso do épico/workflow atual   ║
║   *exit          Sai do modo agente                  ║
╠══════════════════════════════════════════════════════╣
║  SYNAPSE (Motor de Contexto)                         ║
║   *synapse status          Estado da memória cache   ║
║   *create-worktree <nome>  Cria worktree Git isolado ║
╚══════════════════════════════════════════════════════╝
Responda com: *<comando>
```

---

### `!workflows` — Menu de Workflows
**Quando o usuário digita `!workflows` ou `!workflow`:**

**Regra Mestra de Geração Dinâmica:**
Quando o usuário digita **apenas** `!workflows` ou `!workflow`, você NUNCA deve tentar lembrar de cor os IDs. Você DEVE operar dinamicamente navegando no arquivo de manifesto seguindo estas instruções:

1. Acesse de forma silenciosa e leia o arquivo `.antigravity/workflows/workflow.meta.json`.
2. O arquivo contém uma estrutura de categorias (`categories`). Para CADA categoria iterada no JSON:
   - Exiba o `name` da categoria como Título Markdown (ex: `### 🆕 Projetos Novos (Greenfield)`).
   - Renderize a Tabela de Workflows pertencentes a essa categoria, exibindo as colunas `[Comando]`, `[Workflow]` (id), e `[Descrição]`.
3. Ao fim da exibição agregada das tabelas dinâmicas, pergunte qual script o desenvolvedor deseja executar.
4. Aguarde a resposta.
5. Após o usuário escolher, verifique ativamente a variável global `PROJECT_ROOT`. Se o usuário ainda não a fixou na sessão, VOCÊ DEVE OBRIGATORIAMENTE PERGUNTAR QUAL A RAIZ DO TRABALHO antes de disparar o workflow alvo.

---

### `!squads` — Menu de Squads Globais

**Regra Mestra de Geração Dinâmica (Two-Tier Menu):**
Quando o usuário digita **apenas** `!squads` ou `!squad`, você NUNCA deve cuspir uma lista gravada na sua memória. Você DEVE operar dinamicamente navegando no diretório do projeto seguindo fielmente estas instruções:

**Tier 1: Descoberta de Squads**
1. Oculte o processamento e acesse o diretório `.antigravity/squads/` em tempo real para listar todas as squads ativas (subpastas).
2. Para cada pasta encontrada, abra o arquivo manifesto `squad.meta.json` localizado na raiz dela.
3. Exiba ao usuário a **Tabela de Squads**, uma tabela Markdown estilizada contendo as colunas `[Número]`, `[Nome da Squad]` e `[Descrição da Funcionalidade]` (estes dados vêm diretamente dos campos `id`, `name` e `description` do JSON).
4. No rodapé, pessa para "Digite o Número ou ID da Squad para ver os seus agentes". Aguarde fisicamente a resposta. Nunca exiba o Tier 2 na mesma resposta.

**Tier 2: Drill-down nos Agentes**
5. Após a escolha do usuário pela Squad, acesse o array interno `"agents"` dentro do `squad.meta.json` da squad selecionada.
6. Renderize a **Tabela de Especialistas da Squad**, uma tabela Markdown contendo as colunas `[Comando]`, `[Nome do Perfil]` e `[Expertise de Atuação]`.
7. O usuário deverá responder com o comando final (ex: `@agente-responsavel`).
8. Instancie o Agente escolhido! Lembre-se, caso a variável `PROJECT_ROOT` ainda não saiba qual o aplicativo alvo para o trabalho do agente começar, exija que ela seja informada antes de prosseguir com qualquer geração de código ou arquitetura.

---

## Resumo dos Gatilhos

| Gatilho | Alias | Menu |
|---|---|---|
| `!agents` | `!agentes` | 🤖 Lista de Agentes |
| `!commands` | `!comandos` | ⚡ Lista de Star Commands |
| `!workflows` | `!workflow` | 🔄 Lista de Workflows |
| `!squads` | `!squad` | 🧩 Lista de Squads Globais |

---

## Regras de Comportamento

1. **Gatilho isolado:** O menu é exibido quando a palavra-chave é a **única coisa** na mensagem, ou a primeira palavra seguida de nada mais.
2. **Aguardar escolha:** Após exibir o menu, aguarde a resposta do usuário. NÃO execute nada automaticamente.
3. **Verificar Projeto:** Após qualquer escolha de workflow ou squad, confirmar que o AIOX está instalado na raiz do projeto antes de prosseguir.
4. **Menu contextual de commands:** O menu `!commands` deve indicar o agente ativo no momento para contextualizar quais comandos fazem sentido.
