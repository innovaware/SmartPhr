import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Turnimensili } from "../models/turnimensili";

@Injectable({
  providedIn: "root",
})
export class TurnimensiliService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

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
    return this.http.get<Turnimensili[]>(this.api + "/api/turnimensili").pipe(
      map((results: any) => {
        const resultTurni: any[] = results.filter((x: any) => {
          return x.turni.length > 0;
        });
        console.log(resultTurni);
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

  async insertTurno(turnimensili: Turnimensili) {
    var body = turnimensili;
    return this.http.post(this.api + "/api/turnimensili", body).toPromise();
  }

  async updateTurno(turnimensili: Turnimensili) {
    var body = turnimensili;
    console.log("body: ", body);
    return this.http
      .put(this.api + "/api/turnimensili/" + turnimensili._id, body)
      .toPromise();
  }
}
