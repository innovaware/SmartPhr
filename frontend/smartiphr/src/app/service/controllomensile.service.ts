import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError } from "rxjs/operators";
import { controllomensile } from "../models/controllomensile";

@Injectable({
  providedIn: 'root'
})

export class ControlloMensileService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  get(): Observable<controllomensile[]> {
    const headers = {}
    return this.http.get<controllomensile[]>(`${this.api}/api/controllomensile`, { headers });
  }

  getByType(type: String): Observable<controllomensile[]> {
    const headers = {}
    return this.http.get<controllomensile[]>(`${this.api}/api/controllomensile/type/${type}`, { headers });
  }

  add(controllomensile: controllomensile): Observable<controllomensile> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<controllomensile>(`${this.api}/api/controllomensile`, controllomensile, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error("Errore del servizio Segnalazione: ", error);
    return throwError(error);
  }
}
