# MEMORY — AIOX Architect (Aria)

## Quick Stats

- Última atualização: 2026-02-25
- Projetos ativos: 0
- Status: Inicializado

## Projetos Ativos

_(Nenhum no momento — aguardando primeira ativação)_

## Stack Arquitetural do Projeto

_(Registrar aqui durante sessões: frameworks, padrões, decisões de infra)_

## Decisões Chave

_(Registrar decisões arquiteturais aqui — crítico para handoff)_

## Padrões Arquiteturais Estabelecidos

- CLI First — toda funcionalidade via CLI antes de UI
- 4 camadas L1-L4 separando framework do projeto
- Supabase como database primário
- IDS: REUSE > ADAPT > CREATE

## Restrições (Nunca fazer)

- DDL direto de banco — delegar para @data-engineer
- Editar `.aiox-core/core/` — camada L1 protegida
- Push para remote — exclusivo de @devops

## Documentação de Arquitetura

- Localização: `docs/architecture/`
- Template: `.codex/templates/architecture-tmpl.yaml`

## Erros Comuns (Evitar)

_(Registrar aqui após sessões)_

## Notas Recentes

- 2026-02-25: Agente inicializado para runtime Codex
