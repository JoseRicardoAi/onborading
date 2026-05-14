# Tool Input Examples — Selection Guidance

## Purpose

Improve tool selection accuracy by providing concrete input examples for the most-used capabilities within the Codex operational tree. When choosing how to act, match the current task to the correct Codex capability.

## ADR-5 Compliance

These examples apply to Codex execution. Prefer structured Codex tools and repository commands over ad hoc scripting.

## Tool Examples

### read_file_available — Ler conteúdo de arquivo
Use para entender código, documentação ou logs. Evite `cat` no terminal.
- **Ler um arquivo inteiro:** `AbsolutePath: "/path/to/project/src/index.js"`
- **Ler faixa de linhas:** `AbsolutePath: "/path/to/file.md"`, `StartLine: 10`, `EndLine: 50`

### grep_search — Busca de padrões
Use para encontrar onde variáveis, classes ou funções são definidas e usadas.
- **Busca simples de texto:** `Query: "function login"`, `SearchPath: "/path/to/src"`
- **Regex:** `Query: "export const \\w+ ="`, `IsRegex: true`, `SearchPath: "/path/to/src"`
- **Filtrar por extensão:** `Query: "API_URL"`, `SearchPath: ".", `Includes: ["*.ts", "*.js"]`

### edit_file_available — Criar ou sobrescrever arquivos
Use para criar novos componentes, scripts ou testes inteiros.
- **Criar componente:** `TargetFile: "/path/to/src/components/Button.tsx"`, `CodeContent: "..."`
- **Atenção:** Se o arquivo já existir, use `Overwrite: true` APENAS SE quiser apagar todo o conteúdo anterior e substituir pelo novo.

### edit_file_available / multi_edit_file_available — Editar código
Use sempre estas ferramentas no lugar de scripts `sed` ou reescrever arquivos manualmente via shell.
- **Edição simples (substituir bloco único):** Use `edit_file_available` fornecendo o trecho exato de `TargetContent` e o `ReplacementContent`.
- **Múltiplas edições:** Use `multi_edit_file_available` com um array de `ReplacementChunks`.

### run_command — Executar Comandos de Terminal
Use para executar Linting, Testes, Build ou interações Git. **Sempre via `cmd /c` no Windows.**
- **Rodar testes:** `CommandLine: "cmd /c npm test"`, `Cwd: "/path/to/project"`
- **Comandos Git:** `CommandLine: "cmd /c git status"`
- **Verificar tipo (TS):** `CommandLine: "cmd /c npm run typecheck"`

### web_search_available — Buscar informações contextuais recentes
Use quando precisar validar documentação de uma lib externa ou conferir como usar uma versão recente de uma API.
- **Ler documentação:** `query: "site:react.dev server components"`
- **Resolver erro:** `query: "site:github.com/issues nextjs hydration mismatch"`

### visual_generation_optional — Integração Visual (UI Builder)
Use para gerar componentes visuais rapidamente quando houver plugin/MCP disponível no Codex.
- **Gerar Mockup:** `prompt: "Create a modern login screen with email and password fields"`, `projectId: "..."`

## Reference

Tool usage should strictly adhere to `tool-usage.md`. Prefer `apply_patch` for versioned file modifications.
