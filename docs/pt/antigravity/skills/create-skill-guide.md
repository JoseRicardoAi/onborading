# Guia de Criação de Skills (Workflow: create-skill)

O processo de criação de Skills no ecossistema AIOX Antigravity evoluiu. Agora, você pode utilizar o **Skill Creator Squad**, um fluxo de trabalho orquestrado e automatizado para gerar novas Skills com inteligência de mercado, design estratégico (Synapse) e integrações avançadas.

---

## 🚀 Como Iniciar

Você pode iniciar o gerador de Skills chamando-o diretamente do menu de workflows ou através do comando:

```
!workflows
```
Selecione a opção **`[17] create-skill`** no menu (Especialistas e Gestão).

---

## 🧩 O Ciclo de Vida da Criação

O workflow `create-skill` é dividido em 4 etapas principais, geridas por agentes especialistas.

### 1. ELICITATION (Descoberta)
O agente `@skill-architect` conversará com você para entender a motivação, o domínio e o objetivo principal da nova Skill que deseja criar. 

### 2. WEB RESEARCH (Pesquisa Autônoma)
A mágica começa com o `@skill-researcher`. Diferente de criações "vazias", este agente fará **navegação autônoma na internet**.
- **O que ele busca?** Padrões da indústria, melhores fluxos de trabalho, ferramentas utilizadas e armadilhas (gotchas) referentes ao assunto que você definiu.
- **O que ele gera?** Um mapa de inteligência sobre como a tarefa deve ser feita na vida real.

### 3. SYNAPSE DESIGN (Estruturação)
Com o resultado da web em mãos, o `@skill-architect` entra em ação novamente para montar o DNA da Skill: a **Synapse**.
A Synapse definirá o comportamento exato, as restrições e a "Inteligência de Execução" (o passo a passo que qualquer agente Antigravity deverá seguir ao utilizar esta Skill no futuro). Você poderá revisar e aprovar esta etapa.

### 4. INTEGRATION (Super-poderes)
Aqui o agente `@mcp-specialist` ajuda a plugar ferramentas externas à sua Skill.
- **NotebookLM:** Quer que a Skill saiba ler toda a documentação privada da sua empresa? Ele estrutura isso.
- **Context7 e MCPs:** Quer que a Skill consuma APIs, repositórios web em tempo real ou ferramentas globais? Ele instruirá a Skill a como engatilhar essas integrações.

### 5. GENERATION (Entrega Final)
Uma vez tudo aprovado, o Squad consolida o trabalho e cria fisicamente os arquivos na sua pasta `.antigravity/skills/`, deixando-a perfeitamente estruturada (com `SKILL.md`, e as pastas opcionais `scripts/` e `references/`).

---

## 🛠️ Exemplo de Uso Prático

*Usuário:* "Quero criar uma Skill para analisar e fazer review de Pull Requests em Golang."
1. `@skill-researcher` varre a web por "Golang Code Review Best Practices".
2. `@skill-architect` escreve o passo a passo (Verificar lint, performance de concorrência, go routines leak).
3. `@mcp-specialist` sugere integrar ao MCP do GitHub para ler o PR dinamicamente.
4. O gerador entrega a Skill pronta para uso!
