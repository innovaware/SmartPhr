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


  getIndumenti(idCamera: string): Observable<Armadio[]> {
    const headers = {}
    return this.http.get<Armadio[]>(`${this.api}/api/armadio/camera/${idCamera}`, { headers });
  }

}
