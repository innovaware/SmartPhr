import { FarmacoArmadio, PresidioArmadio } from "./armadioFarmaciPresidi";
export class ArmadioFarmaci {
  static clone(obj: ArmadioFarmaci) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  farmaci: FarmacoArmadio[];
  presidi: PresidioArmadio[];
  lastChecked?: {
    idUser: string;
    datacheck: Date;
  };
  pazienteId?: String;
  cancellato?: Boolean;
  DataEliminazione?: Date;
  dataCreazione?: Date;
}
