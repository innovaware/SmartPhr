export class AreaRiabilitativaLesioni {
  static clone(obj: AreaRiabilitativaLesioni) {
    return JSON.parse(JSON.stringify(obj));
  }

  data: Date;
  tipologia: String;
  parteCorpo: String;

  constructor() {
    this.data = new Date();
    this.tipologia = "";
    this.parteCorpo = "";
  }
}
