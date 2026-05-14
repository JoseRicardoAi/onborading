# {{TASK_TITLE}}

> Task ID: {{TASK_ID}}
> Agent: {{AGENT_NAME}}
> Version: {{VERSION}}

## Descrição

{{TASK_DESCRIPTION}}

{{#IF_CONTEXT_REQUIRED}}

## Contexto Necessário

{{CONTEXT_DESCRIPTION}}
{{/IF_CONTEXT_REQUIRED}}

## Pré-requisitos

{{#EACH_PREREQUISITES}}

- {{PREREQUISITE}}
  {{/EACH_PREREQUISITES}}

## Workflow

{{#IF_INTERACTIVE_ELICITATION}}

### Elicitação Interativa

Esta task usa elicitação interativa para coletar informações do usuário.

1. **Coletar Informações Básicas**
   - {{ELICIT_STEP_1}}
2. **Coletar Detalhes Adicionais**
   - {{ELICIT_STEP_2}}
3. **Confirmar e Revisar**
   - {{ELICIT_STEP_3}}
     {{/IF_INTERACTIVE_ELICITATION}}

### Passos

{{#EACH_STEPS}}
{{STEP_NUMBER}}. **{{STEP_TITLE}}**
{{STEP_DESCRIPTION}}
{{#IF_STEP_VALIDATION}}

- Validação: {{STEP_VALIDATION}}
  {{/IF_STEP_VALIDATION}}
  {{/EACH_STEPS}}

## Output

{{OUTPUT_DESCRIPTION}}

{{#IF_OUTPUT_FORMAT}}

### Formato de Output

```{{OUTPUT_FORMAT_TYPE}}
{{OUTPUT_FORMAT_TEMPLATE}}
```

{{/IF_OUTPUT_FORMAT}}

## Critérios de Sucesso

{{#EACH_SUCCESS_CRITERIA}}

- [ ] {{SUCCESS_CRITERION}}
      {{/EACH_SUCCESS_CRITERIA}}

{{#IF_ERROR_HANDLING}}

## Tratamento de Erros

{{#EACH_ERROR_CASES}}

- **{{ERROR_CASE}}**: {{ERROR_HANDLING}}
  {{/EACH_ERROR_CASES}}
  {{/IF_ERROR_HANDLING}}

## Notas

{{#EACH_NOTES}}

- {{NOTE}}
  {{/EACH_NOTES}}
