const { pool } = require('../config/database');

class EtiquetaModel {
  // Obter todas as etiquetas
  obterTodas(callback) {
    pool.query('SELECT * FROM etiquetas ORDER BY nome', (erro, etiquetas) => {
      if (erro) {
        console.error('Erro ao obter etiquetas:', erro);
        return callback(erro, null);
      }
      callback(null, etiquetas);
    });
  }

  // Obter uma etiqueta específica pelo ID
  obterPorId(id, callback) {
    pool.query('SELECT * FROM etiquetas WHERE id = ?', [id], (erro, etiquetas) => {
      if (erro) {
        console.error(`Erro ao obter etiqueta com ID ${id}:`, erro);
        return callback(erro, null);
      }
      
      if (etiquetas.length === 0) {
        return callback(null, null);
      }
      
      callback(null, etiquetas[0]);
    });
  }

  // Criar uma nova etiqueta
  criar(dadosEtiqueta, callback) {
    const query = `
      INSERT INTO etiquetas (nome, cor) 
      VALUES (?, ?)
    `;
    
    const valores = [
      dadosEtiqueta.nome,
      dadosEtiqueta.cor || '#9c27b0'
    ];
    
    pool.query(query, valores, (erro, resultado) => {
      if (erro) {
        console.error('Erro ao criar etiqueta:', erro);
        return callback(erro, null);
      }
      
      const novaEtiqueta = {
        id: resultado.insertId,
        ...dadosEtiqueta
      };
      
      callback(null, novaEtiqueta);
    });
  }

  // Atualizar uma etiqueta existente
  atualizar(id, dadosEtiqueta, callback) {
    // Verificar se a etiqueta existe
    this.obterPorId(id, (erro, etiqueta) => {
      if (erro) {
        return callback(erro, null);
      }
      
      if (!etiqueta) {
        return callback(new Error('Etiqueta não encontrada'), null);
      }
      
      // Atualizar a etiqueta
      const query = `
        UPDATE etiquetas 
        SET nome = ?, cor = ?, data_atualizacao = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const valores = [
        dadosEtiqueta.nome,
        dadosEtiqueta.cor || '#9c27b0',
        id
      ];
      
      pool.query(query, valores, (erro) => {
        if (erro) {
          console.error(`Erro ao atualizar etiqueta com ID ${id}:`, erro);
          return callback(erro, null);
        }
        
        // Obter a etiqueta atualizada
        this.obterPorId(id, callback);
      });
    });
  }

  // Excluir uma etiqueta
  excluir(id, callback) {
    // Verificar se a etiqueta existe
    this.obterPorId(id, (erro, etiqueta) => {
      if (erro) {
        return callback(erro, null);
      }
      
      if (!etiqueta) {
        return callback(new Error('Etiqueta não encontrada'), null);
      }
      
      // Excluir todas as associações dessa etiqueta com tarefas
      pool.query('DELETE FROM tarefas_etiquetas WHERE id_etiqueta = ?', [id], (erro) => {
        if (erro) {
          console.error(`Erro ao excluir associações da etiqueta ${id}:`, erro);
          return callback(erro, null);
        }
        
        // Excluir a etiqueta
        pool.query('DELETE FROM etiquetas WHERE id = ?', [id], (erro) => {
          if (erro) {
            console.error(`Erro ao excluir etiqueta com ID ${id}:`, erro);
            return callback(erro, null);
          }
          
          callback(null, true);
        });
      });
    });
  }

  // Obter tarefas por etiqueta
  obterTarefasPorEtiqueta(id, callback) {
    const query = `
      SELECT t.* 
      FROM tarefas t
      JOIN tarefas_etiquetas te ON t.id = te.id_tarefa
      WHERE te.id_etiqueta = ?
      ORDER BY t.data_criacao DESC
    `;
    
    pool.query(query, [id], (erro, tarefas) => {
      if (erro) {
        console.error(`Erro ao obter tarefas da etiqueta com ID ${id}:`, erro);
        return callback(erro, null);
      }
      
      callback(null, tarefas);
    });
  }
}

module.exports = new EtiquetaModel();
