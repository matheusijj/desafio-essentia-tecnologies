import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etiqueta } from '../models/etiqueta';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
  private apiUrl = 'http://localhost:3000/api/etiquetas';

  constructor(private http: HttpClient) { }

  getEtiquetas(): Observable<Etiqueta[]> {
    return this.http.get<Etiqueta[]>(this.apiUrl);
  }

  getEtiqueta(id: number): Observable<Etiqueta> {
    return this.http.get<Etiqueta>(`${this.apiUrl}/${id}`);
  }

  addEtiqueta(etiqueta: Etiqueta): Observable<Etiqueta> {
    return this.http.post<Etiqueta>(this.apiUrl, etiqueta);
  }

  updateEtiqueta(etiqueta: Etiqueta): Observable<Etiqueta> {
    return this.http.put<Etiqueta>(`${this.apiUrl}/${etiqueta.id}`, etiqueta);
  }

  deleteEtiqueta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTarefasEtiqueta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/tarefas`);
  }
}
