import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { CartellaClinica } from "../models/cartellaClinica";
import { Diario } from "../models/diario";
import { Paziente } from "../models/paziente";
import { Dipendenti } from '../models/dipendenti';
import { DiarioClinico } from "../models/diarioClinico";
import { VisiteSpecialistiche } from "../models/visiteSpecialistiche";

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
      .put<CartellaClinica>(this.api + "/api/cartellaClinica", body)
      .toPromise(); 
  }


  insert(data: CartellaClinica): Promise<CartellaClinica> {
    var body = data;
    return this.http
      .post<CartellaClinica>(this.api + "/api/cartellaClinica", body)
      .toPromise();
  }



  //DIARIO
  async getDiarioByUser(id: string): Promise<DiarioClinico[]> {
    return this.http.get<DiarioClinico[]>(`${this.api}/api/diarioClinico/${id}`).toPromise();
  }

  saveDiario(data: DiarioClinico): Promise<DiarioClinico> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<DiarioClinico>(this.api + "/api/diarioClinico/" + data.user, body)
      .toPromise();
  }


  insertDiario(data: DiarioClinico): Promise<DiarioClinico> {
    var body = data;
    return this.http
      .post<DiarioClinico>(this.api + "/api/diarioClinico", body)
      .toPromise();
  }



  //VISITE  
  async getVisiteByUser(id: string): Promise<VisiteSpecialistiche[]> {
    return this.http.get<VisiteSpecialistiche[]>(`${this.api}/api/visiteSpecialistiche/${id}`).toPromise();
  }

  saveVisita(data: VisiteSpecialistiche): Promise<VisiteSpecialistiche> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<VisiteSpecialistiche>(this.api + "/api/visiteSpecialistiche/" + data.user, body)
      .toPromise();
  }


  insertVisita(data: VisiteSpecialistiche): Promise<VisiteSpecialistiche> {
    var body = data;
    return this.http
      .post<VisiteSpecialistiche>(this.api + "/api/visiteSpecialistiche", body)
      .toPromise();
  }
}
