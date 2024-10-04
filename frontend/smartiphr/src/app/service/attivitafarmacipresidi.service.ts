import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { AttivitaFarmaciPresidi } from '../models/attivitaFarmaciPresidi';

@Injectable({
  providedIn: 'root'
})
export class AttivitafarmacipresidiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  async getAllAttivitaArmadiFP(): Promise<AttivitaFarmaciPresidi[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<AttivitaFarmaciPresidi[]>(this.api + "/api/attivitafarmaci/armadiofarmaci", { headers })
      .toPromise();
  }

  async getAttivitaArmadiFPByPaziente(id: String): Promise<AttivitaFarmaciPresidi[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<AttivitaFarmaciPresidi[]>(this.api + "/api/attivitafarmaci/armadiofarmaci/paziente/" + id, { headers })
      .toPromise();
  }



  async getAllAttivitaFarmaci(): Promise<AttivitaFarmaciPresidi[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<AttivitaFarmaciPresidi[]>(this.api + "/api/attivitafarmaci/farmaci", { headers })
      .toPromise();
  }


  async getAllAttivitaPresidi(): Promise<AttivitaFarmaciPresidi[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<AttivitaFarmaciPresidi[]>(this.api + "/api/attivitafarmaci/presidi", { headers })
      .toPromise();
  }

  addArmF(body: AttivitaFarmaciPresidi) {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }
    return this.http
      .post<AttivitaFarmaciPresidi>(this.api + "/api/attivitafarmaci/armadiofarmaci", body)
      .toPromise();
  }
  addFarm(body: AttivitaFarmaciPresidi) {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }
    return this.http
      .post<AttivitaFarmaciPresidi>(this.api + "/api/attivitafarmaci/farmaci", body)
      .toPromise();
  }
  addPres(body: AttivitaFarmaciPresidi) {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }
    return this.http
      .post<AttivitaFarmaciPresidi>(this.api + "/api/attivitafarmaci/presidi", body)
      .toPromise();
  }
}
