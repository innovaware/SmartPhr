import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Fornitori } from '../models/fornitori';

@Injectable({
  providedIn: "root",
})
export class FornitoriService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getFornitori(): Promise<Fornitori[]> {
    return this.http.get<Fornitori[]>(this.api + "/api/fornitori").toPromise();
  }

  async getFornitore(id: string): Promise<Fornitori[]> {
    return this.http.get<Fornitori[]>(`${this.api}/api/fornitori/${id}`).toPromise();
  }

  save(data: Fornitori): Promise<Fornitori> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<Fornitori>(this.api + "/api/fornitori/" + data._id, body)
      .toPromise();
  }

  insert(data: Fornitori): Promise<Fornitori> {
    var body = data;
    return this.http
      .post<Fornitori>(this.api + "/api/fornitori", body)
      .toPromise();
  }
}
