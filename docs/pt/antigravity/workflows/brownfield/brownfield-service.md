# Workflow: Brownfield Service

**Arquivo de origem nativo:** `.antigravity/workflows/brownfield-service.md`

O processo **Brownfield Service** é taticamente blindado focado apenas no sub-mundo dos Servidores, APIs e Banco de Dados que já estão quentes (operando dados reais de humanos) em um ecossistema.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow exclusivamente para:

- Alterar Payload de Response em Endpoints consumidos publicamente.
- Inserir/Atualizar Models no banco de dados sem desligar a aplicação (Migrations Live).
- Refatoração cirúrgica em rotinas puramente backend.

## 2. A Jornada Operacional (Fases)

### Fase 1: Análise de Contrato (Impacto de Retaguarda)

A diferença colossal aqui é que o `@pm` e o `@architect` gastam quase 50% do tempo do ticket procurando por **Breaking Changes**. Se o engenheiro quiser mudar o Response do objeto JSON _"v1/users"_ que o App Mobile antigo está usando para mostrar perfil, eles vetam e obrigam criar o endpoint _"v2/users"_.

### Fase 2: O Cirurgião de Dados (@data-engineer)

Havendo banco de dados, exige-se protocolo de voo cego antes de programar:

1. `*db-dry-run` — Tenta rodar a migração sem escrever.
2. `*db-snapshot` — Cópia de segurança ativada.
3. `*db-apply-migration` — Roda o commit relacional real.
4. `*db-smoke-test` — Verifica se o servidor subiu ou o schema panificou após a tabela mudar.

### Fase 3: Loop Restrito de Stories

Durante a lida do `@dev`, a regra suprema de execução consiste primariamente em rodar a suíte de testes legado ANTES de tentar tocar em uma vírgula de Node/Python. Você cria código respeitando a compatibilidade reversa sempre.
O Bot de Qualidade `@qa` buscará exaustivamente problemas de _Error Handling_, estourando _Integration Tests_ se você tentar violar contratos antigos.

## 3. Matriz de Entregáveis

- Mudança na API feita lado-a-lado ou sobreposta via v1/v2 com compatibilidade reversa imaculada.
- Código 100% coberto pelas malhas de Testes (Coverage alto onde foi tocado).
- Nenhuma exclusão de dados ativos (sem DROPS acidentais em prod).
