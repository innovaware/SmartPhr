export class Turnimensili {
  static clone(obj: Turnimensili) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  dataRifInizio: Date;
  dataRifFine: Date;
  turnoInizio: Number;
  turnoFine: Number;
  user: string;

  cognome?: string;
  nome?: string;
  cf?: string;
}
