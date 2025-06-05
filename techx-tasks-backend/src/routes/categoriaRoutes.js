const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Rotas para categorias
router.get('/', categoriaController.listarCategorias);
router.get('/:id', categoriaController.obterCategoria);
router.post('/', categoriaController.criarCategoria);
router.put('/:id', categoriaController.atualizarCategoria);
router.delete('/:id', categoriaController.excluirCategoria);
router.get('/:id/tarefas', categoriaController.obterTarefasPorCategoria);

module.exports = router;
