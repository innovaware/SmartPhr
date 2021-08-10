import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CartellaClinica } from "../models/cartellaClinica";
import { Diario } from "../models/diario";
import { Paziente } from "../models/paziente";

@Injectable({
  providedIn: "root",
})
export class PazienteService {
  constructor(private http: HttpClient) {}

  getPazienti(): Promise<Paziente[]> {
    // return this.http.get<Paziente[]>('http://localhost:3000/api/pazienti').toPromise();

    return new Promise<Paziente[]>((resolve, reject) => {
      var diario: Diario = {
        data: new Date(),
        firma: "firma",
        valore: "valore",
      };

      var cartellaClinica1: CartellaClinica = {
        data: new Date(),
        schedaPisico: {
          esame: {
            statoEmotivo: ["ansioso"],
            personalita: ["apatia"],
            linguaggio: ["fluente"],
            memoria: ["difficolta_rec"],
            orientamento: ["dis_temporale"],
            abilitaPercettivo: ["difficoltà_lett_scritt"],
            abilitaEsecutive: ["inflessibilita"],
            ideazione: ["allucinazioni"],
            umore: ["euforico"],

            partecipazioni: "noadeguata",
            ansia: "Presente",
            testEsecutivi: "Si",
          },

          valutazione: "Ciao",

          diario: [diario],
        },
      };

      var result: Paziente[] = [
        {
          cognome: "Test",
          nome: "Test",
          sesso: "F",
          luogoNascita: "Catania",
          dataNascita: new Date("01-01-1980"),
          residenza: "via prova",
          statoCivile: "Sposata",
          figli: 2,
          scolarita: "Media",
          situazioneLavorativa: "Disoccupata",
          personeRiferimento: "Nessuno",
          telefono: "12345667895",
          dataIngresso: new Date(),
          provincia: "CT",
          localita: "Melfi",

          cartellaClinica: [cartellaClinica1],
          // schedaPisico: {
          //   esame: {
          //     statoEmotivo: ["ansioso"],
          //     personalita: ["apatia"],
          //     linguaggio: ["fluente"],
          //     memoria: ["difficolta_rec"],
          //     orientamento: ["dis_temporale"],
          //     abilitaPercettivo: ["difficoltà_lett_scritt"],
          //     abilitaEsecutive: ["inflessibilita"],
          //     ideazione: ["allucinazioni"],
          //     umore: ["euforico"],

          //     partecipazioni: "noadeguata",
          //     ansia: "Presente",
          //     testEsecutivi: "Si",
          //   },

          //   valutazione: "Ciao",

          //   diario: [diario],
          // },
        },
      ];

      resolve(result);
    });
  }
}
