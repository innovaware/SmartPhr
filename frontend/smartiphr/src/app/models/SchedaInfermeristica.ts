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

  constructor() {
    this.schedaBAI = new SchedaBAI();
  }

  schedaBAI?: SchedaBAI;
  schedaInterventi?: SchedaInterventi;
  schedaLesioni?: SchedaLesioniCutanee;
  schedaLesioniDecubito?: SchedaLesioniDecubito;
  schedaMnar?: SchedaMnar;
  schedaUlcere?: SchedaUlcere;
  schedaVas?: SchedaVas;
  schedaUlcereDiabete?: SchedaUlcereDiabete;
  schedaDiario?: SchedaDiario;
}


