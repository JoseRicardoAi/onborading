---
description: pipeline completo de spec — PRD, Épico, Stories e validação — do conceito ao backlog ready
---

# Spec Pipeline Workflow

Workflow para criar especificações completas de produto — desde um conceito inicial até stories ready para desenvolvimento.

## Quando Usar

- Para novos produtos ou grandes features (greenfield)
- Ao transformar uma ideia/conceito em backlog estruturado
- Para garantir alinhamento estratégico antes de desenvolvimento

---

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.antigravity/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes.
3. Todas as operações operam na raiz do projeto.

---

## Step 1: Research de Mercado (@analyst — opcional)

Se o conceito precisar de validação de mercado:

**Invocar @analyst com Mission: `market-research` ou `deep-research`**

```
Mission: market-research
Context: Pesquisar viabilidade e contexto de mercado para [conceito]
```

Output: `docs/research/market-research.md`

---

## Step 2: Criação do PRD (@pm)

**Invocar @pm com Mission: `create-prd` ou `create-brownfield-prd`**

```
Mission: create-prd
Template: prd-tmpl.yaml
Context: Criar PRD completo baseado no conceito [X]
```

O @pm vai:

1. Usar template `prd-tmpl.yaml`
2. Criar PRD com: visão, user personas, features, métricas, risks
3. Aplicar `pm-checklist.md` para validação
4. Output: `docs/prd/{slug}-prd.yaml`

**Revisão humana do PRD antes de continuar (checkpoint)**

---

## Step 3: Validação Arquitetural do PRD (@architect)

**Invocar @architect com Mission: `check-prd`**

```
Mission: check-prd
PRD: [path do PRD]
Context: Validar viabilidade técnica e identificar riscos
```

O @architect vai:

1. Analisar PRD para viabilidade técnica
2. Identificar riscos arquiteturais
3. Sugerir abordagem técnica
4. **[Antigravity Exclusivo] Integração Stitch UI:** Se a seção `stitch-ui-guidelines` estiver habilitada no PRD, gerar obrigatoriamente o arquivo `docs/architecture/ui-guidelines.yaml` com as restrições e design system definidos, parametrizando a geração autônoma de interface para as squads futuras.
5. Aprovar ou solicitar revisões

**Se NEEDS_REVISION:** Loop para @pm ajustar PRD.
**Se APPROVED:** Continuar para Step 4.

---

## Step 4: Criação de Épicos (@pm)

**Invocar @pm com Mission: `create-epic`**

```
Mission: create-epic
PRD: [path do PRD]
Context: Criar épicos baseados nas features do PRD
```

O @pm vai:

1. Decompor features do PRD em épicos
2. Definir objetivo e acceptance criteria de cada épico
3. Priorizar épicos por valor/esforço
4. Output: `docs/epics/{slug}-epic-{n}.md`

---

## Step 5: Criação de Stories (@sm)

**Invocar @sm com Mission: `create-story` para cada épico**

```
Mission: create-story
Epic: [path do épico]
Context: Criar stories implementáveis para o épico
```

O @sm vai:

1. Decompor cada épico em stories
2. Usar template `story-tmpl.yaml`
3. Aplicar `story-draft-checklist.md`
4. Output: `docs/stories/{epic-slug}/{story-id}.yaml`

---

## Step 6: Validação de Stories (@po)

**Invocar @po com Mission: `validate-story` para cada story**

```
Mission: validate-story
Story: [path da story]
Context: Validar se story está ready para desenvolvimento
```

O @po vai:

1. Aplicar `po-master-checklist.md` (10 pontos)
2. Emitir GO (>=7/10) ou NO-GO
3. Se GO: Atualizar status para `Ready`
4. Se NO-GO: Enviar de volta para @sm com feedback

---

## Resultado Esperado

- PRD validado e aprovado ✅
- Épicos criados e priorizados ✅
- Stories em status `Ready` no backlog ✅
- Backlog pronto para Sprint Planning ✅

**Próximo passo:** Executar Story Development Cycle (SDC) para cada story em `Ready`.
