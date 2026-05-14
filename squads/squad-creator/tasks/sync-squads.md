# \*sync-squads

Sincroniza um squad local com um repositório remoto ou sistema de distribuição configurado.

## Uso

```bash
@squad-chief
*sync-squads {path-to-squad}
```

## Protocolo de Execução

1. **Validar Localmente**:
   - Verificar existência de `squad.yaml`.
   - Validar schema básico (campos obrigatórios: name, version, aiox.type, components).
   - Executar `*validate-squad {squad-name}` — deve retornar VÁLIDO antes de prosseguir.

2. **Preparar Payload**:
   - Gerar checksum SHA-256 dos arquivos do squad.
   - Carregar metadados do manifesto.

3. **Configuração do Destino**:
   - Verificar se o destino de distribuição está configurado no projeto.
   - Destinos suportados:
     - **GitHub** (via PR para repositório configurado)
     - **NPM** (via `npm publish` para pacotes `@aiox-squads/`)
     - **Local** (apenas versionamento local com Git)
   - Se nenhum destino estiver configurado, perguntar ao usuário qual utilizar.

4. **Executar Sync**:
   - Para GitHub: criar branch `squad/{squad-name}-v{version}` e abrir PR.
   - Para NPM: preparar `package.json` compatível e executar `npm publish`.
   - Para Local: confirmar com o usuário e commitar via Git.

5. **Reportar**:
   - Mostrar confirmação de onde o squad foi sincronizado.
   - Reportar versão sincronizada.

## Erros Comuns

- Squad inválido: "ERRO: squad.yaml ausente ou corrompido."
- Validação reprovada: "ERRO: *validate-squad retornou VETADO. Corrija antes de sincronizar."
- Destino não configurado: "Nenhum destino de distribuição encontrado. Qual destino usar? (GitHub / NPM / Local)"
