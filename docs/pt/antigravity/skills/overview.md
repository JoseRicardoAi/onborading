# Skills — Sistema de Skills

As **13 skills** em `.antigravity/skills/` são capacidades especializadas que qualquer agente pode invocar. Cada skill reside em uma subpasta com um arquivo `SKILL.md` obrigatório.

---

## O que é uma Skill?

Uma skill é um módulo de competência específico. Diferente dos agents (que têm identidade e persona), skills são **instruções funcionais** que enriquecem o que um agente pode fazer quando chamado.

**Formato obrigatório:**

```
.antigravity/skills/
└── {skill-name}/
    └── SKILL.md    ← Frontmatter YAML + instruções markdown
```

**Frontmatter:**

```yaml
---
name: skill-name
description: 'Quando usar esta skill e por quê.'
---
```

---

## Catálogo de Skills

| Skill               | Tipo           | Descrição                                        |
| ------------------- | -------------- | ------------------------------------------------ |
| `clone-mind`        | Orquestração  | Extração de DNA e clonagem de especialistas      |
| `architect-first`   | Processo       | Verificação arquitetural antes de implementar    |
| `enhance-workflow`  | Processo       | Melhorar workflows existentes via roundtable     |
| `checklist-runner`  | Processo       | Executar checklists de qualidade estruturados    |
| `governance`        | Core           | AIOX Governance Pipeline: bloqueia ops sem rules |
| `squad`             | Orquestração  | Criação e gestão de squads                       |
| `synapse`           | Core           | Gerenciamento do engine de contexto `.synapse/`  |
| `flutter-architect` | Domínio       | Arquitetura Flutter com GetIt + Injectable        |
| `stitch-to-flutter` | Domínio       | Conversão UI Stitch para Flutter widgets          |
| `web-ui-reviewer`   | Domínio       | Quality Gate de UI Web pós-Stitch                |
| `coderabbit-review` | Tool-Integration | Execução CodeRabbit CLI via WSL com auto-fix    |
| `skill-creator`     | Orquestração  | Guia para criação de novas skills               |
| `tech-search`       | Tool-Integration | Deep research pipeline com busca concorrente    |

---

## Perfis das Skills

### `clone-mind`

**Localização:** `.antigravity/skills/clone-mind/SKILL.md`

Extração de DNA de especialistas reais para criação de mind clones.

**Quando usar:**

- Ao criar agente baseado em pessoa real
- Quando precisar verificar fidelidade de um mind clone existente
- Para extrair padrões de pensamento de fontes documentadas

**Pipeline:**

```
*collect-sources      → Coletar livros, talks, posts
*extract-voice-dna    → Padrões de comunicação
*extract-thinking-dna → Frameworks e heurísticas
```

**Output:** `mind_dna_complete.yaml` com voice DNA + thinking DNA.

---

### `architect-first`

**Localização:** `.antigravity/skills/architect-first/SKILL.md`

Verificação arquitetural obrigatória antes de tocar em código de infraestrutura.

**Quando usar:**

- Antes de implementar em `supabase/functions/`
- Antes de criar migrations de banco de dados
- Quando não há documentação de arquitetura para a feature

**Fluxo:**

```
1. Verificar docs/architecture/{feature}.md
2. Se não existe: criar primeiro, obter aprovação
3. Então implementar código
```

Implementa a regra constitucional **Architecture First** da governance.

---

### `enhance-workflow`

**Localização:** `.antigravity/skills/enhance-workflow/SKILL.md`

Otimização e melhoria de workflows existentes.

**Quando usar:**

- Ao revisar um workflow que está causando fricção
- Para adicionar gates de qualidade a um processo existente
- Quando handoffs entre agentes estão quebrando

**Análise típica:**

```
→ Mapear passos atuais
→ Identificar pontos de falha
→ Propor melhorias
→ Validar com @pedro-valerio (se disponível)
```

---

### `checklist-runner`

**Localização:** `.antigravity/skills/checklist-runner/SKILL.md`

Execução estruturada de checklists de qualidade.

**Quando usar:**

- QA gates antes de push
- Validação de estrutura de agente (SC_AGT_001, SC_AGT_002)
- Review de PRDs, stories, documentação

**Formato de execução:**

```
[✅] Item 1 — PASSOU
[✅] Item 2 — PASSOU
[❌] Item 3 — FALHOU: {razão}
→ Resultado: X/Y (threshold: Y/Y)
```

---

### `squad`

**Localização:** `.antigravity/skills/squad/SKILL.md`

Criação e gestão completa de squads. No Antigravit, esta skill delega a orquestração pesada para o pack **`squads/squad-creator/`**.

**Quando usar:**

- Criar um novo squad para um domínio
- Adicionar agente a squad existente
- Gerar estrutura de diretórios do squad

**Estrutura gerada:**

```
squads/{squad-name}/
├── agents/          ← Agentes do squad
├── tasks/           ← Tasks especializadas
├── workflows/       ← Workflows do squad
├── data/            ← Data e registry
│   └── minds/       ← DNA de especialistas
└── README.md        ← Documentação do squad
```

---

### `synapse` ← NOVA (exclusiva do Antigravit)

**Localização:** `.antigravity/skills/synapse/SKILL.md`

Gerenciamento do **SYNAPSE Context Engine** — o engine de contexto unificado do AIOX.

**Quando usar:**

- Para entender o estado atual do engine de contexto
- Ao configurar novos domínios de regras
- Para debugar problemas de injeção de contexto
- Ao criar novos star-commands (`*`)

**SYNAPSE é:**

SYNAPSE (AIOX Adaptive Processing & State Engine) gerencia o engine de contexto unificado do AIOX. Opera através de arquivos em `.synapse/` carregados por contexto.

**Comandos da skill:**

| Comando            | O que faz                   |
| ------------------ | --------------------------- |
| `*synapse status`  | Estado atual do engine      |
| `*synapse domains` | Listar domínios registrados |
| `*synapse debug`   | Info de debug detalhada     |
| `*synapse create`  | Criar novo domínio          |
| `*synapse add`     | Adicionar regra a domínio   |
| `*synapse toggle`  | Ativar/desativar domínio    |

**Pipeline de 8 camadas:**

| Camada | Nome          | Descrição                       |
| ------ | ------------- | ------------------------------- |
| L0     | Constitution  | Regras fundamentais invariáveis |
| L1     | Global        | Contexto global do projeto      |
| L2     | Agent-Scoped  | Regras por agente               |
| L3     | Workflow      | Contexto de workflow ativo      |
| L4     | Task          | Contexto da task atual          |
| L5     | Squad         | Contexto do squad ativo         |
| L6     | Session       | Estado de sessão                |
| L7     | Star-Commands | Comandos especiais `*`          |

**Context Brackets** (volume de injeção adaptativo):

| Bracket  | Uso do Context | Camadas Ativas |
| -------- | -------------- | -------------- |
| FRESH    | < 30%          | Todas (L0-L7)  |
| MODERATE | 30-60%         | L0-L5          |
| DEPLETED | 60-80%         | L0-L3          |
| CRITICAL | > 80%          | L0 apenas      |

---

## Como Invocar uma Skill

Skills são invocadas quando um agente precisa de uma capacidade específica. O agente lê o `SKILL.md` da skill antes de executar:

```
"Use a skill clone-mind para extrair o DNA de Seth Godin"
→ Agente lê .antigravity/skills/clone-mind/SKILL.md
→ Segue as instruções documentadas
```

---

## Documentação Relacionada

- [SYNAPSE skill (código fonte)](../../../../.antigravity/skills/synapse/SKILL.md)
- [Workflows](../workflows/overview.md)
- [Mind Clones](../agents/mind-clones.md)

---

## Perfis Adicionais

### `coderabbit-review`

**Localização:** `.antigravity/skills/coderabbit-review/SKILL.md`

Execução centralizada do CodeRabbit CLI para revisão automática de código via WSL.

**Quando usar:**

- Antes de commits (revisão de mudanças não commitadas)
- Durante story review (mudanças commitadas)
- Antes de PRs (comparação contra branch base)

**Self-Healing Loop:** Em caso de issues CRITICAL, executa até 3 tentativas de auto-fix antes de reportar.

---

### `skill-creator`

**Localização:** `.antigravity/skills/skill-creator/SKILL.md`

Guia completo para criar novas skills eficazes. Segue o padrão *Progressive Disclosure* (3 níveis de carregamento).

**Quando usar:**

- Ao criar uma nova skill do zero
- Ao melhorar ou iterar uma skill existente
- Para empacotar e distribuir uma skill

**Processo:** Entender exemplos → Planejar recursos → Inicializar (`init_skill.py`) → Editar SKILL.md → Empacotar → Iterar

---

### `tech-search`

**Localização:** `.antigravity/skills/tech-search/SKILL.md`

Pipeline de pesquisa técnica profunda com busca concorrente. Zero dependências externas (usa `search_web` + `read_url_content` nativos).

**Quando usar:**

- Pesquisa comparativa de tecnologias
- Descoberta de melhores práticas em frameworks
- Benchmarks e documentação técnica atualizada

**Pipeline (6 fases):**

```
*auto-clarify → *decompose (ultrathink) → *concurrent-search → *evaluate → *synthesize → *document
```

**Output:** `docs/research/{YYYY-MM-DD}-{slug}/` com 5 arquivos estruturados.
