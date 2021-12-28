export class DiarioEducativo {

    static clone(obj: DiarioEducativo) {
      return JSON.parse(JSON.stringify(obj));
    }
  
  
    constructor() {
      this.data = new Date(),
      this.valore = "";
      this.firma = "";
    }
  
    data: Date;
    valore: string;
    firma: string;
  }
  