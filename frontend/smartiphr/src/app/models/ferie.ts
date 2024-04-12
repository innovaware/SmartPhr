export class Ferie {
  static clone(obj: Ferie) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  dataInizio?: Date;
  dataFine?: Date;
  dataRichiesta?: Date;
  accettata?: boolean;
  closed?: boolean;
  user?: string;

  static refresh(src: Ferie, dst: Ferie) {
    src.accettata = dst.accettata;
    src.dataInizio = dst.dataInizio;
    src.dataFine = dst.dataFine;
    src.dataRichiesta = dst.dataRichiesta;
    src.closed = dst.closed;
    src.user = dst.user;
  }

  public update(ferie: Ferie): void {
    this.dataInizio = ferie.dataInizio;
    this.dataFine = ferie.dataFine;
    this.dataRichiesta = ferie.dataRichiesta;
    this.accettata = ferie.accettata;
    this.closed = ferie.closed;
    this.user = ferie.user;
  }


  constructor() {
    this.dataInizio = new Date();
    this.dataFine = new Date();
    this.dataRichiesta = new Date();
    this.accettata = false;
    this.closed = false;
    this.user = "";
  }
}
