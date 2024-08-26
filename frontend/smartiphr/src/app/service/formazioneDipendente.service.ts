import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError } from "rxjs/operators";
import { FormazioneDipendente } from "../models/formazioneDipendente";

@Injectable({
  providedIn: 'root'
})

export class FormazioneDipendentiService {

  api: string = environment.api;
  constructor(private http: HttpClient) { }

  getFormazioni(): Observable<FormazioneDipendente[]> {
    const headers = {}
    return this.http.get<FormazioneDipendente[]>(`${this.api}/api/formazioneDipendente`, { headers });
  }

  getFormazioniById(id: String): Observable<FormazioneDipendente> {
    const headers = {}
    return this.http.get<FormazioneDipendente>(`${this.api}/api/formazioneDipendente/${id}`, { headers });
  }

  getFormazioneDipendente(id: String): Observable<FormazioneDipendente[]> {
    const headers = {}
    return this.http.get<FormazioneDipendente[]>(`${this.api}/api/formazioneDipendente/dipendente/${id}`, { headers });
  }

  add(esito: FormazioneDipendente) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log(esito);
    return this.http.post<FormazioneDipendente>(`${this.api}/api/formazioneDipendente`, esito, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  Update(esito: FormazioneDipendente) {
    return this.http.put(`${this.api}/api/formazioneDipendente/${esito._id}`, esito);
  }
  private handleError(error: any) {
    console.error("Errore del servizio NominaDipendentiService: ", error);
    return throwError(error);
  }
}
