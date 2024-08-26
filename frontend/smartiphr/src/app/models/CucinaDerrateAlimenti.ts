
export class CucinaDerrateAlimenti {
  static clone(obj: CucinaDerrateAlimenti) {
    return JSON.parse(JSON.stringify(obj));
  }

  static copy(src: CucinaDerrateAlimenti, dst: CucinaDerrateAlimenti) {
    dst._id = src._id;
    dst.nome = src.nome;
    dst.dateInsert = src.dateInsert;
    dst.note = src.note;
  }

  _id?: string;

  nome: string;
  /**
   * Data di inserimento
   */
  dateInsert: Date;

  /**
   * Note dell'alimento
   */
  note: string;

  quantita: number;
  unita: string;

  conforme: boolean;
  nonConsumato: boolean;
  dateScadenza: Date;

  idUser: string;

  constructor() {
    this.dateInsert = new Date();
    this.nonConsumato = false;
    this.conforme = true;
  }
}
