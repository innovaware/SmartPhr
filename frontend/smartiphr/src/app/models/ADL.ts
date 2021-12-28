export class ADL {

    static clone(obj: ADL) {
      return JSON.parse(JSON.stringify(obj));
    }
  
  
    constructor() {
      this.A = "";
      this.B = "";
      this.C = "";
      this.D = "";
      this.E = "";
      this.F = "";
    }
  
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
    F: string;
    totale: number;
  }
  