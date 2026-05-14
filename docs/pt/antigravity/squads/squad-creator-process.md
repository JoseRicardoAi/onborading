# Squad Creator Process

O **Squad Creator** é o esquadrão nativo do Antigravity (localizado fisicamente em `squads/squad-creator/`) responsável pela meta-operação: _A inteligência artificial programando e configurando novas inteligências artificiais_.

---

## 1. Visão Geral da Arquitetura

O processo é contido na própria estrutura de squads do Antigravity, mas atua como um administrador global. Ele possui seus próprios agentes, workflows e tasks.

A anatomia do diretório `squads/squad-creator/` consiste em:

- **`squad.yaml`**: O manifesto que define este esquadrão mestre orquestrador.
- **`agents/`**: Os Especialistas (ex: `@oalanicolas` para clonagem comportamental, `@pedro-valerio` para estruturação de agentes).
- **`workflows/`**: As sequências vitais (`clone-mind`, `create-squad-workflow`, `mind-research-loop`).
- **`tasks/`**: Micro-operações (`create-agent`, `create-squad`, `mind-validation`, `sync-squads`).
- **`data/squad-registry.yaml`**: O registro global de todos os squads do sistema.

## 2. O Pipeline "Minds First"

O princípio cardeal na criação de esquadrões é o **"Minds First"**. O Antigravity rejeita arquétipos genéricos.

### Etapa 1: A Investigação (`mind-research-loop`)

Quando você clama por um "Time de Especialistas em Banco de Dados Azure", os agentes de pesquisa iniciam varreduras reais na internet. O framework foca em encontrar humanos influentes (Mentes) com metodologias publicamente documentadas. Os agentes debatem (usando o `mind-validation.md`) se a pessoa X é realmente apta a ser clonada.

### Etapa 2: A Moagem de DNA (`clone-mind`)

Com a mente aprovada, o workflow de clonagem é executado:

- Lê-se artigos, tweets e repositórios open-source do humano alvo.
- O Agente Especialista (`@oalanicolas`) mapeia os padrões sintáticos (_Voice DNA_) e árvores lógicas de decisão (_Thinking DNA_).

### Etapa 3: A Síntese do Agente (`create-agent`)

O DNA purificado é encarnado em um arquivo markdown dentro de `agents/{novo-agente}.md`. Este documento recebe heurísticas operacionais injetadas nativamente para garantir que a IA não vá quebrar o projeto na hora de codificá-lo.

## 3. O Fechamento Burocrático

Após a fundição dos 3 ou 4 agentes necessários para o painel solicitado, entra a etapa de Sync:

- Uma nova pasta em `squads/{novo-squad}/` é gerada.
- O arquivo master `squad.yaml` os engole.
- E o arquivo `data/squad-registry.yaml` do Creator Squad atesta civilmente o "nascimento" desta nova squad no ambiente global, para ser acionada por desenvolvedores futuros.
