export class Farmaci {
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
