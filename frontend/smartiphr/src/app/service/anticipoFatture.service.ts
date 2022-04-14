import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AnticipoFatture } from '../models/anticipoFatture';

@Injectable({
  providedIn: "root",
})
export class AnticipoFattureService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getAnticipoFattureAll(): Observable<AnticipoFatture[]> {
    return this.http.get<AnticipoFatture[]>(`${this.api}/api/anticipofatture`);
  }

  async getAnticipoFatture(id: string): Promise<AnticipoFatture[]> {
    return this.http
      .get<AnticipoFatture[]>(`${this.api}/api/anticipofatture/${id}`)
      .toPromise();
  }

  async insertAnticipo(anticipo: AnticipoFatture, id: string) {
    console.log("Insert anticipo: ", anticipo);
    var body = anticipo;
    return this.http.post(`${this.api}/api/anticipofatture/${id}`, body).toPromise();
  }

  async updateAnticipo(anticipo: AnticipoFatture) {
    var body = anticipo;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/anticipofatture/" + anticipo._id, body).toPromise();
  }

  async remove(anticipo: AnticipoFatture) {
    return this.http.delete(`${this.api}/api/anticipofatture/${anticipo._id}`).toPromise();
  }

/*   delete(anticipo: AnticipoFatture): Observable<AnticipoFatture> {
    return this.http.delete<AnticipoFatture>(this.api + "/api/curriculum/" + anticipo._id);
  } */

}
