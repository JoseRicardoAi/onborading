# Gerenciamento de Squads no Antigravity

Um "Squad" no Antigravity não é apenas uma pasta decorativa de prompts. É um pacote auto-contido de execução paralela. O ecossistema é desenhado para permitir que desenvolvedores injetem rapidamente um grupo de IAs focadas no projeto sem contaminar as diretrizes nativas.

---

## 1. A Anatomia Padrão de um Squad

Cada squad recém-nascido ou importado para a pasta `/squads/` deve seguir ferrenhamente a hierarquia estipulada de pastas. Um Squad válido possui a silhueta:

```text
squads/meu-novo-squad/
├── agents/             # Os atores que farão o trabalho.
│   ├── designer.md
│   └── redator.md
├── tasks/              # Os templates e rotinas das tarefas.
│   ├── write-post.md
│   └── make-banner.md
├── workflows/          # Sequências avançadas encubadoras de tarefas.
├── data/               # Memória persistente, Json de Gotchas, Configs locais.
├── squad.yaml          # A IDENTIDADE (Obrigatorio)
└── README.md           # Como invocar este time.
```

O `squad.yaml` amarra o ecossistema internamente para que ferramentas de busca encontrem seus atores.

## 2. Invocação e Atuação

Para chamar esquadrões você não avisa _"Quero falar com a Squad X"_.
Os painéis operacionais respondem diretamente aos codinomes individuais no prompt:

```bash
# Modo Clássico
"Delegue ao agente @redator da squad Marketing para atualizar a Copy principal"
```

Como o Antigravity opera localmente, ele carrega em tempo de execução o arquivo `designer.md` e mescla junto das regras globais do _Synapse_.

## 3. Escalabilidade e Manutenção

Para squads que atuam diretamente em código (ex: Esquadrão Mobile Flutter), recomenda-se que eles mantenham um registro agressivo dentro da sua própria pasta `data/`.
Se o Squad não tiver sucesso na resolução de algo repetitivo, os arquivos `tasks/*.md` devem ser alterados localmente.

### Compartilhando Squads

Por serem modulares, você pode zipar a pasta `squads/meu-squad/` e soltá-la em outro projeto `.antigravity/squads/` de outro cliente, apenas certificando-se de rodar o comando de registro no `squad-registry.yaml` para habilitar visibilidade instantânea na interface de documentação e busca.
