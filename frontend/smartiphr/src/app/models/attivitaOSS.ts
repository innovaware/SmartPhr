export class AttivitaOSS {
  static clone(obj: AttivitaOSS) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  operator?: string;
  operatorName?: string;
  paziente?: string;
  pazienteName?: string;
  note?: string;
  turno?: string;
  data?: Date;
  letto?: boolean;
  diuresi?: boolean;
  evacuazione?: boolean;
  descrizione?: string;
  igiene?: boolean;
  doccia?: boolean;
  barba?: boolean;
  tagliocapelli?: boolean;
  tagliounghie?: boolean;
  lenzuola?: boolean;

}
