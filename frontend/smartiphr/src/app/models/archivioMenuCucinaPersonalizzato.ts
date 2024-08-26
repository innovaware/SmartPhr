import { CucinaPersonalizzato } from "./cucinaPersonalizzato";
import { Paziente } from "./paziente";

export class ArchivioMenuCucinaPersonalizzato {
  _id?: String;
  paziente: String;
  pazienteNome: String;
  pazienteCognome: String;
  menu: CucinaPersonalizzato[];
  dataCreazione?: Date;
  dataUltimaModifica?: Date;
}
