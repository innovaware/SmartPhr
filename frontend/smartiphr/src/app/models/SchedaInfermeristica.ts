import { SchedaBAI } from './SchedaBAI';
import { SchedaDiario } from './SchedaDiario';
import { SchedaInterventi } from './SchedaInterventi';
import { SchedaLesioniCutanee } from './SchedaLesioniCutanee';
import { SchedaLesioniDecubito } from './SchedaLesioniDecubito';
import { SchedaMnar } from './SchedaMnar';
import { SchedaUlcere } from './schedaUlcere';
import { SchedaUlcereDiabete } from './SchedaUlcereDiabete';
import { SchedaVas } from './SchedaVas';

export class SchedaInfermeristica {
  static clone(obj: SchedaInfermeristica) {
    return JSON.parse(JSON.stringify(obj));
  }

  constructor() {
    this.schedaBAI = new SchedaBAI();
    this.schedaInterventi = [];
    this.schedaLesioni = new SchedaLesioniCutanee();
    this.schedaLesioniDecubito = new SchedaLesioniDecubito();
    this.schedaMnar = new SchedaMnar();
    this.schedaUlcere = new SchedaUlcere();
    this.schedaVas = new SchedaVas();
    this.schedaUlcereDiabete = new SchedaUlcereDiabete();
    this.schedaDiario = new SchedaDiario();


    this.diagnosi = "";
    this.intolleranzeAlimentari = "";
    this.allergie = "";
    this.infezioni = "";
    this.terapiaAtto = "";
    this.catetereVescicale = false;
    this.dataInserimentoCatetereVescicale = undefined;
    this.calibroCatetereVescicale = "";
    this.diurisiCatetereVescicale = "";
    this.mezziContenzione = false;
    this.dimissione = undefined;
  }



  diagnosi: string;
  intolleranzeAlimentari: string;
  allergie: string;
  infezioni: string;
  terapiaAtto: string;
  catetereVescicale: boolean;
  dataInserimentoCatetereVescicale: Date;
  calibroCatetereVescicale: string;
  diurisiCatetereVescicale: string;
  mezziContenzione:boolean;
  dimissione: Date;


  schedaBAI?: SchedaBAI;
  schedaInterventi?: SchedaInterventi[];
  schedaLesioni?: SchedaLesioniCutanee;
  schedaLesioniDecubito?: SchedaLesioniDecubito;
  schedaMnar?: SchedaMnar;
  schedaUlcere?: SchedaUlcere;
  schedaVas?: SchedaVas;
  schedaUlcereDiabete?: SchedaUlcereDiabete;
  schedaDiario?: SchedaDiario;
}


