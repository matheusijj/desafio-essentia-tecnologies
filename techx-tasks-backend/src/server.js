const app = require('./app');
require('./config/database'); // Isso já faz a verificação da conexão
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Iniciar o servidor
app.listen(PORT, () => {
  console.log('===================================');
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
  console.log('===================================');
});
