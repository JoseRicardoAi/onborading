# Agentes Especiais

Os **4 Agentes Especiais** têm capacidades únicas que vão além das funções convencionais do ciclo de desenvolvimento AIOX.

---

## Visão Geral

| Agente                  | Capacidade Principal                 | Ferramentas Exclusivas                 |
| ----------------------- | ------------------------------------ | -------------------------------------- |
| `design-system`         | Design system completo (36 missões)  | `generate_image`, `mcp_stitch_*`       |
| `tools-orchestrator`    | Criação e review de frameworks/tools | `search_web`, `run_command`            |
| `nano-banana-generator` | Assets visuais em escala             | `generate_image`, `mcp_stitch_*`       |
| `sop-extractor`         | Extração de SOPs de qualquer mídia   | `read_url_content`, `browser_subagent` |

---

## `design-system` — Design System Specialist

**Arquivo:** `.antigravity/agents/design-system.md`

Baseado em **Brad Frost** (full), este agente executa 36 missões diferentes ao longo do ciclo de vida de um design system.

**Fluxo principal:**

```
audit → tokenize → build → document → govern
```

**36 Missões organizadas em fases:**

| Fase         | Missões                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| **Audit**    | Inventory visual existente, identificar inconsistências, mapear componentes |
| **Tokenize** | Criar design tokens, definir sistema de cores, tipografia, spacing          |
| **Build**    | Construir componentes Atomic, criar pattern library                         |
| **Document** | Storybook, usage guidelines, do's & don'ts                                  |
| **Govern**   | Contribution model, review process, versionamento                           |

**Ferramentas:**

```
generate_image      → Exemplos visuais de componentes
mcp_stitch_*        → Prototipagem interativa
```

**Quando ativar:**

```
@design-system faça um audit completo do nosso sistema de design
@design-system tokenize o sistema de cores atual
```

---

## `tools-orchestrator` — Tools & Frameworks Orchestrator

**Arquivo:** `.antigravity/agents/tools-orchestrator.md`

Especialista em **criar, revisar e extrair** frameworks de ferramentas. Opera em 7 domínios.

**7 Domínios:**

1. **Development Tools** — CLI, developer tooling, build systems
2. **AI/ML Tools** — Frameworks de IA, pipelines, modelos
3. **Data Tools** — ETL, warehouses, visualização
4. **DevOps Tools** — CI/CD, monitoramento, infraestrutura
5. **Design Tools** — Design systems, prototipagem, handoff
6. **Documentation Tools** — Wikis, docs-as-code, knowledge bases
7. **Collaboration Tools** — Workflows, async, team processes

**Capacidades:**

- **Review:** Avaliar ferramentas existentes (fit, gaps, alternatives)
- **Create:** Propor frameworks customizados
- **Extract:** Extrair padrões de frameworks populares

**Quando ativar:**

```
@tools-orchestrator avalie se devemos usar Turborepo ou Nx no monorepo
@tools-orchestrator crie um framework de avaliação de ferramentas de IA
```

---

## `nano-banana-generator` — Asset Visual Generator

**Arquivo:** `.antigravity/agents/nano-banana-generator.md`

Agente especializado em **geração de assets visuais em escala**. Combina `generate_image` com Stitch MCP para produção em série.

**Casos de uso:**

- Ícones e ilustrações de produto
- Mockups de telas e widgets
- Assets de marketing (banners, thumbnails, social)
- Variações de identidade visual
- Protótipos visuais rápidos

**Fluxo de trabalho:**

```
1. Receber brief visual (estilo, paleta, dimensões)
2. Gerar variações com generate_image
3. Refinar with mcp_stitch_* se necessário
4. Entregar conjunto de assets organizados
```

**Quando ativar:**

```
@nano-banana-generator crie 6 variações de banner para campanha de email
@nano-banana-generator gere ícones para as seções do dashboard
```

---

## `sop-extractor` — SOP Extractor

**Arquivo:** `.antigravity/agents/sop-extractor.md`

Extrai **Standard Operating Procedures (SOPs)** a partir de qualquer fonte de conhecimento.

**Fontes suportadas:**

- 📹 **Vídeos** (YouTube, Loom, gravações) — via URL
- 📚 **Livros e PDFs** — descrição ou extrato
- 🎙️ **Entrevistas** — transcrições ou notas
- 🌐 **Páginas web** — artigos, posts, docs

**Output típico:**

```yaml
sop:
  name: 'Como fazer X'
  trigger: 'Quando Y acontece'
  steps:
    - step: 1
      action: 'Fazer A'
      condition: 'Se B, então C'
  checkpoints:
    - 'Verificar resultado de A'
  owner: 'Role responsável'
```

**Quando ativar:**

```
@sop-extractor extraia um SOP deste vídeo de apresentação de processo: [URL]
@sop-extractor crie um SOP a partir deste livro: "Getting Things Done" capítulo 3
```
