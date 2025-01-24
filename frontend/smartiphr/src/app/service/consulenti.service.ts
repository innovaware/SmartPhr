import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consulenti } from '../models/consulenti';
import { catchError } from "rxjs/internal/operators/catchError";

@Injectable({
  providedIn: "root",
})
export class ConsulentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getConsulenti(): Promise<Consulenti[]> {
    return this.http.get<Consulenti[]>(this.api + "/api/consulenti").toPromise();
  }
  async getById(id:String): Promise<Consulenti> {
    return this.http.get<Consulenti>(this.api + "/api/consulenti/"+id).toPromise();
  }

  insert(consulente: Consulenti): Observable<Consulenti> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    var body = consulente;
    return this.http.post<Consulenti>(this.api + "/api/consulenti", body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  update(consulente: Consulenti): Observable<Consulenti> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    var body = consulente;
    return this.http.put<Consulenti>(this.api + "/api/consulenti/" + consulente._id, body, { headers });
  }
  private handleError(error: any) {
    console.error("Errore del servizio Segnalazione: ", error);
    return throwError(error);
  }

  delete(consulente: Consulenti): Observable<Consulenti> {
    return this.http.delete<Consulenti>(this.api + "/api/consulenti/" + consulente._id);
  }
}
