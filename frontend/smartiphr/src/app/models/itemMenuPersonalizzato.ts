import { CucinaPersonalizzato } from "./cucinaPersonalizzato";
import { Paziente } from "./paziente";

export class ItemMenuPersonalizzato {
  paziente: Paziente;
  cucina: CucinaPersonalizzato;
  data?: Date;
  dataUM?: Date;
  dataInizio?: Date;
  dataFine?: Date;
  active: Boolean;
}
