import { Magazzino } from "./magazzino";


export class MagazzinoOperazioni {
  static clone(obj: MagazzinoOperazioni) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  dateInsert: Date;
  idUser: string;

  tipologiaOperazione: string;
  idMagazzino: string;
  old: Magazzino;
}
