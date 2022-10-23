import { CucinaMenuPersonalizzato } from "./CucinaMenuPersonalizzato";

export class MenuGeneraleView {
  static clone(obj: MenuGeneraleView) {
    return JSON.parse(JSON.stringify(obj));
  }

  //menuPersonalizzato: CucinaMenuPersonalizzato;

  /**
   * Data di inserimento del recordo
   *
   */
  dataInsert: Date;

  /**
   * Tipologia di menu:
   * Estivo oppure Invernale
   * Estivo: 0
   * Invernale: 1
   */
  type: number;

  /**
   * Data di riferimento.
   * Periodo in cui e valido il menu
   */
  dataRif: Date;

}
