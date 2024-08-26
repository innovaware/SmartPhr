import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { IndumentiIngresso } from "../models/indumentiIngresso";

@Injectable({
  providedIn: 'root'
})
export class IndumentiIngressoService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getIndumentiIngresso(): Observable<IndumentiIngresso[]> {
    const headers = {}
    return this.http.get<IndumentiIngresso[]>(`${this.api}/api/indumentiIngresso`, { headers });
  }
  getIndumentiIngressoByPaziente(paziente: string): Observable<IndumentiIngresso[]> {
    const headers = {};
    // Utilizza il separatore '/' per concatenare l'ID del paziente all'URL
    return this.http.get<IndumentiIngresso[]>(`${this.api}/api/indumentiIngresso/paziente/${paziente}`, { headers });
  }

  addIndumentiIngresso(indumento: IndumentiIngresso) {
    return this.http.post(`${this.api}/api/indumentiIngresso`, indumento);
  }

}
