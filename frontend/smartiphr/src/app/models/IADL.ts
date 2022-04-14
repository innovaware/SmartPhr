export class IADL {

    static clone(obj: IADL) {
      return JSON.parse(JSON.stringify(obj));
    }
  
  
    constructor() {
      this.A = "";
      this.B = "";
      this.C = "";
      this.D = "";
      this.E = "";
      this.F = "";
      this.G = "";
      this.H = "";
      
    }
  
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
    F: string;
    G: string;
    H: string;
    totale: number;
  }
  