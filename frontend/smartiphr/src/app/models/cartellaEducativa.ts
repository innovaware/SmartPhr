import { DiarioEducativo } from './diarioEducativo';
import { valutazioneEducativa } from './valutazioneEducativa';
import { SchedaSocializzazione } from './SchedaSocializzazione';

import { ADL } from './ADL';
import { IADL } from './IADL';


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
  
  
    valutazioneEducativa?: valutazioneEducativa;
    schedaSocializzazione?: SchedaSocializzazione;

    ADL?: ADL;
    IADL?: IADL;
   
  
  }