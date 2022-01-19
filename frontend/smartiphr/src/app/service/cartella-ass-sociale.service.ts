import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DiarioAssSociale } from "../models/diarioAssSociale";


@Injectable({
  providedIn: 'root'
})
export class CartellaAssSocialeService {

  api: string = environment.api;
  constructor(private http: HttpClient) {}


  //DIARIO
  async getDiarioByUser(id: string): Promise<DiarioAssSociale[]> {
    return this.http
      .get<DiarioAssSociale[]>(`${this.api}/api/diarioAssSociale/${id}`)
      .toPromise();
  }

  saveDiario(data: DiarioAssSociale): Promise<DiarioAssSociale> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<DiarioAssSociale>(this.api + "/api/diarioAssSociale/" + data.user, body)
      .toPromise();
  }

  insertDiario(data: DiarioAssSociale): Promise<DiarioAssSociale> {
    var body = data;
    return this.http
      .post<DiarioAssSociale>(this.api + "/api/diarioAssSociale", body)
      .toPromise();
  }
}
