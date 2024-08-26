export enum TypeOperationLavanderia {
  LAVATRICE=1,
  ASCIUGATRICE=2
}

export class Lavanderia {
  static clone(obj: Lavanderia) {
    return JSON.parse(JSON.stringify(obj));
  }

  static copy(src: Lavanderia, dst: Lavanderia) {
    dst._id = src._id;
    dst.idDipendente = src.idDipendente;
    dst.descrizione = src.descrizione;
    dst.data = src.data;
    dst.tipologia = src.tipologia;
    dst.descrizioneTipologia = src.descrizioneTipologia;
  }

  _id?: string;

  /**
   * Identificativo paziente
   */
  idDipendente: string;

  /**
   * Data del utilizzo
   */
  data: Date;

  /**
   * Descrizione
   */
  descrizione: string;

  /**
   * Tipologia dello strumento
   * 0: Asciugatrice; 1: Lavatrice
   */
  tipologia: Number;

  /**
   * Descrizione dello strumento
   */
  descrizioneTipologia: string;


  constructor() {

  }
}
