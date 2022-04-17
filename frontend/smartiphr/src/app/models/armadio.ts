import { Paziente } from "./paziente";
import { User } from "./user";

export interface Indumento {
  nome: string;
  quantita: number;
  note?: string;
}

export interface Contenuto {
    idPaziente: string;
    paziente: Paziente;
    items: Indumento[];
    verificato: boolean;
}

export class Armadio {
    static clone(obj:Armadio) {
      return JSON.parse(JSON.stringify(obj));
    }
    _id?: string;
    idCamera: string;

    contenuto: Contenuto[];

    lastChecked?: {
      idUser: string;
      data: Date;
    };

    rateVerifica: Number; //Stato di completamento in %
    pazienti: Paziente[];

    dateStartRif: Date;
    dateEndRif: Date;
  }
