# \*create-squad

Cria um novo squad seguindo a arquitetura task-first e o princípio MINDS FIRST.

## Uso

```
@squad-chief
*create-squad {domain}
```

## Protocolo de Execução (MANDATÓRIO)

### Fase 1: Research First (Victoria/Tim/Daniel)

1. **Ativar** `@research-specialists`.
2. **Executar** `mind-research-loop`:
   - Victoria: Busca de fontes primárias e mentes de elite.
   - Tim: Análise de frameworks e heurísticas documentadas.
   - Daniel: Devil's Advocate para filtrar "falsos gurus".
3. **Apresentar** lista de 3-5 mentes com frameworks comprovados ao usuário.
4. **Obter aprovação** das mentes desejadas.

### Fase 2: DNA Extraction (Oala Nicolas)

1. Para cada mente aprovada:
   - **Ativar** `@oalanicolas`.
   - Extrair Voice DNA e Thinking DNA.
   - Gerar `mind_dna_complete.yaml` temporário.

### Fase 3: Agent Creation

1. Gerar o arquivo do agente em `squads/{domain-slug}/agents/{agent-slug}.md`.
2. Usar o template `agent-template.yaml`.
3. Incorporar o DNA extraído (70% operacional / 30% identitário).

### Fase 4: Structure Generation

1. Criar `squad.yaml` no diretório do squad.
2. Criar `README.md` com arquitetura do squad.
3. Criar diretórios `tasks/`, `data/`, `checklists/`.

### Fase 5: Validation (Pedro Valerio)

1. **Ativar** `@pedro-valerio`.
2. Auditar a estrutura gerada.
3. Verificar veto conditions e qualidade das heurísticas.
4. Se aprovado, registrar no `squad-registry.yaml`.

## Veto Conditions

- Squad não é self-contained (referência fora da própria pasta).
- Agente criado sem DNA de mente real.
- Falha na validação de @pedro-valerio.
