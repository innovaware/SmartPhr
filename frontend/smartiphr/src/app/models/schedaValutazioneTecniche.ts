
export class schedaValutazioneTecniche {
    static clone(obj: schedaValutazioneTecniche) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {

      this.valsociale = "";
      this.valeducativa = "";
      this.valpsicologica = "";
      this.valmotoria = "";

      
    }
  

    valsociale: String;
    valeducativa: String;
    valpsicologica: String;
    valmotoria: String;
  }
  
  
  