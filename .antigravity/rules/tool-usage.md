---
paths: **/*
---

# Tool Usage Rules — AIOX Antigravity

## Ferramentas Nativas (Tier 1 — Sempre Carregadas)

**SEMPRE prefira ferramentas nativas do Antigravity sobre MCP para operações comuns:**

| Tarefa                        | USE ISSO                     | NÃO USE          |
| ----------------------------- | ---------------------------- | ---------------- |
| Ler arquivos                  | `view_file`                  | MCP equivalentes |
| Criar arquivos                | `write_to_file`              | —                |
| Editar arquivos (bloco único) | `replace_file_content`       | —                |
| Editar múltiplos blocos       | `multi_replace_file_content` | —                |
| Buscar conteúdo               | `grep_search`                | —                |
| Buscar arquivos               | `find_by_name`               | —                |
| Executar comandos             | `run_command`                | —                |
| Browser automation            | `browser_subagent`           | —                |
| Gerar imagens/mockups         | `generate_image`             | —                |
| Ver outline de arquivo        | `view_file_outline`          | —                |
| Ver código específico         | `view_code_item`             | —                |

## Ferramentas Nativas Antigravity 🚀

> Estas ferramentas são exclusivas do ambiente Antigravity — use-as para máxima eficiência!

| Ferramenta                             | Quando Usar                                                           |
| -------------------------------------- | --------------------------------------------------------------------- |
| `browser_subagent`                     | Automação de browser, testes E2E, screenshots, gravação de vídeo WebP |
| `generate_image`                       | Mockups de UI, wireframes, assets visuais                             |
| `mcp_stitch_create_project`            | Criar projeto de design de interface                                  |
| `mcp_stitch_generate_screen_from_text` | Gerar tela de UI a partir de texto                                    |
| `mcp_stitch_edit_screens`              | Editar telas de UI existentes                                         |
| `mcp_stitch_generate_variants`         | Gerar variantes de design                                             |
| `task_boundary`                        | Comunicar progresso de tasks ao usuário                               |
| KI System                              | Memória persistente cross-session                                     |

## MCP Governance

**IMPORTANTE:** Toda gestão de infraestrutura MCP é tratada EXCLUSIVAMENTE pelo **DevOps Agent (@devops)**.

| Operação                | Agente | Comando                |
| ----------------------- | ------ | ---------------------- |
| Listar MCPs disponíveis | DevOps | Verificar configuração |
| Adicionar MCP server    | DevOps | Configuração manual    |
| Remover MCP server      | DevOps | Configuração manual    |

Outros agentes (Dev, Architect, etc.) são **consumidores** de MCP, não administradores.

## MCP Servers Disponíveis

### stitch (Design de Interfaces)

**Use stitch para:**

1. Criar projetos de design de UI/UX
2. Gerar telas e componentes visuais
3. Editar designs existentes
4. Criar variantes de design

**Ferramentas disponíveis:**

```
mcp_stitch_create_project
mcp_stitch_list_projects
mcp_stitch_get_project
mcp_stitch_list_screens
mcp_stitch_get_screen
mcp_stitch_generate_screen_from_text
mcp_stitch_edit_screens
mcp_stitch_generate_variants
```

**Quando usar stitch vs generate_image:**
| Necessidade | Use |
|-------------|-----|
| UI interativa com múltiplos screens | stitch |
| Asset visual simples, ícone, ilustração | generate_image |
| Design system com componentes | stitch |
| Imagem estática como placeholder | generate_image |

## 3-Tier Tool System

| Tier                | Quando Carregado           | Exemplos                                                                   |
| ------------------- | -------------------------- | -------------------------------------------------------------------------- |
| **1** (Sempre)      | Início de sessão           | `view_file`, `write_to_file`, `grep_search`, `run_command`, `find_by_name` |
| **2** (Ativado)     | Por ativação de agente     | `browser_subagent`, `generate_image`                                       |
| **3** (Sob demanda) | Via necessidade específica | `mcp_stitch_*`, outras MCPs                                                |

**Guidelines:**

- Use Tier 1 para operações de arquivo, busca e comandos
- Tier 2 para browser e geração de imagens quando necessário
- Tier 3 MCPs apenas quando explicitamente necessário para a task

## Filtragem de Respostas de Ferramentas

Quando processar respostas de ferramentas MCP ou web fetches grandes, aplique filtragem:

### Tipo: content

Extrair conteúdo informacional principal, descartar ruído. Aplicar a: HTML web pages, resultados de busca.

### Tipo: schema

De um JSON, selecionar APENAS os campos necessários. Aplicar a: respostas de API com schemas conhecidos.

### Tipo: field

De array de objetos, projetar APENAS as colunas necessárias. Aplicar a: resultados de scrapers, dados tabulares.

**Fallback:** Se o filtro removeria TODO o conteúdo, usar resposta completa. Nunca produzir resultado vazio.
