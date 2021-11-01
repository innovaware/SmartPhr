export class SchedaUlcereDiabete {
  static clone(obj: SchedaUlcereDiabete) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.descrizione = "";
    this.valutazione = "";
    this.conclusione = "";
  }

  descrizione: string;
  valutazione: string;
  conclusione: string;
}
