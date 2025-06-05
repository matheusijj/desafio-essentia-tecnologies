const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');

// Rotas para tarefas
router.get('/', tarefaController.listarTarefas);
router.get('/:id', tarefaController.obterTarefa);
router.post('/', tarefaController.criarTarefa);
router.put('/:id', tarefaController.atualizarTarefa);
router.delete('/:id', tarefaController.excluirTarefa);
router.patch('/:id/status', tarefaController.atualizarStatusTarefa);

module.exports = router;
