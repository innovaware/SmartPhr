import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { SchedaTerapeutica } from '../models/schedaTerapeutica';
import { catchError, tap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SchedaTerapeuticaService {
  [x: string]: any;

  api: string = environment.api;

  constructor(private http: HttpClient) { }


  async getAll(): Promise<SchedaTerapeutica[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<SchedaTerapeutica[]>(this.api + "/api/schedaTerapeutica/", { headers })
      .toPromise();
  }

  async getByPaziente(id: String): Promise<SchedaTerapeutica> {
    console.log("ID paziente:", id);

    if (!id) {
      throw new Error("ID del paziente non valido o non definito");
    }

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<SchedaTerapeutica>(`${this.api}/api/schedaTerapeutica/paziente/${id}`, { headers })
      .toPromise();
  }

  add(body: SchedaTerapeutica) {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }
    console.log("Il Body: ", body);
    return this.http
      .post<SchedaTerapeutica>(`${this.api}/api/schedaTerapeutica`, body, { headers }) // Aggiungi { headers }
      .toPromise();
  }

  update(body: SchedaTerapeutica): Observable<any> {
    if (!body._id) {
      console.error("Errore: ID mancante nel body per l'aggiornamento.");
      return throwError(() => new Error('ID mancante per l\'aggiornamento della schedaTerapeutica'));
    }

    return this.http.put(`${this.api}/api/schedaTerapeutica/${body._id}`, body).pipe(
      tap(response => console.log("Risposta dall'aggiornamento:", response)),
      catchError(error => {
        console.error("Errore nell'update della schedaTerapeutica:", error);
        return throwError(() => new Error('Errore durante l\'aggiornamento della schedaTerapeutica'));
      })
    );
  }

  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  saveSchedaTerapeutica(scheda: SchedaTerapeutica): Promise<any> {
    return this.http.post(`${this.api}/api/schedaTerapeutica`, scheda).toPromise();
  }

}
