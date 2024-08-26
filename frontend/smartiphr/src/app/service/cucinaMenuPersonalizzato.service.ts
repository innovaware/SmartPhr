import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError } from "rxjs/operators";
import { CucinaPersonalizzato } from "../models/cucinaPersonalizzato";

@Injectable({
  providedIn: 'root'
})
export class CucinaPersonalizzatoService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getCucinaPersonalizzato(): Observable<CucinaPersonalizzato[]> {
    return this.http.get<CucinaPersonalizzato[]>(`${this.api}/api/cucinaPersonalizzato`)
      .pipe(catchError(this.handleError));
  }

  getCucinaPersonalizzatoById(id: string): Observable<CucinaPersonalizzato> {
    return this.http.get<CucinaPersonalizzato>(`${this.api}/api/cucinaPersonalizzato/${id}`)
      .pipe(catchError(this.handleError));
  }

  getActiveByPaziente(id: string): Observable<CucinaPersonalizzato[]> {
    return this.http.get<CucinaPersonalizzato[]>(`${this.api}/api/cucinaPersonalizzato/Paziente/active/${id}`)
      .pipe(catchError(this.handleError));
  }

  getDisactiveByPaziente(id: string): Observable<CucinaPersonalizzato[]> {
    return this.http.get<CucinaPersonalizzato[]>(`${this.api}/api/cucinaPersonalizzato/Paziente/disactive/${id}`)
      .pipe(catchError(this.handleError));
  }

  Insert(cucinaPersonalizzato: CucinaPersonalizzato): Observable<CucinaPersonalizzato> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<CucinaPersonalizzato>(`${this.api}/api/cucinaPersonalizzato`, cucinaPersonalizzato, { headers })
      .pipe(
        catchError(error => {
          console.error("Errore durante l'inserimento:", error);
          return throwError(error);
        })
      );
  }


  Update(cucinaPersonalizzato: CucinaPersonalizzato): Observable<any> {
    return this.http.put(`${this.api}/api/cucinaPersonalizzato/${cucinaPersonalizzato._id}`, cucinaPersonalizzato)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error("Errore del servizio CucinaPersonalizzato: ", error);
    return throwError(error);
  }
}
