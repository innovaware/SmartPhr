import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Presenze } from "../models/presenze";

@Injectable({
  providedIn: "root",
})
export class PresenzeService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getPresenze(): Observable<Presenze[]> {
    return this.http.get<any[]>(this.api + "/api/presenze").pipe(
      map((results: any) => {
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
              mansione: x.mansione,
              user: p.user,
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
          const pres: any[] = results.filter((x: any) => {
            return x.presenze.length > 0;
          });

          const presenze: Presenze[] = [];

          console.log(pres);

          pres.forEach((x) => {
            x.presenze.forEach((p) => {

              const presenza: Presenze = {
                nome: x.nome,
                cognome: x.cognome,
                cf: x.codiceFiscale,
                data: p.data,
                mansione: x.mansione,
                turno: p.turno,
              };
              presenze.push(presenza);
            });
          });
          return presenze;
        })
      );
  }

  getPresenzeByDipendenteID(id): Promise<Presenze[]> {
    return this.http.get<Presenze[]>(this.api + "/api/presenze/dipendente/" + id).toPromise();
  }

  async insertPresenza(presenza: Presenze) {
    var body = presenza;
    return this.http.post(this.api + "/api/presenze", body).toPromise();
  }

  async updatePresenza(presenza: Presenze) {
    var body = presenza;
    return this.http
      .put(this.api + "/api/presenze/" + presenza._id, body)
      .toPromise();
  }
}
