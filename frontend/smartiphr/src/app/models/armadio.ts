import { Indumento } from "./indumento";
import { Paziente } from "./paziente";


export class Armadio {
  rateVerifica: number;
  static clone(obj: Armadio) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  idCamera: string;
  contenuto: Indumento[];
  lastChecked?: {
    _id?: String;
    idUser: string;
    datacheck: Date;
  };
  //rateVerifica: Number; //Stato di completamento in %
  //pazienti?: Paziente[];
  pazienteId?: String;
  pazienti?: Paziente[];
  dateStartRif: Date;
  dateEndRif: Date;
  verified: Boolean;
  stagionale?: Boolean;
}
