export class Cambiturno {
  static clone(obj: Cambiturno) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  user: string;
  dataInizioVT?: Date;
  dataFineVT?: Date;
  dataInizioNT?: Date;
  dataFineNT?: Date;
  motivazione?: string;
  user?: string;
  dataRichiesta?: Date;
  accettata?: boolean;
  closed?: boolean;
}
