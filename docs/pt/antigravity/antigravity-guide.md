# Guia de Onboarding Definitivo — Antigravity

Bem-vindo ao guia passo-a-passo definitivo para iniciar no ambiente **Antigravity** do AIOX. Este guia foi desenhado para ajudar você a contornar limitações da CLI atual e começar a desenvolver aplicações incríveis imediatamente usando o provedor Gemini.

---

## 1. Instalação e Setup Inicial

A partir das versões mais recentes, o comando `aiox-antigravity init` já configura automaticamente o ambiente `.antigravity/` no seu workspace e a sincronização com as IDEs está habilitada por padrão.

### PASSO A PASSO DA INSTALAÇÃO

1. **Instale o AIOX normalmente no seu diretório:**

   ```bash
   npx aiox-antigravity init meu-projeto
   cd meu-projeto
   ```

   _Nota:_ O diretório `.antigravity/` (incluindo `agents/`, `rules/`, `skills/`, `workflows/`, `templates/` e o arquivo `ANTIGRAVITY.md`) será copiado automaticamente para o seu novo projeto.

2. **Sincronização com a IDE:**
   A sincronização já inclui o perfil do Antigravity nativamente. Execute a validação se necessário:

   ```bash
   npm run validate:antigravity-sync
   ```

---

## 2. Configurando as Chaves da API

Para que o Antigravity utilize as engines de IA e as integrações mais avançadas do ecossistema AIOX (como geradores de interface e pesquisa na web), você precisa garantir que o provider principal seja o Gemini e que a chave de API esteja presente no seu ambiente.

1. Escolha o provider `gemini` sempre que o prompt da IDE ou da CLI perguntar qual modelo será utilizado.
2. Configure sua chave mestra antes de inicializar agentes. No Windows (PowerShell/CMD) ou Unix (bash/zsh):

   ```bash
   # Unix / MacOS
   export GEMINI_API_KEY="sua_chave_gemini_aqui"

   # Windows PowerShell
   $env:GEMINI_API_KEY="sua_chave_gemini_aqui"
   ```

3. Configure as permissões necessárias para a sua extensão ou IDE caso esteja utilizando um ambiente migrado ou modificado do Antigravity Code.

---

## 3. O Primeiro Uso: Executando um Greenfield Fullstack

Agora que as pastas estão copiadas e as chaves de API estão definidas, vamos construir sua primeira aplicação orientada por agentes!

Para acionar a magia do AIOX, seu ponto de partida sempre deve ser acionar o workflow correto na sua IDE.

1. **Abra o painel do seu assistente de IA** na IDE (como o Gemini Code Assist ou terminal interno).
2. **Peça explicitamente pelo workflow Greenfield Fullstack:**
   ```text
   Quero iniciar um projeto novo usando o workflow greenfield-fullstack.
   Vamos construir uma aplicação de lista de tarefas em React e Supabase.
   ```
3. O Antigravity injetará o arquivo `.antigravity/workflows/greenfield-fullstack.md` no contexto de execução.
4. **Observe a cadeia de agentes em ação:**
   - A agente `@analyst` fará um diagnóstico detalhado das suas necessidades.
   - O agente `@pm` criará um Product Requirements Document (PRD).
   - O `@architect` definirá a estrutura Front-end e Back-end.
   - A `@po` vai segmentar a especificação em Stories executáveis usando o arquivo `story-tmpl.yaml`.
   - O `@dev` implementará o código das Stories e a `@qa` testará.

### 3.1. A Trava de Consciência (YOLO Mode vs Squad Padrão)

Se você disparar um gatilho global sem designar uma Squad explicitamente, o Antigravity irá interceptar o seu pedido. Ele alertará sobre o risco do **YOLO Mode** (execução direta e generalista) e oferecerá a opção de ativar dinamicamente a **Squad Padrão**, que executará o ciclo SDC passo-a-passo com todos os agentes acima.

---

## 4. Troubleshooting Comum

**O agente não está respeitando as regras governacionais e de Hook**

- **Causa:** O arquivo `ANTIGRAVITY.md` ou a pasta `rules/` não estão devidamente presentes.
- **Solução:** Verifique se o comando de inicialização criou a estrutura adequadamente ou se a inicialização ocorreu com a versão mais recente e se os arquivos não estão sendo ignorados pelo `.gitignore`.

**"Provider não suportado ou erro de autenticação"**

- **Causa:** Ausência da `GEMINI_API_KEY` rodando num ambiente restrito ou reiniciado.
- **Solução:** O terminal atual pode não ter carregado suas variáveis de ambiente. Exporte a variável novamente (Passo 2).

**O assistente diz que a skill/agente não existe**

- **Causa:** A limitação de contexto do assistente da IDE não carregou o conteúdo da pasta em tempo hábil.
- **Solução:** Invoque explicitamente a leitura do arquivo base. Exemplo: _"Leia as instruções em `.antigravity/skills/synapse/SKILL.md`"_.

---

## 5. Índice de Documentação Antigravity

Abaixo você encontra toda a documentação disponível sobre o ambiente Antigravity, detalhando desde os guias iniciais até a análise profunda de arquitetura e dinâmicas de SDC:

### Guias Essenciais e Introdução
* [Ambiente Antigravity — Visão Geral](index.md)
* [Getting Started — Ambiente Antigravity](getting-started.md)
* [Manual de Usabilidade AIOX-Antigravity](manual-usabilidade-integracao-aiox-antigravity.md)
* [Tutorial: Ambiente Antigravity - Manutenção, Build e Dinâmicas](tutorial-ambiente-antigravity.md)

### Processos e Workflows
* [Workflows — Os 14 Workflows Nativos](workflows/overview.md)
* [Processo Passo a Passo: Novo Projeto (Greenfield)](processo-passo-a-passo-novo-projeto.md)
* [Análise Profunda: Desenvolvimento Tradicional vs. AIOX/Antigravity](comparativo-desenvolvimento-aiox.md)

### Arquitetura, Agentes e Skills
* [Sistema de Agentes — Visão Geral](agents/overview.md)
* [Skills — Sistema de Skills](skills/overview.md)
* [Guia de Criação de Skills (Workflow: create-skill)](skills/create-skill-guide.md)
* [Análise Detalhada: Squads e Agentes no Antigravity](analysis-squads-agents.md)
* [Análise Estratégica: Skills no Antigravity (AIOX)](skills-analysis.md)

### Squads e Pacotes de Especialização
* [Squads & Packs — Modelo de Escalabilidade](squads/overview.md)
* [Gerenciamento de Squads no Antigravity](squads/managing-squads.md)
* [Squad Creator Process](squads/squad-creator-process.md)

### Manuais Específicos
* [Guia Manual: Configuração de Skills com NotebookLM](manual-notebooklm-setup.md)
* [Guia Completo: Criação da Squad Angular/NG-Zorro no AIOX - Antigravity](guia-criacao-squad-angular-ng-zorro.md)
