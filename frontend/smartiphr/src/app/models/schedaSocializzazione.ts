export class SchedaSocializzazione {

    static clone(obj: SchedaSocializzazione) {
      return JSON.parse(JSON.stringify(obj));
    }
  
  
    constructor() {
      this.compagnia = "";
      this.interesse = "";
      this.iniziativa = "";

      this.hobbyAltro = "";
    }
  
    compagnia: string;
    interesse: string;
    iniziativa: string;

    hobbyScrittura: boolean;
    hobbyBallo: boolean;
    hobbyBricolage: boolean;
    hobbyLettura: boolean;
    hobbyPittura: boolean;
    hobbyDisegno: boolean;
    hobbyAttMotoria: boolean;
    hobbyGiochi: boolean;
    hobbyTV: boolean;
    hobbyCucina: boolean;

    hobbyAltro: string;
  }
  