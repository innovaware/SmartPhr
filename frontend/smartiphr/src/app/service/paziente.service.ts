import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Diario } from "../models/diario";
import { Paziente } from "../models/paziente";

@Injectable({
  providedIn: "root",
})
export class PazienteService {
  constructor(private http: HttpClient) {}

  getPazienti(): Promise<Paziente[]> {
    return this.http.get<Paziente[]>('http://localhost:3000/api/pazienti').toPromise();


    // return new Promise<Paziente[]>((resolve, reject) => {
    //   var diario: Diario = {
    //     data: new Date(),
    //     firma: "firma",
    //     valore: "valore",
    //   };

    //   var result: Paziente[] = [
    //     {
    //       cognome: "Test",
    //       nome: "Test",
    //       sesso: "F",
    //       luogoNascita: "Catania",
    //       dataNascita: new Date("01-01-1980"),
    //       residenza: "via prova",
    //       statoCivile: "Sposata",
    //       figli: 2,
    //       scolarita: "Media",
    //       situazioneLavorativa: "Disoccupata",
    //       personeRiferimento: "Nessuno",
    //       telefono: "12345667895",
    //       dataIngresso: new Date(),
    //       provincia: "CT",
    //       localita: "Melfi",

    //       schedaPisico: {
    //         esame: {
    //           statoEmotivo: ["ansioso"],
    //           personalita: ["apatia"],
    //           linguaggio: ["fluente"],
    //           memoria: ["difficolta_rec"],
    //           orientamento: ["dis_temporale"],
    //           abilitaPercettivo: ["difficoltà_lett_scritt"],
    //           abilitaEsecutive: ["inflessibilita"],
    //           ideazione: ["allucinazioni"],
    //           umore: ["euforico"],

    //           partecipazioni: "noadeguata",
    //           ansia: "Presente",
    //           testEsecutivi: "Si",
    //         },

    //         valutazione: "Ciao",

    //         diario: [diario],
    //         // diario: [
    //         //   { data: new Date(), valore: 'diario1', firma: ''},
    //         //   { data: new Date(), valore: 'diario2', firma: 'firma2'},
    //         //   { data: new Date(), valore: 'diario3', firma: ''}
    //         // ]
    //       },
    //     },
    //   ];

    //   resolve(result);
    // });
  }
}
