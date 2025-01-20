import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError } from "rxjs/operators";
import { NewMessage } from "../models/newMessage";

@Injectable({
  providedIn: 'root'
})
export class NewMessageService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getMessages(): Observable<NewMessage[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<NewMessage[]>(`${this.api}/api/newMessage`, { headers });
  }

  getMessagesForDip(dest: String): Observable<NewMessage[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<NewMessage[]>(`${this.api}/api/newMessage/messages/${dest}`, { headers });
  }

  getMessageForDip(dest: String, mess: String): Observable<NewMessage[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<NewMessage[]>(`${this.api}/api/newMessage/message/${dest}/${mess}`, { headers });
  }

  add(newMessage: NewMessage): Observable<NewMessage> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    // Se hai bisogno di auth, aggiungi anche:
    // .set('Authorization', 'Bearer ' + this.authService.getToken());

    console.log('Service - Invio messaggio:', newMessage); // Debug log

    return this.http.post<NewMessage>(
      `${this.api}/api/newMessage`,
      JSON.stringify(newMessage), // Assicuriamoci che il body sia in formato JSON
      { headers }
    ).pipe(
      catchError((error) => {
        console.error('Service - Errore nella chiamata:', error);
        return throwError(error);
      })
    );
  }

  Update(newMessage: NewMessage) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(`${this.api}/api/newMessage/${newMessage._id}`, newMessage, { headers });
  }

  private handleError(error: any) {
    console.error("Errore del servizio NewMessage: ", error);
    return throwError(error);
  }
}
