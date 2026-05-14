# Workflow: Greenfield Fullstack

**Arquivo de origem nativo:** `.antigravity/workflows/greenfield-fullstack.md`

O processo **Greenfield Fullstack** é o trilho de produção ponta-a-ponta do Antigravity, desenhado para iniciar um ecossistema inteiramente do zero, cobrindo backend e frontend simultaneamente.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow para:

- Novos MVPs e aplicações Web/SaaS começados do zero.
- Projetos onde as camadas visuais e lógicas conviverão.
- Quando inexiste qualquer código prévio. Se já houver repositório com código, utilize o `brownfield-fullstack`.

## 2. A Jornada Operacional (Fases)

O Antigravity prescreve 4 grandes fases rigorosamente cronológicas para este ciclo:

### Fase 0: Bootstrap do Ambiente

Ocorre a configuração bruta do repositório comandada pelo `@devops`.

- Ele verifica via `.aiox/environment-report.json` se as CLIs e o Git estão rodando.
- Configura o repositório GitHub e prepara a pasta.

### Fase 1: Descoberta e Planejamento em Cadeia

Nenhuma linha de código React/Python é escrita aqui. A inteligência passa de mão em mão:

1. `@analyst` escreve o **Project Brief** (Visão e Dor de Mercado).
2. `@pm` consolida isso no **PRD (Product Requirements Document)**.
3. `@ux` extrai do PRD a **Front-End Spec** (podendo gerar rascunhos visuais no Stitch MCP).
4. `@architect` assume tudo e tranca o martelo na **Fullstack Architecture**.
5. Por fim, o `@po` atua como Auditor (Quality Gate), lendo todos os arquivos gerados frente ao `po-master-checklist`. Se falhar, a esteira volta.

### Fase 2: Sharding (Fragmentação Tática)

Com tudo aprovado, o `@po` fragmenta (shard) o PRD longo em diretrizes consumíveis pela IDE (tech-stack, coding-standards e a hierarquia de source-tree), preparando o terreno prático.

### Fase 3: O Ciclo de Desenvolvimento (Looping)

O coração da engenharia, guiado Story por Story (Ticket):

- `@sm` puxa os requisitos para a sprint.
- `@dev` assume o ticket em mode YOLO ou Interactive, cuspindo código.
- `@qa` acorda para rodar linters, test-coverage e tipagem TypeScript. Se quebrar, o código não comita e retorna pro `@dev`.
- Aprovado no local, `@devops` finaliza no commit do repositório.

## 3. Matriz de Entregáveis

Ao finalizar este workflow, os painéis do sistema deverão conter:

- Ambiente provisionado GitHub/Node.
- Documentos core rubricados: Brief, PRD, Especificação UX e Arquitetura.
- Todo código testado, linkado via JEST/Typscript sem alertas severos e Comitado para os pipelines remotos.
