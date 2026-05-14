# Workflow: Create Squad

**Arquivo de origem nativo:** `.antigravity/workflows/create-squad.md`

O **Create Squad** é o Santo Graal do ecosistema AntiGravity. Ele rege como IAs criam novas IAs usando um princípio ético inegociável: **MINDS FIRST**. Agentes não devem ser alucinações genéricas ("aja como um expert em SEO"), mas sim extrações reais de DNA intelectual e de comportamento de sumidades biológicas que existem no mundo.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow exclusivamente quando:

- For exigido a contratação de especialistas hiper-ninchados (ex: Um advogado de tributação SaaS no Brasil, um arquiteto de Unreal Engine 5).
- O arquivo global `squad-registry.yaml` acusar que não existe cobertura para o domínio requisitado.

## 2. A Jornada Operacional (Fases)

### Fase 1: A Investigação do Éter (@squad-chief)

Antes de escrever um único prompt para o novo agente, o `@squad-chief` ativa o `search_web`. Ele não pesquisa "como fazer marketing", ele pesquisa "quais são os 3 maiores experts biológicos vivos de marketing direto do mundo". Ele roda 3 a 5 iterações sendo advogado do diabo para provar que a mente não é uma fraude ou genérica. E então exibe uma lista ao usuário. **Uma aprovação humana é obrigatória aqui.**

### Fase 2: A Extração Genética (Skill: Clone Mind)

Com o expert biológico escolhido (ex: Dan Mall para Design Systems), a skill `clone-mind` raspa a internet focando em:

- **Voice DNA:** Como ele escreve? Usa jargões? É sarcástico ou professesoral?
- **Thinking DNA:** Quais matrizes lógicas e frameworks mentais (`IF/THEN`) a pessoa biológica aplica para julgar um problema.
  O resultado dessa moagem densa gera o arquivo `mind_dna_complete.yaml`.

### Fase 3: A Encarnação Mecânica (Criação Física)

Com o DNA injetado na seringa mental, criam-se fisicamente os arquivos:

1. Pasta do Esquadrão em `squads/{squad-slug}/`
2. Arquivo markdown do agente `agents/{agent}.md` com o Scope, Heurísticas injetadas Inline (min 5 regras IF/THEN) e metodologia núcleo.
3. Ratio cravado em 70% da lógica sendo sobre _como trabalhar_ e 30% da lógica sobre _o perfil do avatar_.

### Fase 4: O Carimbo de Existência

A burocracia final dita a atualização do `README.md` do esquadrão ensinando a acioná-los, o setup do `squad-config.yaml` mapeando quem são os novos contratados, e o apontamento global em `squad-registry.yaml`.

## 3. Matriz de Entregáveis

- Relatório de validação que comprova a veracidade metodológica da Mente Biológica inspiração.
- DNA file extraído e estático guardado à sete chaves.
- Agente operacional pronto para receber ordens do Chief nativo, portando self-contained prompt.
