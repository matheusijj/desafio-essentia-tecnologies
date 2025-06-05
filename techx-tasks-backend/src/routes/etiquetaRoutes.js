const express = require('express');
const router = express.Router();
const etiquetaController = require('../controllers/etiquetaController');

// Rotas para etiquetas
router.get('/', etiquetaController.listarEtiquetas);
router.get('/:id', etiquetaController.obterEtiqueta);
router.post('/', etiquetaController.criarEtiqueta);
router.put('/:id', etiquetaController.atualizarEtiqueta);
router.delete('/:id', etiquetaController.excluirEtiqueta);
router.get('/:id/tarefas', etiquetaController.obterTarefasPorEtiqueta);

module.exports = router;
