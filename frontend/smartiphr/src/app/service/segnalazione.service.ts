import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { Segnalazione } from "../models/segnalazione";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class SegnalazioneService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getSegnalazione(): Observable<Segnalazione[]> {
    const headers = {}
    return this.http.get<Segnalazione[]>(`${this.api}/api/segnalazione`, { headers });
  }

  addSegnalazione(segnalazione: Segnalazione): Observable<Segnalazione> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Segnalazione>(`${this.api}/api/segnalazione`, segnalazione, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  Update(segnalazione: Segnalazione) {
    return this.http.put(`${this.api}/api/segnalazione/${segnalazione._id}`, segnalazione);
  }
  private handleError(error: any) {
    console.error("Errore del servizio Segnalazione: ", error);
    return throwError(error);
  }
}
