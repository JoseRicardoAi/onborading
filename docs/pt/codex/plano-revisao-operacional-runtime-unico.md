# Plano de Acao - Revisao Operacional `.codex` com Runtime Unico

## Resumo

A aplicacao deve operar com apenas uma interface ativa por vez. Na instalacao, o usuario escolhe uma interface operacional, e essa escolha permanece fixa ate ser alterada explicitamente pelo menu/comando de configuracao.

Nao deve existir cenario valido em que Codex e Antigravity estejam habilitados simultaneamente.

A revisao profunda da `.codex/` sera feita em etapas independentes, com registro em `docs/stories/` e `docs/pt/codex/`, garantindo que:

- runtime `codex` use `.codex/` e suas dependencias;
- runtime `antigravity`/`antigravity-code` use `.antigravity/` e suas dependencias;
- artefatos compartilhados resolvam paths conforme a interface ativa.

## Mudancas Principais

- Ajustar o modelo de configuracao para runtime unico:
  - `ide.selected` deve representar uma unica interface ativa.
  - `ide.configs.codex` e `ide.configs.antigravity`/`ide.configs.antigravity-code` nao devem ficar `true` ao mesmo tempo.
  - `ideSync.targets.*.enabled` deve habilitar somente o alvo da interface ativa.
- Ajustar instalacao e troca posterior:
  - o instalador deve usar escolha unica, nao multi-select;
  - `aiox config ide` deve mostrar a interface atual;
  - `aiox config ide --set codex` troca para Codex e desativa Antigravity;
  - `aiox config ide --set antigravity-code` ou equivalente troca para Antigravity e desativa Codex.
- Definir roteamento rigido por interface:
  - Codex aponta para `.codex/`;
  - Antigravity aponta para `.antigravity/`;
  - artefatos compartilhados, como `squads/`, resolvem paths conforme a interface ativa.

## Etapas Independentes

1. **Story e Controle**
   - Criar story especifica para a revisao operacional runtime unico.
   - Criar documento de matriz em `docs/pt/codex/`.
   - Registrar decisoes, validacoes e pendencias em `docs/pt/codex/registro-execucao.md`.

2. **Configuracao de Runtime Unico**
   - Revisar `.aiox-core/core-config.yaml`, installer e comando `aiox config ide`.
   - Substituir comportamento multi-interface por selecao unica.
   - Adicionar validacao que falha se Codex e Antigravity estiverem ativos juntos.

3. **Resolvedor de Interface**
   - Criar ou ajustar mecanismo unico para descobrir a interface ativa.
   - Usar a configuracao persistida como fonte principal.
   - Permitir entrada explicita via menu/comando apenas para alterar a configuracao, nao para criar execucao paralela.
   - Rejeitar estados ambiguos com erro orientando o usuario a escolher uma interface.

4. **Inventario e Matriz `.codex`**
   - Inventariar agentes, comandos, regras, skills, squads, templates, workflows e memorias.
   - Comparar com `.antigravity/`.
   - Classificar cada artefato como pronto, precisa adaptacao, compartilhado runtime-aware ou legado.

5. **Validacao Profunda**
   - Expandir ou criar validador para toda `.codex/`.
   - Validar paths incorretos, referencias Antigravity indevidas, hooks inexistentes, comandos nativos incompativeis e dependencias sem fallback Codex.
   - Criar validacao equivalente para garantir que Antigravity nao passe a depender de `.codex/`.

6. **Revisao Especifica de Workflows**
   - Inventariar workflows em `.codex/workflows/`, `.antigravity/workflows/`, `.codex/squads/**/workflows/` e `squads/**/workflows/`.
   - Validar cada workflow como processo completo: pre-flight, roteamento por runtime, agentes/skills acionados, entradas, saidas, quality gates e handoffs.
   - Garantir que workflows Codex resolvam para `.codex/` e workflows Antigravity resolvam para `.antigravity/`.
   - Garantir que workflows compartilhados sejam runtime-aware e nao privilegiem Codex nem Antigravity.
   - Preservar workflows em `.antigravity/` como contratos nativos do Antigravity, inclusive sua linguagem operacional original.
   - Substituir linguagem de "ferramenta exclusiva" apenas na copia Codex ou em workflows compartilhados, usando mapeamento equivalente quando aplicavel.

7. **Correcoes por Lote**
   - Corrigir em lotes pequenos: configuracao, comandos, skills, squads, workflows, agentes/regras e templates.
   - Cada lote deve atualizar story, checklist, file list e registro.
   - Nenhum lote deve misturar correcoes nao relacionadas.

8. **Quality Gates**
   - Rodar validadores focados apos cada lote.
   - No fechamento, rodar:
     - `npm.cmd run validate:codex-sync`
     - `npm.cmd run validate:codex-integration`
     - `npm.cmd run validate:codex-skills`
     - `npm.cmd run validate:codex-operational`
     - novo validador runtime unico
     - `npm.cmd run validate:synapse`
     - `npm.cmd run validate:parity`
     - `npm.cmd run lint`
     - `npm.cmd run typecheck`

## Testes e Cenarios

- Instalacao permite escolher somente uma interface.
- Config com Codex ativo desativa Antigravity.
- Config com Antigravity ativo desativa Codex.
- Validador falha se duas interfaces estiverem ativas.
- Troca via menu persiste ate nova alteracao do usuario.
- Codex roteia tudo para `.codex/`.
- Antigravity roteia tudo para `.antigravity/`.
- Artefatos compartilhados resolvem paths conforme a interface ativa.

## Assumptions

- A interface ativa e uma decisao persistida do projeto, nao uma escolha por execucao.
- Gemini e outras IDEs ficam fora do escopo desta revisao, exceto onde validadores existentes exigirem compatibilidade.
- Falhas antigas da suite completa serao registradas separadamente se nao forem causadas por esta revisao.
