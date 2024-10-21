import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { SchedaTerapeutica } from '../models/schedaTerapeutica';
import { catchError, tap } from "rxjs/operators";

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

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<SchedaTerapeutica>(this.api + "/api/schedaTerapeutica/paziente/" + id, { headers })
      .toPromise();
  }

  add(body: SchedaTerapeutica) {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }
    return this.http
      .post<SchedaTerapeutica>(this.api + "/api/schedaTerapeutica", body)
      .toPromise();
  }

  update(body: SchedaTerapeutica): Observable<any> {

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
    return this.http.post('url_del_backend_per_salvare', scheda).toPromise();
  }

}


function of<T extends {}>(arg0: T): Observable<T> {
    throw new Error("Function not implemented.");
}
