export class Presidi {
  quantitaOccupata?: Number;


  constructor() {
    this._id = "";
    this.rif_id = "";
    this.nome = "";
    this.descrizione = "";
    this.note = "";
    this.qty = 1;
    this.qtyTot = 1;
    this.giacenza = 1;
    this.quantitaDisponibile = 1;
    this.taglia = "";
    this.operator = "";
    this.operatorName = "";
    this.quantitaOccupata = 0;
    this.paziente = "";
    this.pazienteName = "";
  }

  static clone(obj: Presidi) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  rif_id: string;
  nome: string;
  descrizione: string;
  note: string;
  taglia: string;
  qty?: number;
  qtyTot?: number;
  quantitaDisponibile?: Number;
  giacenza?: number;
  scadenza?: Date;
  operator: string;
  operatorName: string;
  paziente: string;
  pazienteName: string;
}
