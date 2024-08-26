import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Armadio } from '../models/armadio';
import { RegistroArmadio } from "../models/RegistroArmadio";
import { Paziente } from "../models/paziente";

@Injectable({
  providedIn: 'root'
})
export class ArmadioService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  getIndumenti(idCamera: string, date: Date): Observable<Armadio[]> {
    const headers = {}
    return this.http.get<Armadio[]>(`${this.api}/api/armadio/camera/${idCamera}?date=${date.toISOString()}`, { headers });
  }

  getByCamera(idCamera: string): Observable<Armadio[]> {
    const headers = {}
    return this.http.get<Armadio[]>(`${this.api}/api/armadio/camera/get/${idCamera}`, { headers });
  }

  getByPaziente(idPaziente: String): Promise<Armadio>{
    return this.http.get<Armadio>(`${this.api}/api/armadio/paziente/${idPaziente}`).toPromise();
  }

  update(armadio: Armadio, note: string) {
    return this.http.put(`${this.api}/api/armadio/${armadio._id}`, {armadio: armadio, note: note});
  }

  getRegistro():Observable<RegistroArmadio[]> {
    const headers = {}
    return this.http.get<RegistroArmadio[]>(`${this.api}/api/armadio/registro`, { headers });
  }

  add(armadio: Armadio, note: string) {
    return this.http.post(`${this.api}/api/armadio`, {armadio: armadio, note: note});
  }
  delete(armadio: Armadio) {
    return this.http.delete(`${this.api}/api/armadio/${armadio._id}`);
  }
}
