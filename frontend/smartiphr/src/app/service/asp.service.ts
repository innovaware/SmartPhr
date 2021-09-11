import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Asp } from "../models/asp";

@Injectable({
  providedIn: "root",
})
export class AspService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getAsp(): Promise<Asp[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<Asp[]>(this.api + "/api/asp", { headers })
      .toPromise();
  }

  async insertAsp(asp: Asp) {
    var body = asp;
    return this.http.post(this.api + "/api/asp", body).toPromise();
  }

  async updateAsp(asp: Asp) {
    var body = asp;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/asp/" + asp._id, body).toPromise();
  }
}
