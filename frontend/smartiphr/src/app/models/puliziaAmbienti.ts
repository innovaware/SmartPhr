import { User } from "./user";

export class PuliziaAmbiente {
  static clone(obj: PuliziaAmbiente) {
    return JSON.parse(JSON.stringify(obj));
  }

  static copy(src: PuliziaAmbiente, dst: PuliziaAmbiente) {
    dst._id = src._id;
    dst.idCamera = src.idCamera;
    dst.descrizione = src.descrizione;
    dst.statoPulizia = src.statoPulizia;
    dst.idUser = src.idUser;
  }

  _id?: string;

  /**
   * Identificativo camera
   * Valore recuperato da mongo
   */
  idCamera: string;

  /**
   * Stato pulizia Camera
   * Valore di default 0
   * 0 = Sporco; 1 = In Corso; 2 = Pulito; 3 = Straordinario
  */
  statoPulizia: number;

  /**
   * Descrizione
   *
   * Inserita dall'utente nella form di inserimento
   */
  descrizione: string;

  /**
   * Identificativo utente
   * Valore recuperato da mongo
   */
  idUser: string;

  /**
   * Data della pulizia Ambiente
   *
   * Data in cui e' stata eseguita la pulizia
   */
  data: Date;

  constructor() {
    this.statoPulizia = 0;

  }
}
