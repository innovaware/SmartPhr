import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { dataIngresso } from '../models/dataIngresso';


@Injectable({
  providedIn: 'root'
})
export class DataIngressoService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  async getIngressoByPaziente(id): Promise<dataIngresso> {
    return this.http.get<dataIngresso>(this.api + "/api/dataIngresso/paziente/" + id).toPromise();
  }


  async getIngressi(): Promise<dataIngresso[]> {
    return this.http.get<dataIngresso[]>(this.api + "/api/dataIngresso").toPromise();
  }

  async insertIngresso(ingresso: dataIngresso) {
    var body = ingresso;
    return this.http.post(this.api + "/api/dataIngresso", body).toPromise();
  }

  async updateIngresso(ingresso: dataIngresso) {
    var body = ingresso;
    return this.http.put(this.api + "/api/dataIngresso/" + ingresso._id, body).toPromise();
  }
}
