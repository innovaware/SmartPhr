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
}
