import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Cambiturno } from '../models/cambiturni';

@Injectable({
  providedIn: 'root'
})
export class CambiturniService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  getCambiturnoByDipendente(id): Observable<Cambiturno[]> {
    return this.http.get<Cambiturno[]>(this.api + "/api/cambiturno/dipendente/" + id);
  }


  async getCambiturno(): Promise<Cambiturno[]> {
    console.log("Cambio turno GET");

    return this.http.get<Cambiturno[]>(this.api + "/api/cambiturno").toPromise();
  }

  async insertCambioturno(cambiturno: Cambiturno) {
    var body = cambiturno;
    return this.http.post(this.api + "/api/cambiturno", body).toPromise();
  }

  async updateCambioturno(cambiturno: Cambiturno) {
    var body = cambiturno;
    return this.http.put(this.api + "/api/cambiturno/" + cambiturno._id, body).toPromise();
  }
}
