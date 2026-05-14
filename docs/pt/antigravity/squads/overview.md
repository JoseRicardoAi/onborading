# Squads & Packs — Modelo de Escalabilidade

O Antigravit introduz um sistema de **Squads de Projeto** (também chamados de Packs) que permite escalar o AIOX além dos agentes core nativos.

---

## O que é um Squad?

Um squad é um pacote auto-contido de inteligência IA que reside na pasta `squads/`. Diferente dos agentes globais em `.antigravity/agents/`, os squads são:

1.  **Project-Level**: Específicos para o domínio do projeto atual.
2.  **Self-Contained**: Possuem seus próprios agentes, tasks, workflows e dados.
3.  **Portable**: Podem ser zipados e compartilhados (sincronizados via AffHub API).

## O Orquestrador: `squad-creator`

A joia da coroa da escalabilidade no Antigravit é o pack **`squads/squad-creator/`**. Este meta-squad é responsável por:

- **Pesquisa de Mentes**: Encontrar os melhores especialistas reais para um domínio.
- **Clonagem de DNA**: Extrair o tom de voz e lógica de decisão (Thinking DNA).
- **Geração de Agentes**: Criar novos agentes em `squads/{domain}/agents/`.
- **Sync**: Sincronizar squads com o marketplace da AffHub.

---

## Estrutura de um Squad

Cada squad segue este padrão de diretórios:

```
squads/{squad-name}/
├── agents/           # Agentes especializados com DNA real
├── tasks/            # Comandos especializados (ex: *sync-squads)
├── workflows/        # Sequências de passos (ex: mind-research-loop)
├── data/             # Bases de conhecimento e benchmarks
└── squad.yaml        # Manifesto do squad (metadados e dependências)
```

---

## Como Criar um Novo Squad

O processo é orquestrado pelo `@squad-chief` usando o pack `squad-creator`:

1.  **Request**: `@squad-chief quero um squad de [domínio]`
2.  **Research**: O sistema executa o `mind-research-loop` (iterações de deep research).
3.  **Clone**: Extração de DNA Mental™ das mentes aprovadas.
4.  **Generation**: O squad é gerado fisicamente na pasta `squads/`.

---

## Sincronização e Marketplace

Squads criados localmente podem ser sincronizados com o marketplace AffHub usando o comando:

```bash
@squad-chief *sync-squads squads/{nome-do-squad}
```

Isso gera um checksum, valida o manifesto e faz o upload para a AffHub API, tornando o squad disponível para outros desenvolvedores.
