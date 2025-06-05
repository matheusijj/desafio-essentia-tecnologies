# TechX Tasks - Sistema de Gerenciamento de Tarefas

## Visão Geral

O TechX Tasks é um sistema completo de gerenciamento de tarefas desenvolvido com tecnologias modernas, composto por um backend em Node.js/Express e um frontend em Angular. Este projeto oferece uma solução intuitiva e eficiente para organizar, acompanhar e gerenciar tarefas de forma simples e produtiva.

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

### Backend (pasta techx-tasks-backend)

API RESTful desenvolvida com Node.js e Express, responsável por todo o processamento de dados e lógica de negócios.

- **O que usei**:
  - Node.js e Express para criar a API
  - MySQL para o banco de dados
  - Algumas bibliotecas como cors e dotenv

- **Organização das pastas**:
  - `src/config` → Configurações do banco de dados
  - `src/controllers` → Lógica das tarefas, categorias e etiquetas
  - `src/models` → Comunicação com o banco de dados
  - `src/routes` → Rotas da API
  - `src/app.js` → Configuração do Express
  - `src/server.js` → Arquivo que inicia o servidor

### Frontend (pasta techx-tasks-frontend)

Interface de usuário desenvolvida com Angular, proporcionando uma experiência moderna e responsiva.

- **Tecnologias principais**:
  - Angular 19.2.0 
  - SCSS
  - Sistema de rotas do Angular
  - Componentes independentes

- **Principais arquivos e pastas**:
  - `src/app/components` → Tem os componentes Lista de Tarefas, Detalhes e Formulário
  - `src/app/models` → Define a estrutura dos dados (Tarefa, Etiqueta)
  - `src/app/services` → Faz a comunicação com o backend

## Funcionalidades: 

- **Gerenciar tarefas**:
  - Criar novas tarefas
  - Ver detalhes das tarefas
  - Editar tarefas existentes
  - Apagar tarefas
  - Marcar como concluída/pendente
  - Escolher prioridade (baixa, média ou alta)
  - Definir data para a tarefa ser realizada
  - Buscar tarefas por texto

## Pré-requisitos

- Node.js (v16 ou superior)
- npm (v8 ou superior)
- MySQL (v8 ou superior)
- Angular CLI (v19.2 ou superior)

## Instalação e Configuração

### Primeiro o backend 

1. Entre na pasta do backend:
   ```
   cd techx-tasks-backend
   ```

2. Instala as dependências:
   ```
   npm install
   ```

3. Configura o banco de dados:
   - Cria um arquivo `.env` com essas configs:
     ```
     DB_HOST=localhost
     DB_USER=seu_usuario
     DB_PASSWORD=sua_senha
     DB_NAME=techx_tasks
     PORT=3000
     ```

4. Roda esse comando pra iniciar o servidor:
   ```
   npm run dev
   ```
   O servidor estará disponível em `http://localhost:3000`
   
### Frontend

1. Em outro terminal, entra na pasta do frontend:
   ```
   cd techx-tasks-frontend
   ```

2. Instala as dependências (isso pode demorar um pouco):
   ```
   npm install
   ```

3. Roda a aplicação:
   ```
   npm start
   ```
   A aplicação estará disponível em `http://localhost:4200`

## Uso

Após iniciar tanto o backend quanto o frontend, você pode acessar a aplicação pelo navegador em `http://localhost:4200`.

## Estrutura da API

- **Tarefas**:
  - `GET /api/tarefas`: Lista todas as tarefas
  - `GET /api/tarefas/:id`: Obtém detalhes de uma tarefa específica
  - `POST /api/tarefas`: Cria uma nova tarefa
  - `PUT /api/tarefas/:id`: Atualiza uma tarefa existente
  - `PATCH /api/tarefas/:id/status`: Atualiza apenas o status de uma tarefa
  - `DELETE /api/tarefas/:id`: Remove uma tarefa

- **Categorias** (pra organizar melhor):
  - `GET /api/categorias` → Lista as categorias
  - `POST /api/categorias` → Cria categoria nova
  - `DELETE /api/categorias/:id` → Remove categoria

- **Etiquetas** (aquelas tags legais):
  - `GET /api/etiquetas` → Lista todas etiquetas
  - `POST /api/etiquetas` → Cria etiqueta nova
  - `DELETE /api/etiquetas/:id` → Remove etiqueta


## Query para criação do banco de dados para teste:

 ```
 CREATE DATABASE IF NOT EXISTS techx_tarefas;
USE techx_tarefas;

CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    concluida TINYINT(1) DEFAULT 0,          
    data_vencimento DATE,
    prioridade VARCHAR(10),                  
    id_categoria INT                         
);

```
---

Desenvolvido como desafio técnico.