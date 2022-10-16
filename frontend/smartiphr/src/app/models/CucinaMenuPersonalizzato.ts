import { User } from "./user";

export class CucinaMenuPersonalizzato {
  static clone(obj: CucinaMenuPersonalizzato) {
    return JSON.parse(JSON.stringify(obj));
  }

  static copy(src: CucinaMenuPersonalizzato, dst: CucinaMenuPersonalizzato) {
    dst._id = src._id;
    dst.idPaziente = src.idPaziente;
    dst.descrizione = src.descrizione;
    dst.data = src.data;
  }

  _id?: string;

  /**
   * Identificativo paziente
   */
  idPaziente: string;

  /**
   * Data del utilizzo
   */
  data: Date;

  /**
   * Descrizione
   */
  descrizione: string;

  /**
   * Menu Colazione
   */
  menuColazione: string;

  /**
   * Menu Pranzo
   */
  menuPranzo: string;

  /**
   * Menu Cena
   */
  menuCena: string;

  constructor() {

  }
}
