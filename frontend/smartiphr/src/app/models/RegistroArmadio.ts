import { Camere } from "./camere";
import { Paziente } from "./paziente";
import { Registro } from "./Registro";

export class RegistroArmadio implements Registro {
  static clone(obj: RegistroArmadio) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id: string;
  cameraId: string;
  stato: boolean;
  data: Date;
  note: string;
  firma: string;
  paziente?: String;
  pazienteInfo?: Paziente;
  cameraInfo?: Camere;
}
