import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'tasks', 
    pathMatch: 'full' 
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/lista-tarefas/lista-tarefas.component').then(m => m.ListaTarefasComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./components/formulario-tarefa/formulario-tarefa.component').then(m => m.FormularioTarefaComponent)
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./components/detalhes-tarefa/detalhes-tarefa.component').then(m => m.DetalhesTarefaComponent)
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./components/formulario-tarefa/formulario-tarefa.component').then(m => m.FormularioTarefaComponent)
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];
