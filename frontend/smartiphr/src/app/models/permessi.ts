export class Permessi {
  static clone(obj: Permessi) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  dataPermesso?: Date;
  oraInizio?: String;
  oraFine?: String;
  dataRichiesta?: Date;
  accettata?: boolean;
  closed?: boolean;
  user?: string;
}
