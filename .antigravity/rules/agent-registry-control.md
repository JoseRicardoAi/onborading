# Regra de Registro e Governança de Agentes (Marvel Registry)

Esta regra define o protocolo obrigatório para o registro de novos agentes no Antigravity, garantindo que o menu interativo `!agents` e a documentação de visão geral estejam sempre sincronizados.

## 1. Escopo de Aplicação
Esta regra aplica-se a:
- Todos os agentes criadores (ex: `@squad-chief`).
- Desenvolvedores que criarem agentes manualmente em `.antigravity/agents/` ou `.antigravity/squads/`.

## 2. Protocolo de Nomeação (Marvel Registry)

Ao registrar um novo agente que **não possua nome de pessoa real** (ex: clones de mentes), deve-se seguir a regra Marvel:

1. **Codinome:** Atribuir um nome de personagem da Marvel que possua "poderes" ou características análogas à função técnica do agente.
2. **Especialidade:** A descrição da especialidade deve ser **estritamente técnica e funcional**. Não deve haver referências a heróis, quadrinhos ou "poderes" na descrição.
3. **Formato no Menu:** `Agente: Nome Marvel` | `ID: agent-id` (ou conforme a estrutura da tabela no manual de usabilidade).

## 3. Fluxo de Atualização Obrigatório (Control Plan)

Ao finalizar a criação de um agente (`.md`), o agente criador (ou desenvolvedor) DEVE executar os seguintes passos:

### Passo 1: Atualizar o Menu de Usabilidade
Abrir o arquivo `docs/pt/antigravity/manual-usabilidade-integracao-aiox-antigravity.md` e inserir o novo agente na categoria correta da seção `8.1 !agents — Menu de Agentes`.

### Passo 2: Sincronizar a Visão Geral
Abrir o arquivo `docs/pt/antigravity/agents/overview.md` e:
- Inserir o link do agente no índice por categoria.
- Atualizar a tabela de mapeamento de diretórios se o agente possuir alta relevância arquitetural.

### Passo 3: Notificação de Registro
O log de criação do agente deve conter a confirmação:
`[REGISTRY] Agente {ID} registrado no menu !agents com o codinome {Nome}.`

## 4. Auditoria
Agentes de QA podem validar se existem arquivos em `.antigravity/agents/` que não constam no menu `!agents`.
