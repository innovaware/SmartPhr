import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Evento } from '../models/evento';
import { UserInfo } from '../models/userInfo';

@Injectable({
  providedIn: "root",
})
export class EventiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getEventi(): Promise<Evento[]> {
    return this.http.get<Evento[]>(this.api + "/api/eventi").toPromise();
  }

  async getEventiByDay(day: moment.Moment, user: UserInfo): Promise<Evento[]> {
    const data: string = day.format("YYYYMMDD");
    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');
    const params = new HttpParams().append('user', user.identify);

    return this.http.get<Evento[]>(this.api + "/api/eventi/search/"+ data, {headers, params}).toPromise();
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
}
