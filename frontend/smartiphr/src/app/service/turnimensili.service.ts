import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Turnimensili } from "../models/turnimensili";
import { UserInfo } from "../models/userInfo";

@Injectable({
  providedIn: "root",
})
export class TurnimensiliService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getTurniByIntervalDay(dayStart: moment.Moment, dayEnd: moment.Moment): Observable<Turnimensili[]> {
    const dataStart: string = dayStart.format("YYYYMMDD");
    const dataEnd: string = dayEnd.format("YYYYMMDD");

    const headers = new HttpHeaders().append('Authorization', 'Basic ZGQ6ZGQ=');

    return this.http.get<Turnimensili[]>(`${this.api}/api/turnimensili/searchInterval/${dataStart}/${dataEnd}`);
  }

  getTurnimensiliByDipendente(id): Observable<Turnimensili[]> {
    return this.http
      .get<Turnimensili[]>(this.api + "/api/turnimensili/dipendente/" + id)
      .pipe(
        map((results: any) => {
          const resultTurni: any[] = results.filter((x: any) => {
            return x.turni.length > 0;
          });

          const turni: Turnimensili[] = [];

          resultTurni.forEach((x) => {
            x.turni.forEach((p) => {
              const turniItem: Turnimensili = {
                dataRifInizio: p.dataRifInizio,
                dataRifFine: p.dataRifFine,
                turnoInizio: p.turnoInizio,
                turnoFine: p.turnoFine,
                user: p.user,

                cognome: x.cognome,
                nome: x.nome,
                cf: x.codiceFiscale,
              };
              turni.push(turniItem);
            });
          });
          return turni;
        })
      );
  }

  getTurnimensili(): Observable<Turnimensili[]> {
    //return this.http.get<Turnimensili[]>(this.api + "/api/turnimensili").pipe(
    //  map((results: any) => {
    //    console.log("results:", results);
    //    const resultTurni: any[] = results.filter((x: any) => {
    //      return x.turni.length > 0;
    //    });
    //    console.log(resultTurni);
    //    const turni: Turnimensili[] = [];
    //    console.log("ritorno: ", resultTurni);
    //    resultTurni.forEach((x) => {
    //      x.turni.forEach((p) => {
    //        const turniItem: Turnimensili = {
    //          dataRifInizio: p.dataRifInizio,
    //          dataRifFine: p.dataRifFine,
    //          turnoInizio: p.turnoInizio,
    //          turnoFine: p.turnoFine,
    //          user: p.user,
    //          utente: p.utente,
    //          mansione: p.mansione,
    //          cognome: x.cognome,
    //          nome: x.nome,
    //          cf: x.codiceFiscale,
    //        };
    //        turni.push(turniItem);
    //      });
    //    });
    //    return turni;
    //  })
    //);
    return this.http.get<Turnimensili[]>(this.api + "/api/turnimensili");
  }

  async insertTurno(turnimensili: Turnimensili) {
    var body = turnimensili;
    return this.http.post(this.api + "/api/turnimensili", body).toPromise();
  }

  async updateTurno(turnimensili: Turnimensili) {
    var body = turnimensili;
    return this.http
      .put(this.api + "/api/turnimensili/" + turnimensili._id, body)
      .toPromise();
  }
}
