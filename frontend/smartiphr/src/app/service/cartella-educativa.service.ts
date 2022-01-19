import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DiarioEducativo } from "../models/diarioEducativo";

@Injectable({
  providedIn: 'root'
})
export class CartellaEducativaService {
  api: string = environment.api;
  constructor(private http: HttpClient) {}

    //DIARIO
    async getDiarioByUser(id: string): Promise<DiarioEducativo[]> {
      return this.http
        .get<DiarioEducativo[]>(`${this.api}/api/diarioEducativo/${id}`)
        .toPromise();
    }
  
    saveDiario(data: DiarioEducativo): Promise<DiarioEducativo> {
      var body = data;
      console.log("body: ", body);
      return this.http
        .put<DiarioEducativo>(this.api + "/api/diarioEducativo/" + data.user, body)
        .toPromise();
    }
  
    insertDiario(data: DiarioEducativo): Promise<DiarioEducativo> {
      var body = data;
      return this.http
        .post<DiarioEducativo>(this.api + "/api/diarioEducativo", body)
        .toPromise();
    }
}
