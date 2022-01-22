export class AreaRiabilitativaProgramma {
  static clone(obj: AreaRiabilitativaProgramma) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.note = "";
    this.ausiliDotazione = "";
    this.ausiliProvenienza = "";
  }

  note: String;
  ausiliDotazione: String;
  ausiliProvenienza: String;
}
