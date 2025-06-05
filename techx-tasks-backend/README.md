# TechX Tasks - Backend API

API RESTful para gerenciamento de tarefas, desenvolvida com Node.js e MySQL para a aplicação TechX Tasks.

## Estrutura do Projeto

```
techx-tasks-backend/
│
├── src/
│   ├── config/         # Configurações (banco de dados)
│   ├── controllers/    # Controladores da API
│   ├── middlewares/    # Middlewares (futura extensão)
│   ├── models/         # Modelos para acesso ao banco
│   ├── routes/         # Rotas da API
│   ├── utils/          # Utilitários (futura extensão)
│   ├── app.js          # Configuração da aplicação Express
│   └── server.js       # Inicialização do servidor
│
├── .env                # Variáveis de ambiente
├── package.json        # Dependências e scripts
└── README.md           # Este arquivo
```

## Pré-requisitos

- Node.js (v14 ou superior)
- MySQL (v5.7 ou superior)
- Banco de dados `techx_tarefas` criado conforme script SQL fornecido

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=techx_tarefas
   ```

## Execução

Para executar em modo de desenvolvimento (com hot-reload):
```
npm run dev
```

Para executar em modo de produção:
```
npm start
```

## Endpoints da API

### Tarefas

- **Listar todas as tarefas**
  - `GET /api/tarefas`
  - Query params opcionais: `titulo`, `concluida` (true/false), `prioridade`, `id_categoria`

- **Obter tarefa por ID**
  - `GET /api/tarefas/:id`

- **Criar nova tarefa**
  - `POST /api/tarefas`
  - Body: `{ titulo, descricao, concluida, data_vencimento, prioridade, id_categoria, etiquetas }`

- **Atualizar tarefa**
  - `PUT /api/tarefas/:id`
  - Body: `{ titulo, descricao, concluida, data_vencimento, prioridade, id_categoria, etiquetas }`

- **Excluir tarefa**
  - `DELETE /api/tarefas/:id`

- **Atualizar status de tarefa**
  - `PATCH /api/tarefas/:id/status`
  - Body: `{ concluida }`

### Categorias

- **Listar categorias**
  - `GET /api/categorias`

- **Obter categoria por ID**
  - `GET /api/categorias/:id`

- **Obter tarefas por categoria**
  - `GET /api/categorias/:id/tarefas`

- **Criar categoria**
  - `POST /api/categorias`
  - Body: `{ nome, descricao, cor }`

- **Atualizar categoria**
  - `PUT /api/categorias/:id`
  - Body: `{ nome, descricao, cor }`

- **Excluir categoria**
  - `DELETE /api/categorias/:id`

### Etiquetas

- **Listar etiquetas**
  - `GET /api/etiquetas`

- **Obter etiqueta por ID**
  - `GET /api/etiquetas/:id`

- **Obter tarefas por etiqueta**
  - `GET /api/etiquetas/:id/tarefas`

- **Criar etiqueta**
  - `POST /api/etiquetas`
  - Body: `{ nome, cor }`

- **Atualizar etiqueta**
  - `PUT /api/etiquetas/:id`
  - Body: `{ nome, cor }`

- **Excluir etiqueta**
  - `DELETE /api/etiquetas/:id`

## Formato das Respostas

A API retorna respostas no formato JSON, com códigos de status HTTP apropriados:

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## Exemplo de Resposta

```json
{
  "mensagem": "Tarefa criada com sucesso",
  "tarefa": {
    "id": 1,
    "titulo": "Implementar API",
    "descricao": "Criar endpoints para gerenciamento de tarefas",
    "concluida": false,
    "data_vencimento": "2023-06-30",
    "prioridade": "alta",
    "data_criacao": "2023-06-01T10:00:00Z",
    "data_atualizacao": "2023-06-01T10:00:00Z",
    "id_categoria": 2,
    "nome_categoria": "Desenvolvimento",
    "etiquetas": [
      {
        "id": 1,
        "nome": "Backend",
        "cor": "#0066ff"
      }
    ]
  }
}
```

## Tecnologias Utilizadas

- **Express**: Framework web para Node.js
- **MySQL2**: Driver MySQL para Node.js
- **Dotenv**: Gerenciamento de variáveis de ambiente
- **CORS**: Middleware para habilitar CORS
- **Body-parser**: Middleware para processar requisições JSON
- **Nodemon**: Ferramenta para desenvolvimento com auto-reload

## Integração com Frontend

Esta API foi desenvolvida para integrar com o frontend em Angular do TechX Tasks. Todos os endpoints são projetados para atender às necessidades da interface de usuário.
