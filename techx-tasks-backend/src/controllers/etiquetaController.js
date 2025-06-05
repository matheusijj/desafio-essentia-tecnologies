const etiquetaModel = require('../models/etiquetaModel');

class EtiquetaController {
  // Listar todas as etiquetas
  listarEtiquetas(req, res) {
    etiquetaModel.obterTodas((erro, etiquetas) => {
      if (erro) {
        console.error('Erro ao listar etiquetas:', erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao listar etiquetas', 
          erro: erro.message 
        });
      }
      
      res.status(200).json(etiquetas);
    });
  }

  // Obter uma etiqueta específica por ID
  obterEtiqueta(req, res) {
    const id = req.params.id;
    
    etiquetaModel.obterPorId(id, (erro, etiqueta) => {
      if (erro) {
        console.error(`Erro ao obter etiqueta com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao obter etiqueta', 
          erro: erro.message 
        });
      }
      
      if (!etiqueta) {
        return res.status(404).json({ mensagem: 'Etiqueta não encontrada' });
      }
      
      res.status(200).json(etiqueta);
    });
  }

  // Criar uma nova etiqueta
  criarEtiqueta(req, res) {
    // Validações básicas
    if (!req.body.nome) {
      return res.status(400).json({ mensagem: 'O nome da etiqueta é obrigatório' });
    }
    
    const dadosEtiqueta = {
      nome: req.body.nome,
      cor: req.body.cor
    };
    
    etiquetaModel.criar(dadosEtiqueta, (erro, novaEtiqueta) => {
      if (erro) {
        console.error('Erro ao criar etiqueta:', erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao criar etiqueta', 
          erro: erro.message 
        });
      }
      
      res.status(201).json({
        mensagem: 'Etiqueta criada com sucesso',
        etiqueta: novaEtiqueta
      });
    });
  }

  // Atualizar uma etiqueta existente
  atualizarEtiqueta(req, res) {
    const id = req.params.id;
    
    // Validações básicas
    if (!req.body.nome) {
      return res.status(400).json({ mensagem: 'O nome da etiqueta é obrigatório' });
    }
    
    const dadosEtiqueta = {
      nome: req.body.nome,
      cor: req.body.cor
    };
    
    etiquetaModel.atualizar(id, dadosEtiqueta, (erro, etiquetaAtualizada) => {
      if (erro) {
        if (erro.message === 'Etiqueta não encontrada') {
          return res.status(404).json({ mensagem: erro.message });
        }
        
        console.error(`Erro ao atualizar etiqueta com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao atualizar etiqueta', 
          erro: erro.message 
        });
      }
      
      res.status(200).json({
        mensagem: 'Etiqueta atualizada com sucesso',
        etiqueta: etiquetaAtualizada
      });
    });
  }

  // Excluir uma etiqueta
  excluirEtiqueta(req, res) {
    const id = req.params.id;
    
    etiquetaModel.excluir(id, (erro, sucesso) => {
      if (erro) {
        if (erro.message === 'Etiqueta não encontrada') {
          return res.status(404).json({ mensagem: erro.message });
        }
        
        console.error(`Erro ao excluir etiqueta com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao excluir etiqueta', 
          erro: erro.message 
        });
      }
      
      res.status(200).json({
        mensagem: 'Etiqueta excluída com sucesso'
      });
    });
  }

  // Obter tarefas de uma etiqueta específica
  obterTarefasPorEtiqueta(req, res) {
    const id = req.params.id;
    
    // Verificar se a etiqueta existe
    etiquetaModel.obterPorId(id, (erro, etiqueta) => {
      if (erro) {
        console.error(`Erro ao obter etiqueta com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao obter tarefas da etiqueta', 
          erro: erro.message 
        });
      }
      
      if (!etiqueta) {
        return res.status(404).json({ mensagem: 'Etiqueta não encontrada' });
      }
      
      // Obter as tarefas da etiqueta
      etiquetaModel.obterTarefasPorEtiqueta(id, (erro, tarefas) => {
        if (erro) {
          console.error(`Erro ao obter tarefas da etiqueta com ID ${id}:`, erro);
          return res.status(500).json({ 
            mensagem: 'Erro ao obter tarefas da etiqueta', 
            erro: erro.message 
          });
        }
        
        res.status(200).json({
          etiqueta,
          tarefas
        });
      });
    });
  }
}

module.exports = new EtiquetaController();
