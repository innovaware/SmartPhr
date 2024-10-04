import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { ArmadioFarmaci } from '../models/armadioFarmaci';
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ArmadioFarmaciService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }


  get(): Promise<ArmadioFarmaci[]> {
    return this.http.get<ArmadioFarmaci[]>(`${this.api}/api/armadioFarmaci/`).toPromise();
  }

  getByPaziente(idPaziente: String): Promise<ArmadioFarmaci> {
    return this.http.get<ArmadioFarmaci>(`${this.api}/api/armadioFarmaci/paziente/${idPaziente}`).toPromise();
  }

  update(armadio: ArmadioFarmaci, note: string): Observable<any> {
    console.log("Aggiornamento Armadio:", armadio);
    console.log("Nota:", note);

    return this.http.put(`${this.api}/api/armadioFarmaci/${armadio._id}`, armadio).pipe(
      tap(response => console.log("Risposta dall'aggiornamento:", response)),
      catchError(error => {
        console.error("Errore nell'update dell'armadio:", error);
        return throwError(() => new Error('Errore durante l\'aggiornamento dell\'armadio'));
      })
    );
  }



  add(armadio: ArmadioFarmaci, note: string) {
    return this.http.post(`${this.api}/api/armadioFarmaci`, { armadio: armadio, note: note });
  }

  delete(armadio: ArmadioFarmaci) {
    return this.http.delete(`${this.api}/api/armadioFarmaci/${armadio._id}`);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
