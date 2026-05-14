# Task: Generate Skill Files

**Responsável:** `@skill-architect`
**Gatilho:** `*generate`

## Objetivo
Consolidar a Synapse e o Bloco de Integração no formato final YAML+Markdown exigido pelo modelo AIOX, garantindo a criação estrutural da Skill no ambiente do usuário.

## Instruções de Execução

1. **Revisão Final:** Revise a Synapse aprovada pelo usuário e as Integrações decididas com o `@mcp-specialist`.
2. **Formatação do Artefato:**
   - Crie o arquivo `SKILL.md` dentro da pasta de skills do runtime ativo:
     - Antigravity: `.antigravity/skills/{nome-da-skill}/`
     - Codex: `.codex/skills/{nome-da-skill}/`
   - Adicione o **YAML Frontmatter** com `name` e `description` de forma técnica e objetiva.
   - Escreva a estrutura do Markdown seguindo o padrão de: Propósito, Gatilhos de Ativação, Regras/Escopo, Inteligência de Execução (Passo a Passo) e Ferramentas/Integrações (onde entrarão o NotebookLM e MCPs).
3. **Criação de Recursos Opcionais:**
   - Se o design identificou necessidade, crie os diretórios auxiliares `scripts/`, `references/` ou `assets/` dentro da pasta da skill gerada.
4. **Encerramento:** Informe ao usuário que a Skill foi gerada com sucesso e está pronta para uso!
