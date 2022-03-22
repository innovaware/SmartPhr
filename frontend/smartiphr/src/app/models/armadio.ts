export class Armadio {
    static clone(obj:Armadio) {
      return JSON.parse(JSON.stringify(obj));
    }
    _id?: string;
    operator?: string;
    operatorName?: string;
    paziente?: string;
    pazienteName?: string;
    data?: Date;
    elemento?: string;
    note?: string;
    quantita?: number;
  }
  