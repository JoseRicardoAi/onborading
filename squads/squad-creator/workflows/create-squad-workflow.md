# Workflow: Create Squad Workflow

Orquestração do ciclo completo de criação de um novo squad.

## Runtime

Este workflow é compartilhado e deve operar com a interface ativa persistida:

- Antigravity: usar `.antigravity/` para skills, templates e memória operacional.
- Codex: usar `.codex/` para skills, templates e memória operacional.

O diretório `squads/` continua sendo o pacote compartilhado do squad e não deve privilegiar uma interface.

## Pre-flight

1. Confirmar o runtime ativo.
2. Carregar `squads/squad-creator/squad.yaml`.
3. Carregar os agentes `oalanicolas.md`, `research-specialists.md` e `pedro-valerio.md`.
4. Confirmar que cada agente mantém seu contrato `tools:` original.

## Estados

1. **ELICITATION**: @squad-chief pergunta o domínio e objetivos iniciais.
2. **RESEARCH**: @research-specialists executa o `mind-research-loop`.
3. **CLONING**: @oalanicolas executa o pipeline `clone-mind` para cada especialista.
4. **GENERATION**: @squad-chief gera a estrutura de arquivos e agentes.
5. **AUDIT**: @pedro-valerio valida a qualidade e eficiência.
6. **REGISTRY**: Atualização do `squad-registry.yaml`.

## Transições

- Fail em AUDIT → Volta para GENERATION.
- Veto em RESEARCH → Pede novas referências ao usuário.

## Quality Gates

- O squad gerado possui `squad.yaml`, agentes, tasks/workflows necessários e registry atualizado.
- Tools de agentes não são reduzidas ao portar entre Antigravity e Codex.
- Qualquer path operacional é resolvido por runtime ativo.
- `@pedro-valerio` valida REUSE > ADAPT > CREATE antes do fechamento.

## Handoff

Ao concluir, registrar o novo squad em `squads/squad-creator/data/squad-registry.yaml` e entregar uma lista de arquivos criados/alterados.
