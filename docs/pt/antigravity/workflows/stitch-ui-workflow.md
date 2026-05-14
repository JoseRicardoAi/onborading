---
description: Pipeline de Geração de UI com Google Stitch
---

# 🎨 Stitch UI Generation Pipeline

Este workflow descreve o processo mandatário para a criação de telas (Web ou Mobile) utilizando a integração MCP com o Google Stitch, garantindo extrema fidelidade visual e consistência arquitetural sem a necessidade do agente "adivinhar" o código da Interface de Usuário.

## 📋 Pré-requisitos (Parametrização Única)

Antes de gerar qualquer tela, o projeto deve possuir seu arquivo de identidade visual configurado. Esta informação é exigida **uma única vez** e serve de guia para todo o ciclo de vida da aplicação.

1. Verifique a existência do arquivo de configuração de identidade visual (ex: `docs/architecture/ui-guidelines.yaml`).
2. Se não existir, o agente ou o usuário **deve** criá-lo contendo as seguintes definições mínimas:
   ```yaml
   ui_guidelines:
     platform: 'web' # ou "mobile"
     script_language: 'TypeScript / React 18' # ou Flutter, Svelte, Vue, etc.
     css_framework: 'TailwindCSS v3' # ou CSS puro, Bootstrap, etc.
     design_system:
       primary_color: '#0F172A'
       secondary_color: '#38BDF8'
       font_family: 'Inter, sans-serif'
       border_radius: '0.5rem'
     component_framework: 'Shadcn UI' # ou DaisyUI, Radix, Cupertino, etc.
   ```

## 🚀 Passo a Passo da Geração (Story Development)

Sempre que a `Story` em execução possuir o escopo de "Frontend" ou "Criação de Tela", o Workflow `story-development-cycle.md` direcionará o trabalho para o **`@ui-builder`**, o agente especialista com o conhecimento nativo do Stitch.

1. **Leitura de Contexto Combinado:**
   - O `@ui-builder` lê os requisitos funcionais descritos na Story selecionada.
   - O `@ui-builder` lê obrigatoriamente o arquivo `ui-guidelines.yaml` carregando as restrições tecnológicas e de design.

2. **Orquestração com o Stitch (Integração MCP):**
   - O agente consolida os dados e interage com a ferramenta do Servidor MCP do **Google Stitch**.
   - **Formato do Prompt:** O agente delega a criação visual através de um prompt detalhado, ex: _"Gere uma tela de [Objetivo da Tela] que obedeça estritamente aos seguintes parâmetros: Framework [Language], Estilos via [CSS Framework], utilizando [Component Framework]. Aplique o design system [cores e fontes]. Os dados e comportamentos funcionais são: [Requisitos da Story]."_

3. **Injeção do Código Gerado:**
   - O código (ou os múltiplos componentes) retornado pelo Stitch é integrado e salvo nos diretórios correspondentes da codebase (ex: `src/app/pages/login/page.tsx`, `lib/screens/login_screen.dart`, etc.).

4. **Refinamento Lógico (Business Logic Binding):**
   - Com a casca visual perfeita já gerada com a tecnologia certa, o `@ui-builder` assume a refatoração final implementando a lógica de negócio.
   - O agente injeta os Hooks de estado, gerenciamento de rotas e as chamadas de API reais (Services/BFFs) nos componentes desenhados pelo Stitch.

5. **Validação de Conformidade (@QA):**
   - O agente QA confere o Pull Request/Commit garantindo que a tecnologia adotada pelo Stitch de fato respeitou o `ui-guidelines.yaml`, impedindo que, por exemplo, o Stitch insira Bootstrap num projeto configurado para TailwindCSS.
