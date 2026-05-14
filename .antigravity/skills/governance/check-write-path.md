# Task: check-write-path

## Propósito

Identifica e sugere desvios nas práticas documentais do repositório, garantindo arquivos em pastas corretas.

## Gatilho

`write_to_file` referenciando extensões _.md, _.txt, \*.rst gerenciais no diretório relativo ou subpastas conectadas de projeto, fora de pastas protegidas.

## Input Necessário

- `file_path`: Onde o documento será criado.
- `file_name_hint`: O nome base que serve como indicativo conceitual do arquivo.

## Procedimento de Validação

1. Verifique se path começa com `docs/`. Se sim, prossiga analisando.
2. Analise a semântica de nome do arquivo (`file_name_hint`):
   - Contém "session" ou "handoff": Caminho certo = `docs/sessions/YYYY-MM/`
   - Contém "architecture", "system-design", "infra": Caminho certo = `docs/architecture/`
   - Contém "guide", "tutorial", "how-to": Caminho certo = `docs/guides/`
   - Contém "prd.", "epic", "story": Caminho certo = `docs/projects/{project}/`
3. Compare o uso detectado com o diretório real informado. Se inconsistente, levante alerta.

## Caminhos de Decisão

- Se Path não começar implicitamente por validações de docs (como `outputs/`) ou bater a tabela de rotas obrigatórias de nomenclatura → retornar ALLOWED
- Se path for parte de `docs/` mas for contrário ao formato previsto na tabela anterior → retornar REQUIRES_APPROVAL

## Formato de Output

> A task retorna apenas o resultado. O SKILL.md combina com governance-config.md
> para determinar a ação final (prosseguir / notify_user / bloquear).

RESULT: ALLOWED
Motivo: [...]

— OU —

RESULT: REQUIRES_APPROVAL
Operação: Salvamento de documento inferido como fora da convenção semântica da empresa.
Regra: write_path
Motivo: O path do documento conflita com o padrão de diretórios para o escopo detectado.
Contexto: O arquivo tentado parece tratar da lógica X, que prevê local Y. (WARNING).
Ação se aprovado: Gravar do jeito original especificado, criando possível desordem no arquivo de documentação.
Alternativa: Trocar path na chamada da operação de salvamento usando as convenções corretas.

## Casos de Teste

| Cenário | Input                                   | Resultado Esperado |
| ------- | --------------------------------------- | ------------------ |
| 1       | "docs/architecture/session-hoje.md"     | REQUIRES_APPROVAL  |
| 2       | "docs/sessions/2026-02/session-hoje.md" | ALLOWED            |
| 3       | "docs/guides/architecture-overview.md"  | REQUIRES_APPROVAL  |
| 4       | "docs/architecture/payment-arch.md"     | ALLOWED            |
| 5       | ".antigravity/anything.md"              | ALLOWED            |
