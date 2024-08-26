import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { TestRiabilitativo } from "../models/testRiabilitativo";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class TestRiabilitativoService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getTestRiabilitativiALL(): Observable<TestRiabilitativo[]> {
    const headers = {}
    return this.http.get<TestRiabilitativo[]>(`${this.api}/api/testRiabilitativo`, { headers });
  }

  getTestRiabilitativiByPaziente(id:String): Observable<TestRiabilitativo[]> {
    const headers = {}
    return this.http.get<TestRiabilitativo[]>(`${this.api}/api/testRiabilitativo/paziente/${id}`, { headers });
  }

  addTestRiabilitativo(TestRiabilitativo: TestRiabilitativo): Observable<TestRiabilitativo> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<TestRiabilitativo>(`${this.api}/api/testRiabilitativo`, TestRiabilitativo, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  private handleError(error: any) {
    console.error("Errore del servizio TestRiabilitativo: ", error);
    return throwError(error);
  }
}
