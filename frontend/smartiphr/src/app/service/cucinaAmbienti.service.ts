import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { MenuGeneraleView } from '../models/MenuGeneraleView';
import { CucinaAmbienti } from '../models/CucinaAmbienti';
import { CucinaAmbientiArchivio } from '../models/CucinaAmbientiArchivio';

@Injectable({
  providedIn: 'root'
})
export class CucinaAmbientiService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getAll(): Observable<CucinaAmbienti[]> {
    return this.http.get<CucinaAmbienti[]>(`${this.api}/api/cucina/ambiente`);
  }

  get(id: string): Observable<CucinaAmbienti> {
    return this.http.get<CucinaAmbienti>(`${this.api}/api/cucina/ambiente/${id}`);
  }

  update(cucinaAmbienti: CucinaAmbienti) {
    console.log("Update cucina ambiente:", cucinaAmbienti);
    return this.http.put<CucinaAmbienti>(`${this.api}/api/cucina/ambiente/${cucinaAmbienti._id}`, cucinaAmbienti);
  }

  add(cucinaAmbienti: CucinaAmbienti) {
    console.log("Inserimento cucinaAmbiente:", cucinaAmbienti);
    return this.http.post<CucinaAmbienti>(`${this.api}/api/cucina/ambiente`, cucinaAmbienti);
  }

  remove(cucinaAmbienti: CucinaAmbienti) {
    console.log("Eliminazione cucina ambiente:", cucinaAmbienti);
    return this.http.delete<CucinaAmbienti>(`${this.api}/api/cucina/ambiente/${cucinaAmbienti._id}`);
  }

  getAllArchivio(): Observable<CucinaAmbientiArchivio[]> {
    return this.http.get<CucinaAmbientiArchivio[]>(`${this.api}/api/cucina/archivio/ambiente`);
  }

  getArchivio(id: string): Observable<CucinaAmbientiArchivio> {
    return this.http.get<CucinaAmbientiArchivio>(`${this.api}/api/cucina/archivio/ambiente/${id}`);
  }

}
