import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Presidi } from "../models/presidi";

@Injectable({
  providedIn: 'root'
})
export class GestPresidiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getPresidi(): Promise<Presidi[]> {
    return this.http.get<Presidi[]>(this.api + "/api/presidi").toPromise();
  }

  async update(item: Presidi) {
    var body = item;
    return this.http.put<Presidi>(this.api + "/api/presidi/" + item._id, body).toPromise();
  }

  async insert(item: Presidi) {
    var body = item;
    return this.http.post<Presidi>(this.api + "/api/presidi", body).toPromise();
  }
}
