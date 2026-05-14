# Tutorial: Ambiente Antigravity - Manutenção, Build e Dinâmicas

> **Versão:** 3.0 | **Atualizado:** 2026-03-31

Este documento fornece um guia passo a passo sobre como configurar o ambiente local do projeto **aiox-antigravity (módulo Antigravity) para contribuição**, baixar dependências, executar builds e verificações. 

Por fim, detalhamos a estrutura e a função da constelação de pastas mestre que guiam o sistema.

## 1. Baixando as Dependências

O ambiente requer **Node.js** (versão 18+) e **npm** (versão 9+). Se você clonou este repositório para estender a aplicação:

1. Abra o terminal na raiz do projeto (onde está o `package.json` do aiox-antigravity).
2. Execute o comando padrão:
   ```bash
   npm install
   ```
3. O pacote instalará bibliotecas de scaffolding e ferramentas base.

---

## 2. Executando o Build e Validações

O projeto atua como um CLI Multiplataforma e Engine Lógica de KIs. O "build" refere-se à validação de qualidade:

1. **Verificação de Tipos:** `npm run typecheck`
2. **Linting Geral:** `npm run lint`
3. **Execução de Testes Unitários:** `npm test`
4. **Sincronização de IDEs:** Garanta que prompts e os Manifestos JSON de Menus (ex: `workflow.meta.json`) estão saudáveis: 
   ```bash
   npm run validate:antigravity-sync
   ```

*(Nota: Para testar localmente como o pacote instalador do Host ficará, execute `npm pack`, gerando um `.tgz` que pode ser usado em uma pasta vazia simulando um usuário novo).*

---

## 3. Dinâmica das Engrenagens

Como a aplicação é executada diretamente no repositório do seu projeto, o contexto inicial já é a raiz onde o comando for executado, limitando o escopo de leitura e otimizando o consumo de tokens. O framework entende o limite do seu código nativamente.

### Interagindo pela IDE (Google Gemini)

1. **Os Menus JSON (Dashboards Automáticos):** 
   Não é necessário procurar qual `.md` engatilha uma criação de front-end. No chat, digite `!workflows`. O motor varrerá o arquivo `.antigravity/workflows/workflow.meta.json` na mesma hora e lhe devolverá as tabelas clicáveis. O mesmo ocorre para o `!squads`.

2. **Invocação de Agentes Puros:** 
   Você chama as mentes com `@` (ex: `@architect qual o banco melhor adaptado pro código na pasta da api?`).

---

## 4. O Cérebro da Matriz (`.antigravity` ou `.aiox`)

Se você for modificar o código-fonte de como o Antigravity "pensa", essa é anatomia a ser alterada:

- **`ANTIGRAVITY.md` (Constituição)**
  Define as blindagens e os Níveis Limnars (L1-L4). 

- **`agents/`**
  Os 28+ prompts de personalidade (Ex: Dex/Dev, Aria/Architect, etc).

- **`rules/`**
  Governança Inteligente (Substitutos dos antigos Hooks em bash/python). Antes de um "git push", por exemplo, regras aqui proibem a operação se o agente não for o `@devops`.

- **`workflows/` e `workflow.meta.json`**
  Arquivos que guiam handoffs. Qualquer workflow novo adicionado à pasta DEVE ser declarado no `meta.json` para refletir no comando `!workflows` automaticamente.

- **`skills/`**
  Especializações como o `clone-mind` e conexões a servidores MCP (ex: Google Stitch).

- **`squads/*/squad.yaml`**
  Pastas com Especialistas (Design Systems, SEO). Para cada time, exige-se o manifesto JSON para garantir que o menu dinâmico `!squads` o liste.

- **`agent-memory/`**
  Persistência e KIs (*Knowledge Items*). As KIs da matriz só gerenciam coisas globais. As KIs de projeto específico residem lá dentro da `aiox/` do Cérebro Local do App.

---

> _Para tutoriais sobre como desenvolver usando a ferramenta pronta, veja os manuais principais. Este documento é o mapa de arquitetos que mantém o ecossistema em funcionamento._
