const mysql = require('mysql2');
require('dotenv').config();

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'techx_tarefas',
  waitForConnections: true,
  connectionLimit: 10
};

// Criando a conexão com o banco
const pool = mysql.createPool(dbConfig);

// Verificando conexão
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
  connection.release();
});

// Exportando o pool para ser usado em outros arquivos
module.exports = { pool };

