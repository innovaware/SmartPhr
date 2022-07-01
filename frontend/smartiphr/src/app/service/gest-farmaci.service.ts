import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Farmaci } from "../models/farmaci";

@Injectable({
  providedIn: 'root'
})
export class GestFarmaciService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getFarmaci(): Promise<Farmaci[]> {
    return this.http.get<Farmaci[]>(this.api + "/api/farmaci").toPromise();
  }

  async getFarmaciByPaziente(id): Promise<Farmaci[]> {
    return this.http.get<Farmaci[]>(this.api + "/api/farmaci/paziente/" + id).toPromise();
  }

  async update(item: Farmaci) {
    var body = item;
    return this.http.put<Farmaci>(this.api + "/api/farmaci/" + item._id, body).toPromise();
  }

  async insert(item: Farmaci) {
    var body = item;
    return this.http.post<Farmaci>(this.api + "/api/farmaci", body).toPromise();
  }
}
