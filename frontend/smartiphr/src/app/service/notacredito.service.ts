import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { NotaCredito } from '../models/notacredito';
import { Paziente } from '../models/paziente';

@Injectable({
  providedIn: "root",
})
export class NotaCreditoService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getNotaCredito(paziente: Paziente): Promise<NotaCredito[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<NotaCredito[]>(`${this.api}/api/notacredito/paziente/${paziente._id}`, { headers })
      .toPromise();
  }

  async insertNotaCredito(notacredito: NotaCredito, paziente: Paziente) {
    var body = notacredito;
    return this.http.post(`${this.api}/api/notacredito/paziente/${paziente._id}`, body).toPromise();
  }

  async updateNotaCredito(notacredito: NotaCredito) {
    var body = notacredito;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/notacredito/" + notacredito._id, body).toPromise();
  }

  async remove(notacredito: NotaCredito) {
    return this.http.delete(`${this.api}/api/notacredito/${notacredito._id}`).toPromise();
  }

}
