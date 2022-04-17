import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Armadio } from '../models/armadio';

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

  update(armadio: Armadio) {
    return this.http.put(`${this.api}/api/armadio/${armadio._id}`, {armadio: armadio});
  }
}
