import { Camere } from "./camere";
import { Registro } from "./Registro";
import { User } from "./user";

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

  cameraInfo?: Camere;
  userInfo?: User;

}
