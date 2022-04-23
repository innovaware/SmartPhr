import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Indumento, IndumentoTemplate } from '../models/armadio';

@Injectable({
  providedIn: 'root'
})
export class IndumentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getIndumenti(): Observable<IndumentoTemplate[]> {
    const headers = {}
    return this.http.get<IndumentoTemplate[]>(`${this.api}/api/indumenti`, { headers });
  }

  addIndumenti(indumento: IndumentoTemplate) {
    return this.http.post(`${this.api}/api/indumenti`, indumento);
  }

}
