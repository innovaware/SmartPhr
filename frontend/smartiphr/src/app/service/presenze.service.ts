import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Presenze } from '../models/presenze';

@Injectable({
  providedIn: 'root'
})
export class PresenzeService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getPresenze(): Promise<Presenze[]> {
    return this.http.get<Presenze[]>(this.api + "/api/presenze").toPromise();
  }

  async insertPresenza(presenza: Presenze) {
    var body = presenza;
    return this.http.post(this.api + "/api/presenza", body).toPromise();
  }

  async updatePresenza(presenza: Presenze) {
    var body = presenza;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/presenza/" + presenza._id, body).toPromise();
  }
}
