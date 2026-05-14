# Manual de Usabilidade AIOX-Antigravity (Padrão `.antigravity`)

Este manual é um guia direto e prático sobre como invocar a inteligência do AIOX (AffHub) utilizando **exclusivamente a estrutura padronizada disponível na pasta `.antigravity/`** na raiz do seu repositório.

Toda a interação descrita aqui deve ser feita **via chat (prompt)** com a IA no seu editor, referenciando os arquivos dessa estrutura.

---

## 🏗️ 1. O Ciclo de Vida do Projeto

A ideia central desta arquitetura é que o AIOX é instalado e reside localmente dentro de cada projeto. Isso proporciona autonomia total e isolamento de contexto para a sua aplicação.

### O Fluxo de Trabalho:
1. **Instalação:** Você instala o AIOX via NPM e inicializa a pasta `.antigravity/` no seu projeto.
2. **Evolução:** Você utiliza todo o poder do AIOX (Squads em `.antigravity/squads/`, Skills em `.antigravity/skills/`, e Workflows) interagindo com esse código no chat.
3. **Desenvolvimento Focado:** A IA atua sobre a raiz do projeto de forma contextualizada. O AIOX orquestra as squads correspondentes para a sua aplicação sem vazamento de escopo.

---

## ⚙️ 2. Isolamento de Contexto e Governança

A pasta `.antigravity/` é a porta de entrada para o motor do AIOX no seu projeto. O AIOX armazena metadados exclusivos e o manifesto local da aplicação para gerenciar a evolução do código de forma limpa.

### Context Initialization (A Regra de Ouro)
Como o AIOX atua sobre a raiz do projeto onde foi instalado, as operações são focadas naturalmente na pasta do repositório, o que otimiza o consumo de leitura (Contexto LLM) e garante segurança contra manipulações fora de escopo.

### Como garantir que as regras mestre estão carregadas:
Antes de operações complexas, force o carregamento do manifesto principal, se a IA ainda não o fez.
> **Prompt para copiar e colar:**
> *"Por favor, carregue as heurísticas de comportamento lendo rigorosamente o arquivo `.antigravity/ANTIGRAVITY.md` e verifique as restrições em `.antigravity/rules/`. Atue a partir da raiz do meu repositório para o cumprimento das instruções."*

---

## 🤖 3. Invocando Agentes Nativos do Antigravity

Os agentes nativos vêm pré-configurados e "vivem" na estrutura central do Antigravity, prontos para atuar sobre qualquer arquivo da sua aplicação.

### Invocação Direta de Agentes
Se quiser acionar um perfil padrão (ex: `@architect`, `@dev`, `@qa`):
> **Prompt para copiar e colar:**
> *"Assuma o papel do `@architect` (lendo `.antigravity/agents/aiox-architect.md`). Tendo esse alvo em vista, execute a sua missão de analisar a estrutura e desenhar a arquitetura do banco de dados na pasta do projeto."*

*(Nota: Caso você tenha agentes customizados específicos do projeto, ex: `squads/`, você os referencia diretamente, mas eles herdam a governança central do `.antigravity/ANTIGRAVITY.md`).*

---

## 🎯 4. Injetando Skills Nativas

A pasta `.antigravity/skills/` contém o verdadeiro conhecimento destilado. Essas Skills são ferramentas acionáveis aplicadas no código do seu projeto.

Para amarrar uma skill nativa ou de projeto a uma ação de refatoração:
> **Prompt para copiar e colar:**
> *"Antigravity, atue como desenvolvedor. Preciso que analise os componentes da pasta `src/`, mas ANTES de alterar o seu código local, você DEVE acessar o framework e aplicar rigorosamente os critérios de qualidade da skill localizada em `.antigravity/skills/checklist-runner.md`."*

---

## 🔄 5. Orquestrando Workflows Nativos

A automação de passos ideais de software reside em `.antigravity/workflows/`. Ao invés de pensar repetidamente em como iniciar uma feature num projeto, mande o motor ler o workflow pertinente.

### Como rodar um workflow de arquitetura em um projeto:
> **Prompt para copiar e colar:**
> *"Execute o workflow nativo da engine contido em `.antigravity/workflows/brownfield-discovery.md` para iniciar a leitura da arquitetura, conforme as instruções do próprio workflow."*

---

## 🤝 6. Conectando Squads Globais a Projetos via `notebook-ids.yaml`

Algumas Squads globais (como a `design-system`) utilizam ferramentas externas de IA cujo contexto varia por projeto — por exemplo, o **NotebookLM**. Cada projeto tem seus próprios Notebooks com guidelines de UI específicas. O problema: a squad é global, mas os IDs dos Notebooks são únicos por projeto.

**A solução é o arquivo `notebook-ids.yaml`**, que funciona como uma "ponte" entre a squad global e os recursos externos do projeto.

### Como funciona

```
.antigravity/squads/design-system/   → squad global (não muda)
projetos/locar-ai/
  └── docs/architecture/
        └── notebook-ids.yaml        → IDs dos Notebooks *deste* projeto
```

O workflow da squad lê este arquivo dinamicamente no **Passo 0** para obter os IDs corretos antes de consultar o NotebookLM.

### Criando o `notebook-ids.yaml` para um novo projeto

1. **Copie o template** localizado em `.antigravity/templates/notebook-ids.yaml`.
2. **Cole** em `projetos/[seu-projeto]/docs/architecture/notebook-ids.yaml`.
3. **Preencha** os IDs dos Notebooks criados no NotebookLM seguindo o guia [`manual-notebooklm-setup.md`](./manual-notebooklm-setup.md).

O conteúdo do arquivo segue este formato:

```yaml
notebooklm:
  web:
    notebook_id: 'SEU_ID_DO_NOTEBOOK_WEB'
    notebook_name: '[MeuApp] Design System Web'
    description: 'Stack web e guidelines do projeto'
  mobile:
    notebook_id: 'SEU_ID_DO_NOTEBOOK_MOBILE'
    notebook_name: '[MeuApp] Design System Mobile'
    description: 'Stack mobile e guidelines do projeto'
```

### Ciclo de evolução dos IDs

> **Quando atualizar o `notebook-ids.yaml`?**
> - Ao criar novos Notebooks no NotebookLM (ex: versão 2.0 do Design System).
> - Ao adicionar uma plataforma nova ao projeto (ex: adicionando Mobile a um projeto que era só Web).
> - Ao arquivar um Notebook antigo e criar um substituto.

Os agentes da squad (`@web-ds-architect`, `@mobile-ds-architect`) sempre lerão este arquivo no início de cada sessão de trabalho via o **Passo 0** do workflow `generate-screen.md`. Isso garante que a squad nunca consulte o Notebook errado mesmo após evoluções.

---

## 🚀 7. Exemplo Prático de Integração: Locar.AI Design System

Para demonstrar o poder da ambiente, imagine que o `projetos/locar-ai/` trouxe consigo suas próprias heurísticas de Squad (`design-system`), mas usará o motor central.

Para invocar uma geração de tela end-to-end forçando a integração de **Projeto + Agente Especializado + Motor Antigravity Central**:

> **Mega-Prompt para copiar e colar:**
> 
> *"Aja instantaneamente assumindo o perfil do agente `.antigravity/squads/design-system/agents/@web-ds-architect.md` (Squad Global de Design System). 
>  
> Sua missão primária é atuar dentro do contexto deste projeto. Para isso:
>  
> Regras engatilhadas de execução: 
> 1. Herde o comportamento base lendo `.antigravity/ANTIGRAVITY.md`.
> 2. Leia os IDs dos Notebooks em `docs/architecture/notebook-ids.yaml`.
> 3. Execute o workflow `.antigravity/squads/design-system/workflows/generate-screen.md` para criar do zero a 'Story 2: Gestão de Frota'.
> 4. A skill em `.antigravity/squads/design-system/skills/skill-web-design-system.md` acionará `mcp_notebooklm_notebook_query` com o `PROJECT_WEB_NOTEBOOK_ID` lido do arquivo de configuração.
>  
> Aguardo a execução passo a passo operando unicamente sobre a pasta do repositório."*

---

## ⌨️ 8. Quick Menu System — Atalhos Interativos de Chat

O Antigravity possui um **Sistema de Menu Rápido** com gatilhos `!`. Quando você digita um dos gatilhos abaixo **sozinho** no chat, a IA responde imediatamente com um menu interativo e aguarda sua escolha antes de executar qualquer coisa.

### Por que `!` e não `@`, `/` ou `#`?

| Caractere | Status no Gemini Code Assist | Uso no Antigravity |
|---|---|---|
| `@` | ⛔ Interceptado — abre menu nativo da IDE | Mantido como convenção textual nos prompts |
| `/` | ⛔ Provável conflito — slash commands da IDE | Mantido apenas em notação de menus |
| `#` | ⛔ Provável conflito — heading/busca de arquivo | Mantido apenas em notação de menus |
| `*` | ✅ Passa como texto (sem interceptação) | Mantido como Star Commands de agentes |
| `!` | ✅ Sem conflito em nenhuma IDE | **Prefixo do Quick Menu System** |

> **Regra de funcionamento:** `!agents` (sozinho) → exibe menu. `@dev implementar` → executa diretamente, sem menu.

---

### Os 4 Gatilhos `!`

| Gatilho | Alias | Menu |
|---|---|---|
| `!agents` | `!agentes` | 🤖 Lista de Agentes disponíveis |
| `!commands` | `!comandos` | ⚡ Star Commands do agente ativo |
| `!workflows` | `!workflow` | 🔄 Lista de Workflows |
| `!squads` | `!squad` | 🧩 Lista de Squads Globais |

---

### 8.1 `!agents` — Menu de Agentes

Exibe todos os agentes disponíveis com suas especialidades técnicas.

**A) Agentes Core AIOX (Originais)**

| Comando | Agente | Especialidade Funcional |
|---|---|---|
| `@dev` | Dex | Implementação técnica de código e lógica |
| `@architect` | Aria | Arquitetura de software e design técnico |
| `@pm` | Morgan | Gestão de Produto e elaboração de PRDs |
| `@po` | Pax | Gestão de Backlog e escrita de User Stories |
| `@sm` | River | Scrum Master e facilitação de processos |
| `@qa` | Quinn | Garantia de qualidade e automação de testes |
| `@ux` | Uma | Design de experiência (UX) e interfaces (UI) |
| `@analyst` | Alex | Análise de requisitos e pesquisa de mercado |
| `@data-engineer` | Dara | Modelagem de dados e esquemas de banco |
| `@devops` | Gage | Fluxos de CI/CD e operações Git (⚠️ restrito) |
| `@squad-chief` | Squad Architect | Criação e orquestração de novas squads de IA |

**B) Chiefs (Orquestradores de Domínio)**

| Comando | Agente | Especialidade Funcional |
|---|---|---|
| `@copy-chief` | Jarvis | Redação estruturada e validação do tom de voz |
| `@cyber-chief` | Romanoff | Segurança, compliance e análise de vulnerabilidades |
| `@data-chief` | Strange | Governança mestre e integridade de dados |
| `@design-chief` | Janet | Diretrizes em alto nível de marca e design |
| `@legal-chief` | Murdock | Validação de restrições legais e compliance de software |
| `@story-chief` | Loki | Refinamento narrativo de requisitos funcionais e épicos |
| `@traffic-masters-chief` | Pietro | Otimização de SEO, métricas de tráfego e performance |

**C) Agentes Especiais & Utilitários**

| Comando | Agente | Especialidade Funcional |
|---|---|---|
| `@ui-builder` | UI Builder | Geração acelerada de telas via Stitch MCP |
| `@design-system` | Sentinel | Validação de diretrizes centrais do sistema de design |
| `@db-sage` | Jocasta | Consultoria avançada em otimização de banco de dados |
| `@nano-banana-generator` | Pym | Geração de componentes focados em micro-tarefas |
| `@sop-extractor` | Taskmaster | Extração analítica de Processos Operacionais Padrão (SOPs) |
| `@tools-orchestrator` | Forge | Orquestração e integração sistêmica de ferramentas externas |

**D) Clones de Mentes (Mentoria de Especialistas)**

| Comando | Agente | Especialidade Funcional |
|---|---|---|
| `@brad-frost` | Brad Frost | Componentização de UI utilizando Atomic Design |
| `@dan-mall` | Dan Mall | Design focado em entregáveis acionáveis e valor de negócio |
| `@dave-malouf` | Dave Malouf | Estruturação de processos e fluxo de Design Operations |
| `@oalanicolas` | Oala Nicolas | Extração de DNA comunicacional e fidelidade de persona |
| `@pedro-valerio` | Pedro Valerio | Desenho, controle de workflow e validação de processos |

**E) Agentes de Squads Globais**

| Comando | Agente | Especialidade Funcional |
|---|---|---|
| `@web-ds-architect` | Parker | Design System Web (Angular, React, Vue, etc.) |
| `@mobile-ds-architect` | Danvers | Design System Mobile (Flutter, React Native, etc.) |



---

### 8.2 `!commands` — Menu de Star Commands

Exibe os comandos de ação disponíveis. O menu indica o agente ativo no momento.

**Star Commands do Ciclo de Desenvolvimento:**

| Comando | Função |
|---|---|
| `*draft` | Rascunha a story com contexto do épico |
| `*validate` | Valida critérios de aceitação (GO/NO-GO) |
| `*develop` | Implementa a story atual |
| `*qa-gate` | Quality gate — PASS / CONCERNS / FAIL |
| `*push` | Git push (**exclusivo `@devops`**) |
| `*help` | Lista comandos do agente ativo |
| `*create-story` | Cria nova story de desenvolvimento |
| `*task <nome>` | Executa task específica |
| `*qa-loop <id>` | Ciclo de correção QA (máx. 5 iterações) |
| `*status` | Progresso do épico ou workflow atual |
| `*exit` | Sai do modo agente |

**Star Commands do SYNAPSE:**

| Comando | Função |
|---|---|
| `*synapse status` | Estado atual do cache de memória dos agentes |
| `*create-worktree <nome>` | Cria worktree Git isolado para a feature |

**Ciclo SDC resumido:**
```
@sm *draft → @po *validate → @dev *develop → @qa *qa-gate → @devops *push
```

---

### 8.3 `!workflows` — Menu de Workflows

Exibe todos os workflows disponíveis organizados em tabelas temáticas. Após a seleção, a IA executa o **Passo 0**, solicitando o `PROJECT_ROOT` se não estiver definido para registrar o projeto na Ambiente.

### 🆕 Projetos Novos (Greenfield)
| Comando | Workflow | Descrição |
|---|---|---|
| `[1]` | **greenfield-fullstack** | App full-stack completo do zero |
| `[2]` | **greenfield-service** | Backend ou API pura do zero |
| `[3]` | **greenfield-ui** | Frontend/UI do zero (com ou sem Stitch) |

### 🏗️ Projetos Existentes (Brownfield)
| Comando | Workflow | Descrição |
|---|---|---|
| `[4]` | **brownfield-discovery** | Mapeamento inicial de projeto desconhecido |
| `[5]` | **brownfield-fullstack** | Evoluir um app full-stack legado |
| `[6]` | **brownfield-service** | Evoluir um backend/API legado |
| `[7]` | **brownfield-ui** | Evoluir um frontend/UI legado |

### ⚙️ Ciclo de Desenvolvimento
| Comando | Workflow | Descrição |
|---|---|---|
| `[8]` | **spec-pipeline** | Transformar ideias cruas em PRD e Backlog |
| `[9]` | **epic-orchestration** | Gerenciar e fragmentar épico completo |
| `[10]` | **story-development-cycle**| Implementar uma story específica do início ao fim |
| `[11]` | **qa-loop** | Ciclo rápido de correção interativo (QA ↔ Dev) |

### 🧩 Especialistas e Gestão
| Comando | Workflow | Descrição |
|---|---|---|
| `[12]` | **design-system-build** | Criar ou refatorar Design System |
| `[13]` | **create-squad** | Clonar mentes e criar novo squad de IA |
| `[14]` | **auto-worktree** | Isolar features em desenvolvimento paralelo |
| `[15]` | **factory-gc** | *(Gestão)* Limpar projetos órfãos do registry |
| `[16]` | **export-project** | *(Gestão)* Desacoplar e exportar um projeto |
| `[17]` | **create-skill** | Navegação autônoma e criação inteligente de novas Skills |

### ⚙️ Configuração do Ambiente
| Comando | Workflow | Descrição |
|---|---|---|
| `[18]` | **switch-ide-runtime** | Trocar a IDE/runtime ativa entre Antigravity e Codex |

---

### 8.4 `!squads` — Menu de Squads Globais

Exibe as squads em `.antigravity/squads/`. Após a seleção, a IA solicita `PROJECT_ROOT` e verifica pré-requisitos.

| Squad | Agentes | Pré-requisito |
|---|---|---|
| `design-system` | `@web-ds-architect`, `@mobile-ds-architect` | `notebook-ids.yaml` no projeto |

> Novas squads criadas via `@squad-chief` aparecem automaticamente neste menu.

---

## 🧭 9. Passo a Passo: Como Utilizar o Quick Menu System

Os tutoriais a seguir mostram os fluxos mais comuns de uso do dia a dia dentro do modelo de ambiente Antigravity, usando os gatilhos `!` para navegar sem precisar memorizar nenhum nome de arquivo.

---

### Tutorial 1: Descobrir o que está disponível (primeiros passos)

> **Cenário:** Você abriu o chat com a IA e não sabe por onde começar.

**Passo 1 — Descubra os agentes disponíveis:**
```
!agents
```
A IA exibirá a lista completa de agentes. Leia as especialidades e decida quem você precisa.

**Passo 2 — Descubra os workflows disponíveis:**
```
!workflows
```
A IA exibirá os workflows numerados. Leia as situações e identifique qual se aplica ao seu caso.

**Passo 3 — Veja as squads globais:**
```
!squads
```
A IA exibirá as squads disponíveis e seus pré-requisitos.

> 💡 **Dica:** Você pode usar os três gatilhos em qualquer ordem e a qualquer momento da sessão para se orientar.

---

### Tutorial 2: Iniciar um projeto novo do zero

> **Cenário:** Você tem uma ideia de aplicativo e quer seguir o processo completo da ambiente.

**Passo 1 — Abra o menu de workflows:**
```
!workflows
```

**Passo 2 — Escolha o workflow de greenfield:**
```
1
```
*(ou digite o nome: `greenfield-fullstack`)*

**Passo 3 — A IA perguntará pelo `PROJECT_ROOT`. Informe ou crie a pasta e avise:**
```
A raiz será projetos/meu-novo-app/, pode seguir com a criação.
```

**Passo 4 — A mágica acontece (Gênese da Ambiente):**
O Antigravit executará silenciosamente as obrigações da Ambiente:
1. Criará a pasta `projetos/meu-novo-app/aiox/` fisicamente no seu disco.
2. Gerará os arquivos `project.meta.json`, `gotchas.json` (com escopo isolado) e o `MEMORY.md`.
3. Registrará o seu novo app no mestre `.aiox/registry.json`.

*E a partir daqui o workflow inicia com os bots específicos para engenharia de escopo.*

**Passo 5 — Ao chegar na etapa de implementação, a IA ativará `@dev`. Se quiser ver os comandos disponíveis:**
```
!commands
```

**Passo 6 — Para avançar no ciclo de desenvolvimento:**
```
*develop
```

---

### Tutorial 3: Chamar um agente específico para uma tarefa pontual

> **Cenário:** Você já tem um projeto em andamento e precisa de ajuda com uma tarefa específica de arquitetura.

**Passo 1 — Se não lembrar o nome exato do agente, consulte o menu:**
```
!agents
```

**Passo 2 — Chame o agente diretamente com a instrução (sem abrir menu):**
```
@architect, com PROJECT_ROOT=projetos/locar-ai/, analise o arquivo 
docs/architecture/database-schema.md e sugira melhorias de normalização.
```

**Passo 3 — Com o agente ativo, veja os comandos disponíveis:**
```
!commands
```

**Passo 4 — Execute um comando do ciclo:**
```
*status
```

**Passo 5 — Para sair do modo agente:**
```
*exit
```

---

### Tutorial 4: Acionar uma squad global (Design System)

> **Cenário:** Você quer gerar uma tela nova do Locar.AI seguindo o Design System.

**Passo 1 — Verifique as squads disponíveis:**
```
!squads
```

**Passo 2 — Escolha a squad `design-system`:**
```
design-system
```

**Passo 3 — A IA verificará o pré-requisito `notebook-ids.yaml`. Se existir, ela pedirá o `PROJECT_ROOT`:**
```
PROJECT_ROOT=projetos/locar-ai/
```

**Passo 4 — Ative o agente web da squad:**
```
@web-ds-architect, leia o notebook-ids.yaml do projeto e execute 
o workflow generate-screen para a Story 3: Painel de Relatórios.
```

**Passo 5 — O agente lerá as diretrizes do NotebookLM e criará a tela. Acompanhe e valide o componente gerado.**

---

### Referência Rápida dos Gatilhos

| Digite isto | Para fazer isto |
|---|---|
| `!agents` | Ver todos os agentes e escolher um |
| `!commands` | Ver comandos disponíveis no contexto atual |
| `!workflows` | Ver todos os workflows e iniciar um |
| `!squads` | Ver squads globais e ativar uma |
| `@<agente> <instrução>` | Chamar diretamente um agente (sem abrir menu) |
| `*<comando>` | Executar uma ação de agente (sem abrir menu) |

---

## 📚 Documentação Adicional
- [Manual Prático de Usuário do AIOX](../guides/user-guide.md)
- [Guia de IDE e Usabilidade](./guides/ide-usability.md)
- [A Integração Nativa Arquitetural (.aiox-core vs .antigravity)](../architecture/aiox-antigravity-symbiosis.md)

