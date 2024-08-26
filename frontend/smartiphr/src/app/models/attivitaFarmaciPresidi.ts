export class AttivitaFarmaciPresidi {
    static clone(obj: AttivitaFarmaciPresidi) {
      return JSON.parse(JSON.stringify(obj));
    }
  
    _id?: string;
    operator?: string;
    operatorName?: string;
    paziente?: string;
    pazienteName?: string;
    elemento?: string;
    elemento_id?: string;
    qty?: string;
    type?: string;
    data?: Date;

  }
  