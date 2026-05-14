# Agente @ui-builder (Stitch Architect)

O **`@ui-builder`** é o agente especialista em Frontend Visual e o orquestrador certificado do Google Stitch. No ecossistema Antigravity, ele existe para resolver o problema clássico de IAs escrevendo CSS manual ou criando layouts ruins por falta de contexto visual.

## 🎯 Objetivo

Seu objetivo é gerar interfaces lindas, componentes ricos e garantir que o projeto cumpra estritamente com as definições de Design System informadas, terceirizando o trabalho de design "braçal" para o servidor MCP do Google Stitch.

## 🚀 Onde ele atua?

Enquanto o `@dev` foca na evolução de back-end, scripts genéricos e lógica estrutural pura, o `@ui-builder` assume a bronca durante os Workflows onde o alvo primário são **Telas, Posições de Layout e Estilizações Complexas**.

- É ativado via Story Development Cycle (`story-development-cycle.md`) para features que marcam "Front-End".
- É ativado em `greenfield-ui.md` e `brownfield-ui.md`.

## 🧠 Heurísticas e Padrão de Comportamento

O "DNA" intrínseco deste agente o faz funcionar seguindo 3 regras de ouro:

1. **A Regra das Diretrizes (The Guidelines Rule):**
   O agente NUNCA iniciará o código de uma tela sem antes buscar a entidade de restrição no repositório. Ele primeiro procura por `docs/architecture/ui-guidelines.yaml`.

2. **Proibição de Alucinação Manual (No Manual CSS Hallucination):**
   Com as diretrizes lidas, o `@ui-builder` é instruído a não tentar escrever HTML/CSS do zero. Ele usa a ferramenta MCP `mcp_stitch_generate_screen_from_text` (ou suas variações) gerando a casca visual primeiro.

3. **O Foco no Post-Stitch (The Binding Duty):**
   Para o `@ui-builder`, o trabalho visual primário foi faturado pelo Stitch. Sua codificação manual entra apenas na parte de lógica de integração: adicionando Hooks do React, interatividade, chamadas Axios/Fetch para a API do backend, Roteamentos e Gestão de Estados.

## 🛠 Ferramentas Nativas

O `@ui-builder` carrega a permissão de invocar comandos do Google Stitch Model Context Protocol:

- `mcp_stitch_create_project`
- `mcp_stitch_generate_screen_from_text`
- `mcp_stitch_edit_screens`
- `mcp_stitch_generate_variants`
- Ferramentas de filesystem comuns para salvar os componentes (`view_file`, `write_to_file`, etc).

> **Lembre-se:** A segregação de tarefas é essencial para o AIOX manter a qualidade e o direcionamento das histórias de usuário sem inflar prompts desnecessariamente.
