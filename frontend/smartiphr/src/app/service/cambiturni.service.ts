import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Cambiturno } from '../models/cambiturni';

@Injectable({
  providedIn: 'root'
})
export class CambiturniService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getCambiturno(): Promise<Cambiturno[]> {
    return this.http.get<Cambiturno[]>(this.api + "/api/cambiturno").toPromise();
  }

  async insertCambioturno(cambiturno: Cambiturno) {
    var body = cambiturno;
    return this.http.post(this.api + "/api/cambiturno", body).toPromise();
  }

  async updateCambioturno(cambiturno: Cambiturno) {
    var body = cambiturno;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/cambiturno/" + cambiturno._id, body).toPromise();
  }
}
