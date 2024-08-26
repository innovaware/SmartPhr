import { valutazioneSociale } from './valutazioneSociale';
import { IndiceSocializzazione } from './indiceSocializzazione';
import { AltroCartellaSociale } from './altroCartellaSociale';
import { ICF } from './ICF';


export class cartellaAssSociale {

    static clone(obj: cartellaAssSociale) {
      return JSON.parse(JSON.stringify(obj));
    }
  
    constructor() {
      this.valutazioneSociale = new valutazioneSociale();
      this.indiceSocializzazione = new IndiceSocializzazione();
      this.altroCartellaSociale = new AltroCartellaSociale();
    }
    
    altroCartellaSociale? :AltroCartellaSociale;
    valutazioneSociale?: valutazioneSociale;
  indiceSocializzazione?: IndiceSocializzazione;
  ICF?:ICF;

   
  
  }
