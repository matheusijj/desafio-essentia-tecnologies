const tarefaModel = require('../models/tarefaModel');

class TarefaController {
  // Listar todas as tarefas com filtros opcionais
  listarTarefas(req, res) {
    const filtros = {
      titulo: req.query.titulo,
      concluida: req.query.concluida !== undefined ? req.query.concluida === 'true' : undefined,
      prioridade: req.query.prioridade,
      id_categoria: req.query.id_categoria
    };
    
    tarefaModel.obterTodas(filtros, (erro, tarefas) => {
      if (erro) {
        console.error('Erro ao listar tarefas:', erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao listar tarefas', 
          erro: erro.message 
        });
      }
      res.status(200).json(tarefas);
    });
  }

  // Obter uma tarefa específica por ID
  obterTarefa(req, res) {
    const id = req.params.id;
    
    tarefaModel.obterPorId(id, (erro, tarefa) => {
      if (erro) {
        console.error(`Erro ao obter tarefa com ID ${id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao obter tarefa', 
          erro: erro.message 
        });
      }
      
      if (!tarefa) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
      }
      
      res.status(200).json(tarefa);
    });
  }

  // Criar uma nova tarefa
  criarTarefa(req, res) {
    console.log('Recebido POST para criar tarefa:', req.body);
    
    // Primeiro, verificar se os campos estão em inglês e adaptá-los para português
    if (req.body.title !== undefined && req.body.titulo === undefined) {
      console.log('Campo title detectado em vez de titulo - adaptando...');
      req.body.titulo = req.body.title;
    }
    
    if (req.body.description !== undefined && req.body.descricao === undefined) {
      console.log('Campo description detectado em vez de descricao - adaptando...');
      req.body.descricao = req.body.description;
    }
    
    if (req.body.completed !== undefined && req.body.concluida === undefined) {
      console.log('Campo completed detectado em vez de concluida - adaptando...');
      req.body.concluida = req.body.completed;
    }
    
    if (req.body.dueDate !== undefined && req.body.data_vencimento === undefined) {
      console.log('Campo dueDate detectado em vez de data_vencimento - adaptando...');
      req.body.data_vencimento = req.body.dueDate;
    }
    
    if (req.body.priority !== undefined && req.body.prioridade === undefined) {
      console.log('Campo priority detectado em vez de prioridade - adaptando...');
      req.body.prioridade = req.body.priority;
    }
    
    // Validações básicas - agora que os campos foram adaptados
    if (!req.body.titulo) {
      console.log('Erro: Título não fornecido');
      return res.status(400).json({ mensagem: 'O título da tarefa é obrigatório' });
    }
    
    const dadosTarefa = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      concluida: req.body.concluida || false,
      data_vencimento: req.body.data_vencimento,
      prioridade: req.body.prioridade || req.body.priority,
      id_categoria: req.body.id_categoria,
      etiquetas: req.body.etiquetas
    };
    
    console.log('Dados da tarefa processados para criar:', dadosTarefa);
    
    tarefaModel.criar(dadosTarefa, (erro, novaTarefa) => {
      if (erro) {
        console.error('Erro ao criar tarefa:', erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao criar tarefa',
          erro: erro.message 
        });
      }
      
      console.log('Tarefa criada com sucesso:', novaTarefa);
      res.status(201).json({
        mensagem: 'Tarefa criada com sucesso',
        tarefa: novaTarefa
      });
    });
  }

  // Atualizar uma tarefa existente
  atualizarTarefa(req, res) {
    const id = req.params.id;
    
    // Validações básicas
    if (!req.body.titulo) {
      return res.status(400).json({ mensagem: 'O título da tarefa é obrigatório' });
    }
    
    const dadosTarefa = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      concluida: req.body.concluida,
      data_vencimento: req.body.data_vencimento,
      prioridade: req.body.prioridade,
      id_categoria: req.body.id_categoria,
      etiquetas: req.body.etiquetas
    };
    
    tarefaModel.atualizar(id, dadosTarefa, (erro, tarefaAtualizada) => {
      if (erro) {
        if (erro.message === 'Tarefa não encontrada') {
          return res.status(404).json({ mensagem: erro.message });
        }
        
        console.error(`Erro ao atualizar tarefa com ID ${req.params.id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao atualizar tarefa',
          erro: erro.message 
        });
      }
      
      res.status(200).json({
        mensagem: 'Tarefa atualizada com sucesso',
        tarefa: tarefaAtualizada
      });
    });
  }

  // Excluir uma tarefa
  excluirTarefa(req, res) {
    const id = req.params.id;
    
    tarefaModel.excluir(id, (erro, sucesso) => {
      if (erro) {
        if (erro.message === 'Tarefa não encontrada') {
          return res.status(404).json({ mensagem: erro.message });
        }
        
        console.error(`Erro ao excluir tarefa com ID ${req.params.id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao excluir tarefa',
          erro: erro.message 
        });
      }
      
      res.status(200).json({
        mensagem: 'Tarefa excluída com sucesso'
      });
    });
  }

  // Atualizar apenas o status de conclusão de uma tarefa
  atualizarStatusTarefa(req, res) {
    const id = req.params.id;
    
    if (req.body.concluida === undefined) {
      return res.status(400).json({ mensagem: 'O status de conclusão é obrigatório' });
    }
    
    const concluida = req.body.concluida;
    
    tarefaModel.atualizarStatus(id, concluida, (erro, tarefaAtualizada) => {
      if (erro) {
        if (erro.message === 'Tarefa não encontrada') {
          return res.status(404).json({ mensagem: erro.message });
        }
        
        console.error(`Erro ao atualizar status da tarefa com ID ${req.params.id}:`, erro);
        return res.status(500).json({ 
          mensagem: 'Erro ao atualizar status da tarefa',
          erro: erro.message 
        });
      }
      
      res.status(200).json({
        mensagem: `Tarefa marcada como ${concluida ? 'concluída' : 'pendente'} com sucesso`,
        tarefa: tarefaAtualizada
      });
    });
  }
}

module.exports = new TarefaController();
