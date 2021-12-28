
export class valutazioneSociale {
    static clone(obj: valutazioneSociale) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {
      this.valutazione = "";
    }
    valutazione: String;

  }
  
  
  