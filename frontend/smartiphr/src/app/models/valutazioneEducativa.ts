
export class valutazioneEducativa {
    static clone(obj: valutazioneEducativa) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {
      this.valutazione = "";
    }
    valutazione: String;

  }
  
  
  