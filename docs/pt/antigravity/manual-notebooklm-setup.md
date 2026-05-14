# Guia Manual: Configuração de Skills com NotebookLM

Como optamos por processar as diretrizes visualmente de forma manual e não utilizar o AIOX (Google NotebookLM MCP) para se auto-alimentar de forma autônoma sem supervisão nas etapas iniciais, siga este roteiro exato para a criação das Skills da sua Squad de Design System no site do NotebookLM.

Este processo garante a "Ancoragem de Contexto", provendo não apenas a documentação da ferramenta genérica, mas forçando que as IAs usem os _Design Tokens_ específicos do seu projeto. Sempre que criar um **novo projeto**, você deverá realizar esse passo a passo usando os arquivos de diretrizes (`yaml` e `md`) localizados na pasta de arquitetura do novo projeto.

---

## 🌐 1. Criando o Notebook do Web Design System (Angular)

1. **Acesso:** Entre em [notebooklm.google.com](https://notebooklm.google.com/) e clique em **New Notebook** (Novo Caderno).
2. **Nomeie o Notebook:** `[NOME_DO_PROJETO] Design System Web - ng-zorro` (exemplo: `[MeuApp] Design System Web`).
3. **Adição das Fontes (Upload Sources):**
   - **Fonte A (A Ferramenta):** Clique em *Link > Website* e cole a URL oficial: `https://ng.ant.design/docs/introduce/en`.
   - **Fonte B (A Identidade Visual):** Clique em *Text* (Texto copiado) e cole o conteúdo inteiro do arquivo referente à sua identidade visual, por exemplo, o arquivo `projetos/[seu-projeto]/docs/architecture/ui-guidelines-web.yaml`.
   - **Fonte C (A Regra de Arquitetura):** Clique em *Text* (Texto copiado) e cole o conteúdo do arquivo com as regras do seu projeto, por exemplo, `projetos/[seu-projeto]/docs/architecture/implementation-rules-web.md`.
4. **Instruções do Sistema (System Instructions) no NotebookLM:**
   - Procure pelas configurações do Chat de Caderno e fixe as seguintes instruções comportamentais para a IA da plataforma:
   > _"Você é o @web-ds-architect do Antigravity. Sua missão é gerar componentes visuais para o dashboard do projeto baseados puramente nas ferramentas definidas nas Regras de Arquitetura (ex: ng-zorro no Angular 21), sobrescrevendo a aparência através das variáveis (SCSS/CSS) descritas nas regras. Quando lhe pedirem o código de uma tela ou botão, siga as restrições arquiteturais. Responda apenas com os respectivos arquivos de frontend aplicando as cores Hexadecimais e tipografias obrigatórias descritas nos arquivos das nossas diretrizes de UI."_

## 📱 2. Criando o Notebook do Mobile Design System (Flutter)

1. **Acesso:** Entre em [notebooklm.google.com](https://notebooklm.google.com/) e clique em **New Notebook** (Novo Caderno).
2. **Nomeie o Notebook:** `[NOME_DO_PROJETO] Design System Mobile - shadcn`.
3. **Adição das Fontes (Upload Sources):**
   - **Fonte A (A Ferramenta):** Clique em *Link > Website* e cole a URL oficial pertinente (ex: `https://mariuti.com/flutter-shadcn-ui/`).
   - **Fonte B (A Identidade Visual):** Clique em *Text* (Texto copiado) e cole o conteúdo inteiro do arquivo `projetos/[seu-projeto]/docs/architecture/ui-guidelines-mobile.yaml`.
   - **Fonte C (A Regra de Arquitetura):** Clique em *Text* (Texto copiado) e cole o conteúdo do arquivo `projetos/[seu-projeto]/docs/architecture/implementation-rules-mobile.md`.
4. **Instruções do Sistema (System Instructions) no NotebookLM:**
   - Fixe as seguintes instruções comportamentais:
   > _"Você é o @mobile-ds-architect do Antigravity. Sua missão é gerar componentes visuais para o app alvo baseados puramente nas ferramentas requeridas (ex: flutter-shadcn-ui em Dart/Flutter). Nunca defina cores fixas (hardcoded) direto no Widget gerado; em vez disso, assegure que o tema global do App (ThemeData) carregue as cores Hexadecimais oficiais do Guideline. Construa código escalável, focado em responsividade para tablets e celulares."_

---

### Executando o Fluxo de Trabalho (Handoff do Desenvolvedor)

Ao completar estes Notebooks na criação do seu projeto, a "Cerefa/Skill" do Design System estará perfeitamente delineada globalmente. A squad global de `design-system` do Antigravity será capaz de consultar este Notebook para gerar os layouts.

Quando você (humano) for construir a versão inicial de uma interface, fará o seguinte:

- Copie os dados técnicos (backend requirements) do PRD.
- Abra a interface do seu novo NotebookLM criado.
- Faça o prompt delegando o trabalho, ex: _"Construa a tela de listagem de produtos XYZ que está na imagem raiz. Ela precisa ter um painel lateral e botões de ação primária. Construa o template principal invocando componentes isolados. Retorne todos os arquivos seguindo estritamente as regras de UI enviadas como fonte."_

A resposta da IA estará blindada contra alucinações de design.
