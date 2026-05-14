# Workflow: Brownfield Discovery

**Arquivo de origem nativo:** `.antigravity/workflows/brownfield-discovery.md`

O processo **Brownfield Discovery** é o ponto de entrada estrito e mandatório do Antigravity ao aterrissar em um projeto ou código base legado (já existente). Não se escreve lógica nova sem o Discovery da lógica velha.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow para:

- Adotar um repositório legado construído por ex-funcionários.
- Iniciar uma refatoração em massa.
- Atualizar a documentação arquitetural que caiu em defasagem antes de começar a próxima grande Sprint.

## 2. A Jornada Operacional (Fases)

O processo flui do mapeamento da infraestrutura à catalogação das "armadilhas" de código.

### Passo 1: O Reconhecimento Tático

Agentes consultam o `git log --oneline -20`, `git status` e lêm as branchs ativas para entender a temperatura do repositório no Github/Gitlab.

### Passo 2: Mapeamento Bruto (@architect)

O `@architect` invade as pastas:

- Lista tech-stack real (`package.json`, `pom.xml`, etc).
- Compreende o _design pattern_ atual (ex: Hexagonal, MVC cru).
- Gera o arquivo `docs/architecture/project-structure.md`.

### Passo 3: Auditoria do Banco de Dados (@data-engineer)

Se existir relacional (Postgres/Supabase), o `@data-engineer` é acionado para rodar o comando SQL e extrair as atuais migrations, tabelas orfãs e Row-Level Security Policies falhas, largando tudo em `supabase/docs/SCHEMA.md`.

### Passo 4: Auditoria de Design (@ux)

Caso seja front-heavy, o `@ux` entra caçando UI Tokens, componentes que nunca são reusados, e formata um Relatório de Inconsistência.

### Passo 5: Catalogação de Gotchas (Armadilhas Pata de Urso)

A fase mais vital: A equipe consolida todo "código feio que não pode ser tocado agora porque quebra x" ou "comportamento estranho da V1" dentro da memória do framework no arquivo Json: `.aiox/gotchas.json`. Todos os devs leem isso antes de codar no futuro.

### Passo 6: O Grande Documento

O `@architect` escreve o `docs/architecture/brownfield-architecture.md` unindo todos os relatórios das fases 2, 3, 4 e 5.

## 3. Matriz de Entregáveis

- `brownfield-architecture.md` gerado.
- Banco de dados mapeado.
- Os "Gotchas" (bugs acoplados conhecidos) formalmente guardados na memória JSON dos agentes.
