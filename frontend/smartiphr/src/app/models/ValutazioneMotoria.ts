export class ValutazioneMotoria {
  static clone(obj: ValutazioneMotoria) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.valutazione = "";
    this.dimissione = "";
    this.dimissioneDate = undefined;
  }
  valutazione: String;
  dimissione: String;
  dimissioneDate: Date;

}


