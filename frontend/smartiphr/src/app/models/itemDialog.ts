import { Armadio } from "./armadio";
import { Camere } from "./camere";
import { Paziente } from "./paziente";

export class itemDialog {
  camera?: Camere;
  paziente?: Paziente;
  armadio?: Armadio;
  datacheck?: Date;
  Firmacheck?: String;
  verified?: Boolean;

  constructor() {
    this.camera = null;
    this.paziente = null;
    this.armadio = null;

  }
}
