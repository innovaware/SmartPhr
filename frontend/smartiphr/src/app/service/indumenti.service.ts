import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Indumento } from "../models/indumento";

@Injectable({
  providedIn: 'root'
})
export class IndumentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getIndumenti(): Observable<Indumento[]> {
    const headers = {}
    return this.http.get<Indumento[]>(`${this.api}/api/indumenti`, { headers });
  }

  addIndumenti(indumento: Indumento) {
    return this.http.post(`${this.api}/api/indumenti`, indumento);
  }

}
