import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Lavanderia } from '../models/lavanderia';

@Injectable({
  providedIn: 'root'
})
export class LavanderiaService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Lavanderia[]> {
    return this.http.get<Lavanderia[]>(`${this.api}/api/lavanderia`);
  }

  getByDipendente(idDipendente: string): Observable<Lavanderia> {
    return this.http.get<Lavanderia>(`${this.api}/api/lavanderia/dipendente/${idDipendente}`);
  }


  get(id: string): Observable<Lavanderia> {
    return this.http.get<Lavanderia>(`${this.api}/api/lavanderia/${id}`);
  }


  update(lavanderia: Lavanderia) {
    console.log("Update lavanderia:", lavanderia);

    return this.http.put<Lavanderia>(`${this.api}/api/lavanderia/${lavanderia._id}`, lavanderia);
  }

  add(lavanderia: Lavanderia) {
    console.log("Inserimento lavanderia:", lavanderia);

    return this.http.post<Lavanderia>(`${this.api}/api/lavanderia`, lavanderia);
  }

  remove(lavanderia: Lavanderia) {
    console.log("Eliminazione lavanderia:", lavanderia);
    return this.http.delete<Lavanderia>(`${this.api}/api/lavanderia/${lavanderia._id}`);
  }

}
