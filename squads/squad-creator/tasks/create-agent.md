# \*create-agent

Cria um agente individual pronto para o runtime AIOX ativo, opcionalmente injetando DNA Mental.

## Runtime

Esta task e compartilhada e deve operar com a interface ativa persistida:

- Antigravity: usar templates e capacidades nativas em `.antigravity/`.
- Codex: usar templates e capacidades equivalentes em `.codex/`.

Nenhuma execucao deve gerar ou adaptar artefatos nas duas interfaces ao mesmo tempo.

## Uso

```
@squad-chief
*create-agent {name} --domain {domain} --dna {path-to-dna}
```

## Protocolo

1. **Carregar Template**: Usar o template do runtime ativo:
   - Antigravity: `.antigravity/templates/agent-template.yaml`
   - Codex: `.codex/templates/agent-template.yaml`
2. **Injetar DNA** (se `--dna` presente):
   - Mapear `voice_dna` para Secao Persona.
   - Mapear `heuristics` para Secao Heuristics.
3. **Definir Ferramentas**:
   - Adicionar ferramentas ou capacidades core conforme o runtime ativo e o dominio.
4. **Validar**: Passar por `@pedro-valerio` para auditoria de quality gates.
5. **Salvar**: Escrever em `squads/{domain}/agents/{name}.md`.

## Quality Gate Checklist (SC_AGT_001)

- [ ] 70/30 ratio operacional/identitario.
- [ ] Minimo 5 heuristicas SE/ENTAO.
- [ ] Voice DNA capturado.
- [ ] Self-contained.
