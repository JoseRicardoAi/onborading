# Análise Detalhada: Squads e Agentes no Antigravity

Bem-vindo à análise aprofundada sobre as capacidades do Antigravity operando como IDE/Executor de LLMs, a estrutura funcional das Squads, a dinâmica dos Agentes e um roteiro prático para expansão especializada (ex: Squad Flutter + Supabase).

## 1. O Antigravity como IDE e Executor de LLMs

O Antigravity não é apenas um prompter, ele atua como um **orquestrador autônomo e estruturado** (IDE para agentes).

- **Resolução de Arquivos (IDE-FILE-RESOLUTION):** Os agentes carregam dependências dinamicamente em tempo de execução (`tasks/`, `checklists/`, `data/`). O LLM não precisa manter tudo no contexto inicial; ele busca o que precisa via ferramentas como `view_file` e `grep_search`.
- **Protocolos de Execução Rígidos:** Agentes operam usando o modo YOLO (autônomo) ou guiados por passos inflexíveis (Protocolo IDS: _Investigate, Decide, Share_).
- **Self-Critique & Checkpoints:** No meio das execuções, o agente pausa para rodar checklists (`self-critique-checklist.md`, `story-dod-checklist.md`) para garantir a qualidade de entrega antes de finalizar, simulando o pipeline de desenvolvimento padrão.
- **Governança Integrada (AGP):** Antes de cirar arquivos ou alterar pastas críticas (como `supabase/` ou `docs/`), o agente é barrado e forçado a utilizar "Skills de Governança" (`check-architecture-first`, `check-slug-format`), garantindo que o ecossistema mantenha padrões de nomenclaturas e arquitetura válidos.

## 2. Capacidades Funcionais das Squads e Relação com Agentes Existentes

No Antigravity, **Bots Genéricos são proibidos**. O design funcional é focado na "Clonagem de Mente" (_Minds First_).

### A Relação Chefe-Especialista

Agentes existentes como `aiox-dev` (O Executor / "Dex") são ferramentas táticas. Eles recebem missões de roteamento específicas (ex: `develop-story`) e executam o código seguindo as políticas do `.aiox/gotchas.json`.
Já as **Squads** são orquestradas pelo `squad-chief` (O Arquiteto). O `squad-chief` não resolve tarefas de código diretamente, mas atua como um mestre construtor de equipes.
As Squads são **self-contained**: todos os arquivos, regras e recursos gerados pertencem estritamente à pasta daquela squad (ex: `squads/{nome-da-squad}/`).

### O Processo de Criação (Skills Funcionais)

1. **Mind Research Loop:** O `squad-chief` é instruído a NUNCA propor estruturas arbitrariamente. Se você pede um especialista, ele pesquisa iterativamente (_Deep Research_) as melhores mentes documentadas do mundo para aquele assunto específico.
2. **Extração de DNA (oalanicolas):** Uma vez que a mente ideal é definida (ex: "Dan Abramov" para React), o subagente "oalanicolas" extrai o **Voice DNA** (como ele explica e se comunica) e o **Thinking DNA** (suas heurísticas, padrões de design e tomadas de decisão).
3. **Validação (pedro-valerio):** Garante a sanidade dos workflows criados, exigindo 70% de capacidade tática/operacional contra 30% identitária. O bot deve saber FAZER, não apenas falar.

## 3. Criando uma Squad Especializada: Flutter + Supabase

Tem total viabilidade técnica para criar esse esquadrão altamente especializado clonando capacidades de itens já existentes. O Antigravity está preparado através dos triggers do `squad-chief`.

### Passo a Passo Estratégico e Melhor Abordagem:

1. **Invocação Intencional:**
   Inicie a solicitação para o sistema chamando ativamente a necessidade do framework e especialistas:

   > _"Quero um squad de especialistas de elite em desenvolvimento Mobile utilizando Flutter (focado em Clean Architecture) e Supabase (focado em Edge Functions e RLS)."_

2. **O Pesquisador Autônomo Entra em Ação:**
   O `squad-chief` barrará perguntas generalistas e iniciará o workflow `mind-research-loop.md`.
   - Para o **Flutter**, ele pode voltar e identificar figuras de elite da comunidade (ex: Remi Rousselet, Reso Coder ou Andrea Bizzotto) curando seus frameworks.
   - Para o **Supabase**, ele achará engenheiros de dados conhecidos por arquitetura segura baseada em Postgres.

3. **Geração do DNA e Construção:**
   O sistema exibirá as opções para você: _"Essas são as mentes de elite que encontrei. Devo criar os agentes?"_. Ao aprovar, o `clone-mind` gerará os manifestos baseados na sabedoria desses especialistas.

4. **Copiar Estruturas de Agentes Prévios (`aiox-dev`):**
   Como muito do fluxo de execução base (YOLO mode, self-critique e leitura do task file) deve ser mantido, os robôs novos (`flutter-analyst`, `supabase-architect`) clonarão o DNA base do `aiox-dev` (ferramentas ativadas, rotina de execução), mas focarão suas heurísticas operacionais nas restrições de suas novas personas. Exemplo: um agente Flutter jamais rodaria scripts de backend sem as ressalvas corretas, e um agente Supabase passaria todos as `policies` primeiro por uma review de segurança.

5. **Expansão e Refino Constante (Capacidades Melhores):**
   Para tornar agentes mais "afiados", você pode criar **novos Workflows** e **Checklists**.
   - _Exemplo de Checklists:_ Crie um `flutter-dod-checklist.md` contendo regras estritas (_"O estado precisa utilizar Riverpod. Os widgets devem estar separados com baseação visual."_).
   - _Gotchas:_ Insira no contexto de preferência os gotchas do Flutter e do Supabase. O agente os lê a cada ativação.

## Conclusão

Sua estratégia correta é delegar ao orquestrador. Peça pelo squad de Flutter/Supabase, espere as opções do _mind list_, e injete "Gotchas" ou "Checklists" dedicados à tecnologia na pasta que será criada após a confecção pela ferramenta. O uso do Antigravity como executor LLM garante que não haverá desbravamento e desvios ao longo da execução da esteira.
