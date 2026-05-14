# Task: check-slug-format

## Propósito

Previne uso de slugs despadronizados impondo o uso irrestrito de padrão _snake_case_, mas atua como script utilitário corrigindo sem interrupções ativas.

## Gatilho

Geração de qualquer ID, slug, _nome_ de agente, ou string formatada baseada no nome passado pela query/input.

## Input Necessário

- `proposed_slug`: Objeto String em via de conversão.

## Procedimento de Validação

1. Avalie o pattern proposto de string mentalmente contra `^[a-z0-9]+(_[a-z0-9]+)*$`
2. Descubra erros semânticos (Presença de espaço, Maiúsculas _camelCase_, separador hífen `-`, pontos `.` ou underscores múltiplos).
3. Transforme via correção lógica:
   - `-` , `.`, ` ` viram `_`.
   - `camelCase` ganha `_` entre cases e cai para minúsculo geral.
   - Símbolos aleatórios especiais sofrem drop.

## Caminhos de Decisão

- Sempre validar, se sujo, transformar em runtime o valor de `proposed_slug`.
- Como a task serve para corrigir o payload mental, independentemente de haver erro ele retorna RESULT: ALLOWED.

## Formato de Output

> Diferente de outros validadores bloqueadores explícitos, este atua como um corretor sintático interno de passagem.

RESULT: ALLOWED
Motivo: O formato é válido desde a origem.

— OU —

RESULT: ALLOWED
Motivo: Formato ajustado. Substitua o termo `{proposed_slug}` original nas suas chamadas futuras de ID/filenames pela versão normalizada `{new_slug}` fornecida pelo validador.

## Casos de Teste

| Cenário | Input                | Resultado Esperado                                                                        |
| ------- | -------------------- | ----------------------------------------------------------------------------------------- |
| 1       | "jose_carlos_amorim" | ALLOWED                                                                                   |
| 2       | "jose-carlos-amorim" | ALLOWED (com recomendacao de auto-troca mental na criação base para `jose_carlos_amorim`) |
| 3       | "JoseCarlosAmorim"   | ALLOWED (com recomendacao para `jose_carlos_amorim`)                                      |
| 4       | "workflow.execution" | ALLOWED (sugerir `workflow_execution`)                                                    |
| 5       | "squad v2"           | ALLOWED (sugerir `squad_v2`)                                                              |
| 6       | "my_squad_2026"      | ALLOWED                                                                                   |
