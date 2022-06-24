export class Farmaci {

  constructor() {
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
}
