# Project Brief: Sistema de Onboarding Du Ramo Locacoes

## 1. Contexto

A Du Ramo Locacoes deseja criar um sistema web responsivo para cadastrar novos funcionarios durante o onboarding. O sistema deve coletar informacoes pessoais, familiares, academicas, de saude relevante e contato de emergencia, com foco em melhorar a comunicacao com colaboradores e apoiar acoes internas de cuidado, reconhecimento e relacionamento.

O sistema sera implantado no dominio:

- https://onboarding.duramo.com.br

A hospedagem prevista sera em uma VPS com Coolify.

## 2. Objetivo Do Produto

Criar um sistema de onboarding para centralizar o cadastro inicial de novos funcionarios da Du Ramo Locacoes, permitindo que RH/gestores e o proprio funcionario preencham ou atualizem informacoes durante o processo de entrada.

O produto tambem deve permitir que a empresa seja lembrada de datas importantes, como aniversario do funcionario, aniversario dos filhos e aniversario de casamento, para apoiar a cultura de valorizacao familiar.

## 3. Publico-Alvo

- Funcionarios em processo de onboarding.
- RH ou responsaveis administrativos da Du Ramo Locacoes.
- Gestores internos autorizados.

## 4. Decisoes Ja Definidas

- O cadastro podera ser preenchido tanto pelo funcionario quanto pela equipe interna.
- O funcionario nao tera login proprio no MVP.
- O funcionario acessara o formulario por link unico com token temporario.
- A aplicacao sera somente web responsiva.
- Todos os usuarios administrativos autorizados poderao visualizar informacoes de saude.
- Notificacoes iniciais serao por e-mail.
- WhatsApp sera implantado em fase posterior.
- Gamificacao sera implementada em fase posterior.
- Nao ha integracao com sistemas externos no MVP.
- O uso inicial sera somente para onboarding.
- Deploy previsto em VPS com Coolify.

## 5. Escopo MVP

### 5.1 Cadastro Do Funcionario

O sistema deve coletar:

- Nome completo.
- Data de nascimento.
- Numero de celular.
- E-mail.
- Instagram.
- Endereco residencial.


### 5.2 Informacoes Sobre Filhos

O sistema deve perguntar se o funcionario tem filhos.

Se sim, deve permitir cadastrar um ou mais filhos, com os seguintes dados:

- Nome do filho.
- Genero.
- Data de aniversario.

O formulario deve permitir adicionar novos blocos de filho dinamicamente.

### 5.3 Estado Civil / Relacionamento

O sistema deve perguntar se o funcionario e casado ou amasiado.

Se sim, deve coletar:

- Nome do conjuge.
- Telefone do conjuge.
- Data de aniversario de casamento.

### 5.4 Saude E Cuidados Relevantes

O sistema deve coletar informacoes de saude relevantes para cuidado e emergencia:

- Faz uso de algum medicamento de uso continuo?
- Tem alergia a algum medicamento ou substancia?
- Possui alguma condicao de saude relevante que a empresa deve saber em caso de emergencia?
- Possui alguma restricao fisica ou recomendacao medica relevante para atividades de trabalho?
- Observacoes adicionais de saude.

Essas informacoes devem ser tratadas como dados sensiveis e exigir consentimento explicito no formulario.

### 5.5 Contato De Emergencia

O sistema deve coletar um contato de responsavel ou familiar para emergencia:

- Nome do familiar ou responsavel.
- Numero de celular.
- Endereco do responsavel.

### 5.6 Vida Academica

O sistema deve perguntar se o funcionario esta cursando algum curso tecnico ou faculdade.

Se sim, deve coletar:

- Nome da instituicao.
- Nome do curso.
- Horario do curso.
- Previsao de termino.

Essas informacoes devem ajudar a empresa a considerar impactos em escala de horarios.

### 5.7 Lembretes De Datas Importantes

O sistema deve gerar lembretes para:

- Aniversario do funcionario.
- Aniversario dos filhos.
- Aniversario de casamento.

No MVP, os lembretes devem priorizar visualizacao em painel e notificacao por e-mail. WhatsApp fica fora do MVP.

### 5.8 Acesso Ao Formulario Pelo Funcionario

O funcionario nao tera login e senha no MVP. O acesso ao formulario deve ocorrer por link unico com token temporario.

Fluxo recomendado:

- RH cria um cadastro preliminar do funcionario.
- Sistema gera um link exclusivo para aquele onboarding.
- O link pode ser enviado por e-mail ou copiado pelo RH.
- O link deve ter prazo de expiracao configuravel, inicialmente sugerido em 7 ou 15 dias.
- Apos envio final do formulario, o cadastro deve mudar para "Cadastro completo".
- O link deixa de aceitar novas alteracoes apos envio final.
- RH pode reabrir o cadastro ou gerar novo link quando necessario.

Esse modelo evita formulario publico aberto e reduz complexidade por nao exigir login proprio do funcionario no MVP.

## 6. Funcionalidades Sugeridas Para O PRD

### 6.1 Painel Administrativo

Criar um painel para consultar:

- Funcionarios cadastrados.
- Cadastros pendentes ou incompletos.
- Aniversariantes do mes.
- Datas familiares proximas.
- Contatos de emergencia.
- Informacoes academicas relevantes para escala.

### 6.2 Status Do Onboarding

Cada cadastro deve possuir status:

- Cadastro iniciado.
- Pendente de informacoes.
- Cadastro completo.
- Revisado.

### 6.3 Percentual De Preenchimento

Exibir um indicador de completude do cadastro para facilitar acompanhamento pelo RH.

### 6.4 Formulario Dinamico

O formulario deve mostrar campos condicionais conforme respostas:

- Campos de filhos apenas quando "tem filhos" for sim.
- Campos do conjuge apenas quando "casado/amasiado" for sim.
- Campos academicos apenas quando "esta cursando" for sim.

### 6.5 Auditoria Basica

Registrar data de criacao e ultima atualizacao do cadastro. Uma trilha detalhada de auditoria pode ser evolucao futura.

### 6.6 Exportacao

Sugerir exportacao CSV/Excel dos cadastros e aniversariantes para uso administrativo.

## 7. Fora Do Escopo Inicial

- Login proprio do funcionario.
- Aplicativo mobile nativo.
- Integracao com sistemas externos.
- WhatsApp.
- Gamificacao.
- Ranking, pontos ou badges.
- Folha de pagamento.
- Gestao completa de funcionarios apos onboarding.

## 8. Requisitos Nao Funcionais Iniciais

### 8.1 Seguranca E Privacidade

- Dados pessoais e de saude devem ser protegidos.
- O sistema deve solicitar consentimento para armazenamento de dados sensiveis.
- O acesso deve ser restrito a usuarios internos autorizados.
- A aplicacao deve usar HTTPS no dominio final.

### 8.2 LGPD

O PRD deve considerar:

- Finalidade clara para coleta de dados.
- Consentimento para dados de saude.
- Possibilidade futura de correcao ou remocao de dados.
- Controle de acesso administrativo.

### 8.3 Disponibilidade

O sistema sera hospedado em VPS com Coolify e deve ser simples de operar, atualizar e fazer backup.

### 8.4 Responsividade

A aplicacao deve funcionar bem em desktop, tablet e celular via navegador.

## 9. Sugestao De Arquitetura Inicial

Para o MVP, recomenda-se uma arquitetura simples:

- Web app responsivo.
- Backend com API para cadastro e consultas administrativas.
- Banco relacional para funcionarios, filhos, conjuge, saude, contato de emergencia, educacao e lembretes.
- Jobs agendados para lembretes por e-mail.
- Deploy containerizado via Coolify na VPS.

Decisao detalhada de stack deve ser feita no documento de arquitetura apos o PRD.

## 10. Riscos E Cuidados

- Dados de saude sao sensiveis e exigem cuidado juridico e tecnico.
- Como o funcionario nao tera login no MVP, sera necessario definir como ele acessa/preenche o formulario.
- Caso todos os usuarios administrativos possam ver saude, o PRD deve explicitar esse risco e a responsabilidade interna.
- Lembretes por e-mail dependem de configuracao SMTP confiavel.
- Backup da VPS e do banco deve ser planejado desde o inicio.

## 11. Perguntas Pendentes Para O PRD

1. Quais perfis administrativos existirao no MVP?
2. Quem recebera os e-mails de lembrete?
3. Com quantos dias de antecedencia os lembretes devem ser enviados?
4. A empresa deseja guardar historico de funcionarios que nao foram efetivados?
5. Qual sera o provedor de e-mail usado na VPS/Coolify?
6. Quais dados devem ser obrigatorios e quais podem ser opcionais?

## 12. Handoff Para PRD

Especialista recomendado para o proximo passo: @pm.

Tarefa sugerida:

- Transformar este project brief em PRD formal.
- Definir personas.
- Priorizar MVP.
- Criar requisitos funcionais e nao funcionais.
- Definir criterios de aceitacao.
- Separar epicos e primeiras stories.
