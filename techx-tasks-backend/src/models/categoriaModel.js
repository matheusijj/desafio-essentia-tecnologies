const { pool } = require('../config/database');

class CategoriaModel {
  // Obter todas as categorias
  obterTodas(callback) {
    pool.query('SELECT * FROM categorias ORDER BY nome', (erro, resultados) => {
      if (erro) {
        console.error('Erro ao obter categorias:', erro);
        return callback(erro, null);
      }
      callback(null, resultados);
    });
  }

  // Obter uma categoria específica pelo ID
  obterPorId(id, callback) {
    pool.query('SELECT * FROM categorias WHERE id = ?', [id], (erro, resultados) => {
      if (erro) {
        console.error(`Erro ao obter categoria com ID ${id}:`, erro);
        return callback(erro, null);
      }
      
      if (resultados.length === 0) {
        return callback(null, null);
      }
      
      callback(null, resultados[0]);
    });
  }

  // Criar uma nova categoria
  criar(dadosCategoria, callback) {
    const query = `
      INSERT INTO categorias (nome, descricao, cor) 
      VALUES (?, ?, ?)
    `;
    
    const valores = [
      dadosCategoria.nome,
      dadosCategoria.descricao || null,
      dadosCategoria.cor || '#3f51b5'
    ];
    
    pool.query(query, valores, (erro, resultado) => {
      if (erro) {
        console.error('Erro ao criar categoria:', erro);
        return callback(erro, null);
      }
      
      const novaCategoria = {
        id: resultado.insertId,
        ...dadosCategoria
      };
      
      callback(null, novaCategoria);
    });
  }

  // Atualizar uma categoria existente
  atualizar(id, dadosCategoria, callback) {
    // Verificar se a categoria existe
    this.obterPorId(id, (erro, categoria) => {
      if (erro) {
        return callback(erro, null);
      }
      
      if (!categoria) {
        return callback(new Error('Categoria não encontrada'), null);
      }
      
      // Atualizar a categoria
      const query = `
        UPDATE categorias 
        SET nome = ?, descricao = ?, cor = ?, data_atualizacao = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const valores = [
        dadosCategoria.nome,
        dadosCategoria.descricao || null,
        dadosCategoria.cor || '#3f51b5',
        id
      ];
      
      pool.query(query, valores, (erro) => {
        if (erro) {
          console.error(`Erro ao atualizar categoria com ID ${id}:`, erro);
          return callback(erro, null);
        }
        
        // Obter a categoria atualizada
        this.obterPorId(id, callback);
      });
    });
  }

  // Excluir uma categoria
  excluir(id, callback) {
    // Verificar se a categoria existe
    this.obterPorId(id, (erro, categoria) => {
      if (erro) {
        return callback(erro, null);
      }
      
      if (!categoria) {
        return callback(new Error('Categoria não encontrada'), null);
      }
      
      // Verificar se existem tarefas associadas a esta categoria
      pool.query('SELECT COUNT(*) as total FROM tarefas WHERE id_categoria = ?', [id], (erro, tarefas) => {
        if (erro) {
          console.error(`Erro ao verificar tarefas associadas à categoria ${id}:`, erro);
          return callback(erro, null);
        }
        
        if (tarefas[0].total > 0) {
          // Se existirem tarefas, apenas definir o id_categoria como NULL para essas tarefas
          pool.query('UPDATE tarefas SET id_categoria = NULL WHERE id_categoria = ?', [id], (erro) => {
            if (erro) {
              console.error(`Erro ao desassociar tarefas da categoria ${id}:`, erro);
              return callback(erro, null);
            }
            
            // Excluir a categoria
            excluirCategoria();
          });
        } else {
          // Não existem tarefas associadas, excluir diretamente
          excluirCategoria();
        }
      });
      
      // Função auxiliar para excluir a categoria
      function excluirCategoria() {
        pool.query('DELETE FROM categorias WHERE id = ?', [id], (erro) => {
          if (erro) {
            console.error(`Erro ao excluir categoria com ID ${id}:`, erro);
            return callback(erro, null);
          }
          
          callback(null, true);
        });
      }
    });
  }

  // Obter tarefas por categoria
  obterTarefasPorCategoria(id, callback) {
    const query = `
      SELECT t.* 
      FROM tarefas t
      WHERE t.id_categoria = ?
      ORDER BY t.data_criacao DESC
    `;
    
    pool.query(query, [id], (erro, tarefas) => {
      if (erro) {
        console.error(`Erro ao obter tarefas da categoria com ID ${id}:`, erro);
        return callback(erro, null);
      }
      
      callback(null, tarefas);
    });
  }
}

module.exports = new CategoriaModel();
