const categoriaModel = require('../models/categoriaModel');

class CategoriaController {
  // Listar todas as categorias
  listarCategorias(req, res) {
    categoriaModel.obterTodas((erro, categorias) => {
      if (erro) {
        console.error('Erro ao listar categorias:', erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao listar categorias', 
          erro: erro.message 
        });
      }
      res.status(200).json(categorias);
    });
  }

  // Obter uma categoria específica por ID
  obterCategoria(req, res) {
    const id = req.params.id;
    
    categoriaModel.obterPorId(id, (erro, categoria) => {
      if (erro) {
        console.error(`Erro ao obter categoria com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao obter categoria', 
          erro: erro.message 
        });
      }
      
      if (!categoria) {
        return res.status(404).json({ mensagem: 'Categoria não encontrada' });
      }
      
      res.status(200).json(categoria);
    });
  }

  // Criar uma nova categoria
  criarCategoria(req, res) {
    // Validações básicas
    if (!req.body.nome) {
      return res.status(400).json({ mensagem: 'O nome da categoria é obrigatório' });
    }
    
    const dadosCategoria = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      cor: req.body.cor
    };
    
    categoriaModel.criar(dadosCategoria, (erro, novaCategoria) => {
      if (erro) {
        console.error('Erro ao criar categoria:', erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao criar categoria', 
          erro: erro.message 
        });
      }
      
      res.status(201).json({
        mensagem: 'Categoria criada com sucesso',
        categoria: novaCategoria
      });
    });
  }

  // Atualizar uma categoria existente
  atualizarCategoria(req, res) {
    const id = req.params.id;
    
    // Validações básicas
    if (!req.body.nome) {
      return res.status(400).json({ mensagem: 'O nome da categoria é obrigatório' });
    }
    
    const dadosCategoria = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      cor: req.body.cor
    };
    
    categoriaModel.atualizar(id, dadosCategoria, (erro, categoriaAtualizada) => {
      if (erro) {
        if (erro.message === 'Categoria não encontrada') {
          return res.status(404).json({ mensagem: erro.message });
        }
        
        console.error(`Erro ao atualizar categoria com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao atualizar categoria', 
          erro: erro.message 
        });
      }
      
      res.status(200).json({
        mensagem: 'Categoria atualizada com sucesso',
        categoria: categoriaAtualizada
      });
    });
  }

  // Excluir uma categoria
  excluirCategoria(req, res) {
    const id = req.params.id;
    
    categoriaModel.excluir(id, (erro, sucesso) => {
      if (erro) {
        if (erro.message === 'Categoria não encontrada') {
          return res.status(404).json({ mensagem: erro.message });
        }
        
        console.error(`Erro ao excluir categoria com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao excluir categoria', 
          erro: erro.message 
        });
      }
      
      res.status(200).json({
        mensagem: 'Categoria excluída com sucesso'
      });
    });
  }

  // Obter tarefas de uma categoria específica
  obterTarefasPorCategoria(req, res) {
    const id = req.params.id;
    
    // Verificar se a categoria existe
    categoriaModel.obterPorId(id, (erro, categoria) => {
      if (erro) {
        console.error(`Erro ao obter categoria com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao obter tarefas da categoria', 
          erro: erro.message 
        });
      }
      
      if (!categoria) {
        return res.status(404).json({ mensagem: 'Categoria não encontrada' });
      }
      
      // Obter as tarefas da categoria
      categoriaModel.obterTarefasPorCategoria(id, (erro, tarefas) => {
        if (erro) {
          console.error(`Erro ao obter tarefas da categoria com ID ${id}:`, erro);
          return res.status(500).json({ 
            mensagem: 'Erro ao obter tarefas da categoria', 
            erro: erro.message 
          });
        }
        
        res.status(200).json({
          categoria,
          tarefas
        });
      });
    });
  }
}

module.exports = new CategoriaController();
