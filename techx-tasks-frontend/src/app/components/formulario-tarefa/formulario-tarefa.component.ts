import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa';

@Component({
  selector: 'app-formulario-tarefa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './formulario-tarefa.component.html',
  styleUrl: './formulario-tarefa.component.scss'
})
export class FormularioTarefaComponent implements OnInit {
  formularioTarefa!: FormGroup;
  modoEdicao: boolean = false;
  idTarefa?: number;
  formularioEnviado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tarefaService: TarefaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idTarefa = +id;
        this.modoEdicao = true;
        this.carregarDadosTarefa(this.idTarefa);
      }
    });
  }

  inicializarFormulario(): void {
    this.formularioTarefa = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descricao: [''],
      prioridade: [''],
      dataVencimento: [''],
      concluida: [false]
    });
  }

  get f() {
    return this.formularioTarefa.controls;
  }

  carregarDadosTarefa(id: number): void {
    this.tarefaService.obterTarefa(id).subscribe({
      next: (tarefa) => {
        console.log('Tarefa carregada para edição:', tarefa);
        this.preencherFormularioComTarefa(tarefa);
      },
      error: (erro) => {
        console.error('Erro ao carregar tarefa para edição:', erro);
        this.router.navigate(['/tasks']);
      }
    });
  }

  preencherFormularioComTarefa(tarefa: Tarefa): void {
    const dataVencimento = tarefa.dataVencimento ? this.formatarDataParaInput(new Date(tarefa.dataVencimento)) : '';

    this.formularioTarefa.patchValue({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      prioridade: tarefa.prioridade,
      dataVencimento: dataVencimento,
      concluida: tarefa.concluida
    });
  }

  formatarDataParaInput(data: Date): string {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  aoEnviar(): void {
    this.formularioEnviado = true;

    if (this.formularioTarefa.invalid) {
      console.log('Formulário inválido:', this.formularioTarefa.errors);
      return;
    }

    const tarefa: Tarefa = this.formularioTarefa.value;
    if (tarefa.dataVencimento) {
      tarefa.dataVencimento = new Date(tarefa.dataVencimento);
    }

    console.log('Enviando tarefa:', tarefa);

    if (this.modoEdicao && this.idTarefa) {
      tarefa.id = this.idTarefa;
      this.tarefaService.atualizarTarefa(tarefa).subscribe({
        next: (tarefaAtualizada) => {
          console.log('Tarefa atualizada com sucesso:', tarefaAtualizada);
          this.router.navigate(['/tasks', this.idTarefa]);
        },
        error: (erro) => {
          console.error('Erro ao atualizar tarefa:', erro);
        }
      });
    } else {
      this.tarefaService.adicionarTarefa(tarefa).subscribe({
        next: (novaTarefa) => {
          console.log('Tarefa criada com sucesso:', novaTarefa);
          this.router.navigate(['/tasks']);
        },
        error: (erro) => {
          console.error('Erro ao criar tarefa:', erro);
        }
      });
    }
  }

  aoCancelar(): void {
    if (this.modoEdicao && this.idTarefa) {
      this.router.navigate(['/tasks', this.idTarefa]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
