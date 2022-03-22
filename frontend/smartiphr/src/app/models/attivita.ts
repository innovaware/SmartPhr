export class Attivita {
    static clone(obj: Attivita) {
      return JSON.parse(JSON.stringify(obj));
    }
  
    _id?: string;
    operator?: string;
    operatorName?: string;
    paziente?: string;
    pazienteName?: string;
    data?: Date;
    turno?: string;
    description?: string;
    note?: string;
    completato?: boolean;
  }
  