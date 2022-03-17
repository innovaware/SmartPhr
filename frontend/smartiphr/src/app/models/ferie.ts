export class Ferie {
  static clone(obj: Ferie) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  dataInizio?: Date;
  dataFine?: Date;
  dataRichiesta?: Date;
  accettata?: boolean;
  closed?: boolean;
  user?:string;
}
