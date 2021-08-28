import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Evento } from '../models/evento';

@Injectable({
  providedIn: "root",
})
export class EventiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getEventi(): Promise<Evento[]> {
    return this.http.get<Evento[]>(this.api + "/api/eventi").toPromise();
  }

  async getEventiByDay(day: moment.Moment): Promise<Evento[]> {
    return this.http.get<Evento[]>(this.api + "/api/eventi/"+ day.format("YYYYMMDD")).toPromise();
    // return new Promise((resolve, reject) => {
    //   let eventi: Evento[] = [];
    //   eventi.push({ data:  new Date(), descrizione: "dd", tipo: "", utente: ""});

    //   resolve(eventi);
    // });
  }

  async insertEvento(evento: Evento) {
    var body = evento;
    return this.http.post(this.api + "/api/eventi", body).toPromise();
  }

  async updateEvento(evento: Evento) {
    var body = evento;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/eventi/" + evento._id, body).toPromise();
  }
}
