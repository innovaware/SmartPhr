export class Ferie {
  static clone(obj: Ferie) {
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
