import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AgendaClinica } from '../models/agendaClinica';
import { UserInfo } from '../models/userInfo';
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AgendaClinicaService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  async getagendaClinica(): Promise<AgendaClinica[]> {
    return this.http.get<AgendaClinica[]>(this.api + "/api/agendaClinica").toPromise();
  }

  getagendaClinicaByType(tipo: string): Promise<AgendaClinica[]> {
    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');
    console.log(`${this.api}/api/agendaClinica/tipo/${tipo}`);
    return this.http.get<AgendaClinica[]>(`${this.api}/api/agendaClinica/tipo/${tipo}`, { headers })
      .pipe(
        catchError(this.handleError)
      )
      .toPromise();
  }

  async insertAgendaClinica(AgendaClinica: AgendaClinica) {
    var body = AgendaClinica;
    return this.http.post(this.api + "/api/agendaClinica", body).toPromise();
  }

  async updateAgendaClinica(AgendaClinica: AgendaClinica) {
    var body = AgendaClinica;
    return this.http.put(this.api + "/api/agendaClinica/" + AgendaClinica._id, body).toPromise();
  }

  private handleError(error: any): Observable<never> {
    console.error('Si è verificato un errore:', error); // Log dell'errore
    return throwError(error.message || 'Errore del server');
  }
}
