
export class schedaDimissioneOspite {
    static clone(obj: schedaDimissioneOspite) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {

      this.relazionedimissione = "";
      this.terapiainatto = "";
    }
  

    relazionedimissione: String;
    terapiainatto: String;
  }
  
  
  