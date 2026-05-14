# Workflow: Spec Pipeline

**Arquivo de origem nativo:** `.antigravity/workflows/spec-pipeline.md`

O **Spec Pipeline** é a espinha dorsal de planejamento de Produto e Requisitos. Ele converte abstrações humanas baseadas numa reunião ou e-mail nos clássicos PRDs técnicos organizados, desmembrando-os em tickets consumíveis pela equipe de desenvolvedores.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow para:

- Adicionar documentações formais num projeto Greenfield.
- Trazer clareza de negócio e viabilidade técnica antes da construção do ticket 1.
- Validar se a ideia corporativa faz sentido matemático e técnico (Anti-Alucinação).

## 2. A Jornada Operacional (Fases)

### Fase 1: Descoberta e Consolidação Mercadológica (@analyst & @pm)

Havendo tempo, permite-se delegar ao `@analyst` varreduras da web com pesquisas profundas (`search_web`) para sustentar a base argumentativa de uma feature.
Com as balas feitas, o `@pm` amarra e cria a raiz fundamental de governança: O **PRD** (Product Requirements Document), estocando métricas, personas visadas e as premissas em `docs/prd/`. E então impõe-se checkpoint obrigatório com aprovação humana real.

### Fase 2: Choque Arquitetural e Design Restrito (@architect)

O PRD cai nas mãos do `@architect` puro. Diferente de criar o banco de dados, a checagem (`check-prd`) caça "Riscos Ocultos".

> **Integração Exclusiva Antigravity:** Se o PRD clamar massivamente por uma injeção Visual Nova, esse é o trecho onde o `ui-guidelines.yaml` passa a ser forçadamente gerado. Esse arquivo aprisiona a equipe a construir visualmente atrelado ao modelo _Google Stitch_ sem desvios para bibliotecas independentes indesejadas.

### Fase 3: Produção de Embalagens Administrativas (@pm & @sm)

Validada e segura em termos de lógica, a visão é moída:

- `@pm` extrai **Épicos** gigantescamente fechados baseados nos módulos.
- `@sm` consome os Épicos dissecando minuciosamente e cunhando os **Stories** (Tickets de tarefas micro prontas pro codificador), com templates `story-tmpl.yaml`.

### Fase 4: O Abate do Dono do Produto (@po)

Nenhum programador toca numa Story que o `@po` (Auditor de Regras Práticas) não decapitou com o seu check de aderência comercial via `po-master-checklist.md`. Recebendo o Status `>= 7/10`, o backlog vira `READY`.

## 3. Matriz de Entregáveis

- PRD rubricado que lastreia responsabilidade sobre escopo.
- `ui-guidelines.yaml` de front trancando a criatividade sem limites caso ativado.
- Árvore rica populando `/epics/` e `/stories/` prontas pro ciclo SDC.
