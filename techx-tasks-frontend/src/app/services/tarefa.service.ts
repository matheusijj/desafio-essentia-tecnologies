import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Tarefa } from '../models/tarefa';

interface TarefaBackend {
  id?: number;
  titulo: string;
  descricao?: string;
  concluida: boolean;
  data_vencimento?: string;
  data_criacao?: string;
  data_atualizacao?: string;
  prioridade?: string;
  id_categoria?: number;
  nome_categoria?: string;
  etiquetas?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private apiUrl = 'http://localhost:3000/api/tarefas'; 

  constructor(private http: HttpClient) { }
  
  private mapearParaTarefa(tarefaBackend: TarefaBackend): Tarefa {
    console.log('Mapeando tarefa do backend:', tarefaBackend);
    
    let prioridade = 'media';
    if (tarefaBackend.prioridade === 'baixa') prioridade = 'baixa';
    else if (tarefaBackend.prioridade === 'media') prioridade = 'media';
    else if (tarefaBackend.prioridade === 'alta') prioridade = 'alta';
    
    return {
      id: tarefaBackend.id,
      titulo: tarefaBackend.titulo,
      descricao: tarefaBackend.descricao || '',
      concluida: tarefaBackend.concluida,
      dataVencimento: tarefaBackend.data_vencimento ? new Date(tarefaBackend.data_vencimento) : undefined,
      dataCriacao: tarefaBackend.data_criacao ? new Date(tarefaBackend.data_criacao) : undefined,
      dataAtualizacao: tarefaBackend.data_atualizacao ? new Date(tarefaBackend.data_atualizacao) : undefined,
      prioridade: prioridade,
      idCategoria: tarefaBackend.id_categoria,
      nomeCategoria: tarefaBackend.nome_categoria,
      etiquetas: tarefaBackend.etiquetas || []
    };
  }

  obterTarefas(): Observable<Tarefa[]> {
    console.log('Solicitando todas as tarefas do backend');
    return this.http.get<TarefaBackend[]>(this.apiUrl).pipe(
      map(tarefas => {
        console.log('Tarefas recebidas do backend:', tarefas);
        const tarefasConvertidas = tarefas.map(tarefa => this.mapearParaTarefa(tarefa));
        console.log('Tarefas convertidas:', tarefasConvertidas);
        return tarefasConvertidas;
      })
    );
  }

  obterTarefa(id: number): Observable<Tarefa> {
    return this.http.get<TarefaBackend>(`${this.apiUrl}/${id}`).pipe(
      map(tarefa => this.mapearParaTarefa(tarefa))
    );
  }
  
  private prepararParaEnvio(tarefa: Tarefa): any {
    console.log('Preparando tarefa para envio:', tarefa);
    
    return {
      id: tarefa.id,
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      concluida: tarefa.concluida,
      data_vencimento: tarefa.dataVencimento ? tarefa.dataVencimento.toISOString() : null,
      prioridade: tarefa.prioridade,
      id_categoria: tarefa.idCategoria,
      etiquetas: tarefa.etiquetas
    };
  }

  adicionarTarefa(tarefa: Tarefa): Observable<Tarefa> {
    console.log('Enviando nova tarefa para o backend:', tarefa);
    const tarefaParaEnvio = this.prepararParaEnvio(tarefa);
    console.log('Dados preparados para envio:', tarefaParaEnvio);
    
    return this.http.post<TarefaBackend>(this.apiUrl, tarefaParaEnvio).pipe(
      map(novaTarefa => this.mapearParaTarefa(novaTarefa))
    );
  }

  atualizarTarefa(tarefa: Tarefa): Observable<Tarefa> {
    console.log('Atualizando tarefa:', tarefa);
    const tarefaParaEnvio = this.prepararParaEnvio(tarefa);
    console.log('Dados preparados para envio:', tarefaParaEnvio);
    
    return this.http.put<TarefaBackend>(`${this.apiUrl}/${tarefa.id}`, tarefaParaEnvio).pipe(
      map(tarefaAtualizada => this.mapearParaTarefa(tarefaAtualizada))
    );
  }

  atualizarStatusTarefa(id: number, concluida: boolean): Observable<Tarefa> {
    console.log(`Atualizando status da tarefa ${id} para ${concluida ? 'concluída' : 'pendente'}`);
    
    return this.http.patch<TarefaBackend>(`${this.apiUrl}/${id}/status`, { concluida: concluida }).pipe(
      map(tarefaAtualizada => {
        console.log('Resposta da atualização de status:', tarefaAtualizada);
        return this.mapearParaTarefa(tarefaAtualizada);
      })
    );
  }
  excluirTarefa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
