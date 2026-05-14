# \*validate-squad

Valida um squad existente quanto à estrutura, conformidade com o manifesto e qualidade dos agentes.

## Uso

```
@squad-chief
*validate-squad {squad-name}
*validate-squad {squad-name} --strict
```

## Protocolo de Validação

### Fase 1: Estrutura do Diretório

Verificar existência dos seguintes itens no diretório `squads/{squad-name}/`:

- [ ] `squad.yaml` — manifesto obrigatório
- [ ] `README.md` — documentação do squad
- [ ] `agents/` — diretório de agentes
- [ ] `tasks/` — diretório de tasks (arquitetura task-first)

### Fase 2: Validação do Manifesto (`squad.yaml`)

Verificar campos obrigatórios:

- [ ] `name` — kebab-case, identificador único
- [ ] `version` — versionamento semântico (x.y.z)
- [ ] `description` — descrição do squad
- [ ] `aiox.type: squad`
- [ ] `aiox.minVersion` — versão semântica válida
- [ ] `components.agents` — lista de arquivos de agentes
- [ ] `components.tasks` — lista de arquivos de tasks

Verificar que todos os arquivos declarados em `components` existem fisicamente.

### Fase 3: Quality Gate SC_AGT_001 — Estrutura dos Agentes

Para cada agente em `agents/`, verificar:

- [ ] Possui SCOPE explícito (o que faz / o que não faz)
- [ ] Possui mínimo 5 heurísticas SE/ENTÃO
- [ ] Core methodology inline (não referenciado externamente)
- [ ] Voice DNA presente (mínimo 5 frases assinatura)
- [ ] Output examples incluídos
- [ ] Self-contained (sem referências fora de `squads/{squad-name}/`)
- [ ] Ratio aproximado 70% operacional / 30% identitário

**Threshold de aprovação: 7/7 (todos obrigatórios)**

### Fase 4: Quality Gate SC_AGT_002 — Fidelidade do Clone (para agentes baseados em pessoas reais)

- [ ] DNA extraído antes de criar o agente (clone-mind executado)
- [ ] Voice DNA captura estilo real de comunicação
- [ ] Thinking DNA captura frameworks reais documentados
- [ ] Fonte documentada e verificável

**Threshold de aprovação: 4/4**

### Fase 5: Verificação de Self-Containment

- [ ] Nenhum agente referencia arquivos fora de `squads/{squad-name}/`
- [ ] Nenhuma task referencia arquivos fora de `squads/{squad-name}/`
- [ ] Dependências externas estão declaradas em `squad.yaml` (dependencies.squads)

## Modo Strict (`--strict`)

No modo strict, avisos são tratados como erros. Inclui verificações adicionais:

- [ ] README.md com conteúdo mínimo (> 50 linhas)
- [ ] Todos os agentes têm tasks associadas
- [ ] Workflows definidos para sequências de múltiplos agentes

## Output Esperado

```
Validando squad: {squad-name}
═══════════════════════════════

✅ Manifesto: Válido
✅ Estrutura: Completa
✅ Agentes: {N}/{N} válidos (SC_AGT_001: PASS)
✅ Self-contained: Confirmado
⚠️  Avisos:
   - README.md está mínimo (considere expandir)

Resumo: VÁLIDO ({X} avisos)
```

## Veto Conditions

A validação retorna **VETADO** se:

- `squad.yaml` ausente ou com campos obrigatórios faltando
- Qualquer agente tem referência fora do diretório do squad
- Qualquer agente falha em 2+ checks do SC_AGT_001
- No modo `--strict`: qualquer aviso presente
