const { pool } = require('../config/database');

class TarefaModel {
  // Obter todas as tarefas com opção de filtro
  obterTodas(filtros = {}, callback) {
    let query = `
      SELECT t.*, c.nome as nome_categoria
      FROM tarefas t
      LEFT JOIN categorias c ON t.id_categoria = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Aplicar filtros
    if (filtros.titulo) {
      query += ` AND t.titulo LIKE ?`;
      params.push(`%${filtros.titulo}%`);
    }
    
    if (filtros.concluida !== undefined) {
      query += ` AND t.concluida = ?`;
      params.push(filtros.concluida);
    }
    
    if (filtros.prioridade) {
      query += ` AND t.prioridade = ?`;
      params.push(filtros.prioridade);
    }
    
    if (filtros.id_categoria) {
      query += ` AND t.id_categoria = ?`;
      params.push(filtros.id_categoria);
    }
    
    // Ordenação
    query += ` ORDER BY t.data_criacao DESC`;
    
    pool.query(query, params, (erro, tarefas) => {
      if (erro) {
        console.error('Erro ao obter tarefas:', erro);
        return callback(erro, null);
      }
      
      // Contador para controlar quando todas as tarefas foram processadas
      let contador = 0;
      
      // Se não houver tarefas, retornar array vazio
      if (tarefas.length === 0) {
        return callback(null, []);
      }
      
      // Para cada tarefa, buscar as etiquetas associadas
      tarefas.forEach((tarefa) => {
        const queryEtiquetas = `
          SELECT e.id, e.nome, e.cor 
          FROM etiquetas e
          JOIN tarefas_etiquetas te ON e.id = te.id_etiqueta
          WHERE te.id_tarefa = ?
        `;
        
        pool.query(queryEtiquetas, [tarefa.id], (erroEtiquetas, etiquetas) => {
          contador++;
          
          if (erroEtiquetas) {
            console.error('Erro ao obter etiquetas:', erroEtiquetas);
            tarefa.etiquetas = [];
          } else {
            tarefa.etiquetas = etiquetas;
          }
          
          // Se todas as tarefas foram processadas, retornar o resultado
          if (contador === tarefas.length) {
            callback(null, tarefas);
          }
        });
      });
    });
  }

  // Obter uma tarefa específica pelo ID
  obterPorId(id, callback) {
    const query = `
      SELECT t.*, c.nome as nome_categoria
      FROM tarefas t
      LEFT JOIN categorias c ON t.id_categoria = c.id
      WHERE t.id = ?
    `;
    
    pool.query(query, [id], (erro, tarefas) => {
      if (erro) {
        console.error(`Erro ao obter tarefa com ID ${id}:`, erro);
        return callback(erro, null);
      }
      
      if (tarefas.length === 0) {
        return callback(null, null);
      }
      
      const tarefa = tarefas[0];
      
      // Buscar as etiquetas associadas à tarefa
      const queryEtiquetas = `
        SELECT e.id, e.nome, e.cor 
        FROM etiquetas e
        JOIN tarefas_etiquetas te ON e.id = te.id_etiqueta
        WHERE te.id_tarefa = ?
      `;
      
      pool.query(queryEtiquetas, [id], (erroEtiquetas, etiquetas) => {
        if (erroEtiquetas) {
          console.error(`Erro ao obter etiquetas para tarefa ${id}:`, erroEtiquetas);
          tarefa.etiquetas = [];
        } else {
          tarefa.etiquetas = etiquetas;
        }
        
        callback(null, tarefa);
      });
    });
  }

  // Criar uma nova tarefa
  criar(dadosTarefa, callback) {
    // Inserir os dados básicos da tarefa
    const query = `
      INSERT INTO tarefas (
        titulo, 
        descricao, 
        concluida, 
        data_vencimento,
        prioridade,
        id_categoria
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      dadosTarefa.titulo,
      dadosTarefa.descricao || null,
      dadosTarefa.concluida || false,
      dadosTarefa.data_vencimento || null,
      dadosTarefa.prioridade || 'media',
      dadosTarefa.id_categoria || null
    ];
    
    pool.query(query, params, (erro, resultado) => {
      if (erro) {
        console.error('Erro ao criar tarefa:', erro);
        return callback(erro, null);
      }
      
      const idTarefa = resultado.insertId;
      
      // Se não tiver etiquetas, retornar a tarefa criada
      if (!dadosTarefa.etiquetas || !Array.isArray(dadosTarefa.etiquetas) || dadosTarefa.etiquetas.length === 0) {
        const novaTarefa = {
          id: idTarefa,
          ...dadosTarefa,
          etiquetas: []
        };
        return callback(null, novaTarefa);
      }
      
      // Associar etiquetas, se fornecidas
      let valoresEtiquetas = '';
      const etiquetaParams = [];
      
      dadosTarefa.etiquetas.forEach((idEtiqueta, index) => {
        valoresEtiquetas += '(?, ?)';
        if (index < dadosTarefa.etiquetas.length - 1) {
          valoresEtiquetas += ', ';
        }
        etiquetaParams.push(idTarefa, idEtiqueta);
      });
      
      const queryEtiquetas = `
        INSERT INTO tarefas_etiquetas (id_tarefa, id_etiqueta) VALUES ${valoresEtiquetas}
      `;
      
      pool.query(queryEtiquetas, etiquetaParams, (erroEtiquetas) => {
        if (erroEtiquetas) {
          console.error('Erro ao associar etiquetas:', erroEtiquetas);
          // Mesmo com erro nas etiquetas, retornar a tarefa criada
        }
        
        // Retornar a tarefa criada com suas etiquetas
        this.obterPorId(idTarefa, (erroBusca, tarefa) => {
          if (erroBusca) {
            // Em caso de erro, retornar pelo menos os dados básicos
            const novaTarefa = {
              id: idTarefa,
              ...dadosTarefa,
              etiquetas: []
            };
            return callback(null, novaTarefa);
          }
          
          callback(null, tarefa);
        });
      });
    });
  }

  // Atualizar uma tarefa existente
  atualizar(id, dadosTarefa, callback) {
    // Verificar se a tarefa existe
    pool.query('SELECT id, concluida FROM tarefas WHERE id = ?', [id], (erro, tarefas) => {
      if (erro) {
        console.error(`Erro ao verificar tarefa com ID ${id}:`, erro);
        return callback(erro, null);
      }
      
      if (tarefas.length === 0) {
        return callback(new Error('Tarefa não encontrada'), null);
      }
      
      // Atualizar os dados básicos da tarefa
      const queryAtualizar = `
        UPDATE tarefas SET
          titulo = ?,
          descricao = ?,
          concluida = ?,
          data_vencimento = ?,
          prioridade = ?,
          id_categoria = ?,
          data_atualizacao = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const params = [
        dadosTarefa.titulo,
        dadosTarefa.descricao || null,
        dadosTarefa.concluida !== undefined ? dadosTarefa.concluida : tarefas[0].concluida,
        dadosTarefa.data_vencimento || null,
        dadosTarefa.prioridade || 'media',
        dadosTarefa.id_categoria || null,
        id
      ];
      
      pool.query(queryAtualizar, params, (erroUpdate) => {
        if (erroUpdate) {
          console.error(`Erro ao atualizar tarefa com ID ${id}:`, erroUpdate);
          return callback(erroUpdate, null);
        }
        
        // Se não foram fornecidas etiquetas, retornar a tarefa atualizada
        if (!dadosTarefa.etiquetas || !Array.isArray(dadosTarefa.etiquetas)) {
          return this.obterPorId(id, callback);
        }
        
        // Remover todas as associações existentes
        pool.query('DELETE FROM tarefas_etiquetas WHERE id_tarefa = ?', [id], (erroDelete) => {
          if (erroDelete) {
            console.error(`Erro ao remover etiquetas da tarefa ${id}:`, erroDelete);
            // Continuar mesmo com erro
          }
          
          // Se não há novas etiquetas para adicionar
          if (dadosTarefa.etiquetas.length === 0) {
            return this.obterPorId(id, callback);
          }
          
          // Adicionar as novas associações
          let valoresEtiquetas = '';
          const etiquetaParams = [];
          
          dadosTarefa.etiquetas.forEach((idEtiqueta, index) => {
            valoresEtiquetas += '(?, ?)';
            if (index < dadosTarefa.etiquetas.length - 1) {
              valoresEtiquetas += ', ';
            }
            etiquetaParams.push(id, idEtiqueta);
          });
          
          const queryEtiquetas = `
            INSERT INTO tarefas_etiquetas (id_tarefa, id_etiqueta) VALUES ${valoresEtiquetas}
          `;
          
          pool.query(queryEtiquetas, etiquetaParams, (erroInsert) => {
            if (erroInsert) {
              console.error(`Erro ao associar etiquetas à tarefa ${id}:`, erroInsert);
              // Continuar mesmo com erro
            }
            
            // Retornar a tarefa atualizada
            this.obterPorId(id, callback);
          });
        });
      });
    });
  }

  // Excluir uma tarefa
  excluir(id, callback) {
    // Verificar se a tarefa existe
    pool.query('SELECT id FROM tarefas WHERE id = ?', [id], (erro, tarefas) => {
      if (erro) {
        console.error(`Erro ao verificar tarefa com ID ${id}:`, erro);
        return callback(erro, false);
      }
      
      if (tarefas.length === 0) {
        return callback(new Error('Tarefa não encontrada'), false);
      }
      
      // Excluir as associações com etiquetas
      pool.query('DELETE FROM tarefas_etiquetas WHERE id_tarefa = ?', [id], (erroEtiquetas) => {
        if (erroEtiquetas) {
          console.error(`Erro ao excluir associações da tarefa ${id}:`, erroEtiquetas);
          // Continuar mesmo com erro
        }
        
        // Excluir a tarefa
        pool.query('DELETE FROM tarefas WHERE id = ?', [id], (erroTarefa) => {
          if (erroTarefa) {
            console.error(`Erro ao excluir tarefa com ID ${id}:`, erroTarefa);
            return callback(erroTarefa, false);
          }
          
          callback(null, true);
        });
      });
    });
  }

  // Atualizar apenas o status de conclusão de uma tarefa
  atualizarStatus(id, concluida, callback) {
    // Verificar se a tarefa existe
    pool.query('SELECT id FROM tarefas WHERE id = ?', [id], (erro, tarefas) => {
      if (erro) {
        console.error(`Erro ao verificar tarefa com ID ${id}:`, erro);
        return callback(erro, null);
      }
      
      if (tarefas.length === 0) {
        return callback(new Error('Tarefa não encontrada'), null);
      }
      
      // Atualizar apenas o status de conclusão
      const query = `
        UPDATE tarefas SET 
          concluida = ?, 
          data_atualizacao = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      pool.query(query, [concluida, id], (erroUpdate) => {
        if (erroUpdate) {
          console.error(`Erro ao atualizar status da tarefa ${id}:`, erroUpdate);
          return callback(erroUpdate, null);
        }
        
        // Retornar a tarefa atualizada
        this.obterPorId(id, callback);
      });
    });
  }
}

module.exports = new TarefaModel();
