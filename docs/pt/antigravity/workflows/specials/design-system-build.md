# Workflow: Design System Build

**Arquivo de origem nativo:** `.antigravity/workflows/design-system-build.md`

O processo **Design System Build & Quality** não é apenas sobre CSS — é a ambiente que codifica o núcleo visual de uma empresa, garantindo que o Botão Primário tenha exatamente o mesmo Hexadecimal, Raio da Borda e Sombra em 500 telas com a ajuda pesada das capacidades nativas do AntiGravity (Stitch MCP e Browser Subagent).

---

## 1. Gatilho de Uso (Quando invocar)

Use este workflow para:

- Erigir o chão de ambiente visual de um projeto Absolutamente Novo (Greenfield).
- Refatorar legados (Brownfield) transformando valores chumbados no CSS (`#ff0033`) em Tokens Organizacionais (`color.brand.primary`).
- Validar se o Time de Front não quebrou o alinhamento visual em diferentes tamanhos de tela (Breakpoints).

## 2. A Jornada Operacional (Fases)

### Fase 1: Auditoria ou Espionagem (@ux & @analyst)

- No mato existente (Legado), `@ux` caça valores corrompidos soltos pela aplicação para tentar criar lixeiras ou reaproveitar, extraindo o estado real.
- No mato verde (Novo), `@analyst` usa `search_web` caçando referências e guias oficiais das gigantes da tecnologia alinhando ao negócio do cliente.

### Fase 2: O Escultor de Tokens (@ux & @brad-frost)

As fundações visuais nascem: `@ux` estipula o dicionário de chaves em `design-tokens.yaml` contendo:

- Tipografia escalonável (H1...H6).
- Espaçamentos engessados (xs, sm, md, lg, xl).
- Cores de utilidade.
  Sendo guiados pela cartilha do especialista `@brad-frost`. **AntiGravity Engine:** O modelo de visão aciona o `generate_image`, criando pranchetas visuais da paleta para humanos verem antes do CSS iniciar.

### Fase 3: A Mágica do Stitch MCP (Gerador Guiado)

Aqui o AntiGravity humilha as IAs convencionais: Não escreve-se código as cegas.
O framework aciona o **Stitch MCP** (`generate-ui-screens`) passando a matriz de design definida acima e a IA do servidor Google funde o layout e desenha botões, modais, cards na engine visual e salva em `docs/design-system/screens/`. Você prevê a plataforma inteira na tela como se fosse um Webflow autônomo.

### Fase 4: O Chão de Prédio Atômico (@dev & @brad-frost)

O método Atomic Design é respeitado:

1. Codar **Atoms** (Inputs isolados, textos).
2. Costurar **Molecules** (Input + Label num Form Group).
3. Levantar **Organisms** (Cards densos, Navbars inteiras).

### Fase 5: QA Fotográfico

Outra função exclusiva AntiGravity: `@qa` ativa o `browser_subagent`. Em vez de testes matemáticos invisíveis Jest, a IA abre um Chromium na máquina local, clica fisicamente nos componentes e **Gera Vídeos WebP**, comprovando para o corpo executivo que as coisas existem com precisão e testando cores em Dark Mode e Light Mode real.

## 3. Matriz de Entregáveis

- Um repositório de Tokens (Yaml puro) servindo de fonte da verdade e Telas Visuais de Referência via Stitch.
- Hierarquia Atômica implementada.
- QA com prova irrefutável (WebP) documentando que a responsividade está limpa.
