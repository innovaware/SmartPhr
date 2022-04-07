import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Armadio } from '../models/armadio';

@Injectable({
  providedIn: 'root'
})
export class ArmadioService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  async getAll(): Promise<Armadio[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<Armadio[]>(this.api + "/api/armadio/", { headers })
      .toPromise();
  }


  async getElementiByPaziente(id): Promise<Armadio[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<Armadio[]>(this.api + "/api/armadio/paziente/" + id, { headers })
      .toPromise();
  }



  async getAllAttivita(): Promise<Armadio[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<Armadio[]>(this.api + "/api/armadio/attivita", { headers })
      .toPromise();
  }


  async getAttivitaByPaziente(id): Promise<Armadio[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<Armadio[]>(this.api + "/api/armadio/attivitapaziente/" + id, { headers })
      .toPromise();
  }


  async insert(armadio: Armadio) {
    var body = armadio;
    return this.http.post(this.api + "/api/armadio", body).toPromise();
  }


  async update(armadio: Armadio) {
    var body = armadio;
    return this.http.put(this.api + "/api/armadio/" + armadio._id, body).toPromise();
  }
}
