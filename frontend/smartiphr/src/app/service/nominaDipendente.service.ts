import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError } from "rxjs/operators";
import { NominaDipendente } from "../models/nominaDipendente";

@Injectable({
  providedIn: 'root'
})

export class NominaDipendentiService {

  api: string = environment.api;
  constructor(private http: HttpClient) { }

  getNomine(): Observable<NominaDipendente[]> {
    const headers = {}
    return this.http.get<NominaDipendente[]>(`${this.api}/api/nominaDipendente`, { headers });
  }

  getNomineById(id: String): Observable<NominaDipendente> {
    const headers = {}
    return this.http.get<NominaDipendente>(`${this.api}/api/nominaDipendente/${id}`, { headers });
  }

  getNominaDipendente(id: String): Observable<NominaDipendente[]> {
    const headers = {}
    return this.http.get<NominaDipendente[]>(`${this.api}/api/nominaDipendente/dipendente/${id}`, { headers });
  }

  addNomina(nomina: NominaDipendente) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log(nomina);
    return this.http.post<NominaDipendente>(`${this.api}/api/nominaDipendente`, nomina, { headers })
      .pipe(                                                                                                                                                                       
        catchError(this.handleError)
      );
  }
  Update(nomina: NominaDipendente) {
    return this.http.put(`${this.api}/api/nominaDipendente/${nomina._id}`, nomina);
  }
  private handleError(error: any) {
    console.error("Errore del servizio NominaDipendentiService: ", error);
    return throwError(error);
  }
}
