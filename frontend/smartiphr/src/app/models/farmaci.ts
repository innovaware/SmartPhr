export class Farmaci {

  constructor() {
    this.nome = "";
    this.descrizione = "";
    this.formato = "";
    this.dose = "";
    this.qty = 1;
    this.codice_interno   = "";
  }

  static clone(obj: Farmaci) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  nome: string;
  descrizione: string;
  formato: string;
  dose: string;
  qty: number;
  codice_interno: string;
}
