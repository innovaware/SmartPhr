export class Permessi {
  static clone(obj: Permessi) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  nome?: string;
  cognome?: string;
  cf?: string;
  dataInizio?: Date;
  dataFine?: Date;
  dataRichiesta?: Date;
  accettata?: boolean;
  closed?: boolean;
}
