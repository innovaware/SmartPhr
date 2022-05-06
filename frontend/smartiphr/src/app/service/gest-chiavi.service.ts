import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { gestChiavi } from "../models/gestChiavi";

@Injectable({
  providedIn: 'root'
})
export class GestChiaviService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async get(): Promise<gestChiavi[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<gestChiavi[]>(`${this.api}/api/gestChiavi`, { headers })
      .toPromise();
  }




  async insert(rec: gestChiavi) {
    var body = rec;
    return this.http.post(`${this.api}/api/gestChiavi`, body).toPromise();
  }

  async update(rec: gestChiavi) {
    var body = rec;
    return this.http.put(this.api + "/api/gestChiavi/" + rec._id, body).toPromise();
  }


}
