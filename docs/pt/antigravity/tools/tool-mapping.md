# Mapeamento de Ferramentas — Antigravity → Antigravit

Referência completa das ferramentas disponíveis no Antigravit, incluindo mapeamento a partir do Antigravity Code e **capacidades exclusivas** do Antigravit.

---

## Mapeamento Antigravity Code → Antigravit

| Ferramenta Antigravity  | Ferramenta Antigravit        | Observação                               |
| ------------------ | ---------------------------- | ---------------------------------------- |
| `Read`             | `view_file`                  | Equivalente direto                       |
| `Write`            | `write_to_file`              | Equivalente direto                       |
| `Edit`             | `replace_file_content`       | Edição de bloco único                    |
| `Edit` (múltiplos) | `multi_replace_file_content` | Múltiplas edições não-adjacentes         |
| `Grep`             | `grep_search`                | Busca por padrão em arquivos             |
| `Glob`             | `find_by_name`               | Busca de arquivos por nome/padrão        |
| `WebSearch`        | `search_web`                 | Pesquisa na web                          |
| `WebFetch`         | `read_url_content`           | Leitura de conteúdo de URL               |
| `Bash`             | `run_command`                | Execução de comandos shell               |
| `Task`             | `browser_subagent`           | Casos compatíveis de subagente           |
| ❌ N/A             | `generate_image`             | **Exclusivo Antigravit**                 |
| ❌ N/A             | `mcp_stitch_*`               | **Exclusivo Antigravit** (8 ferramentas) |
| ❌ N/A             | `browser_subagent` completo  | **Exclusivo Antigravit** (com vídeo)     |
| ❌ N/A             | `task_boundary`              | **Exclusivo Antigravit**                 |
| ❌ N/A             | `notify_user`                | **Exclusivo Antigravit**                 |

---

## Ferramentas Nativas (Uso Preferencial)

### Arquivo — Leitura e Escrita

#### `view_file`

Lê o conteúdo de um arquivo. Suporta leitura parcial por intervalo de linhas.

```
view_file(AbsolutePath, StartLine?, EndLine?)
```

> **Regra de governança:** `.antigravity/ANTIGRAVITY.md` e todos os `.antigravity/rules/*.md` devem ser lidos **completos** (sem StartLine/EndLine) quando tomando decisões sobre eles.

#### `write_to_file`

Cria um arquivo novo. Falha se o arquivo já existir (use `Overwrite=true` para sobrescrever).

```
write_to_file(TargetFile, CodeContent, Overwrite?)
```

#### `replace_file_content`

Substitui um bloco **contíguo** de conteúdo em um arquivo existente.

```
replace_file_content(TargetFile, TargetContent, ReplacementContent, StartLine, EndLine)
```

#### `multi_replace_file_content`

Substitui **múltiplos blocos não-adjacentes** em um único arquivo (uma chamada).

```
multi_replace_file_content(TargetFile, ReplacementChunks[])
```

> **Regra:** Prefira `multi_replace_file_content` quando há mais de um bloco não-adjacente a editar. Nunca faça múltiplas chamadas paralelas para o mesmo arquivo.

---

### Busca

#### `grep_search`

Busca por padrão (texto ou regex) dentro de arquivos ou diretórios.

```
grep_search(SearchPath, Query, IsRegex?, CaseInsensitive?, Includes?)
```

#### `find_by_name`

Busca arquivos e diretórios por nome ou padrão glob.

```
find_by_name(SearchDirectory, Pattern, Extensions?, Type?, MaxDepth?)
```

#### `view_file_outline`

Visualiza a estrutura (classes, funções) de um arquivo sem ler o conteúdo completo.

```
view_file_outline(AbsolutePath, ItemOffset?)
```

---

### Execução

#### `run_command`

Executa comandos no shell do sistema (Windows cmd).

```
run_command(CommandLine, Cwd, SafeToAutoRun?, WaitMsBeforeAsync?)
```

> **Autoridade:** Apenas `@devops` executa `git push`. Comandos SQL DDL devem usar `supabase migration` CLI.

---

### Web e URL

#### `search_web`

Pesquisa na web e retorna sumário com citações de URL.

```
search_web(query, domain?)
```

#### `read_url_content`

Lê o conteúdo de uma URL e converte HTML para markdown. Não executa JavaScript.

```
read_url_content(Url)
```

---

## Ferramentas Exclusivas do Antigravit

### `generate_image` ⭐

Gera imagens ou edita imagens existentes a partir de texto.

```
generate_image(Prompt, ImageName, ImagePaths?)
```

**Casos de uso:**

- Mockups de UI para @ux-design-expert
- Assets visuais para @nano-banana-generator
- Ilustrações para documentação
- Variações de identidade visual

**Exemplo:**

```
@ux-design-expert crie um mockup da tela de dashboard principal
→ generate_image("Dashboard moderno com sidebar esquerda, cards de métricas...")
```

---

### `mcp_stitch_*` — Stitch MCP (8 ferramentas) ⭐

Design de interfaces de usuário via Stitch.

| Ferramenta                             | O que faz                              |
| -------------------------------------- | -------------------------------------- |
| `mcp_stitch_create_project`            | Criar novo projeto de design           |
| `mcp_stitch_list_projects`             | Listar projetos existentes             |
| `mcp_stitch_get_project`               | Ver detalhes de um projeto             |
| `mcp_stitch_generate_screen_from_text` | Gerar tela a partir de prompt de texto |
| `mcp_stitch_edit_screens`              | Editar telas existentes                |
| `mcp_stitch_generate_variants`         | Gerar variações de uma tela            |
| `mcp_stitch_list_screens`              | Listar telas de um projeto             |
| `mcp_stitch_get_screen`                | Ver tela específica                    |

**Fluxo típico:**

```
mcp_stitch_create_project(title="Meu App")
→ mcp_stitch_generate_screen_from_text(projectId, prompt="tela de login minimalista")
→ mcp_stitch_generate_variants(projectId, screenIds, prompt="variante dark mode")
```

**Agentes que usam:** `@ux-design-expert`, `@design-chief`, `@design-system`, `@nano-banana-generator`

---

### `browser_subagent` ⭐

Automação de browser com subagente dedicado. Grava sessões em vídeo WebP automaticamente.

```
browser_subagent(TaskName, Task, RecordingName, MediaPaths?, ReusedSubagentId?)
```

**Capacidades:**

- Navegação e interação com páginas web
- Preenchimento de formulários
- Captura de screenshots
- **Gravação automática de vídeo WebP** (único no Antigravit!)
- Pode retomar sessões anteriores via `ReusedSubagentId`

**Exemplo:**

```
browser_subagent(
  TaskName="Testing Login Flow",
  Task="Navegue para localhost:3000, faça login com admin@test.com...",
  RecordingName="login_flow_test"
)
```

**Agentes que usam:** `@qa` (testes de UI), `@sop-extractor` (extração de SOPs de vídeo)

---

### `task_boundary` ⭐

Comunicação estruturada de progresso ao usuário.

```
task_boundary(TaskName, Mode, TaskSummary, TaskStatus, PredictedTaskSize)
```

**Mode:** `PLANNING`, `EXECUTION`, `VERIFICATION`

Usado por todos os agentes ao trabalhar em tarefas complexas. Exibe o progresso em um UI estruturado no chat.

---

### `notify_user` ⭐

Única forma de comunicar com o usuário durante uma task ativa.

```
notify_user(PathsToReview, BlockedOnUser, Message, ShouldAutoProceed)
```

---

### Knowledge Items (KI System) ⭐

Sistema de memória persistente cross-session.

**Localização:** `C:\Users\{user}\.gemini\antigravity\knowledge\`

**Estrutura de cada KI:**

```
{ki-id}/
├── metadata.json    ← Sumário, timestamps, fontes
└── artifacts/       ← Arquivos e documentação
```

**Regra:** Verificar KI summaries **sempre** antes de pesquisar. Evita trabalho duplicado entre sessões.

---

## Prioridade de Uso de Ferramentas

```
1. Ferramentas nativas do Antigravit (view_file, write_to_file, etc.)
2. MCP Stitch (para design UI)
3. run_command (para operações shell)
4. browser_subagent (para automação web)
```

> **Prefer native tools over MCP equivalents** — conforme `.antigravity/rules/tool-usage.md`

---

## Performance — Execução Paralela

O Antigravit suporta chamadas de ferramentas em batch (paralelas). Para operações independentes:

```
✅ Executar em paralelo:
- Múltiplos view_file de arquivos diferentes
- search_web + read_url_content
- Múltiplos write_to_file em arquivos diferentes

❌ Executar em sequência:
- Edições em sequência no mesmo arquivo
- Operações que dependem do resultado de outra
```

---

## Documentação Relacionada

- [Tool Usage Rules](../../../../.antigravity/rules/tool-usage.md)
- [Governance](../rules/governance.md)
- [Getting Started](../getting-started.md)
