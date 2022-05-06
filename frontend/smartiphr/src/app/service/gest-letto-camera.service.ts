import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AttivitaRifacimentoLetti } from "../models/attivitaRifacimentoLetti";
import { LettoCamera } from "../models/lettoCamera";

@Injectable({
  providedIn: 'root'
})
export class GestLettoCameraService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async get(): Promise<LettoCamera[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<LettoCamera[]>(`${this.api}/api/lettoCamera`, { headers })
      .toPromise();
  }

  async getAttivita(): Promise<AttivitaRifacimentoLetti[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<AttivitaRifacimentoLetti[]>(`${this.api}/api/lettoCamera/attivita`, { headers })
      .toPromise();
  }



  async update(rec: LettoCamera) {
    var body = rec;
    return this.http.put(this.api + "/api/lettoCamera/" + rec._id, body).toPromise();
  }

}
