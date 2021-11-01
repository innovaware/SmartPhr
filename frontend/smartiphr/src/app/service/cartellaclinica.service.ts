import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { CartellaClinica } from "../models/cartellaClinica";
import { Diario } from "../models/diario";
import { Paziente } from "../models/paziente";
import { Dipendenti } from '../models/dipendenti';

@Injectable({
  providedIn: 'root'
})
export class CartellaclinicaService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getById(id: string): Promise<CartellaClinica> {
    return this.http.get<CartellaClinica>(`${this.api}/api/cartellaClinica/${id}`).toPromise();
  }

  save(data: CartellaClinica): Promise<CartellaClinica> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<CartellaClinica>(this.api + "/api/cartellaClinica/" + data.user, body)
      .toPromise();
  }


  insert(data: CartellaClinica): Promise<CartellaClinica> {
    var body = data;
    return this.http
      .post<CartellaClinica>(this.api + "/api/cartellaClinica/" + data.user, body)
      .toPromise();
  }
}
