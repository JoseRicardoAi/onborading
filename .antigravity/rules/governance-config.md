# AIOX Governance Pipeline — Configuração

Este arquivo controla o comportamento de cada regra de governança e é lido pela skill central (SKILL.md).

```yaml
# AIOX Governance Pipeline — Configuração
# Valores possíveis por regra: BLOCKED | REQUIRES_APPROVAL | ALLOWED | disabled
# governance_mode: active (padrão) | disabled (desativa tudo)

governance:
  mode: active # Mude para 'disabled' para desativar completamente o AGP em cenários Turbo

  rules:
    architecture_first: REQUIRES_APPROVAL # Pede confirmação antes de criar em supabase/
    mind_clone_dna: BLOCKED # Nunca cria agente sem DNA (Mind Clones exigem veracidade)
    sql_ddl: BLOCKED # Nunca executa DDL direto, reforça uso de schema migrations via supabase
    git_push_authority: REQUIRES_APPROVAL # Pede confirmação de push se agente != @devops
    write_path: ALLOWED # Só avisa corrigindo/confirmando paths recomendados, não bloqueia
    slug_format: ALLOWED # Altera snake_case de slugs em runtime de maneira silenciosa e permite seguir
```

## Referência dos Valores de Configuração

| Valor               | Comportamento                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLOCKED`           | Sempre bloqueia a execução no runtime, impedindo a continuidade da tool/operação sem obedecer os requisitos. |
| `REQUIRES_APPROVAL` | Para a operação e alerta a necessidade de confirmação do usuário por via explícita na UI/Terminal. Uso do `notify_user`                      |
| `ALLOWED`           | A operação notifica e corrige no fluxo subjacente (como padronizar slugs), prosseguindo com execução sem pausas.                             |
| `disabled`          | Desativa de forma singular a aplicação daquela regra e seu gatilho.                                                                          |
| `mode: disabled`    | Desativa o AGP inteiro. As `skills` relacionadas pulam iterações e operam no modo _Turbo_.                                                   |

## Exemplos de Configurações Alternativas

### Modo Turbo (Desenvolvimento Local Ágil e Sem Interrupções)

```yaml
governance:
  mode: disabled
```

### Modo Leve (Bloqueia apenas riscos críticos, como banco de dados e personas)

```yaml
governance:
  mode: active
  rules:
    architecture_first: ALLOWED
    mind_clone_dna: BLOCKED
    sql_ddl: BLOCKED
    git_push_authority: ALLOWED
    write_path: disabled
    slug_format: disabled
```

### Modo Auditoria (Estritamente Manual)

```yaml
governance:
  mode: active
  rules:
    architecture_first: REQUIRES_APPROVAL
    mind_clone_dna: REQUIRES_APPROVAL
    sql_ddl: REQUIRES_APPROVAL
    git_push_authority: REQUIRES_APPROVAL
    write_path: REQUIRES_APPROVAL
    slug_format: REQUIRES_APPROVAL
```
