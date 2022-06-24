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


  async getAttivitaFarmaciByPaziente(id): Promise<AttivitaFarmaciPresidi[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<AttivitaFarmaciPresidi[]>(this.api + "/api/attivitafarmaci/farmacipaziente/" + id, { headers })
      .toPromise();
  }


  async getAttivitaPresidiByPaziente(id): Promise<AttivitaFarmaciPresidi[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<AttivitaFarmaciPresidi[]>(this.api + "/api/attivitafarmaci/presidipaziente/" + id, { headers })
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


}
