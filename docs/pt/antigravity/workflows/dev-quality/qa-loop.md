# Workflow: QA Loop

**Arquivo de origem nativo:** `.antigravity/workflows/qa-loop.md`

O **QA Loop** é o martelo iterativo da Qualidade de Software do Antigravity. Trata-se do círculo infernal de vai-e-volta entre o Bot de Qualidade (`@qa`) e o Bot Desenvolvedor (`@dev`). É invocado não pro primeiro review amigável, mas **quando a implementação quebra e precisa de múltiplos ciclos de correção automáticos**.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow exclusivamente quando:

- O `@qa` dá um belo `REJECT` vermelho em uma Story entregue e devolve uma lista de bugs.
- Para ligar a automação sem precisar interceder humanamente toda hora pedindo pro dev arrumar o PR.

## 2. A Engenharia do Loop (Fases)

### Fase 1: Tracking de Persistência

Para evitar "Alucinação Circular" que ocorre nas LLMs básicas soltas, cria-se imediatamente o state-machine file em `qa/loop-status.json`. O sistema anota que está na Iteração N de no máximo 5 permitidas.

### Fase 2: Tribunal do Código (@qa)

O `@qa` baixa as regras do Acceptance Criteria na mesa e checa estritamente os issues achados.
Ele processa o status com saídas limitadas:

- `APPROVE`: Dá a benção final e encerra o loop.
- `REJECT`: Engrossa a lista de infrações e manda à mesa da cirurgia.
- `BLOCKED`: Acusa um bloqueio técnico irresolvível no momento e trava tudo.

### Fase 3: A Cirurgia Fria (@dev)

Recebido o `REJECT`, o Dev não refaz a task, ele processa **apenas** a lista de fix do QA. A regra central de framework bloqueia a intenção da IA de inflar o código com melhorias que não foram pedidas em cima do escopo de reparo.

### Fase 4: O "If" Limitador

Ao término do reparo, incrementa-se N. Se as inteligências ficarem presas nessa briga de bate e volta e passarem da `Iteração 5`, o Bot de QA não devolve mais para o Dev: ele trava (Trigger: `max_iterations_reached`) e clama por Intervenção Humana via aviso formal com o sumário da briga técnica no `escalation-report.md`.

## 3. Matriz de Entregáveis

- Fixes isolados documentados no status file validando persistência do porquê o código estava quebrando na iteração N.
- Código final chancelado APENAS após varredura do Bot @qa.
- Ou: Ponto de parada duro provando em relatório por que os bots não conseguiram resolver a instrução do ticket.
