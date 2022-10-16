import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { CucinaMenuPersonalizzato } from '../models/CucinaMenuPersonalizzato';

@Injectable({
  providedIn: 'root'
})
export class CucinaService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getByPaziente(idPaziente: string): Observable<CucinaMenuPersonalizzato[]> {
    return this.http.get<CucinaMenuPersonalizzato[]>(`${this.api}/api/cucina/paziente/${idPaziente}`);
  }

  getAll(): Observable<CucinaMenuPersonalizzato[]> {
    return this.http.get<CucinaMenuPersonalizzato[]>(`${this.api}/api/cucina`);
  }

  get(id: string): Observable<CucinaMenuPersonalizzato> {
    return this.http.get<CucinaMenuPersonalizzato>(`${this.api}/api/cucina/${id}`);
  }

  update(menuPersonalizzato: CucinaMenuPersonalizzato) {
    console.log("Update menu personalizzato:", menuPersonalizzato);
    return this.http.put<CucinaMenuPersonalizzato>(`${this.api}/api/cucina/${menuPersonalizzato._id}`, menuPersonalizzato);
  }

  add(menuPersonalizzato: CucinaMenuPersonalizzato) {
    console.log("Inserimento menu personalizzato:", menuPersonalizzato);
    return this.http.post<CucinaMenuPersonalizzato>(`${this.api}/api/cucina`, menuPersonalizzato);
  }

  remove(menuPersonalizzato: CucinaMenuPersonalizzato) {
    console.log("Eliminazione menu personalizzato:", menuPersonalizzato);
    return this.http.delete<CucinaMenuPersonalizzato>(`${this.api}/api/cucina/${menuPersonalizzato._id}`);
  }

}
