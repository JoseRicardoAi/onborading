---
name: 'skill-mobile-design-system'
description: 'Como aplicar e estruturar telas mobile do projeto alvo seguindo as diretrizes arquiteturais e o Design System configurado no NotebookLM.'
---
# Skill: Implementação do Design System Mobile (Global)

Esta skill é genérica e opera sobre **qualquer projeto** no ambiente Codex/AIOX.
As regras tecnológicas concretas (stack: Flutter, React Native, etc.) são fornecidas pelas seguintes fontes do projeto corrente:

- `{CAMINHO_DO_PROJETO}/docs/architecture/ui-guidelines-mobile.yaml` — Tokens de Design (cores, tipografia, espaçamentos)
- `{CAMINHO_DO_PROJETO}/docs/architecture/implementation-rules-mobile.md` — Regras arquiteturais da stack mobile eleita

> **Onde `{CAMINHO_DO_PROJETO}`** é o caminho raiz do projeto informado pelo usuário no início da sessão.

---

### 0. REGRA MATRIZ: INTEGRAÇÃO DINÂMICA OBRIGATÓRIA (SEMPRE EXECUTE PRIMEIRO)

Antes de construir **qualquer** widget, componente ou tela, o agente **DEVE OBRIGATORIAMENTE** consultar a base de conhecimento dinâmica do projeto atual.

Use a tool `mcp_notebooklm_notebook_query`:
- `notebook_id`: `{{PROJECT_MOBILE_NOTEBOOK_ID}}` _(variável fornecida no contexto da sessão)_
- `query`: "Quais as regras específicas, restrições e exemplos de uso para o componente [NOME DO COMPONENTE] usando a stack mobile definida nas diretrizes do projeto?"

> **Como obter o ID do NotebookLM Mobile:** Solicite ao usuário o ID do notebook que contém as diretrizes do Design System Mobile do projeto, ou leia o arquivo `docs/architecture/notebook-ids.yaml` no projeto alvo.

**Só após ler essa resposta você pode prosseguir com a implementação mobile.**

---

## 1. Stack Tecnológica (Lida do Projeto)
A stack do projeto (ex: Flutter + shadcn, React Native + NativeWind) é definida no arquivo `implementation-rules-mobile.md` do projeto alvo.
Leia-o ANTES de gerar qualquer código e extraia:
- **Core Framework** (ex: Flutter 3.x/Dart, React Native)
- **Biblioteca de UI** (ex: flutter-shadcn-ui, NativeWind, Expo UI)
- **Solução de Gerenciamento de Estado** (ex: Riverpod, BLoC, Zustand)
- **Padrão Arquitetural** (ex: Clean Architecture, Feature-First)

## 2. Paradigma de Estilização e Design System
- **Fonte Única de Verdade:** O arquivo `ui-guidelines-mobile.yaml` é a única referência permitida para tokens de cores (Light/Dark), tipografia, tamanhos, espaçamentos e sombras.
- **Regra de Ouro:** **Nunca** declare cores, tamanhos de fonte ou espaçamentos de forma manual (hardcoded) em widgets/componentes individuais. Todo valor deve ser rastreado de volta a um token do YAML.
- **Arquivo de Tema:** A conversão dos tokens para o framework deve ser centralizada no arquivo de tema principal do projeto (ex: `app_theme.dart` no Flutter, `theme.ts` no React Native).

## 3. Arquitetura de Código (Princípios Universais)
Independente do framework, aplique separação de responsabilidades:
- A camada de **apresentação** (widgets/components) **não deve importar** diretamente da camada de **dados** (repositories/services).
- A camada de **domínio/regras de negócio** não pode depender de nenhum framework externo.
- Repositórios devem utilizar interfaces/abstract classes para facilitar mocks em testes.

## 4. Gerenciamento de Estado (Leia as Regras do Projeto)
A escolha do gerenciador de estado (Riverpod, BLoC, Context API, Zustand, etc.) é definida nas `implementation-rules-mobile.md` do projeto. Siga o mapeamento rigoroso definido lá para a escolha dos providers/stores/notifiers adequados a cada cenário.

**Princípios universais:**
- Exponha **apenas** o estado mínimo necessário para cada tela.
- Evite acoplamento de lógica de negócio em StatefulWidgets/componentes visuais.
- Forçar atualização de dados deve usar os meios do gerenciador (ex: `ref.invalidate()` no Riverpod).

## 5. Performance e Renderização UI (Princípios Universais)
- Extraia widgets/componentes que atualizam com alta frequência para classes próprias com construtores imutáveis (ex: `const` no Flutter).
- **Sempre** utilize listas virtualizadas para listas dinâmicas (ex: `ListView.builder` no Flutter).
- Painéis analíticos devem ser responsivos, adaptando-se entre tablets e celulares.
- Processe cargas pesadas de CPU (ex: parse de grandes payloads JSON) em isolates/threads separadas para não travar a UI.
- **Skeleton Loading:** Implemente shimmer effects em todas as telas que aguardam dados da API.

## 6. Qualidade de Código e Segurança
- **Segurança de API:** É expressamente proibido usar API Keys em texto claro (hardcoded). Use variáveis de ambiente/configuração injetadas.
- **Tipagem Forte:** Prefira tipos explícitos. Evite `dynamic`, `any`, `var` quando não estritamente necessários.
- **Assincronismo:** Padronize o uso de async/await. Nunca misture padrões de callbacks com Promises/Futures no mesmo fluxo.
- **Memory Leaks:** Garanta cancelamento de streams e controllers no `dispose`/`unmount` dos componentes.
