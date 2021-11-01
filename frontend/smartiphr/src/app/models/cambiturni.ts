export class Cambiturno {
  static clone(obj: Cambiturno) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  nome?: string;
  cognome?: string;
  cf?: string;
  dataInizioVT?: Date;
  dataFineVT?: Date;
  dataInizioNT?: Date;
  dataFineNT?: Date;
  motivazione?: string;
  dataRichiesta?: Date;
  accettata?: boolean;
  closed?: boolean;
}
