import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Bonifico } from '../models/bonifico';
import { Paziente } from '../models/paziente';

@Injectable({
  providedIn: "root",
})
export class BonificoService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getBonifico(paziente: Paziente): Promise<Bonifico[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<Bonifico[]>(`${this.api}/api/bonifici/paziente/${paziente._id}`, { headers })
      .toPromise();
  }

  async insertBonifico(bonifico: Bonifico, paziente: Paziente) {
    var body = bonifico;
    return this.http.post(`${this.api}/api/bonifici/paziente/${paziente._id}`, body).toPromise();
  }

  async updateBonifico(bonifico: Bonifico) {
    var body = bonifico;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/bonifici/" + bonifico._id, body).toPromise();
  }

  async remove(bonifico: Bonifico) {
    return this.http.delete(`${this.api}/api/bonifici/${bonifico._id}`).toPromise();
  }

}
