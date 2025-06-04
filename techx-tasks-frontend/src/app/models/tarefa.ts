export interface Tarefa {
  id?: number;
  titulo: string;
  descricao?: string;
  concluida: boolean;
  prioridade?: string;
  dataVencimento?: Date;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  idCategoria?: number;
  nomeCategoria?: string;
  etiquetas?: string[];
}
