
export class CucinaAmbienti {
  static clone(obj: CucinaAmbienti) {
    return JSON.parse(JSON.stringify(obj));
  }

  static copy(src: CucinaAmbienti, dst: CucinaAmbienti) {
    dst._id = src._id;
    dst.dateSanficazioneOrdinaria = src.dateSanficazioneOrdinaria;
    dst.dateSanficazioneStraordinaria = src.dateSanficazioneStraordinaria;
    dst.idUser = src.idUser;
  }

  _id?: string;

  nome: string;
  /**
   * Data della sanificazione Ordinaria
   */
  dateSanficazioneOrdinaria: Date;

  /**
   * Data della sanificazione Straordinaria
   */
  dateSanficazioneStraordinaria: Date;

  /**
   * Id user che ha eseguito la sanificazione
   */
  idUser: string;

  constructor() {

  }
}
