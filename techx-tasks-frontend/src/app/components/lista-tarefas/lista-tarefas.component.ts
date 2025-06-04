import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa';

@Component({
  selector: 'app-lista-tarefas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-tarefas.component.html',
  styleUrl: './lista-tarefas.component.scss'
})
export class ListaTarefasComponent implements OnInit {
  tarefas: Tarefa[] = [];
  tarefasFiltradas: Tarefa[] = [];
  filtroStatus: string = 'todas';
  termoBusca: string = '';

  constructor(private tarefaService: TarefaService) {}

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.tarefaService.obterTarefas().subscribe(tarefas => {
      this.tarefas = tarefas;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    this.tarefasFiltradas = this.tarefas.filter(tarefa => {
      const correspondeStatus = this.filtroStatus === 'todas' || 
        (this.filtroStatus === 'concluidas' && tarefa.concluida) ||
        (this.filtroStatus === 'pendentes' && !tarefa.concluida);
      const correspondeBusca = !this.termoBusca || 
        tarefa.titulo.toLowerCase().includes(this.termoBusca.toLowerCase()) || 
        (tarefa.descricao && tarefa.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()));
      
      return correspondeStatus && correspondeBusca;
    });
  }

  filtrarPorStatus(status: string): void {
    this.filtroStatus = status;
    this.aplicarFiltros();
  }

  buscar(termo: string): void {
    this.termoBusca = termo;
    this.aplicarFiltros();
  }

  excluirTarefa(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.tarefaService.excluirTarefa(id).subscribe(() => {
        this.carregarTarefas();
      });
    }
  }

  alternarStatusTarefa(tarefa: Tarefa): void {
    console.log(`Alterando status da tarefa ${tarefa.id} de ${tarefa.concluida} para ${!tarefa.concluida}`);
    if (tarefa.id) {
      this.tarefaService.atualizarStatusTarefa(tarefa.id, !tarefa.concluida).subscribe(() => {
        console.log('Status alterado com sucesso');
        this.carregarTarefas(); 
      }, erro => {
        console.error('Erro ao atualizar status:', erro);
      });
    }
  }
}
