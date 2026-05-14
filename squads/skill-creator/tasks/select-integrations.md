# Task: Select Integrations

**Responsável:** `@mcp-specialist`
**Gatilho:** `*integrate`

## Objetivo
Anexar super-poderes externos à Skill por meio da integração de Model Context Protocols (MCPs) e ferramentas disponíveis no runtime AIOX ativo.

## Instruções de Execução

1. **Apresentação de Opções:** Apresente ao usuário as seguintes ferramentas de forma consultiva:
   - **NotebookLM:** Ideal para skills que requeiram ler extensa documentação estática, manuais proprietários e "Company Knowledge".
   - **Context7:** Ideal para integrar a skill a dados externos de negócios e plataformas online dinâmicas.
   - **Stitch:** Ideal para UI.
   - (Mencione que integrações locais como scripts Python/Node já vêm pré-suportadas).
2. **Coleta de Escolha:** Peça para o usuário selecionar as integrações desejadas, justificando ou perguntando caso haja dúvida.
3. **Elaboração Técnica:** Após a decisão do usuário, escreva o "Integration Block" — o texto técnico que comporá a seção `## Tools & Integrations` do `SKILL.md`, ensinando os agentes como usar as ferramentas aprovadas.
4. **Handoff:** Transfira este bloco técnico de volta para o `@skill-architect` iniciar a Geração.
