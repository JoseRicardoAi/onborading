# Workflow: Epic Orchestration

**Arquivo de origem nativo:** `.antigravity/workflows/epic-orchestration.md`

O processo **Epic Orchestration** coordena o paralelismo e a saúde vitalícia de um Épico inteiro. Ele funciona como o guarda de trânsito quando existem 5+ Stories precisando ser construídas com dependências cruzadas (Ex: O banco de dados da Story A precisa existir antes da Tela B da Story B).

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow para:

- Iniciar a operação massiva após o término do workflow `spec-pipeline` (quando o backlog está limpo e documentado).
- Controlar a sequência matemática do que os desenvolvedores/agentes pegarão primeiro.

## 2. A Jornada Operacional (Fases)

### Fase 1: Planejamento Tático (@po)

Nenhum código é escrito até que o `@po` crie a matriz de dependências dentro do `docs/epics/{epic-slug}-execution-plan.md`. Ele mapeia se o sistema de Autenticação precisa obrigatoriamente terminar para a Página de Extrato poder começar.

### Fase 2: O Conceito de Waves (Ondas de Execução)

As Stories não são jogadas em uma única caldeira. Elas são fatiadas em **Waves**:

- **Wave 1:** Stories raiz, sem pais (ex: Setup do JWT).
- **Wave 2:** Stories que clamam existência da Wave 1.

### Fase 3: Looping de Obras

Para cada Story dentro da Wave atual, invoca-se independentemente o Workflow `story-development-cycle` para as IAs codarem sob o escrutínio do `qa-loop`.
Quando a Wave 1 bater o martelo (100% Done) e estiver comitada, os agentes abrem as eclusas para a Wave 2.

### Fase 4: Burocracia de Progresso

O status consolidado do épico fica rodando nativamente na memória em `.aiox/epic-status-{epic-slug}.json`. O `@sm` fica fiscalizando se os agentes engasgaram em alguma Story Bloqueada por mais de 2 dias e exige intervenção no canal de comunicação (escalation).

### Fase 5: Encerramento Final (@po & @devops)

O `@po` valida todos os Acceptance Criterias da soma do Épico. Aprovado, o `@devops` sobe o push para o remote e gera tag de Release.

## 3. Matriz de Entregáveis

- Relatório de Mapeamento de Dependências blindando acoplamentos perigosos iniciais.
- Épico construído linearmente através do agrupamento _Waves_ sem atraso de branches.
- Tagged release cravada no Github/Gitlab.
