import { Paziente } from "./paziente";
import { User } from "./user";

export class Armadio {
    static clone(obj:Armadio) {
      return JSON.parse(JSON.stringify(obj));
    }
    _id?: string;
    idCamera: string;

    indumento: {
      idPaziente: string;
      nome: string;
      quantita: number;
      note?: string;
      paziente: Paziente;
    };

    lastChecked?: {
      idUser: string;
      data: Date;
    }

  }
