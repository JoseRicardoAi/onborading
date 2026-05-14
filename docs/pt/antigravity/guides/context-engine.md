# SYNAPSE Context Engine

O **SYNAPSE** (AffHub Adaptive Processing & State Engine) é o coração pulsante da retenção de memória do Antigravity. Diferente de chats genéricos que esquecem coisas no meio da conversa, o SYNAPSE gerencia um cache rigoroso local dividido em 8 camadas de injeção.

---

## 1. A Estrutura de Arquivos Oculta

Dentro da raiz do seu projeto recide a pasta `.synapse/`. Ela não é apenas um log, é um painel de controle de injetáveis:

```text
.synapse/
├── manifest          # Registro central de chaves
├── constitution      # L0 - Regras invioláveis do servidor
├── global            # L1 - Regras que afetam todos
├── context           # L1 - Instruções sobre o tamanho do contexto
├── agent-*           # L2 - Arquivos escopados (ex: agent-dev)
├── workflow-*        # L3 - Dicas injetáveis do Workflow atual
├── commands          # Comandos Estrela (*) salvos
└── sessions/         # Onde a IDE guarda o cache de troca de mão
```

## 2. A Injeção em 8 Camadas (L0 a L7)

Quando uma ordem é dada ao Antigravity, ele não olha apenas para o seu `.md`. Ele empilha a seguinte cebola mental:

| Camada | Nome          | Função                                                                   |
| ------ | ------------- | ------------------------------------------------------------------------ |
| **L0** | Constitution  | O que ele NUNCA deve fazer (Ex: Apagar DB em prod sem perguntar).        |
| **L1** | Global        | Stack tecnológica (React, Node, etc.).                                   |
| **L2** | Agent-Scoped  | Dicionário do Agente ativo (Heurísticas do @pm, por exemplo).            |
| **L3** | Workflow      | O fluxo atual (Se estamos em `brownfield`, ele carrega dicas de legacy). |
| **L4** | Task          | Instruções milimétricas do arquivo `task.md` atual.                      |
| **L5** | Squad         | Memória coletiva da painel de especialistas acionado.                    |
| **L6** | Session       | Histórico da aba do chat do usuário.                                     |
| **L7** | Star-Commands | Definição operacional caso o usuário tente um atalho.                    |

## 3. Sobrevivência de Tokens (Context Brackets)

Modelos de IA possuem limites de _Context Window_. O arquivo `.synapse/context` atua como um regulador de pressão na IDE:

1. **FRESH (< 30% uso):** O modelo consome todas as camadas livremente (L0 a L7).
2. **MODERATE (30-60% uso):** O sistema comeca a ficar pesado, dropamos camadas cosméticas (mantendo L0-L5).
3. **DEPLETED (60-80% uso):** Alerta amarelo de tokens (corta para L0-L3).
4. **CRITICAL (> 80% uso):** A IDE sugere o hand-off de sessão e apenas injeta a camada Constitution (L0).

Saber manipular a engine de injeção através dos atalhos de `*synapse` permite treinar a IA do seu computador como um cachorro fiel.
