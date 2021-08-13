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

  async getDipendenti(): Promise<Dipendenti[]> {
    return this.http.get<Dipendenti[]>(this.api + "/api/dipendenti").toPromise();
  }

  async insertDipendente(dipendente: Dipendenti) {
    var body = dipendente;
    return this.http.post(this.api + "/api/dipendenti", body).toPromise();
  }

  async updateDipendete(dipendente: Dipendenti) {
    var body = dipendente;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/dipendenti/" + dipendente._id, body).toPromise();
  }
}
