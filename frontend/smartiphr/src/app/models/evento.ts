export class Evento {
  static clone(obj: Evento) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  data: Date;
  utente: string;
  tipo: string;
  descrizione: string;
  visibile?: Boolean;
  finito?: Boolean;
  dataCreazione?: Date;
  dataCompletato?: Date;
}
