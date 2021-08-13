import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Asp } from '../models/asp';

@Injectable({
  providedIn: "root",
})
export class AspService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getAsp(): Promise<Asp[]> {
    return this.http.get<Asp[]>(this.api + "/api/asp").toPromise();
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
