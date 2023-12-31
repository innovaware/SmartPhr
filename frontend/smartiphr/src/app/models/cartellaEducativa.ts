import { valutazioneEducativa } from './valutazioneEducativa';
import { ADL } from './ADL';
import { IADL } from './IADL';
import { SchedaSocializzazione } from './schedaSocializzazione';


export class CartellaEducativa {

    static clone(obj: CartellaEducativa) {
      return JSON.parse(JSON.stringify(obj));
    }

    constructor() {
      this.valutazioneEducativa = new valutazioneEducativa();
      this.schedaSocializzazione = new SchedaSocializzazione();
      this.ADL = new ADL();
      this.IADL = new IADL();
    }


    public update(scheda: CartellaEducativa): void {
      this.valutazioneEducativa = scheda.valutazioneEducativa;
      this.schedaSocializzazione = scheda.schedaSocializzazione;
      this.ADL = scheda.ADL;
      this.IADL = scheda.IADL;
    }



    valutazioneEducativa?: valutazioneEducativa;
    schedaSocializzazione?: SchedaSocializzazione;

    ADL?: ADL;
    IADL?: IADL;


  }
