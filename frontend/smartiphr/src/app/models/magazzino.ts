import { User } from "./user";

export class Magazzino {
  static clone(obj: Magazzino) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  dateInsert: Date;
  idUser: string;

  nome: string;
  descrizione: string;
  area: string;
  quantita: number;
  giacenza: string;
  conformi: string;
  inuso: boolean;

}
