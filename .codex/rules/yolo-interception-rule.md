# Interceptação de YOLO Mode vs Squad Padrão

O ambiente Codex deve evitar execução generalista quando a tarefa pede orquestração:

1. **YOLO Mode**: Execução assíncrona, acelerada e generalista onde a IA absorve a tarefa num único prompt e cospe a solução direta (sem orquestração de pares).
2. **SDC (Story Development Cycle) com Squads**: Linha de montagem industrial (com @pm, @architect, @ui-builder, @dev, @qa).

**Regra Principal de Interceptação**:
Quando a sessão Codex receber a criação de um aplicativo complexo, feature pesada, ou acionar workflows como Greenfield/SDC SEM mencionar explicitamente uma Squad limitadora de escopo ou orquestrador, você DEVE interromper a execução inicial e NÃO gerar nenhum código ou artefato sem alinhamento.

Comunique imediatamente ao usuário a seguinte mensagem (ou algo similar com a mesma intenção):
_'Atenção: Nenhuma Squad foi direcionada. Posso engolir essa requisição em modo agressivo e criá-la agora mesmo (YOLO Mode), correndo risco de pular passos da arquitetura, ou podemos engatar a **Squad Padrão** que vai acionar o SDC (Passo-a-passo orquestrado acionando o Arquiteto, UI-Builder via Stitch, QA, etc).'._

**Comportamento Pós-Aviso**:

- Aguarde a resposta do usuário.
- Se o usuário escolher **YOLO Mode (Opção 1)**, prossiga com a execução direta.
- Se o usuário escolher **Squad Padrão (Opção 2)**, detecte o contexto e roteia para o workflow correto:

## Roteamento Contextual (Squad Padrão)

| Contexto do Pedido | Workflow a Executar | Primeiro Agente |
|---|---|---|
| **Novo projeto do zero** (greenfield, criar app, MVP, SaaS, protótipo, "do zero") | `greenfield-fullstack.md` | `@devops` (bootstrap) → `@analyst` (brief) |
| **Nova API/backend do zero** | `greenfield-service.md` | `@analyst` → `@architect` |
| **Nova UI/frontend do zero** | `greenfield-ui.md` | `@ux` (spec) → `@dev` |
| **Implementar story específica** | `story-development-cycle.md` | `@sm` (draft) → `@po` (validate) |
| **Evoluir projeto existente** | `brownfield-fullstack.md` | `@architect` (discovery) |
| **Ideia → PRD → Backlog** | `spec-pipeline.md` | `@analyst` → `@pm` |

> **IMPORTANTE:** Sempre verifique que o AIOX está instalado no projeto antes de iniciar qualquer workflow.
> Exemplo: _"Para prosseguir com a Squad Padrão, confirme que o AIOX está instalado neste projeto (`.codex/` presente)."_
