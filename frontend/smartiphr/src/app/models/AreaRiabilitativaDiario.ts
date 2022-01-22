export class AreaRiabilitativaDiario {
  static clone(obj: AreaRiabilitativaDiario) {
    return JSON.parse(JSON.stringify(obj));
  }

  data: Date;
  controllo: Number;
  note: String;
  firma: String;

  constructor() {
    this.data = new Date();
    this.controllo = -1;
    this.note = "";
    this.firma = "";
  }
}
