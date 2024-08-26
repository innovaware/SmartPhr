import { CucinaPersonalizzato } from "./cucinaPersonalizzato";
import { Paziente } from "./paziente";

export class ItemMenuPersonalizzato {
  paziente: Paziente;
  cucina: CucinaPersonalizzato[];
  data?: Date;
  dataUM?: Date;
  active: Boolean;
}
