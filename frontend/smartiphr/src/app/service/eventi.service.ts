import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Evento } from '../models/evento';
import { UserInfo } from '../models/userInfo';
import { catchError } from "rxjs/operators";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class EventiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getEventi(): Promise<Evento[]> {
    return this.http.get<Evento[]>(this.api + "/api/eventi").toPromise();
  }

  getEventiByType(tipo: string): Promise<Evento[]> {
    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');
    console.log(`${this.api}/api/eventi/tipo/${tipo}`);
    return this.http.get<Evento[]>(`${this.api}/api/eventi/tipo/${tipo}`, { headers })
      .pipe(
        catchError(this.handleError)
      )
      .toPromise();
  }

  async getEventiByDay(day: moment.Moment, user: UserInfo): Promise<Evento[]> {
    const data: string = day.format("YYYYMMDD");
    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');
    const params = new HttpParams().append('user', user.identify);

    return this.http.get<Evento[]>(this.api + "/api/eventi/search/"+ data, {headers, params}).toPromise();
  }

  async getEventsByDay(day: moment.Moment, user: UserInfo): Promise<Evento[]> {
    const data: string = day.format("YYYYMMDD");
    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');

    const params = new HttpParams().append('user', user.identify);
    try {
      return await this.http.get<Evento[]>(this.api + "/api/eventi/searchByDay/" + data, { headers, params }).toPromise();
    } catch (error) {
      console.error("Errore durante la richiesta degli eventi per giorno:", error);
      throw new Error("Impossibile recuperare gli eventi per il giorno specificato.");
    }
  }
  async getEventsByDayType(day: moment.Moment, type: String, user: UserInfo): Promise<Evento[]> {
    const data: string = day.format("YYYYMMDD");
    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');
    const params = new HttpParams().append('user', user.identify);

    try {
      return await this.http.get<Evento[]>(this.api + "/api/eventi/searchByDayType/" + data + "/" + type, { headers, params }).toPromise();
    } catch (error) {
      console.error("Errore durante la richiesta degli eventi per giorno:", error);
      throw new Error("Impossibile recuperare gli eventi per il giorno specificato.");
    }
  }

  getEventiByIntervalDayType(dayStart: moment.Moment, dayEnd: moment.Moment, tipo: string, user: UserInfo): Observable<Evento[]> {
    const dataStart: string = dayStart.format("YYYYMMDD");
    const dataEnd: string = dayEnd.format("YYYYMMDD");

    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');
    const params = new HttpParams().append('user', user.identify);

    return this.http.get<Evento[]>(`${this.api}/api/eventi/searchIntervaltype/${dataStart}/${dataEnd}/${tipo}`, { headers, params });
  }
  getEventiByIntervalDay(dayStart: moment.Moment, dayEnd: moment.Moment, user: UserInfo): Observable<Evento[]> {
    const dataStart: string = dayStart.format("YYYYMMDD");
    const dataEnd: string = dayEnd.format("YYYYMMDD");

    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');
    const params = new HttpParams().append('user', user.identify);

    return this.http.get<Evento[]>(`${this.api}/api/eventi/searchInterval/${dataStart}/${dataEnd}`, {headers, params});
  }

  async insertEvento(evento: Evento) {
    var body = evento;
    return this.http.post(this.api + "/api/eventi", body).toPromise();
  }

  async updateEvento(evento: Evento) {
    var body = evento;
    return this.http.put(this.api + "/api/eventi/" + evento._id, body).toPromise();
  }

  async deleteEvento(evento: Evento) {
    return this.http.delete(this.api + "/api/eventi/" + evento._id).toPromise();
  }

  private handleError(error: any): Observable<never> {
    console.error('Si è verificato un errore:', error); // Log dell'errore
    return throwError(error.message || 'Errore del server');
  }
}
