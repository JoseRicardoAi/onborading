# MEMORY-PROTOCOL — Protocolo de Atualização de MEMORY.md

Guia de referência para os agentes AIOX sobre quando e como atualizar o arquivo `MEMORY.md` de cada projeto.

## O Que é o MEMORY.md

O `MEMORY.md` é o **diário de bordo técnico** de um projeto. Diferente do `gotchas.json` (que registra armadilhas e pegadinhas), o MEMORY.md registra **decisões, aprendizados e contexto histórico** que qualquer agente precisa para entender o presente estado do projeto.

**Localização:** `.aiox/MEMORY.md`

---

## Diferença: MEMORY.md vs gotchas.json

| Critério | MEMORY.md | gotchas.json |
|---|---|---|
| **O que registra** | Decisões, patterns, aprendizados | Armadilhas, pegadinhas, bugs |
| **Tom** | Narrativo, histórico | Imperativo, preventivo |
| **Formato** | Markdown livre (estruturado) | JSON estruturado |
| **Quem lê** | Todos os agentes — especialmente ao retomar | Agente específico ao iniciar missão |
| **Exemplo** | "Escolhemos Zustand em vez de Redux porque…" | "GOTCHA: useEffect não funciona com RSC em Next 15" |

---

## Template de Entrada

```markdown
## [YYYY-MM-DD] — [1 linha descrevendo o que foi feito]

**Decisão:** [o que foi decidido]
**Rationale:** [por que essa decisão foi tomada]
**Alternativas descartadas:** [o que foi considerado e rejeitado, se aplicável]
**Arquivos impactados:** [principais arquivos criados/modificados]
**Agente responsável:** [@agente que tomou a decisão]
```

### Exemplo Preenchido

```markdown
## 2026-03-31 — Escolhido Zustand para state management

**Decisão:** Usar Zustand em vez de Redux para gerenciamento de estado global.
**Rationale:** O projeto tem <5 estados globais. Redux adicionaria boilerplate desnecessário e ~12k de bundle.
**Alternativas descartadas:** Redux Toolkit (overkill), Context API (sem DevTools, re-renders).
**Arquivos impactados:** `src/store/`, `src/hooks/useAppStore.ts`
**Agente responsável:** @architect
```

---

## Quando Atualizar

### Deve atualizar (obrigatório)
- Decisão arquitetural não-trivial tomada
- Bug complexo resolvido (além de um gotcha)
- Mudança de paradigma (ex: migrou de pages router para app router)
- Novo padrão de código estabelecido

### Pode atualizar (recomendado)
- Story finalizada com aprendizado relevante
- Integração com API externa funcionando (documentar quirks)
- Performance improvement significativo

### Não deve atualizar
- Bugs simples já documentados em gotchas.json
- Informações já no PRD ou arquitetura
- Decisões triviais ou óbvias

---

## Quem Atualiza

| Agente | Quando atualiza |
|---|---|
| `@dev` | Após pattern novo ou bug complexo resolvido |
| `@architect` | Após decisão arquitetural ou mudança de design |
| `@data-engineer` | Após migration ou mudança de schema significativa |
| `@qa` | Após bug crítico identificado ou novo padrão de teste |
| `@devops` | Após mudança de infraestrutura ou CI/CD |

---

## Regras de Formatação

1. **Mais recente no topo** — ordem cronológica reversa
2. **Máximo 5 linhas por entrada** — seja conciso
3. **1 entrada por decisão** — não agrupar decisões não relacionadas
4. **Sem duplicação** — não copiar o que já está em `gotchas.json`
5. **Links relativos** — `[arquivo](../../src/arquivo.ts)` para referenciar arquivos

---

## Inicialização do MEMORY.md

Ao criar um novo projeto via greenfield, o Step 0 deve criar o `MEMORY.md` com:

```markdown
# MEMORY — {{PROJECT_NAME}}

Registro de decisões arquiteturais e aprendizados do projeto.
Projeto iniciado em: [data]
Workflow inicial: [workflow usado]
Tech stack: [lista]

---

> As entradas mais recentes ficam no topo desta seção.

```

---

*Protocolo v1.0 | Criado em 2026-03-31*
