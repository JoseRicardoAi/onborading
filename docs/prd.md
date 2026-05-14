# PRD: Sistema de Onboarding Du Ramo Locacoes

## 1. Goals and Background Context

### 1.1 Goals

- Centralizar o cadastro inicial de novos funcionarios da Du Ramo Locacoes.
- Permitir que RH/gestores e o funcionario preencham dados de onboarding sem exigir login do funcionario no MVP.
- Coletar informacoes pessoais, familiares, academicas, de saude relevante e contato de emergencia.
- Criar uma base confiavel para lembretes de aniversarios do funcionario, filhos e aniversario de casamento.
- Apoiar uma cultura interna de cuidado familiar, reconhecimento e comunicacao com colaboradores.
- Implantar o sistema como web app responsivo em `https://onboarding.duramo.com.br`, hospedado em VPS com Coolify.

### 1.2 Background Context

A Du Ramo Locacoes quer melhorar o processo de onboarding e estreitar a comunicacao com novos colaboradores. Hoje, as informacoes necessarias para acolhimento, emergencias, escala de horarios e reconhecimento familiar precisam ser reunidas de forma estruturada, segura e facil de consultar.

O sistema proposto sera inicialmente focado apenas no onboarding. Ele deve permitir cadastro orientado, formulario dinamico, acompanhamento administrativo e lembretes de datas importantes. Gamificacao e WhatsApp fazem parte da visao futura, mas ficam fora do MVP para manter a primeira entrega objetiva e segura.

### 1.3 Change Log

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-05-14 | 0.1 | PRD inicial criado a partir do project brief e decisoes do usuario | Morgan / Codex |

## 2. Scope

### 2.1 In Scope For MVP

- Web app responsivo.
- Painel administrativo para RH/gestores.
- Cadastro preliminar de funcionario por usuario interno.
- Formulario de onboarding acessado por link unico com token temporario.
- Cadastro pessoal, familiar, conjugal, saude, emergencia e vida academica.
- Campos condicionais e repetiveis para filhos.
- Status do onboarding.
- Indicador de completude do cadastro.
- Lembretes de datas importantes em painel.
- Notificacoes por e-mail para lembretes.
- Exportacao administrativa sugerida em CSV/Excel.
- Deploy em VPS com Coolify.

### 2.2 Out Of Scope For MVP

- Login proprio do funcionario.
- Aplicativo mobile nativo.
- WhatsApp.
- Gamificacao.
- Ranking, pontos ou badges.
- Integracao com sistemas externos.
- Folha de pagamento.
- Gestao completa de funcionarios apos onboarding.
- Assinatura digital de documentos.
- Upload documental, salvo se priorizado posteriormente.

## 3. Users and Personas

### 3.1 RH / Administrativo

Usuario interno responsavel por iniciar cadastros, gerar links, acompanhar pendencias, revisar dados e consultar aniversarios.

### 3.2 Gestor Autorizado

Usuario interno que consulta informacoes relevantes do onboarding, incluindo status, contatos de emergencia, dados familiares e observacoes academicas que possam impactar escala.

### 3.3 Funcionario Em Onboarding

Pessoa convidada a preencher o formulario por link unico. Nao possui login no MVP. Pode concluir o cadastro e enviar as informacoes para revisao interna.

## 4. Requirements

### 4.1 Functional Requirements

- FR1: O sistema deve permitir que um usuario interno crie um cadastro preliminar de funcionario.
- FR2: O cadastro preliminar deve permitir informar, no minimo, nome completo e e-mail ou outro canal operacional definido pela empresa.
- FR3: O sistema deve gerar um link unico com token temporario para cada onboarding.
- FR4: O link unico deve abrir somente o formulario do funcionario associado ao token.
- FR5: O token deve ter prazo de expiracao configuravel, com sugestao inicial de 7 ou 15 dias.
- FR6: O RH deve poder copiar ou enviar por e-mail o link unico do formulario.
- FR7: O formulario deve permitir coletar nome completo, data de nascimento, numero de celular, e-mail, Instagram e endereco residencial.
- FR8: O formulario deve perguntar se o funcionario tem filhos.
- FR9: Quando o funcionario tiver filhos, o formulario deve permitir cadastrar um ou mais filhos.
- FR10: Cada filho cadastrado deve conter nome, genero e data de aniversario.
- FR11: O formulario deve permitir adicionar e remover blocos de filho antes do envio final.
- FR12: O formulario deve perguntar se o funcionario e casado ou amasiado.
- FR13: Quando o funcionario for casado ou amasiado, o formulario deve coletar nome do conjuge, telefone do conjuge e data de aniversario de casamento.
- FR14: O formulario deve coletar informacoes de saude relevantes, incluindo medicamento continuo, alergias, condicoes relevantes para emergencia, restricoes fisicas ou recomendacoes medicas e observacoes adicionais.
- FR15: O formulario deve solicitar consentimento explicito para armazenamento e uso das informacoes de saude.
- FR16: O formulario deve coletar contato de emergencia com nome do familiar/responsavel, numero de celular e endereco.
- FR17: O formulario deve perguntar se o funcionario esta cursando curso tecnico ou faculdade.
- FR18: Quando o funcionario estiver estudando, o formulario deve coletar instituicao, curso, horario e previsao de termino.
- FR19: O sistema deve permitir envio final do formulario pelo funcionario.
- FR20: Apos envio final, o cadastro deve mudar para status "Cadastro completo".
- FR21: Apos envio final, o link deve deixar de aceitar alteracoes.
- FR22: O RH deve poder reabrir um cadastro ou gerar novo link quando necessario.
- FR23: O sistema deve permitir que usuario interno preencha ou edite dados do funcionario durante o onboarding.
- FR24: O sistema deve manter status do cadastro: "Cadastro iniciado", "Pendente de informacoes", "Cadastro completo" e "Revisado".
- FR25: O sistema deve exibir percentual de completude do cadastro.
- FR26: O painel administrativo deve listar funcionarios cadastrados.
- FR27: O painel administrativo deve permitir filtrar cadastros por status.
- FR28: O painel administrativo deve exibir aniversariantes do mes.
- FR29: O sistema deve gerar lembretes para aniversario do funcionario, aniversario dos filhos e aniversario de casamento.
- FR30: O sistema deve permitir notificacoes por e-mail para lembretes.
- FR31: O sistema deve permitir configurar quem recebe os e-mails de lembrete.
- FR32: O sistema deve permitir configurar antecedencia dos lembretes, com sugestao inicial de 7 dias antes e no dia do evento.
- FR33: O painel administrativo deve permitir consultar contato de emergencia do funcionario.
- FR34: O painel administrativo deve permitir consultar informacoes academicas que possam impactar escala.
- FR35: O sistema deve registrar data de criacao e data de ultima atualizacao do cadastro.
- FR36: O sistema deve permitir exportacao administrativa dos cadastros e/ou aniversariantes em formato CSV ou Excel.

### 4.2 Non Functional Requirements

- NFR1: A aplicacao deve ser web responsiva e funcionar bem em desktop, tablet e celular.
- NFR2: A aplicacao deve ser publicada com HTTPS em `https://onboarding.duramo.com.br`.
- NFR3: O sistema deve ser implantavel em VPS gerenciada por Coolify.
- NFR4: O sistema deve proteger dados pessoais e dados sensiveis de saude.
- NFR5: O sistema deve registrar consentimento explicito para dados de saude antes do envio final.
- NFR6: O sistema deve restringir acesso administrativo a usuarios internos autorizados.
- NFR7: No MVP, todos os usuarios administrativos autorizados poderao visualizar dados de saude, conforme decisao do produto.
- NFR8: O PRD reconhece que dados de saude possuem maior risco LGPD; a empresa deve validar politica interna de acesso e uso.
- NFR9: Tokens de acesso ao formulario devem ser longos, nao previsiveis e armazenados de forma segura.
- NFR10: Tokens expirados ou ja finalizados nao devem permitir edicao do formulario.
- NFR11: O sistema deve ser simples de operar, atualizar e fazer backup na VPS.
- NFR12: O sistema deve suportar backups regulares do banco de dados.
- NFR13: O sistema deve exibir mensagens claras de erro, expiracao de link e cadastro concluido.
- NFR14: O sistema deve ser projetado para evoluir com WhatsApp e gamificacao em fases futuras.

## 5. User Interface Design Goals

### 5.1 Overall UX Vision

A experiencia deve ser clara, acolhedora e objetiva. O funcionario deve sentir que esta preenchendo um formulario de boas-vindas, nao um processo burocratico pesado. Para o RH, a interface deve ser administrativa, rapida de consultar e organizada por status, pendencias e datas importantes.

### 5.2 Key Interaction Paradigms

- Formulario em etapas para reduzir carga cognitiva.
- Campos condicionais exibidos apenas quando necessarios.
- Lista dinamica para adicionar multiplos filhos.
- Indicador visual de progresso do formulario.
- Painel administrativo com filtros e busca.
- Calendario ou lista de proximas datas importantes.

### 5.3 Core Screens and Views

- Tela de login administrativo.
- Dashboard administrativo.
- Lista de funcionarios em onboarding.
- Criacao de cadastro preliminar.
- Detalhe do cadastro do funcionario.
- Geracao e reenvio de link unico.
- Formulario publico por token.
- Tela de envio concluido.
- Tela de link expirado.
- Calendario/lista de aniversarios e datas familiares.
- Tela de configuracoes de lembrete.

### 5.4 Accessibility

Meta recomendada: WCAG AA onde for viavel para o MVP.

### 5.5 Branding

Usar identidade visual da Du Ramo Locacoes quando houver guia de marca disponivel. Na ausencia de guia formal, usar visual profissional, limpo e acolhedor, evitando excesso de elementos decorativos.

### 5.6 Target Device and Platforms

Web responsivo para desktop, tablet e celular.

## 6. Technical Assumptions

### 6.1 Repository Structure

Monorepo recomendado para o MVP, com frontend, backend e configuracoes de deploy no mesmo repositorio.

### 6.2 Service Architecture

Arquitetura recomendada para avaliacao do Architect: monolito modular ou fullstack app unico, com API interna, banco relacional e job agendado para lembretes. Essa abordagem reduz complexidade operacional na VPS e facilita deploy via Coolify.

### 6.3 Deployment

- Dominio alvo: `https://onboarding.duramo.com.br`.
- Infraestrutura: VPS com Coolify.
- Deploy sugerido: containerizado.
- E-mail: provedor SMTP ainda a definir.

### 6.4 Testing Requirements

Recomendacao inicial:

- Testes unitarios para validacoes e regras de token.
- Testes de integracao para formulario, cadastro e lembretes.
- Teste manual guiado para fluxo completo de onboarding.
- Teste responsivo em desktop e mobile antes de producao.

### 6.5 Additional Technical Assumptions and Requests

- Banco relacional recomendado por haver entidades bem estruturadas e relacoes claras.
- Jobs agendados devem processar lembretes de datas importantes.
- E-mail deve ser abstraido para permitir troca futura de provedor.
- WhatsApp deve ser considerado extensao futura, sem acoplamento direto no MVP.
- Gamificacao futura deve ser planejada sem bloquear o modelo inicial.

## 7. Epic List

- Epic 1: Fundacao, Deploy E Acesso Administrativo: preparar a base tecnica, ambiente web, login administrativo e estrutura inicial implantavel.
- Epic 2: Cadastro Preliminar E Link Unico: permitir que RH crie onboarding e gere links temporarios para funcionarios.
- Epic 3: Formulario De Onboarding: entregar formulario responsivo com campos pessoais, familiares, conjugais, saude, emergencia e vida academica.
- Epic 4: Painel Administrativo E Revisao: permitir acompanhamento, edicao interna, status, completude e revisao dos cadastros.
- Epic 5: Lembretes E Exportacao: entregar calendario/lista de datas importantes, e-mails de lembrete e exportacao administrativa.

## 8. Epic Details

### Epic 1: Fundacao, Deploy E Acesso Administrativo

Estabelecer a aplicacao web, configuracao de ambiente, estrutura de banco, autenticacao administrativa e deploy inicial em ambiente preparado para Coolify. Ao fim deste epic, o time deve ter uma base navegavel e protegida para iniciar os fluxos de onboarding.

#### Story 1.1: Base Da Aplicacao Web

As a usuario administrativo,
I want acessar uma aplicacao web inicial,
so that eu saiba que o sistema esta online e pronto para evolucao.

Acceptance Criteria:

1. A aplicacao possui pagina inicial administrativa ou tela de login.
2. A aplicacao roda localmente em ambiente de desenvolvimento.
3. A aplicacao possui configuracao basica para deploy em Coolify.
4. A aplicacao possui health check simples.

#### Story 1.2: Autenticacao Administrativa

As a RH ou gestor autorizado,
I want acessar o painel com credenciais administrativas,
so that somente usuarios internos possam visualizar dados de onboarding.

Acceptance Criteria:

1. Usuario administrativo consegue fazer login.
2. Usuario nao autenticado nao acessa painel administrativo.
3. Sessao administrativa pode ser encerrada.
4. Fluxo de erro de login e claro.

#### Story 1.3: Estrutura Inicial De Dados

As a sistema,
I want persistir cadastros de onboarding,
so that os dados possam ser consultados e evoluidos nos proximos epics.

Acceptance Criteria:

1. Existe estrutura persistente para funcionario/onboarding.
2. Existe estrutura para status do onboarding.
3. Existe registro de criacao e ultima atualizacao.
4. Estrutura suporta extensao para filhos, conjuge, saude, emergencia e educacao.

### Epic 2: Cadastro Preliminar E Link Unico

Permitir que RH inicie um onboarding e gere um link unico com token temporario. Ao fim deste epic, um funcionario podera abrir seu formulario sem login usando um link seguro.

#### Story 2.1: Criar Cadastro Preliminar

As a RH,
I want criar um cadastro preliminar de funcionario,
so that eu possa iniciar o onboarding antes do funcionario preencher todos os dados.

Acceptance Criteria:

1. RH consegue cadastrar nome completo e e-mail do funcionario.
2. Cadastro recebe status "Cadastro iniciado".
3. Cadastro aparece na lista administrativa.
4. Sistema registra data de criacao.

#### Story 2.2: Gerar Link Unico

As a RH,
I want gerar um link unico para o funcionario,
so that ele possa preencher o formulario sem login.

Acceptance Criteria:

1. Sistema gera token unico e nao previsivel.
2. Link fica associado a um cadastro especifico.
3. Link possui data de expiracao configuravel.
4. RH consegue copiar o link.

#### Story 2.3: Validar Link Do Funcionario

As a funcionario,
I want abrir meu formulario por link,
so that eu possa preencher meus dados com seguranca.

Acceptance Criteria:

1. Link valido abre o formulario correto.
2. Link expirado exibe tela de expiracao.
3. Link finalizado nao permite nova edicao.
4. Link invalido nao revela dados internos.

### Epic 3: Formulario De Onboarding

Entregar o formulario responsivo de onboarding com todos os blocos de informacao definidos para o MVP. Ao fim deste epic, o funcionario podera preencher e enviar o cadastro completo.

#### Story 3.1: Dados Pessoais

As a funcionario,
I want informar meus dados pessoais,
so that a empresa tenha informacoes basicas para meu onboarding.

Acceptance Criteria:

1. Formulario coleta nome completo.
2. Formulario coleta data de nascimento.
3. Formulario coleta numero de celular.
4. Formulario coleta e-mail.
5. Formulario coleta Instagram.
6. Formulario coleta endereco residencial.

#### Story 3.2: Filhos Com Blocos Dinamicos

As a funcionario com filhos,
I want cadastrar um ou mais filhos,
so that a empresa possa lembrar datas familiares importantes.

Acceptance Criteria:

1. Formulario pergunta se o funcionario tem filhos.
2. Se resposta for nao, campos de filhos nao sao obrigatorios.
3. Se resposta for sim, funcionario pode adicionar filho.
4. Cada filho coleta nome, genero e data de aniversario.
5. Funcionario pode adicionar mais de um filho.
6. Funcionario pode remover filho antes do envio.

#### Story 3.3: Conjuge

As a funcionario casado ou amasiado,
I want informar dados do meu conjuge,
so that a empresa possa reconhecer datas familiares importantes.

Acceptance Criteria:

1. Formulario pergunta se o funcionario e casado ou amasiado.
2. Se resposta for nao, campos de conjuge nao sao obrigatorios.
3. Se resposta for sim, formulario coleta nome do conjuge.
4. Se resposta for sim, formulario coleta telefone do conjuge.
5. Se resposta for sim, formulario coleta data de aniversario de casamento.

#### Story 3.4: Saude E Consentimento

As a funcionario,
I want informar dados de saude relevantes com consentimento,
so that a empresa tenha informacoes importantes em caso de emergencia.

Acceptance Criteria:

1. Formulario pergunta sobre medicamento de uso continuo.
2. Formulario pergunta sobre alergias.
3. Formulario permite informar condicao relevante para emergencia.
4. Formulario permite informar restricao fisica ou recomendacao medica.
5. Formulario possui campo de observacoes adicionais.
6. Formulario exige consentimento explicito para dados de saude antes do envio final.

#### Story 3.5: Contato De Emergencia

As a funcionario,
I want informar um contato de emergencia,
so that a empresa saiba quem acionar quando necessario.

Acceptance Criteria:

1. Formulario coleta nome do familiar ou responsavel.
2. Formulario coleta numero de celular.
3. Formulario coleta endereco do responsavel.

#### Story 3.6: Vida Academica

As a funcionario estudante,
I want informar meus estudos e horarios,
so that a empresa possa considerar impactos na escala.

Acceptance Criteria:

1. Formulario pergunta se o funcionario cursa tecnico ou faculdade.
2. Se resposta for nao, campos academicos nao sao obrigatorios.
3. Se resposta for sim, formulario coleta instituicao.
4. Se resposta for sim, formulario coleta curso.
5. Se resposta for sim, formulario coleta horario do curso.
6. Se resposta for sim, formulario coleta previsao de termino.

#### Story 3.7: Envio Final

As a funcionario,
I want enviar meu formulario concluido,
so that o RH possa revisar meu onboarding.

Acceptance Criteria:

1. Funcionario consegue revisar dados antes do envio final.
2. Sistema valida campos obrigatorios.
3. Ao enviar, cadastro muda para "Cadastro completo".
4. Link deixa de aceitar alteracoes apos envio.
5. Tela de sucesso confirma o envio.

### Epic 4: Painel Administrativo E Revisao

Dar ao RH e gestores autorizados visao operacional dos cadastros, pendencias e dados coletados. Ao fim deste epic, a equipe interna podera acompanhar e revisar o onboarding.

#### Story 4.1: Lista De Cadastros

As a RH,
I want ver uma lista de funcionarios em onboarding,
so that eu consiga acompanhar o andamento dos cadastros.

Acceptance Criteria:

1. Painel lista funcionarios cadastrados.
2. Lista mostra status do onboarding.
3. Lista mostra data de criacao ou ultima atualizacao.
4. Lista permite busca por nome.

#### Story 4.2: Filtros Por Status

As a RH,
I want filtrar cadastros por status,
so that eu encontre rapidamente pendencias e cadastros completos.

Acceptance Criteria:

1. Painel filtra por "Cadastro iniciado".
2. Painel filtra por "Pendente de informacoes".
3. Painel filtra por "Cadastro completo".
4. Painel filtra por "Revisado".

#### Story 4.3: Detalhe E Edicao Interna

As a usuario administrativo autorizado,
I want consultar e editar dados de onboarding,
so that eu possa corrigir ou completar informacoes quando necessario.

Acceptance Criteria:

1. Usuario autorizado acessa detalhe do cadastro.
2. Usuario autorizado visualiza dados pessoais, familiares, saude, emergencia e educacao.
3. Usuario autorizado pode editar dados enquanto cadastro nao estiver bloqueado por regra administrativa.
4. Sistema atualiza data de ultima atualizacao.

#### Story 4.4: Reabrir Cadastro

As a RH,
I want reabrir um cadastro ou gerar novo link,
so that o funcionario possa corrigir informacoes quando necessario.

Acceptance Criteria:

1. RH consegue reabrir cadastro concluido.
2. Sistema gera novo link quando solicitado.
3. Link anterior pode ser invalidado.
4. Status volta para estado adequado de pendencia.

#### Story 4.5: Revisar Cadastro

As a RH,
I want marcar cadastro como revisado,
so that o onboarding fique formalmente conferido.

Acceptance Criteria:

1. Cadastro completo pode ser marcado como revisado.
2. Cadastro revisado aparece com status "Revisado".
3. Cadastro revisado permanece consultavel no painel.

### Epic 5: Lembretes E Exportacao

Transformar os dados coletados em acao administrativa: lembretes de datas importantes, e-mails e exportacao. Ao fim deste epic, a empresa podera se antecipar a aniversarios e eventos familiares.

#### Story 5.1: Lista De Datas Importantes

As a RH,
I want ver proximas datas importantes,
so that a empresa possa planejar mensagens e presentes.

Acceptance Criteria:

1. Painel mostra aniversarios de funcionarios.
2. Painel mostra aniversarios de filhos.
3. Painel mostra aniversarios de casamento.
4. Painel permite visualizar eventos do mes.

#### Story 5.2: Configurar Lembretes

As a RH,
I want configurar antecedencia dos lembretes,
so that eu receba avisos no momento adequado.

Acceptance Criteria:

1. Sistema permite configurar destinatarios dos lembretes.
2. Sistema permite configurar antecedencia em dias.
3. Sugestao inicial e 7 dias antes e no dia do evento.

#### Story 5.3: Enviar E-mail De Lembrete

As a RH,
I want receber e-mails de lembrete,
so that eu nao perca datas importantes dos colaboradores e familiares.

Acceptance Criteria:

1. Sistema envia e-mail para aniversario de funcionario conforme configuracao.
2. Sistema envia e-mail para aniversario de filho conforme configuracao.
3. Sistema envia e-mail para aniversario de casamento conforme configuracao.
4. Falhas de envio sao registradas para verificacao.

#### Story 5.4: Exportar Dados Administrativos

As a RH,
I want exportar cadastros e datas importantes,
so that eu consiga trabalhar com os dados fora do sistema quando necessario.

Acceptance Criteria:

1. Sistema permite exportar lista de funcionarios.
2. Sistema permite exportar lista de aniversariantes.
3. Exportacao nao deve expor dados de saude sem confirmacao administrativa.
4. Arquivo gerado possui formato CSV ou Excel.

## 9. Metrics and Success Criteria

- 90% dos novos funcionarios com cadastro concluido antes ou durante onboarding.
- Reducao de cadastros incompletos por acompanhamento de status e completude.
- RH consegue identificar aniversariantes do mes sem planilhas externas.
- RH consegue gerar e reenviar link de cadastro sem suporte tecnico.
- Sistema consegue enviar lembretes por e-mail de forma confiavel.

## 10. Risks, Constraints and Open Questions

### 10.1 Risks

- Dados de saude sao sensiveis e exigem cuidado tecnico, juridico e operacional.
- Permitir que todos os usuarios administrativos autorizados vejam dados de saude aumenta responsabilidade interna.
- Funcionario sem login depende da seguranca do link unico e do token temporario.
- Lembretes por e-mail dependem de provedor SMTP confiavel.
- Operacao em VPS exige rotina de backup e atualizacoes.

### 10.2 Constraints

- MVP deve ser web responsivo.
- Funcionario nao tera login proprio.
- Deploy deve considerar Coolify em VPS.
- WhatsApp e gamificacao ficam para fases posteriores.
- O sistema nao deve depender de integracoes externas no MVP, exceto e-mail.

### 10.3 Open Questions

1. Qual sera o provedor SMTP para envio de e-mails?
2. Quem recebera os e-mails de lembrete no MVP?
3. A antecedencia inicial dos lembretes sera 7 dias, no dia, ou ambos?
4. A empresa guardara historico de candidatos/funcionarios que nao foram efetivados?
5. Quais campos serao estritamente obrigatorios no envio final?
6. Dados de saude devem aparecer em exportacao ou apenas na tela administrativa?

## 11. Next Steps

### 11.1 UX Expert Prompt

Criar a especificacao UX/UI para um web app responsivo de onboarding da Du Ramo Locacoes com painel administrativo, cadastro preliminar, link unico por token, formulario em etapas com campos condicionais, lista dinamica de filhos, consentimento de saude e calendario/lista de datas importantes.

### 11.2 Architect Prompt

Criar arquitetura fullstack para o PRD do Sistema de Onboarding Du Ramo Locacoes. Considerar deploy em VPS com Coolify, dominio `https://onboarding.duramo.com.br`, aplicacao web responsiva, autenticacao administrativa, acesso de funcionario por link unico com token temporario, banco relacional, lembretes por e-mail e evolucao futura para WhatsApp e gamificacao.

### 11.3 Data Engineer Prompt

Modelar o banco de dados para funcionario, onboarding, filhos, conjuge, saude, contato de emergencia, vida academica, tokens de acesso, usuarios administrativos, lembretes e eventos de aniversario. Considerar LGPD, dados sensiveis, exportacao e auditoria basica.

