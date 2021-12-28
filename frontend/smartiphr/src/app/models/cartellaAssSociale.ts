import { valutazioneSociale } from './valutazioneSociale';
import { IndiceSocializzazione } from './indiceSocializzazione';


export class cartellaAssSociale {

    static clone(obj: cartellaAssSociale) {
      return JSON.parse(JSON.stringify(obj));
    }
  
    constructor() {
      this.valutazioneSociale = new valutazioneSociale();
      this.indiceSocializzazione = new IndiceSocializzazione();
    }
    
  
    valutazioneSociale?: valutazioneSociale;
    indiceSocializzazione?: IndiceSocializzazione;

   
  
  }