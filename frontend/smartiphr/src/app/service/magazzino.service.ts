import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Magazzino, TypeProcedureMagazzino } from '../models/magazzino';
import { MagazzinoOperazioni } from '../models/magazzinoOperazioni';

@Injectable({
  providedIn: 'root'
})
export class MagazzinoService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Magazzino[]> {
    return this.http.get<Magazzino[]>(`${this.api}/api/magazzino`);
  }

  get(id: string): Observable<Magazzino> {
    return this.http.get<Magazzino>(`${this.api}/api/magazzino/${id}`);
  }

  getOperazioni(): Observable<MagazzinoOperazioni[]> {
    return this.http.get<MagazzinoOperazioni[]>(`${this.api}/api/magazzino/operazioni/getAll`);
  }

  getOperazioniByIdMagazzino(idMagazzino: string): Observable<MagazzinoOperazioni[]> {
    return this.http.get<MagazzinoOperazioni[]>(`${this.api}/api/magazzino/operazioni/${idMagazzino}`);
  }

  update(magazzino: Magazzino) {
    console.log("Update magazzino:", magazzino);
    return this.http.put<Magazzino>(`${this.api}/api/magazzino/${magazzino._id}`, magazzino);
  }

  add(magazzino: Magazzino) {
    console.log("Inserimento magazzino:", magazzino);
    return this.http.post<Magazzino>(`${this.api}/api/magazzino`, magazzino);
  }

  remove(magazzino: Magazzino) {
    console.log("Eliminazione magazzino:", magazzino);
    return this.http.delete<Magazzino>(`${this.api}/api/magazzino/${magazzino._id}`);
  }

  carico_scarico(magazzino: Magazzino, type: TypeProcedureMagazzino) {
    const operazione = type === TypeProcedureMagazzino.Carico ? "carico" : "scarico";
    return this.http.put<Magazzino>(`${this.api}/api/magazzino/operazioni/${operazione}/${magazzino._id}`, magazzino);
  }

}
