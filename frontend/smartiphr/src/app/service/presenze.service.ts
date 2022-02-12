import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Presenze } from "../models/presenze";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PresenzeService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getPresenze(): Observable<Presenze[]> {
    return this.http.get<any[]>(this.api + "/api/presenze").pipe(
      map((results: any) => {
        console.log(results);
        const pres: any[] = results.filter((x: any) => {
          return x.presenze.length > 0;
        });

        const presenze: Presenze[] = [];

        pres.forEach((x) => {
          x.presenze.forEach((p) => {

            const presenza: Presenze = {
              nome: x.nome,
              cognome: x.cognome,
              cf: x.codiceFiscale,
              data: p.data,
              turno: p.turno,
              mansione: p.mansione,
            };
            presenze.push(presenza);
          });
        });
        return presenze;
      })
    );
  }

  getPresenzeByDipendente(id): Observable<Presenze[]> {
    return this.http
      .get<any[]>(this.api + "/api/presenze/dipendente/" + id)
      .pipe(
        map((results: any) => {
          console.log(results);
          const pres: any[] = results.filter((x: any) => {
            return x.presenze.length > 0;
          });

          const presenze: Presenze[] = [];

          pres.forEach((x) => {
            x.presenze.forEach((p) => {

              const presenza: Presenze = {
                nome: x.nome,
                cognome: x.cognome,
                cf: x.codiceFiscale,
                data: p.data,
                turno: p.turno,
                mansione: p.mansione,
              };
              presenze.push(presenza);
            });
          });
          return presenze;
        })
      );
  }

  async insertPresenza(presenza: Presenze) {
    var body = presenza;
    return this.http.post(this.api + "/api/presenza", body).toPromise();
  }

  async updatePresenza(presenza: Presenze) {
    var body = presenza;
    console.log("body: ", body);
    return this.http
      .put(this.api + "/api/presenza/" + presenza._id, body)
      .toPromise();
  }
}
