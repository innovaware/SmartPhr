import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError } from "rxjs/operators";
import { ArchivioMenuCucinaPersonalizzato } from "../models/archivioMenuCucinaPersonalizzato";

@Injectable({
  providedIn: 'root'
})
export class ArchivioMenuCucinaPersonalizzatoService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  get(): Observable<ArchivioMenuCucinaPersonalizzato[]> {
    return this.http.get<ArchivioMenuCucinaPersonalizzato[]>(`${this.api}/api/archivioMenuCucinaPersonalizzato`)
      .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<ArchivioMenuCucinaPersonalizzato> {
    return this.http.get<ArchivioMenuCucinaPersonalizzato>(`${this.api}/api/archivioMenuCucinaPersonalizzato/${id}`)
      .pipe(catchError(this.handleError));
  }

  Insert(ArchivioMenuCucinaPersonalizzato: ArchivioMenuCucinaPersonalizzato): Observable<ArchivioMenuCucinaPersonalizzato> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log("Archivio spedito al BE: ", ArchivioMenuCucinaPersonalizzato);
    return this.http.post<ArchivioMenuCucinaPersonalizzato>(`${this.api}/api/archivioMenuCucinaPersonalizzato`, ArchivioMenuCucinaPersonalizzato, { headers })
      .pipe(
        catchError(error => {
          console.error("Errore durante l'inserimento:", error);
          return throwError(error);
        })
      );
  }

  private handleError(error: any) {
    console.error("Errore del servizio CucinaPersonalizzato: ", error);
    return throwError(error);
  }
}
