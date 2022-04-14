import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Ferie } from '../models/ferie';

@Injectable({
  providedIn: 'root'
})
export class FerieService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getFerie(): Promise<Ferie[]> {
    return this.http.get<Ferie[]>(this.api + "/api/ferie").toPromise();
  }


  getFerieByDipendente(id): Observable<Ferie[]> {
    return this.http.get<Ferie[]>(this.api + "/api/ferie/dipendente/" + id);
  }

  async insertFerie(ferie: Ferie) {
    var body = ferie;
    return this.http.post(this.api + "/api/ferie", body).toPromise();
  }

  async updateFerie(ferie: Ferie) {
    var body = ferie;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/ferie/" + ferie._id, body).toPromise();
  }
}
