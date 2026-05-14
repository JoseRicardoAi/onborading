---
name: 'generate-screen'
description: 'O fluxo padrao da Squad Design System global para gerar telas de interface no Codex com validacao rigorosa pelas diretrizes do projeto alvo.'
---
# Workflow: Gerar Telas de Interface (Design System Global)

Este e o processo obrigatorio que a Squad `design-system` executa quando precisa criar interfaces para **qualquer projeto** no ambiente Codex/AIOX.

> **Pré-requisito obrigatório:** Antes de iniciar, garanta que o caminho raiz do projeto alvo e os IDs dos notebooks do NotebookLM estejam definidos na sessão atual. Se não estiverem, solicite ao usuário.

---

## Passo 0: Inicialização de Contexto (Mandatório)
1. Leia o contrato central do Codex: `AGENTS.md`
2. Leia a camada operacional local: `.codex/CODEX.md`
3. Registre o caminho raiz do projeto alvo informado pelo usuario (ex: `projetos/meu-app/`). Se nao foi informado, solicite agora.
4. Obtenha os IDs do NotebookLM:
   - Leia `{CAMINHO_DO_PROJETO}/docs/architecture/notebook-ids.yaml` (se existir)
   - **ou** solicite ao usuário os IDs `WEB_NOTEBOOK_ID` e/ou `MOBILE_NOTEBOOK_ID`

## Passo 1: Preparação do Contexto da Tela
- Reúna a "Story" ou requisito a ser gerado (ex: "Dashboard Principal", "Tela de Cadastro").
- Leia os arquivos de definição de design do projeto alvo:
- Conteúdo de `{CAMINHO_DO_PROJETO}/docs/architecture/ui-guidelines-web.yaml` (para web)
- Conteúdo de `{CAMINHO_DO_PROJETO}/docs/architecture/ui-guidelines-mobile.yaml` (para mobile)

## Passo 2: Sincronização Dinâmica (Consultar NotebookLM — OBRIGATÓRIO)
O agente **DEVE** executar a consulta ao NotebookLM correspondente à plataforma:

**Para telas Web:**
```
tool: mcp_notebooklm_notebook_query
notebook_id: {{PROJECT_WEB_NOTEBOOK_ID}}
query: "Quais as regras específicas, restrições e exemplos de uso para [componentes da tela, ex: sidebars, cards, tabelas] usando a stack web do projeto?"
```

**Para telas Mobile:**
```
tool: mcp_notebooklm_notebook_query
notebook_id: {{PROJECT_MOBILE_NOTEBOOK_ID}}
query: "Quais as regras específicas, restrições e exemplos de uso para [widgets da tela, ex: cards, listas, botões de ação] usando a stack mobile do projeto?"
```

📌 **A resposta do NotebookLM informa as restrições e padrões reais do projeto antes de gerar o prompt para o Stitch.**

## Passo 3: Delegação e Prompting Stitch
- Solicite ao `@ui-builder` (ou execute diretamente assumindo o papel) a compilação do prompt reflexivo para o Stitch, injetando:
  - A resposta do NotebookLM (regras do projeto atual)
  - As cores, tipografia, border-radius do `ui-guidelines.yaml` do projeto
  - As restrições arquiteturais (ex: banimento de TailwindCSS, framework de estado)
- O prompt Stitch deve mencionar explicitamente estas regras para que a geração seja fiel.

## Passo 4: Geracao no Motor Visual
- Se houver Stitch MCP disponivel no ambiente Codex, invoque a capacidade equivalente de geracao de tela por texto.
- Se nao houver Stitch MCP disponivel, registre a limitacao e gere a interface diretamente com os recursos locais do projeto, preservando as diretrizes de design, tokens, acessibilidade e arquitetura.
- Projete os requisitos definidos nas etapas anteriores.
- Se a saida precisar de polimento, o agente refatora as classes ou codigo retornado.

## Passo 5: QA e Compliance (Validação Estrita)
Passe o código gerado pelo crivo das Rules, checando as restrições lidas nas skills:
- [ ] Confirme ausência de padrões proibidos (ex: `tailwindcss` zero incidências, se banido).
- [ ] Confirme border-radius conforme o `ui-guidelines.yaml` do projeto.
- [ ] Confirme tipografia conforme o `ui-guidelines.yaml` do projeto.
- [ ] Confirme que nenhuma cor hexadecimal está hardcoded (use variáveis CSS/tokens).
- [ ] No mobile: verifique os patterns de gerenciamento de estado definidos nas regras.
- [ ] Confirme que a skill correspondente foi lida e aplicada.
- Se falhar em qualquer ponto, faça refatoração antes de declarar completo.
