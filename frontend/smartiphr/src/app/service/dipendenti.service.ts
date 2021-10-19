import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { CartellaClinica } from "../models/cartellaClinica";
import { Diario } from "../models/diario";
import { Paziente } from "../models/paziente";
import { Dipendenti } from '../models/dipendenti';

@Injectable({
  providedIn: "root",
})
export class DipendentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async get(): Promise<Dipendenti[]> {
    return this.http.get<Dipendenti[]>(this.api + "/api/dipendenti").toPromise();
  }

  async getById(id: string): Promise<Dipendenti[]> {
    return this.http.get<Dipendenti[]>(`${this.api}/api/dipendenti/${id}`).toPromise();
  }

  save(data: Dipendenti): Promise<Dipendenti> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<Dipendenti>(this.api + "/api/dipendenti/" + data._id, body)
      .toPromise();
  }

  insert(data: Dipendenti): Promise<Dipendenti> {
    var body = data;
    return this.http
      .post<Dipendenti>(this.api + "/api/dipendenti", body)
      .toPromise();
  }

  async remove(contratto: Dipendenti) {
    return this.http.delete(`${this.api}/api/dipendenti/${contratto._id}`).toPromise();
  }


}
