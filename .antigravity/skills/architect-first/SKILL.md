---
name: architect-first
description: Guia para implementar a filosofia de desenvolvimento Architect-First — arquitetura perfeita, execução pragmática, qualidade garantida por testes. Use esta skill ao iniciar novas features, refatorar sistemas, ou quando decisões arquiteturais são necessárias. Aplica non-negotiables como design/documentação completa antes de código, zero coupling, e validação multi-perspectiva antes de decisões estruturais.
---

# Architect First

## Visão Geral

Esta skill incorpora a filosofia de desenvolvimento "Architect-First": **Arquitetura perfeita, execução pragmática, qualidade garantida por testes**. Aplique esta skill ao tomar decisões arquiteturais, iniciar novas features, refatorar sistemas existentes, ou quando quality gates precisam ser aplicados.

Princípio central: **Arquitetura e documentação são non-negotiable e devem preceder a implementação. Qualidade de código é negociável SE respaldada por testes como safety net (escape hatch).**

## Core Philosophy

### Mantra

"Arquitetura perfeita, execução pragmática, qualidade garantida por testes"

### Quality Gates

**Non-Negotiable (STOP se violado):**

- **Arquitetura**: Design e documentação COMPLETOS ANTES de qualquer código
- **Documentação**: Deve preceder e acompanhar a implementação
- **Preservação de Capacidade**: Nunca perder capability/granularidade vs versões anteriores
- **Zero Coupling**: Expansion packs devem ser independentes
- **Validação Multi-Agente**: Decisões estruturais validadas por PO/Architect/Usuário

**Negociável (com escape hatch):**

- **Estilo de Código**: Aceitável se respaldado por testes como safety net
- **Completude de Features**: 80% aceitável SE use case core funcionar
- **Quick & Dirty Code**: Permitido APENAS com plano de testes e logging mínimo

### Modos de Decisão

**Architect-First Mode (padrão):**

- Projetar e documentar completamente antes de codificar
- Mapear estrutura e pointers antes de propor implementação
- Validar arquitetura com múltiplos agentes/perspectivas
- Externalizar todas as configurações mutáveis para YAML

**Fast Mode (pós-validação apenas):**

- Decisões binárias e delegação rápida
- Ativado APENAS após validação arquitetural estar completa
- Velocidade via automação, não shortcuts

## Árvore de Decisão de Workflow

```
Nova Task/Feature Request
    ↓
É uma decisão estrutural/arquitetural?
    ↓ SIM                     ↓ NÃO
    ↓                         ↓
[Architecture Flow]     [Execution Flow]
```

### Architecture Flow (Decisões Estruturais)

**STOP e siga esta sequência:**

1. **Mapear Antes de Modificar**
   - Documentar estado atual completamente
   - Identificar todas as dependências e touch points
   - Criar diagramas/flows arquiteturais

2. **Validação Multi-Agente**
   - Apresentar opções A/B/C com trade-offs explícitos
   - Obter validação de:
     - Product Owner (alinhamento de negócio)
     - Architect (solidez técnica)
     - Usuário (decisão final)
   - Documentar rationale da decisão

3. **Documentação de Design**
   - Documento de design COMPLETO ANTES de código
   - Incluir: diagramas de arquitetura, interações de componentes, data flows, schema de configuração (YAML), integration points

4. **Gold Standard Baseline**
   - Garantir que novo design atenda/supere capability baseline
   - Validar: Este design mantém TODAS as capacidades anteriores?
   - STOP se perda de capability detectada → restaurar ou redesenhar

5. **Validação de Zero Coupling**
   - Garantir independência do expansion pack
   - Sem dependências cross-module hardcoded

6. **Prosseguir à Implementação**
   - Agora e apenas agora: escrever código

### Execution Flow (Implementação)

1. **Pre-Implementation Checklist**
   - [ ] Arquitetura documentada e validada?
   - [ ] Use case core claramente definido?
   - [ ] Configuração externalizada para YAML?
   - [ ] Estratégia de testes definida?

2. **Safety Net Test-Driven**
   - Definir plano de testes PRIMEIRO
   - Identificar pontos de logging/observação
   - Testes permitem imperfeição temporária (escape hatch)

3. **Estilo de Implementação**

   ```
   ACEITÁVEL:
   ✓ Código "feio" COM testes abrangentes
   ✓ 80% de completude SE use case core funcionar
   ✓ Implementação rápida COM plano de testes + logging

   REJEITADO:
   ✗ Código "feio" SEM testes
   ✗ Perda de capability sem justificativa explícita
   ✗ Valores mutáveis hardcoded (devem ser YAML)
   ✗ Deploy sem use case core funcionando
   ```

## Heurísticas (Regras de Decisão)

1. **Gold Standard Baseline**: 22 artefatos mínimos (ajustar ao contexto)
2. **Nunca Perder Capability**: Acumular, nunca reduzir
3. **Architect Before Build**: Design/docs antes de código, sempre
4. **Zero Coupling, Max Modularidade**: Expansion packs independentes
5. **Config > Hardcoding**: Externalizar para YAML todos os valores mutáveis
6. **Mapear Antes de Modificar**: Documentar estrutura antes de mudar
7. **Decisão Binária Pós-Validação**: Execução rápida após validação arquitetural
8. **Velocidade via Automação**: Não via shortcuts ou cortes de qualidade
9. **Quality Escape Hatch**: Testes permitem imperfeição temporária

## Stop Rules (Limites Rígidos)

**STOP imediatamente se detectar:**

- ⛔ **Perda de capability** vs baseline
- ⛔ **Decisão estrutural** sem validação multi-agente
- ⛔ **Coupling** entre módulos
- ⛔ **Documentação arquitetural faltando**
- ⛔ **Quick & dirty code** SEM plano de testes e logs
- ⛔ **Configurações mutáveis** hardcoded

## Mitigação de Riscos

| Risco                     | Estratégia de Mitigação                                   |
| ------------------------- | --------------------------------------------------------- |
| Planejamento excessivo    | Time-box + POC obrigatório antes de formalização completa |
| Cascata de perfeccionismo | Regra de 3: pilot simples → 2 iterações → formalizar      |
| Configuração prematura    | Generalizar apenas após ≥2 cenários reais                 |
| Troca de contexto         | Checklist de pendências a cada pivô                       |

## Quick Reference

**Iniciando nova feature:**

1. Mapear arquitetura atual
2. Projetar com opções A/B/C
3. Validação multi-agente
4. Documentar arquitetura
5. Definir testes
6. Implementar com logging
7. Validar e iterar

**Fazendo mudanças arquiteturais:**

1. STOP — Não codificar ainda
2. Documentar estado atual completamente
3. Apresentar opções com trade-offs
4. Obter validação PO/Architect/Usuário
5. Verificar coupling
6. Documentar decisão
7. Agora implementar

## Workflows Associados

A filosofia Architect-First deve ser aplicada especialmente ao iniciar estes workflows:

| Workflow                  | Fase Crítica para Architect-First          |
| ------------------------- | ------------------------------------------ |
| `greenfield-fullstack.md` | Fase 1 — Antes de escrever qualquer código |
| `greenfield-service.md`   | Step 1.2 — Arquitetura de Serviço          |
| `brownfield-fullstack.md` | Step 3 — Validação arquitetural            |
| `brownfield-service.md`   | Step 2 — Spec de Mudança                   |
| `design-system-build.md`  | Step 4 — Antes de implementar atoms        |
| `spec-pipeline.md`        | Fase 3 — Plan (Fase 6 do pipeline)         |
