import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError, tap } from "rxjs/operators";
import { Carrello } from "../models/carrello";

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }


  get(): Promise<Carrello[]> {
    return this.http.get<Carrello[]>(`${this.api}/api/carrello/`).toPromise();
  }

  getById(id:String): Promise<Carrello> {
    return this.http.get<Carrello>(`${this.api}/api/carrello/${id}`).toPromise();
  }

  getByType(type: String): Promise<Carrello[]> {
    return this.http.get<Carrello[]>(`${this.api}/api/carrello/type/${type}`).toPromise();
  }

  update(cart: Carrello): Observable<Carrello> {
    console.log("Aggiornamento Carrello:", cart);

    return this.http.put(`${this.api}/api/carrello/${cart._id}`, cart).pipe(
      tap(response => console.log("Risposta dall'aggiornamento:", response)),
      catchError(error => {
        console.error("Errore nell'update del carrello:", error);
        return throwError(() => new Error('Errore durante l\'aggiornamento del carrello'));
      })
    );
  }

}
