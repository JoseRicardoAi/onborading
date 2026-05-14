# Workflow: Greenfield Service

**Arquivo de origem nativo:** `.antigravity/workflows/greenfield-service.md`

O processo **Greenfield Service** é focado como raio laser na **construção silenciosa de Backend e APIs puras**, operando desde o Design Relacional até a implementação lógica onde telas ou camadas de marcação visual (Frontend) são abstraídas ou inexistentes.

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow exclusivamente para:

- Criação de Micro-serviços headless (GraphQL, REST APIs).
- Ferramentas de Background, Lambdas / Edge Functions e integrações sistêmicas puras.
- Dutos de processamento sem interface humana.

## 2. A Jornada Operacional (Fases)

### Fase 0: Bootstrap Base

Igual ao padrão `fullstack`, o agente `@devops` amarra a fundação local e remota sem envolvimento de código.

### Fase 1: Planejamento Profundo Backend

O foco na Fase 1 difere na entrada de peso arquitetural de banco de dados:

1. `@analyst` e `@pm` definem as regras cruas no **PRD Corporativo**.
2. `@architect` destrincha o PRD numa robusta **Service Architecture** (Cria endpoints, design de payloads e fluxos de in/out).
3. Entra o `@data-engineer` (DB Sage), executando design crítico: Analisa o schema proposto com a lógica _KISS_, configura as rígidas RLS Policies (ex: Supabase) e elabora a primeira migração PostgreSQL de raiz.
4. `@po` homologa todos os documentos contra o checklist mestre de qualidade.

### Fase 2: Configuração e Carga Inicial do Banco de Dados

Aqui intercede o `@data-engineer` montando as vigas brutas:

- Roda o dry-run da Migration inicial.
- Aplica a modelagem nas tabelas.
- Instancia os Seeds (dados fantasias cruciais pro teste) e crava com o `smoke-test`.

### Fase 3: A Ambiente de Endpoints (Loop de Sprints)

Guiado pelas Stories fracionadas pelo `@po`:

- `@sm` extrai as tarefas isoladas de manipulação de banco e rotas.
- `@dev` digita o Service Layer.
- `@qa` sobe as malhas de testes testando estritamente: Endpoints retornando Payload blindado, Edge Cases sistêmicos e validações severas de Segurança nos Tokens de Auth.

## 3. Expectativa Binária ao Final

- Schema de arquitetura PostgreSQL em live rodando as Row-Level-Security contra injeções.
- Toda request documentada em um Swagger ou spec baseada no código commitável.
