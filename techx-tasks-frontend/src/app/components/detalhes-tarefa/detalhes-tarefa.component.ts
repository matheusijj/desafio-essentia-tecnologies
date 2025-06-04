import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa';

@Component({
  selector: 'app-detalhes-tarefa',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhes-tarefa.component.html',
  styleUrl: './detalhes-tarefa.component.scss'
})
export class DetalhesTarefaComponent implements OnInit {
  idTarefa: number = 0;
  tarefa: Tarefa | null = null;
  carregando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tarefaService: TarefaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idTarefa = +id;
        this.carregarDetalhesTarefa();
      } else {
        this.router.navigate(['/tasks']);
      }
    });
  }

  carregarDetalhesTarefa(): void {
    this.carregando = true;
    this.tarefaService.obterTarefa(this.idTarefa).subscribe({
      next: (tarefa) => {
        console.log('Tarefa carregada:', tarefa);
        this.tarefa = tarefa;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar tarefa:', erro);
        this.carregando = false;
      }
    });
  }

  obterLabelPrioridade(prioridade: string): string {
    switch (prioridade) {
      case 'baixa':
        return 'Baixa';
      case 'media':
        return 'Média';
      case 'alta':
        return 'Alta';
      default:
        return '';
    }
  }

  alternarStatusTarefa(): void {
    if (this.tarefa && this.tarefa.id) {
      const novoStatus = !this.tarefa.concluida;
      console.log(`Alterando status da tarefa ${this.tarefa.id} para ${novoStatus ? 'concluída' : 'pendente'}`);
      
      this.tarefaService.atualizarStatusTarefa(this.tarefa.id, novoStatus).subscribe({
        next: () => {
          console.log('Status da tarefa atualizado com sucesso');
          if (this.tarefa) {
            this.tarefa.concluida = novoStatus;
          this.carregarDetalhesTarefa();
        },
        error: (erro) => {
          console.error('Erro ao atualizar status da tarefa:', erro);
        }
      });
    }
  }

  editarTarefa(): void {
    if (this.tarefa && this.tarefa.id) {
      this.router.navigate(['/tasks', this.tarefa.id, 'edit']);
    }
  }

  excluirTarefa(): void {
    if (this.tarefa && this.tarefa.id && confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.tarefaService.excluirTarefa(this.tarefa.id).subscribe({
        next: () => {
          console.log('Tarefa excluída com sucesso');
          this.router.navigate(['/tasks']);
        },
        error: (erro) => {
          console.error('Erro ao excluir tarefa:', erro);
        }
      });
    }
  }
}
