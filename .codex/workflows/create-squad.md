---
description: criar novo squad de agentes IA para qualquer domínio — pesquisa de mentes, clonagem de DNA, criação de agentes
---

# Create Squad Workflow

Workflow completo para criar um novo squad de agentes IA especializados em qualquer domínio. Segue o princípio MINDS FIRST: pesquisar mentes reais antes de criar qualquer agente.

## Quando Usar

- Quando precisar de um time de especialistas IA em um domínio específico
- Para criar squad de mind clones de experts reais
- Quando squad-registry.yaml não tem cobertura do domínio pedido

---

## Step 0: Verificação do Projeto

1. Confirmar que o AIOX está instalado no projeto (`.codex/` e `.aiox-core/` presentes na raiz).
2. Carregar memória do projeto e contexto de agentes.
3. Squads do projeto ficam em `squads/` na raiz do projeto.

---

## Step 1: Verificar Squad Registry

Antes de criar, verificar se já existe squad para o domínio:

```
# Ler squads/squad-creator/data/squad-registry.yaml
# Buscar por: domain_index.{keyword}
```

**Se encontrado:** Perguntar ao usuário:

1. Usar o squad existente
2. Estender o squad existente com novos agentes
3. Criar novo squad igualmente (foco diferente)

**Se não encontrado:** Prosseguir para Step 2.

---

## Step 2: Research de Mentes (@squad-chief)

**CRÍTICO: NUNCA sugerir agentes antes de pesquisar!**

**Invocar @squad-chief com pesquisa de mentes:**

```
Invocar skill de squad para pesquisar as melhores mentes no domínio [X].
Executar mind-research-loop com 3-5 iterações.
```

O @squad-chief vai:

1. Usar `web_search_available` para pesquisar mentes reais no domínio
2. Executar 3-5 iterações com devil's advocate
3. Validar cada mente contra mind-validation.md checklist
4. Apresentar lista curada de mentes REAIS com frameworks documentados

**Show para usuário:**

```
Aqui estão as X mentes de elite para [domínio]:
1. [Nome] — [Framework] — [Framework key]
2. [Nome] — [Framework] — [Framework key]
...
Devo criar agentes baseados nessas mentes?
```

**Aguardar aprovação do usuário antes de prosseguir.**

---

## Step 3: Clonagem de DNA (por mente aprovada)

**Para CADA mente aprovada, executar skill clone-mind:**

```
Usar skill clone-mind para [nome_da_mente]:
- Extrair Voice DNA (estilo de comunicação)
- Extrair Thinking DNA (frameworks e heurísticas)
- Gerar mind_dna_complete.yaml
```

A skill clone-mind vai:

1. Pesquisar fontes primárias com `web_search_available` + `read_url_available`
2. Executar pipeline DNA Mental™ de 9 camadas
3. PARAR no Checkpoint L6-L8 para validação humana
4. Gerar `outputs/minds/{slug}/implementation/system-prompt.md`

---

## Step 4: Criação dos Agentes

**Para cada mente com DNA extraído:**

```
Criar agente em squads/{squad-slug}/agents/{agent-slug}.md
Usar mind_dna_complete.yaml como base para o agente
Validar contra quality gates SC_AGT_001 e SC_AGT_002
```

Cada agente deve ter:

- [ ] SCOPE definido (o que faz/não faz)
- [ ] Heuristics (mínimo 5 regras SE/ENTÃO)
- [ ] Core methodology INLINE
- [ ] Voice DNA (5 frases assinatura)
- [ ] Output examples
- [ ] Self-contained (sem refs externas ao squad)
- [ ] Ratio 70% operacional / 30% identitário

---

## Step 5: Criação da Estrutura do Squad

```
Criar squads/{squad-slug}/
├── agents/          # Agentes criados
│   └── {agent}.md
├── tasks/           # Tasks do squad
├── checklists/      # Checklists específicas
├── data/            # Dados e configurações
│   └── squad-config.yaml
├── squad.meta.json  # Manifesto OBRIGATÓRIO para o Menu !squads
└── README.md        # Documentação do squad
```

**squad.meta.json (OBRIGATÓRIO para o Quick Menu System):**

```json
{
  "id": "{ squad-slug }",
  "name": "{ squad-name }",
  "description": "{ squad-purpose-short }",
  "agents": [
    {
      "command": "@{agent-slug}",
      "name": "{ agent-name }",
      "description": "{ agent-expertise }"
    }
  ]
}
```

**squad-config.yaml:**

```yaml
name: { squad-name }
domain: { domain }
created: { date }
agents:
  - name: { agent-name }
    file: agents/{agent-file}.md
    expertise: { expertise }
```

---

## Step 6: Registro no Squad Registry

Adicionar o novo squad ao `squads/squad-creator/data/squad-registry.yaml`:

```yaml
squads:
  { squad-slug }:
    domain: { domain }
    keywords: [{ keyword1 }, { keyword2 }]
    purpose: { propósito }
    agents: [{ agent1 }, { agent2 }]
    example_use: { exemplo de uso }
```

---

## Resultado Esperado

- Squad completo em `squads/{squad-slug}/` ✅
- Agentes com DNA real extraído ✅
- Quality gates SC_AGT_001 e SC_AGT_002 PASS ✅
- Squad registrado em squad-registry.yaml e arquivo `squad.meta.json` gerado ✅
- README com instruções de uso ✅
