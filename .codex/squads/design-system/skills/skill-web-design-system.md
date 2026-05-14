---
name: 'skill-web-design-system'
description: 'Como aplicar e estruturar telas web do projeto alvo seguindo as diretrizes arquiteturais e o Design System configurado no NotebookLM.'
---
# Skill: Diretrizes de Implementação Frontend Web (Design System Global)

Esta skill é genérica e opera sobre **qualquer projeto** no ambiente Codex/AIOX.
As regras tecnológicas concretas (stack, frameworks, nome das variáveis CSS) são fornecidas pelas seguintes fontes do projeto corrente:

- `{CAMINHO_DO_PROJETO}/docs/architecture/ui-guidelines-web.yaml` — Tokens de Design (cores, tipografia, espaçamentos)
- `{CAMINHO_DO_PROJETO}/docs/architecture/implementation-rules-web.md` — Regras arquiteturais da stack web eleita

> **Onde `{CAMINHO_DO_PROJETO}`** é o caminho raiz do projeto informado pelo usuário no início da sessão.

---

### 0. REGRA MATRIZ: INTEGRAÇÃO DINÂMICA OBRIGATÓRIA (SEMPRE EXECUTE PRIMEIRO)

Antes de construir **qualquer** componente ou tela, o agente **DEVE OBRIGATORIAMENTE** consultar a base de conhecimento dinâmica do projeto atual.

Use a tool `mcp_notebooklm_notebook_query`:
- `notebook_id`: `{{PROJECT_WEB_NOTEBOOK_ID}}` _(variável fornecida no contexto da sessão)_
- `query`: "Quais as regras específicas, restrições e exemplos de uso para o componente [NOME DO COMPONENTE] usando a stack web definida nas diretrizes do projeto?"

> **Como obter o ID do NotebookLM Web:** Solicite ao usuário o ID do notebook que contém as diretrizes do Design System Web do projeto, ou leia o arquivo `docs/architecture/notebook-ids.yaml` no projeto alvo.

**Só após ler essa resposta você pode prosseguir com a geração do código.**

---

### 1. Stack Tecnológica (Lida do Projeto)
A stack do projeto (ex: Angular + ng-zorro, React + shadcn, Vue + Quasar) é definida no arquivo `implementation-rules-web.md` do projeto alvo.
Leia-o ANTES de gerar qualquer código e extraia:
- **Core Framework** (ex: Angular Standalone, React, Vue 3 Composables)
- **Biblioteca de UI** (ex: ng-zorro-antd, shadcn/ui, Quasar)
- **Estratégia de Estilização** (ex: SCSS puro, CSS Modules, CSS-in-JS)
- **Padrões proibidos** (ex: TailwindCSS pode estar banido no projeto)

### 2. Fontes de Verdade (Sempre Relativas ao Projeto)
- **`ui-guidelines-web.yaml`**: É a **fonte única de verdade** inquestionável para todos os tokens de cor (Light/Dark), tipografia, espaçamentos e sombras.
- **`implementation-rules-web.md`**: Contém as restrições arquiteturais e convenções de código.

### 3. Paradigma de Estilização e Temas
- **Regra de Ouro dos Tokens:** **Nunca** declare cores, tamanhos de fonte ou espaçamentos diretamente no código sem mapeá-los para o Design System do projeto.
- **Variáveis CSS:** Use SEMPRE as variáveis definidas no `ui-guidelines-web.yaml` do projeto (prefixo pode variar conforme o projeto, ex: `--project-primary`, `--locar-primary`).
- **Isolamento:** Estilos específicos de tela devem ficar no arquivo de estilo isolado do componente.
- **Alternância de Tema (Light/Dark):** A estratégia de troca de tema será a definida nas regras do projeto.

### 4. Arquitetura de Componentes (Princípios Universais)
- **Responsabilidade Única:** Componentes devem ter foco único. Lógicas complexas devem ser extraídas para camadas de serviço/use-case.
- **Tipagem Forte:** Utilize interfaces/types para contratos de dados. Evite `any` / `dynamic`.
- **Exportações Limpas:** Utilize arquivos de barrel exports quando o framework permitir/recomendar.
- **Inputs rigorosos:** Declare propriedades obrigatórias de forma explícita (ex: `@Input({ required: true })` em Angular, `props: { required: true }` em Vue).

### 5. Acessibilidade (A11y) e Internacionalização (i18n)
- **Acessibilidade mantida:** Ao customizar componentes da biblioteca de UI, **nunca** remova atributos nativos `aria-*`.
- **Idioma/Locale:** Configure o locale do framework/biblioteca de UI conforme definido nas diretrizes do projeto (ex: `pt_BR` para projetos em Português).
- **Tipagem estrita:** Sempre utilize interfaces ao invés do tipo genérico.
