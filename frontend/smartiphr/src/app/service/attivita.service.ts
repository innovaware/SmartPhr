import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Attivita } from '../models/attivita';
import { AttivitaOSS } from "../models/attivitaOSS";

@Injectable({
  providedIn: 'root'
})
export class AttivitaService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  async getAttivitaByPaziente(id): Promise<AttivitaOSS[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<AttivitaOSS[]>(this.api + "/api/attivita/paziente/" + id, { headers })
      .toPromise();
  }



  async getAllAttivita(): Promise<Attivita[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<Attivita[]>(this.api + "/api/attivita", { headers })
      .toPromise();
  }


  async insert(attivita: Attivita) {
    var body = attivita;
    return this.http.post(this.api + "/api/attivita", body).toPromise();
  }


}
