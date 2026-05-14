# Processo Passo a Passo: Novo Projeto (Greenfield)

Este documento descreve o fluxo operacional de ponta a ponta para a criação de um novo software (Greenfield Fullstack) utilizando o AIOX no ambiente Antigravity. Este processo é orquestrado por uma squad de agentes especialistas.

---

## Fase 0: Inicialização do Ambiente AIOX

Antes do planejamento das squads, o projeto precisa ter o ambiente AIOX configurado em sua raiz.

- **Ação:** O desenvolvedor inicializa o AIOX no diretório do projeto executando o comando de inicialização padrão (`npx aiox init`).
- **Artefatos Gerados:** Criação do diretório `.antigravity/` (ou configuração equivalente via CLI) contendo as regras globais, skills e manifesto local da aplicação para gerenciar a evolução do código.
- **Resultado:** O projeto está pronto para receber interações conversacionais contextuais. Se houver scaffolding de código base (Git, Node, etc), a IA invoca o `@devops`.

---

## Fase 1: Descoberta e Planejamento

Transformamos a ideia inicial em especificações concretas de engenharia.

1.  **Project Brief (@analyst)**: Gera o documento de escopo abrangente (`docs/project-brief.md`) com base na descrição inicial.
2.  **PRD - Product Requirements Document (@pm)**: Define as regras de negócio, épicos e o escopo do MVP (`docs/prd.md`).
3.  **Front-End / UI Spec (@ux)**: Especifica a experiência do usuário e diretrizes visuais (`docs/front-end-spec.md`). Pode incluir wireframes gerados via _Google Stitch MCP_.
4.  **Arquitetura Full-Stack (@architect)**: Define a solução tecnológica, padrões de código e esquema de banco de dados (`docs/fullstack-architecture.md`).
5.  **Quality Gate / Validação (@po)**: O Product Owner valida a coerência de todos os artefatos. O processo só avança com aprovação explícita.

---

## Fase 2: Fragmentação de Documentos (@po)

Para otimizar o desenvolvimento e evitar sobrecarga de contexto:

- **Sharding:** O `@po` fragmenta o PRD em arquivos operacionais menores na pasta `docs/prd/`, incluindo guias de estilo e árvores de diretórios.

---

## Fase 3: Ciclo de Desenvolvimento (SDC)

Iteração sobre cada funcionalidade (Story) do backlog.

1.  **Criação da Story (@sm)**: O Scrum Master gera o descritivo da tarefa com critérios de aceite (AC).
2.  **Análise de Impacto (@architect)**: Valida que a implementação não compromete a integridade do sistema.
3.  **Implementação (@dev ou @ui-builder)**:
    - `@ui-builder`: Focado em interfaces e componentes visuais.
    - `@dev`: Implementa lógica, backend e integrações, garantindo que todos os ACs e testes sejam atendidos.
4.  **QA Review (@qa)**: O agente de QA revisa o código. Se não atender aos critérios, entra no `qa-loop` para correções.
5.  **Commit (@devops)**: Após aprovação do QA, o `@devops` realiza o commit seguindo o padrão _Conventional Commits_.
6.  **Push Final (@devops)**: Após a conclusão do épico ou conjunto de histórias, o `@devops` realiza o push para o repositório remoto.

---

## Resumo do Fluxo de Handoff

`@analyst` → `@pm` → `@ux` → `@architect` → `@po` → (fragmentação) → `@sm` → `@dev` → `@qa` → `@devops`

---

_Documento gerado como guia de referência para execução de novos projetos no AIOX._
