const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Importando as rotas
const tarefaRoutes = require('./routes/tarefaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const etiquetaRoutes = require('./routes/etiquetaRoutes');

// Criando a aplicação Express
const app = express();

// Configurar middleware CORS com opções específicas para o frontend Angular
const corsOptions = {
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'], // Origens permitidas para o frontend Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permite cookies nas requisições
  optionsSuccessStatus: 200 // Para compatibilidade com alguns navegadores
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log simples de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Tarefas - TechX',
    versao: '1.0.0'
  });
});

// Definindo as rotas
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/etiquetas', etiquetaRoutes);

// Tratamento de erros básico
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    mensagem: 'Erro no servidor',
    erro: err.message
  });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    mensagem: 'Rota não encontrada'
  });
});

module.exports = app;
