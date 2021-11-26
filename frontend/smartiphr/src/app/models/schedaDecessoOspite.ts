
export class schedaDecessoOspite {
    static clone(obj: schedaDecessoOspite) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {
      this.relazionedecesso = "";
    }
    relazionedecesso: String;

  }
  
  
  