
export enum TypeMenu {
  Estivo=0,
  Invernale=1
}


export class MenuGeneraleView {
  static clone(obj: MenuGeneraleView) {
    return JSON.parse(JSON.stringify(obj));
  }


  _id?: string;

  /**
   *
   */
  constructor() {
    this.isNew = false;
  }

  /**
   * indica se il record da inserire
   */
  isNew?: boolean = false;

  year: number;

  day?: number;

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
   * Data di riferimento inizio.
   * Periodo in cui e valido il menu
   */
  dataStartRif: Date;

  /**
   * Data di riferimento fine
   */
  dataEndRif: Date;

  /**
   * Settimana di riferimento
   *
   */
  week: number;


  colazione?: string;
  spuntino?: string;
  pranzo?: string;
  merenda?: string;
  cena?: string;

}
