export class Farmaci {

  constructor() {
    this._id = "";
    this.nome = "";
    this.descrizione = "";
    this.formulazione = "";
    this.lotto = "";
    this.formato = "";
    this.classe = "";
    this.dose = "";
    this.note = "";
    this.qty = 1;
    this.codice_interno   = "";

    this.operator = "";
    this.operatorName = "";
    this.paziente = "";
    this.pazienteName = "";
  }

  static clone(obj: Farmaci) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  nome: string;
  descrizione: string;
  formulazione: string;
  lotto: string;
  scadenza?: Date;
  classe: string;
  formato: string;
  dose: string;
  note: string;
  qty: number;
  giacenza?: number;
  codice_interno: string;

  operator: string;
  operatorName: string;
  paziente: string;
  pazienteName: string;
}
