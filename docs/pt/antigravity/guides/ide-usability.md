# Usabilidade: Antigravity como a sua IDE Primária

O framework Antigravity **não** é apenas um conjunto longo de instruções no markdown. Foi desenhado para substituir seu uso do VSCode nos fluxos onde o esforço criativo braçal precisa focar na Engenharia de Requisitos. Nós rodamos o agente dentro de terminais potentes e usamos a interface ao nosso favor.

---

## 1. O Fluxo de Trabalho (Daily Drive)

O desenvolvedor sênior Antigravity acorda, abre sua IDE, e em vez de codar um `for loop`, ele abre a conversa com o ambiente instanciado e age como o _Diretor Executivo_.

### A Abordagem via Interface de Conversa

**Você não tecla código, você empilha contexto.**

1. Você usa o chat acionando `@agentes` como pessoas reais: `"@ux analisa a concorrência na página de login e @ui-builder usa o Stitch para prever como faremos a nossa"`.
2. A IDE entra no "Task Mode" gerando caixas de seleção, assumindo que começou a ler `.antigravity/workflows`, ativando o **SYNAPSE**.

### A Abordagem via Terminal

Apesar de parecer uma interface de chat, nós abraçamos comandos rápidos (Star Commands `*`) injetáveis:

- Você insere `*synapse status` e a IDE entende que você mandou printar o estado da memória cache dos agentes ali mesmo no papo.
- Você comanda `*create-worktree novo-painel` e sem perguntar, ele despacha comandos `git` na máquina real usando a skill Sub-Terminal nativa.

## 2. Visão de Documentação (Read Mode vs Execute Mode)

Você precisa manter uma janela onde você lê o andamento dos arquivos `task.md` abertos ao lado direito.
No Antigravity há o acordo cavalheiros da Modificação:
A inteligência artificial **NÃO** fica alterando mil linhas no código fonte principal se o painel `implementation_plan.md` não foi chancelado por você.
O modo como você usa é:

1. Pede planejamento (O agente cria .md)
2. Você inspeciona e comenta "Tire a biblioteca X, use nativo"
3. O agente refaz o `.md`
4. Você emite a flag de permissão. Ele entra em Modo de Execução.

## 3. Lidando com Logs e Falhas (A Regra da Morte Súbita)

A IDE pode falhar devido ao Limite de Contexto.

- Se no console aparecer **"Context Bracket > 80% (CRITICAL)"**, você fisicamente **precisa** forçar o comando de hand-off para abrir uma aba nova de inteligência limpa (Limpando o L6 Session context).
- Se ferramentas como Stitch MCP quebrarem, peça para o próprio `@devtools` investigar o trace log dele sem sair da IDE.

A regra fundamental: A inteligência no sistema Antigravity atua melhor como um bisturi, não uma vassoura. Guie seus sub-agentes fileira por fileira em vez de dar ordens vazias do tipo "Faça um netflix clone completo".
