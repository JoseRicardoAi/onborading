# Workflow: Brownfield Fullstack

**Arquivo de origem nativo:** `.antigravity/workflows/brownfield-fullstack.md`

O processo **Brownfield Fullstack** rege como construir funcionalidades novas ou refatorar profundamente sistemas legados sem quebrar tudo em produção.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow para:

- Adicionar features massivas (Backend e Frontend) em um projeto que já perfaz faturamento ou possui usuários ativos.
- Quando seu PRD cruza fronteiras e atinge N camadas de um código monolítico antigo.

> **Regra de Ouro:** Só invoque isso SE o `brownfield-discovery` foi rodado em algum momento nos últimos meses e a arquitetura (`.aiox/gotchas.json`) está fresca.

## 2. A Jornada Operacional (Fases)

### Fase 1: Contexto e Planejamento Respeitoso

1. `@pm` levanta o **Brownfield PRD** focado no Estado Atual (As-Is) antes do Estado Futuro (To-Be).
2. O `@architect` submete esse PRD a um teste de estresse contra a pasta `docs/architecture/`. Ele precisa validar se a feature proposta explode os padrões atuais. Se aprovar, dita a estratégia de integração.

### Fase 2: Spec Fatiado (BD & Visual)

- Se a interface muda, o `@ux` adapta o wireframe tentando **reaproveitar o sistema base** sem forçar a injeção do Tailwind num projeto estritamente Bootstrap.
- Se o DB muda, o `@data-engineer` traça uma migração cega (que nunca envolve comandos DROP em dados de clientes ativos), rodando um KISS-gate de estresse.

### Fase 3: Épicos e Stories

As fatias de construção vão pro painel do `@sm`.

### Fase 4: O Coração do Desenvolvimento (A Lei R.A.C)

Durante as execuções do `@dev` Interactive, é injetada nativamente a Lei do código legado (**REUSE > ADAPT > CREATE**):

- REUSE: Tem no legado? Puxe e não crie novo.
- ADAPT: É 80% parecido com o do legado? Adapte sem quebrar os painéis atuais.
- CREATE: Totalmente novo? Isole em pasta nova bem coesa e escreva o "Por quê".
  Ao terminar o código, o `@qa` testa iterativamente antes do commit final.

## 3. Matriz de Entregáveis

- Novo Épico encaixado de forma modular no bloco monolítico sem causar Regressão visual ou no serviço Rest.
- Commits empacotados garantindo que gotchas do `.aiox/gotchas.json` foram evitados.
