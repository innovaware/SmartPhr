import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError } from "rxjs/operators";
import { Log } from "../models/log";

@Injectable({
  providedIn: 'root'
})

export class LogService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getLogs(): Observable<Log[]> {
    const headers = {}
    return this.http.get<Log[]>(`${this.api}/api/log`, { headers });
  }

  async addLog(log: Log): Promise<Log> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Log>(`${this.api}/api/log`, log, { headers })
      .pipe(
        catchError(this.handleError)
      ).toPromise();
  }

  private handleError(error: any) {
    console.error("Errore del servizio Log: ", error);
    return throwError(error);
  }
}
