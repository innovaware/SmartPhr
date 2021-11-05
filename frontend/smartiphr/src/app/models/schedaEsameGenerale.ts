
export class schedaEsameGenerale {
    static clone(obj: schedaEsameGenerale) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {

      this.tipocostituzionale = "";
      this.condizionigenerali = "";
      this.nutrizione = "";
      this.cute = "";
      this.sistemalinfo = "";

      this.capocollo = "";
      this.protesi = "";
      this.apparatourogenitale = "";
      this.apparatomuscholoscheletrico = "";
      this.apparatocardio = "";


      this.frequenza = "";
      this.pressionearteriosa = "";
      this.polsiarteriosi = "";
      this.apparatorespiratorio = "";
      this.addome = "";

      this.fegato = "";
      this.milza = "";

      
    }

    tipocostituzionale: String;
    condizionigenerali: String;
    nutrizione: String;
    cute: String;
    sistemalinfo: String;

    capocollo: String;
    protesi: String;
    apparatourogenitale: String;
    apparatomuscholoscheletrico: String;
    apparatocardio: String;

    frequenza: String;
    pressionearteriosa: String;
    polsiarteriosi: String;
    apparatorespiratorio: String;
    addome: String;
    
    fegato: String;
    milza: String;
  }
  
  
  