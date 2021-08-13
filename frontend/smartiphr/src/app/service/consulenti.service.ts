import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Consulenti } from '../models/consulenti';

@Injectable({
  providedIn: "root",
})
export class ConsulentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getConsulenti(): Promise<Consulenti[]> {
    return this.http.get<Consulenti[]>(this.api + "/api/consulenti").toPromise();
  }

  async insertConsulenti(consulente: Consulenti) {
    var body = consulente;
    return this.http.post(this.api + "/api/consulenti", body).toPromise();
  }

  async updateConsulenti(consulente: Consulenti) {
    var body = consulente;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/consulenti/" + consulente._id, body).toPromise();
  }
}
