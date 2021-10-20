import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PuntoFatture } from '../models/puntoFatture';

@Injectable({
  providedIn: "root",
})
export class PuntoFattureService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getPuntoFattureAll(): Observable<PuntoFatture[]> {
    return this.http.get<PuntoFatture[]>(`${this.api}/api/puntofatture`);
  }

  async getPuntoFatture(id: string): Promise<PuntoFatture[]> {
    return this.http
      .get<PuntoFatture[]>(`${this.api}/api/puntofatture/${id}`)
      .toPromise();
  }

  async insertPuntoFatture(punto: PuntoFatture, id: string) {
    console.log("Insert punto: ", punto);
    var body = punto;
    return this.http.post(`${this.api}/api/puntofatture/${id}`, body).toPromise();
  }

  async updatePuntoFatture(punto: PuntoFatture) {
    var body = punto;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/puntofatture/" + punto._id, body).toPromise();
  }

  async remove(punto: PuntoFatture) {
    return this.http.delete(`${this.api}/api/puntofatture/${punto._id}`).toPromise();
  }

/*   delete(punto: PuntoFatture): Observable<PuntoFatture> {
    return this.http.delete<PuntoFatture>(this.api + "/api/curriculum/" + punto._id);
  } */

}
